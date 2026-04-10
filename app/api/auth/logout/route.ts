import { NextResponse } from "next/server"

import { sanitizeRedirectPath } from "@/lib/auth/redirect"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? ""
  let nextValue: string | null | undefined

  if (contentType.includes("application/json")) {
    const payload = (await request.json().catch(() => ({ next: "/" }))) as {
      next?: string
    }
    nextValue = payload.next
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData()
    nextValue = form.get("next")?.toString()
  }

  const nextPath = sanitizeRedirectPath(nextValue, "/")

  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()

  return NextResponse.json({ redirectTo: nextPath }, { status: 200 })
}
