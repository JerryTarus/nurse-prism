import { NextResponse } from "next/server"

import { resolveAuthAccess } from "@/lib/auth/access"
import { enforceRateLimit, getRequestIp } from "@/lib/security/rate-limit"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { blogPostPayloadSchema } from "@/lib/validations/blog"

const BLOG_WRITE_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  maxHits: 50,
}

async function requireAdminMfa() {
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
    return { error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) }
  }

  if (access.mfa.required && !access.mfa.verified) {
    return {
      error: NextResponse.json(
        { error: "MFA verification is required." },
        { status: 428 }
      ),
    }
  }

  return { user, error: null as NextResponse<unknown> | null }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminMfa()
  if (auth.error) {
    return auth.error
  }

  const { id } = await context.params
  if (!id) {
    return NextResponse.json({ error: "Post id is required." }, { status: 400 })
  }

  const ip = getRequestIp(request.headers)
  const limiter = enforceRateLimit(`admin:blog:update:${ip}:${auth.user?.id}`, BLOG_WRITE_RATE_LIMIT)
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
  const parsed = blogPostPayloadSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid blog post payload." }, { status: 400 })
  }

  const input = parsed.data
  const nowIso = new Date().toISOString()
  const publishedAt =
    input.status === "published"
      ? (input.publishedAt ?? nowIso)
      : input.status === "scheduled"
        ? input.publishedAt
        : null

  const adminClient = createSupabaseAdminClient() as unknown as {
    from: (table: string) => {
      update: (value: Record<string, unknown>) => {
        eq: (column: string, value: string) => {
          select: (columns: string) => {
            single: () => Promise<{
              data: Record<string, unknown> | null
              error: { message?: string } | null
            }>
          }
        }
      }
    }
  }

  const { data, error } = await adminClient
    .from("blog_posts")
    .update({
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      category: input.category,
      tags: input.tags,
      content: input.body,
      cover_image_url: input.image,
      status: input.status,
      published_at: publishedAt,
      read_time_minutes: input.readTimeMinutes,
      updated_at: nowIso,
    })
    .eq("id", id)
    .select("id")
    .single()

  if (error || !data?.id) {
    return NextResponse.json(
      {
        error:
          "Unable to update blog post. Ensure `blog_posts` table exists and service role is configured.",
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    {
      id: data.id,
      redirectTo: `/admin/blog/${data.id}?status=saved`,
    },
    { status: 200 }
  )
}
