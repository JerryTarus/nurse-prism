import { NextResponse } from "next/server"

import { resolveAuthAccess } from "@/lib/auth/access"
import { createSupabaseServerClient } from "@/lib/supabase/server"

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
  const cookies = request.headers.get("cookie") ?? ""
  const lastPathMatch = cookies.match(/(?:^|;\s*)np_admin_last_path=([^;]+)/)
  const lastPath = lastPathMatch ? decodeURIComponent(lastPathMatch[1]) : "/admin"

  return NextResponse.json(
    {
      isAuthenticated: access.isAuthenticated,
      isAdmin: access.isAdmin,
      isSuperAdmin: access.isSuperAdmin,
      canAccessAdmin: access.isAdmin && (!access.mfa.required || access.mfa.verified),
      mfaVerified: access.mfa.verified,
      lastAdminPath: lastPath || "/admin",
    },
    { status: 200 }
  )
}
