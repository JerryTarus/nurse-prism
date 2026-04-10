import { NextResponse } from "next/server"

import { resolveAuthAccess } from "@/lib/auth/access"
import { sanitizeRedirectPath } from "@/lib/auth/redirect"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const fallbackNext = sanitizeRedirectPath(requestUrl.searchParams.get("next"), "/admin")

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/login?error=callback_error", request.url)
    )
  }

  const supabase = await createSupabaseServerClient()
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    return NextResponse.redirect(
      new URL("/auth/login?error=callback_error", request.url)
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

  if (!access.isAuthenticated || !access.isAdmin) {
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL("/auth/login?error=forbidden", request.url))
  }

  if (access.mfa.required && !access.mfa.verified) {
    const mfaUrl = new URL("/auth/mfa", request.url)
    mfaUrl.searchParams.set("next", fallbackNext)
    return NextResponse.redirect(mfaUrl)
  }

  return NextResponse.redirect(new URL(fallbackNext, request.url))
}
