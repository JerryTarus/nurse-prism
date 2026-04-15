import "server-only"

import { unstable_noStore as noStore } from "next/cache"

import { PRICING_CATEGORIES } from "@/data/pricing"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"
import type { PricingCategory } from "@/types/pricing"

type PublicPageSection = {
  title: string
  content: string
}

type PublicPageSectionMap = Record<string, PublicPageSection>
type PublicSiteSettingsMap = Record<string, string>

type QueryRowsResponse = {
  data: Record<string, unknown>[] | null
  error: unknown
}

function isString(value: unknown): value is string {
  return typeof value === "string"
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

function toBoolean(value: unknown, fallback = true) {
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

function clonePricingCategories(categories: PricingCategory[]) {
  return categories.map((category) => ({
    ...category,
    plans: category.plans.map((plan) => ({ ...plan })),
  }))
}

function getPublicAdminReadClient() {
  try {
    return createSupabaseAdminClient()
  } catch {
    return null
  }
}

function mergePricingCategories(rows: Record<string, unknown>[]) {
  const packageMap = new Map(
    rows
      .map((row) => {
        const packageKey = isString(row.package_key) ? row.package_key : ""

        return [
          packageKey,
          {
            name: isString(row.name) && row.name.trim().length > 0 ? row.name : null,
            basePriceKes: toNumber(row.base_price_kes),
            isActive: toBoolean(row.is_active, true),
          },
        ] as const
      })
      .filter(([packageKey]) => packageKey.length > 0)
  )

  return PRICING_CATEGORIES.map((category) => ({
    ...category,
    plans: category.plans.flatMap((plan) => {
      const override = packageMap.get(plan.id)

      if (override && !override.isActive) {
        return []
      }

      return [
        {
          ...plan,
          name: override?.name ?? plan.name,
          basePriceKes: override?.basePriceKes ?? plan.basePriceKes,
        },
      ]
    }),
  })).filter((category) => category.plans.length > 0)
}

export async function getPublicPricingCategories(): Promise<PricingCategory[]> {
  noStore()

  const client = getPublicAdminReadClient()
  if (!client) {
    return clonePricingCategories(PRICING_CATEGORIES)
  }

  const pricingClient = client as unknown as {
    from: (table: string) => {
      select: (columns: string) => Promise<QueryRowsResponse>
    }
  }

  const { data, error } = await pricingClient
    .from("packages")
    .select("package_key,name,base_price_kes,is_active")

  if (error || !data) {
    return clonePricingCategories(PRICING_CATEGORIES)
  }

  return mergePricingCategories(data)
}

export async function getPublicPageSections(
  pageKey: string
): Promise<PublicPageSectionMap> {
  noStore()

  const client = getPublicAdminReadClient()
  if (!client) {
    return {}
  }

  const sectionClient = client as unknown as {
    from: (table: string) => {
      select: (columns: string) => {
        eq: (column: string, value: string) => Promise<QueryRowsResponse>
      }
    }
  }

  const { data, error } = await sectionClient
    .from("page_sections")
    .select("section_key,title,content")
    .eq("page_key", pageKey)

  if (error || !data) {
    return {}
  }

  return Object.fromEntries(
    data
      .map((row) => {
        const sectionKey = isString(row.section_key) ? row.section_key : ""
        if (!sectionKey) {
          return null
        }

        return [
          sectionKey,
          {
            title: isString(row.title) ? row.title : "",
            content: isString(row.content) ? row.content : "",
          },
        ] as const
      })
      .filter(
        (
          entry
        ): entry is readonly [string, { title: string; content: string }] =>
          Boolean(entry)
      )
  )
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettingsMap> {
  noStore()

  const client = getPublicAdminReadClient()
  if (!client) {
    return {}
  }

  const settingsClient = client as unknown as {
    from: (table: string) => {
      select: (columns: string) => Promise<QueryRowsResponse>
    }
  }

  const { data, error } = await settingsClient
    .from("site_settings")
    .select("key,value")

  if (error || !data) {
    return {}
  }

  return Object.fromEntries(
    data
      .map((row) => {
        const key = isString(row.key) ? row.key : ""
        if (!key) {
          return null
        }

        return [key, isString(row.value) ? row.value : ""] as const
      })
      .filter((entry): entry is readonly [string, string] => Boolean(entry))
  )
}

export function resolvePublicSetting(
  settings: PublicSiteSettingsMap,
  key: string,
  fallback: string
) {
  const value = settings[key]
  return isString(value) && value.trim().length > 0 ? value : fallback
}

export function resolvePublicSection(
  sections: PublicPageSectionMap,
  sectionKey: string,
  fallback: PublicPageSection
) {
  const section = sections[sectionKey]

  if (!section) {
    return fallback
  }

  return {
    title: section.title.trim().length > 0 ? section.title : fallback.title,
    content: section.content.trim().length > 0 ? section.content : fallback.content,
  }
}

export function splitSectionParagraphs(content: string) {
  return content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}
