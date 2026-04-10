import { NextResponse } from "next/server"
import { z } from "zod"

import { resolveAuthAccess } from "@/lib/auth/access"
import { enforceRateLimit, getRequestIp } from "@/lib/security/rate-limit"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"

const resendEmailSchema = z.object({
  to: z.email().trim().toLowerCase(),
  subject: z.string().trim().min(3).max(180),
  html: z.string().trim().min(10).max(15000),
})

const EMAIL_RATE_LIMIT = {
  windowMs: 60 * 60 * 1000,
  maxHits: 25,
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient()
  const [
    {
      data: { user },
    },
    {
      data: { session },
    },
  ] = await Promise.all([supabase.auth.getUser(), supabase.auth.getSession()])

  const access = resolveAuthAccess(user, session)
  if (!access.isAuthenticated || !access.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  if (access.mfa.required && !access.mfa.verified) {
    return NextResponse.json(
      { error: "MFA verification is required." },
      { status: 428 }
    )
  }

  const ip = getRequestIp(request.headers)
  const rate = enforceRateLimit(`admin:email:${ip}:${user?.id}`, EMAIL_RATE_LIMIT)
  if (!rate.ok) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Please retry later.",
        retryAfterSeconds: rate.retryAfterSeconds,
      },
      { status: 429 }
    )
  }

  const payload = await request.json().catch(() => null)
  const parsed = resendEmailSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email payload." }, { status: 400 })
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const resendFromEmail = process.env.RESEND_FROM_EMAIL

  if (!resendApiKey || !resendFromEmail) {
    return NextResponse.json(
      {
        error:
          "Email provider is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.",
      },
      { status: 500 }
    )
  }

  const providerResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFromEmail,
      to: [parsed.data.to],
      subject: parsed.data.subject,
      html: parsed.data.html,
    }),
  })

  const providerPayload = (await providerResponse.json().catch(() => null)) as
    | { id?: string; message?: string }
    | null

  if (!providerResponse.ok) {
    return NextResponse.json(
      {
        error: "Email provider rejected this request. Check sender domain setup.",
      },
      { status: 502 }
    )
  }

  try {
    const adminClient = createSupabaseAdminClient() as unknown as {
      from: (table: string) => {
        insert: (value: Record<string, unknown>) => Promise<unknown>
      }
    }

    await adminClient.from("outbound_email_logs").insert({
      sent_by_user_id: user?.id ?? null,
      provider: "resend",
      provider_message_id: providerPayload?.id ?? null,
      recipient_email: parsed.data.to,
      subject: parsed.data.subject,
      status: "sent",
      created_at: new Date().toISOString(),
    })
  } catch {
    // Best-effort logging: email has already been sent successfully.
  }

  return NextResponse.json(
    {
      message: "Email sent successfully.",
      payloadPreview: {
        to: parsed.data.to,
        subject: parsed.data.subject,
      },
      providerMessageId: providerPayload?.id ?? null,
    },
    { status: 200 }
  )
}
