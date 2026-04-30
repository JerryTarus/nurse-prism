import { NextResponse } from "next/server"

import { resolveAuthAccess } from "@/lib/auth/access"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { buildAdminContextPayload } from "@/lib/auth/admin-context"

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient()
  const [
    {
      data: { user },
    },
    {
      data: { session },
    },
  ] = await Promise.all([supabase.auth.getUser(), supabase.auth.getSession()])

  const access = resolveAuthAccess(user, session)
  const payload = buildAdminContextPayload({
    canAccessAdmin:
      access.isAdmin && (!access.mfa.required || access.mfa.verified),
    isSuperAdmin: access.isSuperAdmin,
  })

  return NextResponse.json(payload, { status: 200 })
}
