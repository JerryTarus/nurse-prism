import { NextResponse } from "next/server"

import { getPostAuthRedirect } from "@/lib/auth/admin-flow"
import { resolveAuthAccess } from "@/lib/auth/access"
import { sanitizeRedirectPath } from "@/lib/auth/redirect"
import { syncAllowlistedUserIfNeeded } from "@/lib/auth/profile-sync"
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
      { error: "Please enter a valid email and password." },
      { status: 400 }
    )
  }

  const rateLimitKey = `auth:password:${clientIp}:${parsed.data.email}`
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

  const nextPath = sanitizeRedirectPath(parsed.data.next, "/admin")
  const supabase = await createSupabaseServerClient()
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (signInError) {
    return NextResponse.json(
      { error: "We couldn't sign you in with those details." },
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

  const role = user ? await syncAllowlistedUserIfNeeded(user) : null

  if (!user || !role) {
    await supabase.auth.signOut()
    return NextResponse.json(
      {
        error: "This account is not authorized for the Nurse Prism dashboard.",
      },
      { status: 403 }
    )
  }

  const access = resolveAuthAccess(user, session)

  if (!access.isAuthenticated || !access.isAdmin) {
    await supabase.auth.signOut()
    return NextResponse.json(
      {
        error: "This account is not authorized for the Nurse Prism dashboard.",
      },
      { status: 403 }
    )
  }

  return NextResponse.json(
    { redirectTo: getPostAuthRedirect(access, nextPath) },
    { status: 200 }
  )
}
