import type { Metadata } from "next"

import { BlogCard } from "@/components/blog/blog-card"
import { JsonLd } from "@/components/shared/json-ld"
import { getPublishedBlogPosts } from "@/lib/cms/blog"
import { createPageMetadata } from "@/lib/seo/metadata"
import { createBlogCollectionSchema } from "@/lib/seo/structured-data"

type BlogPageProps = {
  searchParams: Promise<{ q?: string }>
}

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description:
    "Read Nurse Prism insights on Gulf nursing relocation, profile positioning, and interview strategy.",
  path: "/blog",
  keywords: [
    "nursing career blog",
    "gulf nurse relocation tips",
    "nurse interview guidance",
  ],
})

export default async function BlogIndexPage({ searchParams }: BlogPageProps) {
  const rawQuery = ((await searchParams).q ?? "").trim()
  const normalizedQuery = rawQuery.toLowerCase()
  const publishedPosts = await getPublishedBlogPosts()

  const visiblePosts = normalizedQuery
    ? publishedPosts.filter((post) =>
        `${post.title} ${post.excerpt} ${post.tags.join(" ")}`
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : publishedPosts

  return (
    <section className="np-container pb-12 pt-10 sm:pt-14">
      <JsonLd data={createBlogCollectionSchema(publishedPosts)} />

      <div className="rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Blog
        </p>
        <h1 className="font-heading mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          Practical guidance for your global nursing career
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Explore strategy notes on relocation, interviews, and profile
          positioning for Gulf opportunities.
        </p>

        <form method="get" className="mt-5 max-w-lg">
          <label htmlFor="blog-search" className="sr-only">
            Search blog posts
          </label>
          <input
            id="blog-search"
            name="q"
            defaultValue={rawQuery}
            placeholder="Search by keyword..."
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </form>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visiblePosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      {publishedPosts.length === 0 ? (
        <p className="mt-6 rounded-xl border border-border bg-card/90 px-4 py-3 text-sm text-muted-foreground">
          No blog posts are published yet. Publish your first article from the admin
          dashboard to make it live here.
        </p>
      ) : null}

      {publishedPosts.length > 0 && visiblePosts.length === 0 ? (
        <p className="mt-6 rounded-xl border border-border bg-card/90 px-4 py-3 text-sm text-muted-foreground">
          No posts found for &quot;{rawQuery}&quot;. Try another keyword.
        </p>
      ) : null}
    </section>
  )
}
