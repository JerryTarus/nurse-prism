import type { MetadataRoute } from "next"

import { getPublishedBlogPosts } from "@/lib/cms/blog"
import { toAbsoluteUrl } from "@/lib/seo/metadata"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getPublishedBlogPosts()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: toAbsoluteUrl("/"), lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: toAbsoluteUrl("/about"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: toAbsoluteUrl("/services"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: toAbsoluteUrl("/pricing"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: toAbsoluteUrl("/program"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: toAbsoluteUrl("/blog"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: toAbsoluteUrl("/contact"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.85 },
    { url: toAbsoluteUrl("/faq"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ]

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: toAbsoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.75,
  }))

  return [...staticRoutes, ...blogRoutes]
}
