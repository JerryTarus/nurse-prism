import { NextResponse } from "next/server"

import { resolveAuthAccess } from "@/lib/auth/access"
import { getPostAuthRedirect } from "@/lib/auth/admin-flow"
import { sanitizeRedirectPath } from "@/lib/auth/redirect"
import { syncAllowlistedUserIfNeeded } from "@/lib/auth/profile-sync"
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

  const role = user ? await syncAllowlistedUserIfNeeded(user) : null
  const access = resolveAuthAccess(user, session)

  if (!access.isAuthenticated || !access.isAdmin || !role) {
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL("/auth/login?error=forbidden", request.url))
  }

  return NextResponse.redirect(
    new URL(getPostAuthRedirect(access, fallbackNext), request.url)
  )
}
