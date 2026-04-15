import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

import { requireAdminApiSession } from "@/lib/auth/admin-api"
import { enforceRateLimit, getRequestIp } from "@/lib/security/rate-limit"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

const MEDIA_DELETE_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  maxHits: 30,
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApiSession()
  if (auth.error) {
    return auth.error
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ error: "Media id is required." }, { status: 400 })
  }

  const ip = getRequestIp(request.headers)
  const limiter = enforceRateLimit(
    `admin:media:delete:${ip}:${auth.user?.id}`,
    MEDIA_DELETE_RATE_LIMIT
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

  const adminClient = createSupabaseAdminClient() as unknown as {
    storage: {
      from: (bucket: string) => {
        remove: (paths: string[]) => Promise<{ error: { message?: string } | null }>
      }
    }
    from: (table: string) => {
      select: (columns: string) => {
        eq: (column: string, value: string) => {
          maybeSingle: () => Promise<{
            data: Record<string, unknown> | null
            error: { message?: string } | null
          }>
        }
      }
      delete: () => {
        eq: (column: string, value: string) => Promise<{
          error: { message?: string } | null
        }>
      }
    }
  }

  const { data, error } = await adminClient
    .from("media_files")
    .select("bucket,path")
    .eq("id", id)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Unable to locate media file." },
      { status: 404 }
    )
  }

  const bucket = typeof data.bucket === "string" ? data.bucket : "media"
  const path = typeof data.path === "string" ? data.path : null

  if (path) {
    const storageResult = await adminClient.storage.from(bucket).remove([path])
    if (storageResult.error) {
      return NextResponse.json(
        { error: storageResult.error.message ?? "Unable to remove media file." },
        { status: 500 }
      )
    }
  }

  const deleteResult = await adminClient.from("media_files").delete().eq("id", id)
  if (deleteResult.error) {
    return NextResponse.json(
      { error: deleteResult.error.message ?? "Unable to delete media record." },
      { status: 500 }
    )
  }

  revalidatePath("/admin/media")

  return NextResponse.json({ success: true }, { status: 200 })
}
