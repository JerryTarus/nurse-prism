import "server-only"

import { randomUUID } from "node:crypto"

import {
  CheckoutPaymentIntent,
  OrderApplicationContextUserAction,
  OrdersController,
  type Order,
  type OrderRequest,
} from "@paypal/paypal-server-sdk"

import { getCheckoutAmountUsdForIntent, getPlanLabelForIntent, type ConsultationIntent } from "@/lib/consultations"
import { toAbsoluteUrl } from "@/lib/seo/metadata"

import { createPaypalClient } from "./client"

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null
  }

  return value as Record<string, unknown>
}

function findApproveUrl(order: Order) {
  const links = Array.isArray(order.links) ? order.links : []

  for (const link of links) {
    const record = asRecord(link)
    if (!record) {
      continue
    }

    if (record.rel === "approve" && typeof record.href === "string") {
      return record.href
    }
  }

  return null
}

export function extractPaypalCaptureDetails(order: unknown) {
  const topLevel = asRecord(order)
  const purchaseUnits = Array.isArray(topLevel?.purchaseUnits)
    ? topLevel.purchaseUnits
    : Array.isArray(topLevel?.purchase_units)
      ? topLevel.purchase_units
      : []

  for (const purchaseUnit of purchaseUnits) {
    const purchaseUnitRecord = asRecord(purchaseUnit)
    const payments = asRecord(purchaseUnitRecord?.payments)
    const captures = Array.isArray(payments?.captures) ? payments.captures : []

    for (const capture of captures) {
      const captureRecord = asRecord(capture)
      if (!captureRecord) {
        continue
      }

      const amount = asRecord(captureRecord.amount)

      return {
        captureId:
          typeof captureRecord.id === "string" ? captureRecord.id : null,
        status:
          typeof captureRecord.status === "string"
            ? captureRecord.status
            : null,
        amount:
          typeof amount?.value === "string" ? amount.value : null,
        currency:
          typeof amount?.currencyCode === "string"
            ? amount.currencyCode
            : typeof amount?.currency_code === "string"
              ? amount.currency_code
              : null,
      }
    }
  }

  return {
    captureId: null,
    status: null,
    amount: null,
    currency: null,
  }
}

export async function createHostedPaypalOrder(input: {
  bookingId: string
  intent: ConsultationIntent
  payerName: string
  payerEmail: string
}) {
  const checkoutAmount = getCheckoutAmountUsdForIntent(input.intent)
  if (!checkoutAmount) {
    throw new Error("This consultation does not require a PayPal payment.")
  }

  const orders = new OrdersController(createPaypalClient())
  const bookingQuery = `booking=${encodeURIComponent(input.bookingId)}&intent=${encodeURIComponent(input.intent)}`
  const requestBody: OrderRequest = {
    intent: CheckoutPaymentIntent.Capture,
    purchaseUnits: [
      {
        referenceId: input.bookingId,
        amount: {
          currencyCode: "USD",
          value: checkoutAmount,
        },
        description: `${getPlanLabelForIntent(input.intent)} - Nurse Prism`,
        customId: input.bookingId,
      },
    ],
    applicationContext: {
      returnUrl: toAbsoluteUrl(`/contact?paypal=success&${bookingQuery}`),
      cancelUrl: toAbsoluteUrl(`/contact?paypal=cancelled&${bookingQuery}`),
      userAction: OrderApplicationContextUserAction.PayNow,
    },
  }

  const response = await orders.createOrder({
    body: requestBody,
    paypalRequestId: randomUUID(),
    prefer: "return=representation",
  })

  const order = response.result
  const approvalUrl = findApproveUrl(order)

  if (!order.id || !approvalUrl) {
    throw new Error("PayPal did not return an approval URL for this order.")
  }

  return {
    orderId: order.id,
    approvalUrl,
    checkoutAmount,
  }
}

export async function captureHostedPaypalOrder(orderId: string) {
  const orders = new OrdersController(createPaypalClient())
  const response = await orders.captureOrder({
    id: orderId,
    paypalRequestId: randomUUID(),
    prefer: "return=representation",
  })

  return response.result
}
