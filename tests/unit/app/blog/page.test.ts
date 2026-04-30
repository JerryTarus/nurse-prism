import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

import type { BlogPost } from "@/types/blog"

const getPublishedBlogPosts = vi.fn<() => Promise<BlogPost[]>>()

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: unknown
    href: string
  }) => createElement("a", { href, ...props }, children),
}))

vi.mock("server-only", () => ({}))

vi.mock("@/components/blog/blog-card", () => ({
  BlogCard: ({ post }: { post: BlogPost }) =>
    createElement("article", null, post.title),
}))

vi.mock("@/components/shared/json-ld", () => ({
  JsonLd: () => null,
}))

vi.mock("@/lib/cms/blog", () => ({
  getPublishedBlogPosts,
}))

vi.mock(import("@/lib/seo/metadata"), async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    createManagedPageMetadata: vi.fn(() => ({})),
  }
})

const publishedPost: BlogPost = {
  id: "post-1",
  slug: "pivoting-into-digital-health",
  title: "Pivoting into digital health",
  excerpt: "How nurses can evaluate digital health roles with confidence.",
  category: "Career Pivot",
  readTimeMinutes: 6,
  publishedAt: "2026-04-01T00:00:00.000Z",
  image: null,
  tags: ["digital health", "remote"],
  author: {
    name: "Nurse Prism",
    role: "Career Coach",
  },
  body: "Body copy",
  status: "published",
  createdAt: "2026-04-01T00:00:00.000Z",
  updatedAt: "2026-04-01T00:00:00.000Z",
}

describe("GET /blog page", () => {
  beforeEach(() => {
    vi.resetModules()
    getPublishedBlogPosts.mockReset()
  })

  it(
    "shows a visitor-facing coming soon state when no posts are published",
    async () => {
      getPublishedBlogPosts.mockResolvedValue([])

      const { default: BlogIndexPage } = await import("@/app/blog/page")

      const page = await BlogIndexPage({
        searchParams: Promise.resolve({}),
      })

      const html = renderToStaticMarkup(page)

      expect(html).toContain("Fresh nursing career insights are coming soon")
      expect(html).toContain(
        "We’re preparing practical guides on career pivots, LinkedIn visibility, remote nursing roles, digital health, and international opportunities. Check back soon for resources designed to help you move forward with clarity."
      )
      expect(html).toContain("Book a Career Consultation")
      expect(html).toContain("Explore Services")
      expect(html).not.toContain(
        "Publish your first article from the admin dashboard"
      )
    },
    10000
  )

  it(
    "shows the public no-results message when a search has no matches",
    async () => {
      getPublishedBlogPosts.mockResolvedValue([publishedPost])

      const { default: BlogIndexPage } = await import("@/app/blog/page")

      const page = await BlogIndexPage({
        searchParams: Promise.resolve({ q: "linkedin" }),
      })

      const html = renderToStaticMarkup(page)

      expect(html).toContain(
        "No matching articles found. Try another keyword or explore our services while new resources are being prepared."
      )
      expect(html).not.toContain(
        "Publish your first article from the admin dashboard"
      )
    },
    10000
  )
})
