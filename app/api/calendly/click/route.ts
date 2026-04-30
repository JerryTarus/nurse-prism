import { NextResponse } from "next/server"

import { markCalendlyClick } from "@/lib/cms/public"
import { enforceRateLimit, getRequestIp } from "@/lib/security/rate-limit"
import { calendlyClickPayloadSchema } from "@/lib/validations/public"

const CALENDLY_CLICK_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  maxHits: 20,
}

export async function POST(request: Request) {
  const clientIp = getRequestIp(request.headers)

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 })
  }

  const parsed = calendlyClickPayloadSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "A valid booking reference is required." },
      { status: 400 }
    )
  }

  const rate = enforceRateLimit(
    `public:calendly:click:${clientIp}:${parsed.data.bookingId}`,
    CALENDLY_CLICK_RATE_LIMIT
  )

  if (!rate.ok) {
    return NextResponse.json(
      {
        error: "Too many scheduling attempts. Please try again shortly.",
        retryAfterSeconds: rate.retryAfterSeconds,
      },
      { status: 429 }
    )
  }

  try {
    const result = await markCalendlyClick(parsed.data)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Failed to continue to Calendly", error)
    return NextResponse.json(
      {
        error:
          "Something went wrong while preparing your booking. Please try again or contact support.",
      },
      { status: 500 }
    )
  }
}
