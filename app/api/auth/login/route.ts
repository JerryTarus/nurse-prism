import { NextResponse } from "next/server"

import { resolveAuthAccess } from "@/lib/auth/access"
import { sanitizeRedirectPath } from "@/lib/auth/redirect"
import { enforceRateLimit, getRequestIp } from "@/lib/security/rate-limit"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { emailLoginSchema } from "@/lib/validations/auth"

const LOGIN_RATE_LIMIT = {
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

  const parsed = emailLoginSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please provide a valid email and password." },
      { status: 400 }
    )
  }

  const { email, password, next } = parsed.data
  const rateLimitKey = `auth:password:${clientIp}:${email}`
  const rate = enforceRateLimit(rateLimitKey, LOGIN_RATE_LIMIT)

  if (!rate.ok) {
    return NextResponse.json(
      {
        error: "Too many login attempts. Please try again shortly.",
        retryAfterSeconds: rate.retryAfterSeconds,
      },
      { status: 429 }
    )
  }

  const supabase = await createSupabaseServerClient()
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    return NextResponse.json(
      { error: "Invalid credentials or account not available." },
      { status: 401 }
    )
  }

  const [
    {
      data: { user },
    },
    {
      data: { session },
    },
  ] = await Promise.all([supabase.auth.getUser(), supabase.auth.getSession()])

  const access = resolveAuthAccess(user, session)

  if (!access.isAdmin) {
    await supabase.auth.signOut()
    return NextResponse.json(
      { error: "This account is not permitted to access the admin dashboard." },
      { status: 403 }
    )
  }

  const nextPath = sanitizeRedirectPath(next, "/admin")
  if (access.mfa.required && !access.mfa.verified) {
    return NextResponse.json(
      { redirectTo: `/auth/mfa?next=${encodeURIComponent(nextPath)}` },
      { status: 200 }
    )
  }

  return NextResponse.json({ redirectTo: nextPath }, { status: 200 })
}
