import "server-only"

import type { Session, User } from "@supabase/supabase-js"

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

const ROLE_CANDIDATES: AppRole[] = ["user", "admin", "super_admin"]
const SUPER_ADMIN_ROUTE_PREFIXES = ["/admin/settings", "/admin/appearance"] as const

function parseCsv(value: string | undefined) {
  return new Set(
    (value ?? "")
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean)
  )
}

function parseRole(value: unknown): AppRole | null {
  if (typeof value !== "string") {
    return null
  }

  const normalized = value.toLowerCase()
  return ROLE_CANDIDATES.includes(normalized as AppRole)
    ? (normalized as AppRole)
    : null
}

function parseRoleArray(value: unknown): AppRole[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((entry) => parseRole(entry))
    .filter((role): role is AppRole => role !== null)
}

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
  const adminEmailAllowlist = parseCsv(env.AUTH_ADMIN_EMAILS)
  const superAdminEmailAllowlist = parseCsv(env.AUTH_SUPER_ADMIN_EMAILS)
  const userEmail = user.email?.toLowerCase().trim()

  const roles = new Set<AppRole>(["user"])

  parseRoleArray(user.app_metadata?.roles).forEach((role) => roles.add(role))

  const singleRole = parseRole(user.app_metadata?.role)
  if (singleRole) {
    roles.add(singleRole)
  }

  if (userEmail && adminEmailAllowlist.has(userEmail)) {
    roles.add("admin")
  }

  if (userEmail && superAdminEmailAllowlist.has(userEmail)) {
    roles.add("super_admin")
  }

  if (roles.has("super_admin")) {
    roles.add("admin")
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
