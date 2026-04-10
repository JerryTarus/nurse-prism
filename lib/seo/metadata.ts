import type { Metadata } from "next"

import { SITE_CONFIG } from "@/lib/constants"

const FALLBACK_SITE_URL = "http://localhost:3000"
const DEFAULT_OG_IMAGE = "/images/hero/nurse-prism-hero.webp"

function normalizePath(path: string) {
  if (!path) {
    return "/"
  }

  return path.startsWith("/") ? path : `/${path}`
}

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL

  try {
    const normalized = new URL(value).toString().replace(/\/$/, "")

    return normalized
  } catch {
    return FALLBACK_SITE_URL
  }
}

export function getMetadataBase() {
  return new URL(getSiteUrl())
}

export function toAbsoluteUrl(path: string) {
  const cleanSiteUrl = getSiteUrl()
  const cleanPath = normalizePath(path)
  return `${cleanSiteUrl}${cleanPath}`
}

type PageMetadataOptions = {
  title: string
  description: string
  path: string
  image?: string
  keywords?: string[]
}

export function createPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  keywords,
}: PageMetadataOptions): Metadata {
  const canonicalPath = normalizePath(path)

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      title,
      description,
      siteName: SITE_CONFIG.name,
      url: canonicalPath,
      images: [
        {
          url: image,
          width: 1600,
          height: 1000,
          alt: `${SITE_CONFIG.name} preview image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

type ArticleMetadataOptions = {
  title: string
  description: string
  path: string
  image?: string
  publishedTime: string
  modifiedTime?: string
  tags?: string[]
}

export function createArticleMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  publishedTime,
  modifiedTime,
  tags,
}: ArticleMetadataOptions): Metadata {
  const canonicalPath = normalizePath(path)

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "article",
      title,
      description,
      siteName: SITE_CONFIG.name,
      url: canonicalPath,
      publishedTime,
      modifiedTime: modifiedTime ?? publishedTime,
      tags,
      images: [
        {
          url: image,
          width: 1600,
          height: 1000,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}
