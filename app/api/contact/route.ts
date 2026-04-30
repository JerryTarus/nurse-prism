import { NextResponse } from "next/server"

import { createContactSubmission } from "@/lib/cms/public"
import { enforceRateLimit, getRequestIp } from "@/lib/security/rate-limit"
import { contactSubmissionPayloadSchema } from "@/lib/validations/public"

const CONTACT_RATE_LIMIT = {
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

  const parsed = contactSubmissionPayloadSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please complete all required contact details." },
      { status: 400 }
    )
  }

  const rate = enforceRateLimit(
    `public:contact:${clientIp}:${parsed.data.email}`,
    CONTACT_RATE_LIMIT
  )

  if (!rate.ok) {
    return NextResponse.json(
      {
        error: "Too many messages sent. Please try again shortly.",
        retryAfterSeconds: rate.retryAfterSeconds,
      },
      { status: 429 }
    )
  }

  try {
    await createContactSubmission(parsed.data)

    return NextResponse.json(
      {
        message:
          "Message received. Nurse Prism will respond by email within one business day.",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to create contact submission", error)
    return NextResponse.json(
      {
        error: "We couldn't save your details right now. Please try again.",
      },
      { status: 500 }
    )
  }
}
