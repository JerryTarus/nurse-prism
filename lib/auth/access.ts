import "server-only"

import type { Session, User } from "@supabase/supabase-js"

import { resolveAllowlistedRole } from "@/lib/auth/admin-identities"
import { getSupabaseServerEnv } from "@/lib/supabase/env.server"

export type AppRole = "user" | "admin" | "super_admin"

export type AuthAccess = {
  isAuthenticated: boolean
  roles: AppRole[]
  isAdmin: boolean
  isSuperAdmin: boolean
  mfa: {
    required: boolean
    hasEnrolledFactor: boolean
    assuranceLevel: "aal1" | "aal2" | "unknown"
    verified: boolean
  }
}

const SUPER_ADMIN_ROUTE_PREFIXES = ["/admin/settings", "/admin/appearance"] as const

function decodeJwtAal(accessToken: string | undefined): "aal1" | "aal2" | "unknown" {
  if (!accessToken) {
    return "unknown"
  }

  try {
    const [, payloadPart] = accessToken.split(".")

    if (!payloadPart) {
      return "unknown"
    }

    const normalized = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payloadPart.length / 4) * 4, "=")

    const payload =
      typeof atob === "function"
        ? atob(normalized)
        : Buffer.from(normalized, "base64").toString("utf8")

    const parsed = JSON.parse(payload) as { aal?: unknown }
    return parsed.aal === "aal1" || parsed.aal === "aal2" ? parsed.aal : "unknown"
  } catch {
    return "unknown"
  }
}

export function resolveAuthAccess(user: User | null, session?: Session | null): AuthAccess {
  if (!user) {
    return {
      isAuthenticated: false,
      roles: ["user"],
      isAdmin: false,
      isSuperAdmin: false,
      mfa: {
        required: false,
        hasEnrolledFactor: false,
        assuranceLevel: "unknown",
        verified: false,
      },
    }
  }

  const env = getSupabaseServerEnv()
  const allowlistedRole = resolveAllowlistedRole(user.email, env)
  const roles = new Set<AppRole>(["user"])

  if (allowlistedRole === "admin" || allowlistedRole === "super_admin") {
    roles.add("admin")
  }

  if (allowlistedRole === "super_admin") {
    roles.add("super_admin")
  }

  const hasEnrolledFactor = (user.factors?.length ?? 0) > 0
  const assuranceLevel = decodeJwtAal(session?.access_token)
  const isAdmin = roles.has("admin")

  return {
    isAuthenticated: true,
    roles: Array.from(roles),
    isAdmin,
    isSuperAdmin: roles.has("super_admin"),
    mfa: {
      required: isAdmin,
      hasEnrolledFactor,
      assuranceLevel,
      verified: assuranceLevel === "aal2",
    },
  }
}

export function requiresSuperAdminForPath(pathname: string) {
  return SUPER_ADMIN_ROUTE_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export function hasRouteAccess(pathname: string, access: AuthAccess) {
  if (!access.isAuthenticated || !access.isAdmin) {
    return false
  }

  if (requiresSuperAdminForPath(pathname)) {
    return access.isSuperAdmin
  }

  return true
}
