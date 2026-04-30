import "server-only"

import type { User } from "@supabase/supabase-js"

import type { AllowlistedRole } from "@/lib/auth/admin-identities"
import { resolveAllowlistedRole } from "@/lib/auth/admin-identities"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { getSupabaseServerEnv } from "@/lib/supabase/env.server"

export function buildProfileSyncPayload(user: User, role: AllowlistedRole) {
  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : null

  return {
    profile: {
      id: user.id,
      email: user.email?.trim().toLowerCase() ?? null,
      full_name: fullName,
      role,
      mfa_required: true,
    },
    roleMappings: role === "super_admin" ? ["admin", "super_admin"] : ["admin"],
  }
}

export async function syncAllowlistedUserIfNeeded(user: User) {
  const env = getSupabaseServerEnv()
  const role = resolveAllowlistedRole(user.email, env)

  if (!role) {
    return null
  }

  const client = createSupabaseAdminClient()
  const payload = buildProfileSyncPayload(user, role)

  await client.from("profiles").upsert(payload.profile, { onConflict: "id" })
  await client
    .from("role_mappings")
    .delete()
    .eq("user_id", user.id)
    .in("role_id", ["admin", "super_admin"])

  await client.from("role_mappings").insert(
    payload.roleMappings.map((roleId) => ({
      user_id: user.id,
      role_id: roleId,
    }))
  )

  return role
}
