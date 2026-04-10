import "server-only"

import { cache } from "react"

import { PRICING_CATEGORIES } from "@/data/pricing"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type {
  AppearanceSetting,
  ContactMessage,
  DashboardSnapshot,
  EditablePageSection,
  MediaFile,
  PackageConfig,
  SiteSetting,
} from "@/types/admin"
import type { Booking } from "@/types/booking"
import type { BlogPost } from "@/types/blog"
import type { Lead } from "@/types/lead"

type QueryResult<T> = {
  data: T
  cmsReady: boolean
}

type SupabaseLikeClient = {
  from: (table: string) => {
    select: (...args: unknown[]) => unknown
  }
}

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

  if (isString(value) && value.trim().length > 0) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }

  return fallback
}

function toBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") {
    return value
  }

  if (isString(value)) {
    if (value.toLowerCase() === "true") {
      return true
    }
    if (value.toLowerCase() === "false") {
      return false
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

function isTableReady(error: unknown) {
  if (!error || typeof error !== "object") {
    return true
  }

  const shape = error as { message?: unknown; details?: unknown; code?: unknown }
  const code = isString(shape.code) ? shape.code : ""
  const message = `${isString(shape.message) ? shape.message : ""} ${
    isString(shape.details) ? shape.details : ""
  }`.toLowerCase()

  if (code === "PGRST205" || code === "42P01") {
    return false
  }

  if (
    message.includes("does not exist") ||
    message.includes("relation") ||
    message.includes("schema cache")
  ) {
    return false
  }

  return false
}

async function getCmsReadClient(): Promise<SupabaseLikeClient> {
  try {
    return createSupabaseAdminClient() as unknown as SupabaseLikeClient
  } catch {
    return (await createSupabaseServerClient()) as unknown as SupabaseLikeClient
  }
}

function formatReadTime(minutes: number) {
  const safeMinutes = Math.max(1, Math.round(minutes))
  return safeMinutes
}

function mapBlogPostRow(row: Record<string, unknown>): BlogPost {
  const readTimeMinutes = formatReadTime(toNumber(row.read_time_minutes, 6))

  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    excerpt: String(row.excerpt ?? ""),
    category: String(row.category ?? "General"),
    readTimeMinutes,
    publishedAt: toOptionalIso(row.published_at),
    image:
      (isString(row.cover_image_url) && row.cover_image_url.length > 0
        ? row.cover_image_url
        : null) ??
      (isString(row.image) && row.image.length > 0 ? row.image : null),
    tags: toStringArray(row.tags),
    author: {
      name: String(row.author_name ?? "Nurse Prism Team"),
      role: String(row.author_role ?? "Editorial"),
    },
    body: String(row.content ?? row.body ?? ""),
    status:
      row.status === "draft" ||
      row.status === "scheduled" ||
      row.status === "published" ||
      row.status === "archived"
        ? row.status
        : "draft",
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  }
}

const getDashboardData = cache(async () => {
  const client = await getCmsReadClient()
  let cmsReady = true

  const [leadsResponse, bookingsResponse, messagesResponse, postsResponse] =
    await Promise.all([
      (
        client
          .from("leads")
          .select(
            "id,full_name,email,phone,target_country,intent,status,source,notes,created_at,updated_at"
          ) as Promise<{ data: Record<string, unknown>[] | null; error: unknown }>
      ),
      (
        client
          .from("bookings")
          .select(
            "id,full_name,email,phone,intent,status,scheduled_for,assigned_coach,notes,created_at,updated_at"
          ) as Promise<{ data: Record<string, unknown>[] | null; error: unknown }>
      ),
      (
        client
          .from("contact_submissions")
          .select(
            "id,full_name,email,phone,subject,message,status,created_at,updated_at"
          ) as Promise<{ data: Record<string, unknown>[] | null; error: unknown }>
      ),
      (
        client
          .from("blog_posts")
          .select(
            "id,slug,title,excerpt,category,status,published_at,updated_at,created_at,tags,cover_image_url,read_time_minutes,author_name,author_role,content"
          ) as Promise<{ data: Record<string, unknown>[] | null; error: unknown }>
      ),
    ])

  const leads: Lead[] =
    leadsResponse.data?.map((row) => ({
      id: String(row.id ?? ""),
      fullName: String(row.full_name ?? ""),
      email: String(row.email ?? ""),
      phone: isString(row.phone) ? row.phone : null,
      targetCountry: isString(row.target_country) ? row.target_country : null,
      intent: String(row.intent ?? ""),
      status:
        row.status === "new" ||
        row.status === "qualified" ||
        row.status === "follow_up" ||
        row.status === "won" ||
        row.status === "lost"
          ? row.status
          : "new",
      source:
        row.source === "website" ||
        row.source === "contact_form" ||
        row.source === "pricing_page" ||
        row.source === "program_page" ||
        row.source === "referral" ||
        row.source === "manual"
          ? row.source
          : "website",
      notes: isString(row.notes) ? row.notes : null,
      createdAt: toIso(row.created_at),
      updatedAt: toIso(row.updated_at),
    })) ?? []

  if (leadsResponse.error) {
    cmsReady = cmsReady && isTableReady(leadsResponse.error)
  }

  const bookings: Booking[] =
    bookingsResponse.data?.map((row) => ({
      id: String(row.id ?? ""),
      fullName: String(row.full_name ?? ""),
      email: String(row.email ?? ""),
      phone: isString(row.phone) ? row.phone : null,
      intent: String(row.intent ?? ""),
      status:
        row.status === "pending" ||
        row.status === "confirmed" ||
        row.status === "completed" ||
        row.status === "cancelled" ||
        row.status === "no_show"
          ? row.status
          : "pending",
      scheduledFor: toOptionalIso(row.scheduled_for),
      assignedCoach: isString(row.assigned_coach) ? row.assigned_coach : null,
      notes: isString(row.notes) ? row.notes : null,
      createdAt: toIso(row.created_at),
      updatedAt: toIso(row.updated_at),
    })) ?? []

  if (bookingsResponse.error) {
    cmsReady = cmsReady && isTableReady(bookingsResponse.error)
  }

  const messages: ContactMessage[] =
    messagesResponse.data?.map((row) => ({
      id: String(row.id ?? ""),
      fullName: String(row.full_name ?? ""),
      email: String(row.email ?? ""),
      phone: isString(row.phone) ? row.phone : null,
      subject: isString(row.subject) ? row.subject : null,
      message: String(row.message ?? ""),
      status:
        row.status === "new" ||
        row.status === "in_progress" ||
        row.status === "replied" ||
        row.status === "closed"
          ? row.status
          : "new",
      createdAt: toIso(row.created_at),
      updatedAt: toIso(row.updated_at),
    })) ?? []

  if (messagesResponse.error) {
    cmsReady = cmsReady && isTableReady(messagesResponse.error)
  }

  const blogPosts = postsResponse.data?.map(mapBlogPostRow) ?? []
  if (postsResponse.error) {
    cmsReady = cmsReady && isTableReady(postsResponse.error)
  }

  return {
    leads,
    bookings,
    messages,
    blogPosts,
    cmsReady,
  }
})

export const getAdminDashboardSnapshot = cache(async (): Promise<DashboardSnapshot> => {
  const data = await getDashboardData()

  return {
    totals: {
      leads: data.leads.length,
      bookings: data.bookings.length,
      messages: data.messages.length,
      publishedPosts: data.blogPosts.filter((post) => post.status === "published")
        .length,
    },
    recentLeads: data.leads.slice(0, 8),
    upcomingBookings: data.bookings
      .filter((booking) => Boolean(booking.scheduledFor))
      .sort((a, b) => {
        const timeA = a.scheduledFor ? new Date(a.scheduledFor).getTime() : Infinity
        const timeB = b.scheduledFor ? new Date(b.scheduledFor).getTime() : Infinity
        return timeA - timeB
      })
      .slice(0, 8),
    recentMessages: data.messages.slice(0, 8),
    latestPosts: data.blogPosts.slice(0, 6),
    cmsReady: data.cmsReady,
  }
})

export const getAdminLeads = cache(async (): Promise<QueryResult<Lead[]>> => {
  const data = await getDashboardData()
  return { data: data.leads, cmsReady: data.cmsReady }
})

export const getAdminBookings = cache(async (): Promise<QueryResult<Booking[]>> => {
  const data = await getDashboardData()
  return { data: data.bookings, cmsReady: data.cmsReady }
})

export const getAdminMessages = cache(
  async (): Promise<QueryResult<ContactMessage[]>> => {
    const data = await getDashboardData()
    return { data: data.messages, cmsReady: data.cmsReady }
  }
)

export const getAdminBlogPosts = cache(async (): Promise<QueryResult<BlogPost[]>> => {
  const data = await getDashboardData()
  return { data: data.blogPosts, cmsReady: data.cmsReady }
})

export const getAdminMediaFiles = cache(async (): Promise<QueryResult<MediaFile[]>> => {
  const client = await getCmsReadClient()

  const { data, error } = (await (
    client
      .from("media_files")
      .select(
        "id,bucket,path,title,alt_text,mime_type,size_bytes,public_url,created_at"
      )
  )) as { data: Record<string, unknown>[] | null; error: unknown }

  const mapped: MediaFile[] =
    data?.map((row) => ({
      id: String(row.id ?? ""),
      bucket: String(row.bucket ?? "public"),
      path: String(row.path ?? ""),
      title: String(row.title ?? "Untitled media"),
      altText: isString(row.alt_text) ? row.alt_text : null,
      mimeType: isString(row.mime_type) ? row.mime_type : null,
      sizeBytes: typeof row.size_bytes === "number" ? row.size_bytes : null,
      publicUrl: isString(row.public_url) ? row.public_url : null,
      createdAt: toIso(row.created_at),
    })) ?? []

  return { data: mapped, cmsReady: !error }
})

export const getAdminPageSections = cache(
  async (): Promise<QueryResult<EditablePageSection[]>> => {
    const client = await getCmsReadClient()

    const { data, error } = (await (
      client
        .from("page_sections")
        .select("id,page_key,section_key,title,content,updated_at,updated_by")
    )) as { data: Record<string, unknown>[] | null; error: unknown }

    const mapped: EditablePageSection[] =
      data?.map((row) => ({
        id: String(row.id ?? ""),
        pageKey: String(row.page_key ?? ""),
        sectionKey: String(row.section_key ?? ""),
        title: String(row.title ?? ""),
        content: String(row.content ?? ""),
        updatedAt: toIso(row.updated_at),
        updatedBy: isString(row.updated_by) ? row.updated_by : null,
      })) ?? []

    return { data: mapped, cmsReady: !error }
  }
)

export const getAdminPackageConfigs = cache(
  async (): Promise<QueryResult<PackageConfig[]>> => {
    const client = await getCmsReadClient()

    const { data, error } = (await (
      client
        .from("packages")
        .select("id,package_key,name,category,base_price_kes,is_active,updated_at")
    )) as { data: Record<string, unknown>[] | null; error: unknown }

    if (error || !data) {
      const fallback = PRICING_CATEGORIES.flatMap((category) =>
        category.plans.map((plan) => ({
          id: plan.id,
          packageKey: plan.id,
          name: plan.name,
          category: category.id,
          basePriceKes: plan.basePriceKes,
          isActive: true,
          updatedAt: new Date(0).toISOString(),
        }))
      ) as PackageConfig[]

      return { data: fallback, cmsReady: false }
    }

    return {
      data: data.map((row) => ({
        id: String(row.id ?? ""),
        packageKey: String(row.package_key ?? ""),
        name: String(row.name ?? ""),
        category:
          row.category === "consultation" ||
          row.category === "relocation" ||
          row.category === "program"
            ? row.category
            : "consultation",
        basePriceKes: toNumber(row.base_price_kes),
        isActive: toBoolean(row.is_active, true),
        updatedAt: toIso(row.updated_at),
      })),
      cmsReady: true,
    }
  }
)

const getSiteSettings = cache(async (): Promise<QueryResult<SiteSetting[]>> => {
  const client = await getCmsReadClient()

  const { data, error } = (await client
    .from("site_settings")
    .select("key,value,updated_at")) as {
    data: Record<string, unknown>[] | null
    error: unknown
  }

  const settings: SiteSetting[] =
    data?.map((row) => ({
      key: String(row.key ?? ""),
      value: String(row.value ?? ""),
      updatedAt: toIso(row.updated_at),
    })) ?? []

  return { data: settings, cmsReady: !error }
})

export const getAdminSettings = cache(async (): Promise<QueryResult<SiteSetting[]>> => {
  return getSiteSettings()
})

export const getAdminAppearanceSettings = cache(
  async (): Promise<QueryResult<AppearanceSetting[]>> => {
    const settings = await getSiteSettings()

    return {
      data: settings.data
        .filter((setting) => setting.key.startsWith("appearance."))
        .map((setting) => ({
          key: setting.key,
          value: setting.value,
          updatedAt: setting.updatedAt,
        })),
      cmsReady: settings.cmsReady,
    }
  }
)
