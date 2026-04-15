import { NextResponse } from "next/server"

import {
  createConsultationLead,
} from "@/lib/cms/public"
import {
  getCalendlyUrlForIntent,
} from "@/lib/consultations"
import { convertKesToCurrency } from "@/lib/currency"
import { enforceRateLimit, getRequestIp } from "@/lib/security/rate-limit"
import { consultationLeadPayloadSchema } from "@/lib/validations/public"

const LEAD_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  maxHits: 10,
}

export async function POST(request: Request) {
  const clientIp = getRequestIp(request.headers)

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 })
  }

  const parsed = consultationLeadPayloadSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please complete all required consultation details." },
      { status: 400 }
    )
  }

  const rate = enforceRateLimit(
    `public:lead:${clientIp}:${parsed.data.email}`,
    LEAD_RATE_LIMIT
  )

  if (!rate.ok) {
    return NextResponse.json(
      {
        error: "Too many consultation requests. Please try again shortly.",
        retryAfterSeconds: rate.retryAfterSeconds,
      },
      { status: 429 }
    )
  }

  if (!getCalendlyUrlForIntent(parsed.data.intent)) {
    return NextResponse.json(
      {
        error:
          "Scheduling is not configured yet. Please add the Calendly launch URLs before accepting bookings.",
      },
      { status: 500 }
    )
  }

  try {
    const result = await createConsultationLead(parsed.data)

    return NextResponse.json(
      {
        bookingId: result.bookingId,
        leadId: result.leadId,
        requiresPayment: result.paymentRequired,
        calendlyUrl: result.paymentRequired ? null : result.calendlyUrl,
        plan: result.plan
          ? {
              id: result.plan.id,
              name: result.plan.name,
              amountKes: result.plan.basePriceKes,
              amountUsd:
                result.plan.basePriceKes > 0
                  ? convertKesToCurrency(result.plan.basePriceKes, "USD").toFixed(2)
                  : null,
            }
          : null,
        message: result.paymentRequired
          ? "Consultation saved. Continue to PayPal to unlock your paid booking link."
          : "Consultation saved. Continue to Calendly to choose your free session time.",
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to submit your consultation right now.",
      },
      { status: 500 }
    )
  }
}
