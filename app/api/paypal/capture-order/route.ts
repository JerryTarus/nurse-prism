import { NextResponse } from "next/server"

import {
  getCheckoutAmountForBooking,
  getPaymentByProviderOrderId,
  markPaymentCaptured,
} from "@/lib/cms/public"
import { getCalendlyUrlForIntent } from "@/lib/consultations"
import {
  captureHostedPaypalOrder,
  extractPaypalCaptureDetails,
} from "@/lib/paypal/orders"
import { enforceRateLimit, getRequestIp } from "@/lib/security/rate-limit"
import { paypalCaptureOrderPayloadSchema } from "@/lib/validations/public"

const PAYPAL_CAPTURE_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  maxHits: 8,
}

function toTopLevelStatus(value: unknown) {
  return typeof value === "string" ? value : null
}

function normalizeUsdAmount(value: string | null) {
  if (!value) {
    return null
  }

  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return null
  }

  return parsed.toFixed(2)
}

export async function POST(request: Request) {
  const clientIp = getRequestIp(request.headers)

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 })
  }

  const parsed = paypalCaptureOrderPayloadSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "A valid booking and PayPal order are required." },
      { status: 400 }
    )
  }

  const rate = enforceRateLimit(
    `public:paypal:capture:${clientIp}:${parsed.data.bookingId}:${parsed.data.orderId}`,
    PAYPAL_CAPTURE_RATE_LIMIT
  )

  if (!rate.ok) {
    return NextResponse.json(
      {
        error: "Too many capture attempts. Please try again shortly.",
        retryAfterSeconds: rate.retryAfterSeconds,
      },
      { status: 429 }
    )
  }

  try {
    const { booking, checkoutAmount } = await getCheckoutAmountForBooking(
      parsed.data.bookingId
    )
    const calendlyUrl = getCalendlyUrlForIntent(booking.intent)

    if (!calendlyUrl) {
      console.error("Calendly URL missing for paid booking capture", {
        bookingId: parsed.data.bookingId,
        intent: booking.intent,
      })
      return NextResponse.json(
        {
          error:
            "Scheduling is not available right now. Please contact Nurse Prism for help with your booking.",
        },
        { status: 500 }
      )
    }

    const payment = await getPaymentByProviderOrderId({
      bookingId: parsed.data.bookingId,
      orderId: parsed.data.orderId,
    })

    if (payment.status === "completed") {
      return NextResponse.json(
        {
          bookingId: parsed.data.bookingId,
          calendlyUrl,
          message:
            "Payment already confirmed. Continue to Calendly to choose your session time.",
        },
        { status: 200 }
      )
    }

    const captureOrder = await captureHostedPaypalOrder(parsed.data.orderId)
    const captureDetails = extractPaypalCaptureDetails(captureOrder)
    const topLevelStatus = toTopLevelStatus(captureOrder.status)

    if (topLevelStatus !== "COMPLETED" && captureDetails.status !== "COMPLETED") {
      return NextResponse.json(
        { error: "PayPal has not confirmed this payment yet." },
        { status: 422 }
      )
    }

    const capturedAmount = normalizeUsdAmount(captureDetails.amount)
    if (captureDetails.currency !== "USD" || capturedAmount !== checkoutAmount) {
      return NextResponse.json(
        { error: "The captured PayPal amount did not match this booking." },
        { status: 422 }
      )
    }

    await markPaymentCaptured({
      bookingId: parsed.data.bookingId,
      paymentId: payment.id,
      orderId: parsed.data.orderId,
      captureId: captureDetails.captureId,
      captureStatus: captureDetails.status,
      capturePayload: captureOrder,
    })

    return NextResponse.json(
      {
        bookingId: parsed.data.bookingId,
        calendlyUrl,
        message:
          "Payment confirmed. Continue to Calendly to choose your career clarity session slot.",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Failed to capture PayPal order", error)
    return NextResponse.json(
      {
        error:
          "We couldn't confirm your payment right now. Please try again in a moment.",
      },
      { status: 500 }
    )
  }
}
