import { NextResponse } from "next/server"

import { resolveAuthAccess } from "@/lib/auth/access"
import { enforceRateLimit, getRequestIp } from "@/lib/security/rate-limit"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"

const MEDIA_UPLOAD_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  maxHits: 30,
}

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
])

function sanitizeFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export async function POST(request: Request) {
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
  if (!access.isAuthenticated || !access.isAdmin) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
  }

  if (access.mfa.required && !access.mfa.verified) {
    return NextResponse.json(
      { error: "MFA verification is required." },
      { status: 428 }
    )
  }

  const ip = getRequestIp(request.headers)
  const rate = enforceRateLimit(`admin:media-upload:${ip}:${user?.id}`, MEDIA_UPLOAD_RATE_LIMIT)
  if (!rate.ok) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Please retry later.",
        retryAfterSeconds: rate.retryAfterSeconds,
      },
      { status: 429 }
    )
  }

  const formData = await request.formData()
  const file = formData.get("file")
  const folderRaw = formData.get("folder")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 })
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPG, PNG, WEBP, or AVIF." },
      { status: 400 }
    )
  }

  const folder =
    typeof folderRaw === "string" && folderRaw.trim().length > 0
      ? sanitizeFileName(folderRaw)
      : "blog"

  const safeName = sanitizeFileName(file.name || "image")
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "media"
  const filePath = `${folder}/${Date.now()}-${safeName}`
  const fileBytes = new Uint8Array(await file.arrayBuffer())

  const adminClient = createSupabaseAdminClient() as unknown as {
    storage: {
      from: (bucket: string) => {
        upload: (
          path: string,
          body: Uint8Array,
          options: { contentType: string; upsert: boolean }
        ) => Promise<{ error: { message?: string } | null }>
        getPublicUrl: (path: string) => { data: { publicUrl: string } }
      }
    }
    from: (table: string) => {
      insert: (value: Record<string, unknown>) => Promise<unknown>
    }
  }

  const uploadResult = await adminClient.storage
    .from(bucket)
    .upload(filePath, fileBytes, { contentType: file.type, upsert: false })

  if (uploadResult.error) {
    return NextResponse.json(
      {
        error:
          uploadResult.error.message ??
          "Unable to upload image. Check storage bucket configuration.",
      },
      { status: 500 }
    )
  }

  const { data: publicData } = adminClient.storage.from(bucket).getPublicUrl(filePath)

  try {
    await adminClient.from("media_files").insert({
      bucket,
      path: filePath,
      title: safeName,
      alt_text: null,
      mime_type: file.type,
      size_bytes: file.size,
      public_url: publicData.publicUrl,
      created_at: new Date().toISOString(),
    })
  } catch {
    // Best-effort DB log.
  }

  return NextResponse.json(
    {
      publicUrl: publicData.publicUrl,
      path: filePath,
      bucket,
    },
    { status: 201 }
  )
}
