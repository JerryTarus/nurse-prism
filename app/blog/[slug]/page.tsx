import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { JsonLd } from "@/components/shared/json-ld"
import { getPublishedBlogPostBySlug } from "@/lib/cms/blog"
import { createArticleMetadata } from "@/lib/seo/metadata"
import { createArticleSchema } from "@/lib/seo/structured-data"

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const slug = (await params).slug
  const post = await getPublishedBlogPostBySlug(slug)

  if (!post) {
    return { title: "Article not found" }
  }

  return createArticleMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.image ?? undefined,
    publishedTime: post.publishedAt ?? post.createdAt,
    tags: post.tags,
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const slug = (await params).slug
  const post = await getPublishedBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="np-container pb-14 pt-10 sm:pt-14">
      <JsonLd data={createArticleSchema(post)} />

      <Link href="/blog" className="text-sm font-medium text-primary hover:underline">
        Back to blog
      </Link>

      <header className="mt-4 rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">
          {post.category}
        </p>
        <h1 className="font-heading mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{post.excerpt}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Publishing date pending"}{" "}
          | {post.readTimeMinutes} min read | by {post.author.name}
        </p>

        {post.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image}
            alt={post.title}
            className="mt-5 h-72 w-full rounded-2xl object-cover sm:h-96"
          />
        ) : null}
      </header>

      <div className="mt-8 rounded-2xl border border-border/80 bg-card/95 p-5 sm:p-6">
        {(post.body || "").trim().length > 0 ? (
          <div className="space-y-4 text-sm leading-7 text-foreground/90 sm:text-base">
            {(post.body || "")
              .split(/\n{2,}/)
              .filter((paragraph) => paragraph.trim().length > 0)
              .map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            This article is being prepared and will be updated soon.
          </p>
        )}
      </div>
    </article>
  )
}
