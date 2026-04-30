import { NextResponse } from "next/server"

import { createNewsletterLead } from "@/lib/cms/public"
import { enforceRateLimit, getRequestIp } from "@/lib/security/rate-limit"
import { newsletterPayloadSchema } from "@/lib/validations/public"

const NEWSLETTER_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  maxHits: 12,
}

export async function POST(request: Request) {
  const clientIp = getRequestIp(request.headers)

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 })
  }

  const parsed = newsletterPayloadSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    )
  }

  const rate = enforceRateLimit(
    `public:newsletter:${clientIp}:${parsed.data.email}`,
    NEWSLETTER_RATE_LIMIT
  )

  if (!rate.ok) {
    return NextResponse.json(
      {
        error: "Too many signup attempts. Please try again shortly.",
        retryAfterSeconds: rate.retryAfterSeconds,
      },
      { status: 429 }
    )
  }

  try {
    await createNewsletterLead(parsed.data)

    return NextResponse.json(
      {
        message:
          "You are on the list. Expect practical career insights from Nurse Prism.",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to create newsletter lead", error)
    return NextResponse.json(
      {
        error: "We couldn't save your details right now. Please try again.",
      },
      { status: 500 }
    )
  }
}
