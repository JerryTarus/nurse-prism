import "server-only"

import { NextResponse } from "next/server"

import { createSupabaseServerClient } from "@/lib/supabase/server"

import { resolveAuthAccess } from "./access"
import { syncAllowlistedUserIfNeeded } from "./profile-sync"

type RequireAdminApiSessionOptions = {
  requireSuperAdmin?: boolean
}

export async function requireAdminApiSession(
  options?: RequireAdminApiSessionOptions
) {
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

  if (!access.isAuthenticated || !access.isAdmin) {
    return {
      user: null,
      access,
      error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
    }
  }

  if (access.mfa.required && !access.mfa.verified) {
    return {
      user: null,
      access,
      error: NextResponse.json(
        { error: "MFA verification is required." },
        { status: 428 }
      ),
    }
  }

  if (options?.requireSuperAdmin && !access.isSuperAdmin) {
    return {
      user: null,
      access,
      error: NextResponse.json(
        { error: "Super admin access is required." },
        { status: 403 }
      ),
    }
  }

  return { user, access, error: null as NextResponse<unknown> | null }
}
