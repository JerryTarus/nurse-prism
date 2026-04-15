import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

import { requireAdminApiSession } from "@/lib/auth/admin-api"
import { enforceRateLimit, getRequestIp } from "@/lib/security/rate-limit"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { pageSectionCreateSchema } from "@/lib/validations/dashboard"

const PAGE_SECTION_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  maxHits: 50,
}

export async function POST(request: Request) {
  const auth = await requireAdminApiSession()
  if (auth.error) {
    return auth.error
  }

  const ip = getRequestIp(request.headers)
  const limiter = enforceRateLimit(
    `admin:page-sections:create:${ip}:${auth.user?.id}`,
    PAGE_SECTION_RATE_LIMIT
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
  const parsed = pageSectionCreateSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid page section payload." },
      { status: 400 }
    )
  }

  const adminClient = createSupabaseAdminClient() as unknown as {
    from: (table: string) => {
      insert: (value: Record<string, unknown>) => {
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
    .from("page_sections")
    .insert({
      page_key: parsed.data.pageKey,
      section_key: parsed.data.sectionKey,
      title: parsed.data.title,
      content: parsed.data.content,
      updated_at: new Date().toISOString(),
      updated_by: auth.user?.id ?? null,
    })
    .select("id")
    .single()

  if (error) {
    return NextResponse.json(
      { error: error.message ?? "Unable to create page section." },
      { status: 500 }
    )
  }

  revalidatePath("/admin/pages")

  return NextResponse.json({ success: true }, { status: 201 })
}
