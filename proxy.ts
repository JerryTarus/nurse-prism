import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { hasRouteAccess, resolveAuthAccess } from "@/lib/auth/access"
import { sanitizeRedirectPath } from "@/lib/auth/redirect"
import { updateSession } from "@/lib/supabase/middleware"

function cloneSupabaseCookies(
  source: NextResponse,
  target: NextResponse
): NextResponse {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie.name, cookie.value)
  })
  return target
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isAdminPath = pathname.startsWith("/admin")
  const isLoginPath = pathname === "/auth/login"
  const isMfaPath = pathname === "/auth/mfa"

  if (!isAdminPath && !isLoginPath && !isMfaPath) {
    return NextResponse.next()
  }

  const { response, supabase } = await updateSession(request)
  const [
    {
      data: { user },
    },
    {
      data: { session },
    },
  ] = await Promise.all([supabase.auth.getUser(), supabase.auth.getSession()])

  const access = resolveAuthAccess(user, session)
  const requestedPath = `${pathname}${request.nextUrl.search}`

  if ((isAdminPath || isMfaPath) && (!access.isAuthenticated || !access.isAdmin)) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("next", requestedPath)
    return cloneSupabaseCookies(response, NextResponse.redirect(loginUrl))
  }

  if (isAdminPath && access.mfa.required && !access.mfa.verified) {
    const mfaUrl = new URL("/auth/mfa", request.url)
    mfaUrl.searchParams.set("next", requestedPath)
    return cloneSupabaseCookies(response, NextResponse.redirect(mfaUrl))
  }

  if (isAdminPath && !hasRouteAccess(pathname, access)) {
    return cloneSupabaseCookies(
      response,
      NextResponse.redirect(new URL("/admin?error=insufficient_role", request.url))
    )
  }

  if (isAdminPath && access.isAdmin) {
    response.cookies.set("np_admin_last_path", requestedPath, {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8,
    })
  }

  if (isMfaPath && access.mfa.verified) {
    const destination = sanitizeRedirectPath(
      request.nextUrl.searchParams.get("next"),
      "/admin"
    )
    return cloneSupabaseCookies(
      response,
      NextResponse.redirect(new URL(destination, request.url))
    )
  }

  if (isLoginPath && access.isAuthenticated && access.isAdmin) {
    const destination = sanitizeRedirectPath(
      request.nextUrl.searchParams.get("next"),
      "/admin"
    )
    const nextDestination =
      access.mfa.required && !access.mfa.verified
        ? `/auth/mfa?next=${encodeURIComponent(destination)}`
        : destination

    return cloneSupabaseCookies(
      response,
      NextResponse.redirect(new URL(nextDestination, request.url))
    )
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*", "/auth/login", "/auth/mfa"],
}
