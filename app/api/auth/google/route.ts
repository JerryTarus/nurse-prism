import { NextResponse } from "next/server"

import { sanitizeRedirectPath } from "@/lib/auth/redirect"
import { getSiteUrl } from "@/lib/seo/metadata"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { oauthLoginSchema } from "@/lib/validations/auth"

export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 })
  }

  const parsed = oauthLoginSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid redirect request." }, { status: 400 })
  }

  const nextPath = sanitizeRedirectPath(parsed.data.next, "/admin")
  const callbackUrl = `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(
    nextPath
  )}`

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  })

  if (error || !data.url) {
    return NextResponse.json(
      { error: "Unable to start Google sign-in right now." },
      { status: 500 }
    )
  }

  return NextResponse.json({ redirectTo: data.url }, { status: 200 })
}
