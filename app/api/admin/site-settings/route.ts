import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

import { requireAdminApiSession } from "@/lib/auth/admin-api"
import { enforceRateLimit, getRequestIp } from "@/lib/security/rate-limit"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { siteSettingUpsertSchema } from "@/lib/validations/dashboard"

const SETTINGS_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  maxHits: 50,
}

export async function POST(request: Request) {
  const auth = await requireAdminApiSession({ requireSuperAdmin: true })
  if (auth.error) {
    return auth.error
  }

  const ip = getRequestIp(request.headers)
  const limiter = enforceRateLimit(
    `admin:settings:upsert:${ip}:${auth.user?.id}`,
    SETTINGS_RATE_LIMIT
  )
  if (!limiter.ok) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Please retry shortly.",
        retryAfterSeconds: limiter.retryAfterSeconds,
      },
      { status: 429 }
    )
  }

  const payload = await request.json().catch(() => null)
  const parsed = siteSettingUpsertSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid setting payload." },
      { status: 400 }
    )
  }

  const adminClient = createSupabaseAdminClient() as unknown as {
    from: (table: string) => {
      upsert: (
        value: Record<string, unknown>,
        options: { onConflict: string }
      ) => {
        select: (columns: string) => {
          single: () => Promise<{
            data: Record<string, unknown> | null
            error: { message?: string } | null
          }>
        }
      }
    }
  }

  const { error } = await adminClient
    .from("site_settings")
    .upsert(
      {
        key: parsed.data.key,
        value: parsed.data.value,
        updated_at: new Date().toISOString(),
        updated_by: auth.user?.id ?? null,
      },
      { onConflict: "key" }
    )
    .select("key")
    .single()

  if (error) {
    return NextResponse.json(
      { error: error.message ?? "Unable to save setting." },
      { status: 500 }
    )
  }

  revalidatePath("/admin/settings")
  revalidatePath("/admin/appearance")

  return NextResponse.json({ success: true }, { status: 200 })
}
