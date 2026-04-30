import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"

import { createSupabaseServerClient } from "@/lib/supabase/server"

import { resolveAuthAccess } from "./access"
import { syncAllowlistedUserIfNeeded } from "./profile-sync"
import { sanitizeRedirectPath } from "./redirect"

export const getServerSessionContext = cache(async () => {
  const supabase = await createSupabaseServerClient()
  const [
    {
      data: { user },
    },
    {
      data: { session },
    },
  ] = await Promise.all([supabase.auth.getUser(), supabase.auth.getSession()])

  if (user) {
    await syncAllowlistedUserIfNeeded(user)
  }

  const access = resolveAuthAccess(user, session)

  return { user, session, access, supabase }
})

type RequireAdminSessionOptions = {
  nextPath?: string
  requireMfa?: boolean
  requireSuperAdmin?: boolean
}

export async function requireAdminSession(options?: RequireAdminSessionOptions) {
  const nextPath = sanitizeRedirectPath(options?.nextPath, "/admin")
  const requireMfa = options?.requireMfa ?? true
  const requireSuperAdmin = options?.requireSuperAdmin ?? false

  const context = await getServerSessionContext()

  if (!context.user) {
    redirect(`/auth/login?next=${encodeURIComponent(nextPath)}`)
  }

  if (!context.access.isAdmin) {
    redirect(`/auth/login?next=${encodeURIComponent(nextPath)}&error=forbidden`)
  }

  if (
    requireMfa &&
    context.access.mfa.required &&
    !context.access.mfa.verified
  ) {
    redirect(`/auth/mfa?next=${encodeURIComponent(nextPath)}`)
  }

  if (requireSuperAdmin && !context.access.isSuperAdmin) {
    redirect("/admin?error=insufficient_role")
  }

  return context
}

type RequireSuperAdminSessionOptions = Omit<
  RequireAdminSessionOptions,
  "requireSuperAdmin"
>

export async function requireSuperAdminSession(
  options?: RequireSuperAdminSessionOptions
) {
  return requireAdminSession({ ...options, requireSuperAdmin: true })
}
