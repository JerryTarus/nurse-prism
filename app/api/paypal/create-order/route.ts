import { NextResponse } from "next/server"

import {
  createPaymentRecord,
  getCheckoutAmountForBooking,
} from "@/lib/cms/public"
import { createHostedPaypalOrder } from "@/lib/paypal/orders"
import { enforceRateLimit, getRequestIp } from "@/lib/security/rate-limit"
import { paypalCreateOrderPayloadSchema } from "@/lib/validations/public"

const PAYPAL_CREATE_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  maxHits: 8,
}

export async function POST(request: Request) {
  const clientIp = getRequestIp(request.headers)

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 })
  }

  const parsed = paypalCreateOrderPayloadSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "A valid booking reference is required to start checkout." },
      { status: 400 }
    )
  }

  const rate = enforceRateLimit(
    `public:paypal:create:${clientIp}:${parsed.data.bookingId}`,
    PAYPAL_CREATE_RATE_LIMIT
  )

  if (!rate.ok) {
    return NextResponse.json(
      {
        error: "Too many checkout attempts. Please try again shortly.",
        retryAfterSeconds: rate.retryAfterSeconds,
      },
      { status: 429 }
    )
  }

  try {
    const { booking, plan, checkoutAmount } = await getCheckoutAmountForBooking(
      parsed.data.bookingId
    )

    const order = await createHostedPaypalOrder({
      bookingId: booking.id,
      intent: booking.intent,
      payerName: booking.fullName,
      payerEmail: booking.email,
    })

    const payment = await createPaymentRecord({
      bookingId: booking.id,
      packageKey: booking.packageKey ?? plan.id,
      amountKes: plan.basePriceKes,
      checkoutAmount,
      approvalUrl: order.approvalUrl,
      providerOrderId: order.orderId,
    })

    return NextResponse.json(
      {
        bookingId: booking.id,
        paymentId: payment.id,
        orderId: order.orderId,
        approvalUrl: order.approvalUrl,
        currency: "USD",
        checkoutAmount,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to start PayPal checkout right now.",
      },
      { status: 500 }
    )
  }
}
