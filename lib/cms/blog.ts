import "server-only"

import { cache } from "react"

import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { BlogPost } from "@/types/blog"

function isString(value: unknown): value is string {
  return typeof value === "string"
}

function toIso(value: unknown) {
  return isString(value) && value.length > 0 ? value : new Date(0).toISOString()
}

function toOptionalIso(value: unknown) {
  return isString(value) && value.length > 0 ? value : null
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }

  if (isString(value) && value.length > 0) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return fallback
}

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }
  return value.filter((entry): entry is string => isString(entry))
}

function mapBlogRow(row: Record<string, unknown>): BlogPost {
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    excerpt: String(row.excerpt ?? ""),
    category: String(row.category ?? "General"),
    readTimeMinutes: Math.max(1, Math.round(toNumber(row.read_time_minutes, 6))),
    publishedAt: toOptionalIso(row.published_at),
    image: isString(row.cover_image_url) ? row.cover_image_url : null,
    tags: toStringArray(row.tags),
    author: {
      name: String(row.author_name ?? "Nurse Prism Team"),
      role: String(row.author_role ?? "Editorial"),
    },
    body: String(row.content ?? ""),
    status: "published",
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  }
}

type BlogQueryBuilder = {
  eq: (column: string, value: string) => BlogQueryBuilder
  order: (
    column: string,
    options: { ascending: boolean }
  ) => Promise<{ data: Record<string, unknown>[] | null; error: unknown }>
  maybeSingle: () => Promise<{ data: Record<string, unknown> | null; error: unknown }>
}

type BlogReadClient = {
  from: (table: string) => {
    select: (columns: string) => BlogQueryBuilder
  }
}

async function getBlogReadClient(): Promise<BlogReadClient> {
  try {
    return createSupabaseAdminClient() as unknown as BlogReadClient
  } catch {
    return (await createSupabaseServerClient()) as unknown as BlogReadClient
  }
}

export const getPublishedBlogPosts = cache(async (): Promise<BlogPost[]> => {
  const supabase = await getBlogReadClient()

  const { data, error } = (await supabase
    .from("blog_posts")
    .select(
      "id,slug,title,excerpt,category,published_at,updated_at,created_at,tags,cover_image_url,read_time_minutes,author_name,author_role,content"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false })) as {
    data: Record<string, unknown>[] | null
    error: unknown
  }

  if (error || !data) {
    return []
  }

  return data.map(mapBlogRow)
})

export const getPublishedBlogPostBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    const supabase = await getBlogReadClient()

    const { data, error } = (await supabase
      .from("blog_posts")
      .select(
        "id,slug,title,excerpt,category,published_at,updated_at,created_at,tags,cover_image_url,read_time_minutes,author_name,author_role,content,status"
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle()) as { data: Record<string, unknown> | null; error: unknown }

    if (error || !data) {
      return null
    }

    return mapBlogRow(data)
  }
)
