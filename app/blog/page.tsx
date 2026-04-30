import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CalendarCheck2 } from "lucide-react"

import { BlogCard } from "@/components/blog/blog-card"
import { JsonLd } from "@/components/shared/json-ld"
import { Button } from "@/components/ui/button"
import { getPublishedBlogPosts } from "@/lib/cms/blog"
import { SITE_CONFIG } from "@/lib/constants"
import { createManagedPageMetadata } from "@/lib/seo/metadata"
import { createBlogCollectionSchema } from "@/lib/seo/structured-data"

type BlogPageProps = {
  searchParams: Promise<{ q?: string }>
}

const BLOG_COMING_SOON_TOPICS = [
  "LinkedIn Strategy for Nurses",
  "Remote & Digital Health Roles",
  "International Nursing Pathways",
] as const

export async function generateMetadata(): Promise<Metadata> {
  return createManagedPageMetadata({
    pageKey: "blog",
    title: "Blog",
    description:
      "Read Nurse Prism insights on career pivots, digital health, LinkedIn strategy, global opportunities, and growth beyond traditional nursing roles.",
    path: "/blog",
    keywords: [
      "nursing career blog",
      "nurse career pivot advice",
      "digital health nursing insights",
      "nurse LinkedIn strategy",
    ],
  })
}

export default async function BlogIndexPage({ searchParams }: BlogPageProps) {
  const rawQuery = ((await searchParams).q ?? "").trim()
  const normalizedQuery = rawQuery.toLowerCase()
  const publishedPosts = await getPublishedBlogPosts()
  const hasPublishedPosts = publishedPosts.length > 0

  const visiblePosts = normalizedQuery
    ? publishedPosts.filter((post) =>
        `${post.title} ${post.excerpt} ${post.tags.join(" ")}`
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : publishedPosts
  const hasVisiblePosts = visiblePosts.length > 0

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
          Explore strategy notes on career transitions, remote opportunities,
          LinkedIn visibility, interviews, and international pathways.
        </p>

        {hasPublishedPosts ? (
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
        ) : null}
      </div>

      {!hasPublishedPosts ? (
        <div className="relative mt-8 overflow-hidden rounded-3xl border border-[color:rgb(122_22_58/0.35)] bg-[linear-gradient(145deg,rgba(91,14,45,0.96),rgba(26,18,22,0.97))] p-6 text-[color:var(--np-champagne-mist)] shadow-[0_25px_55px_-28px_rgba(15,10,12,0.88)] sm:p-8 lg:p-10">
          <div className="absolute -left-20 top-0 size-48 rounded-full bg-[color:rgb(224_184_90/0.14)] blur-3xl" />
          <div className="absolute -right-16 -top-20 size-64 rounded-full bg-[color:rgb(224_184_90/0.2)] blur-3xl" />

          <div className="relative z-10">
            <p className="text-xs font-semibold tracking-[0.2em] text-[color:var(--np-warm-gold)] uppercase">
              Coming Soon
            </p>
            <h2 className="font-heading mt-3 max-w-3xl text-2xl font-semibold sm:text-3xl">
              Fresh nursing career insights are coming soon
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:rgb(246_239_231/0.88)] sm:text-base">
              {
                "We\u2019re preparing practical guides on career pivots, LinkedIn visibility, remote nursing roles, digital health, and international opportunities. Check back soon for resources designed to help you move forward with clarity."
              }
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="border border-[color:rgb(224_184_90/0.3)] bg-[color:rgb(224_184_90/0.95)] text-[color:var(--np-near-black)] hover:bg-[color:rgb(224_184_90/0.85)]"
              >
                <Link href={SITE_CONFIG.consultationHref}>
                  <CalendarCheck2 className="size-4" />
                  Book a Career Consultation
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-[color:rgb(246_239_231/0.18)] bg-[color:rgb(246_239_231/0.08)] text-[color:var(--np-champagne-mist)] hover:bg-[color:rgb(246_239_231/0.14)] hover:text-[color:var(--np-champagne-mist)]"
              >
                <Link href="/services">
                  Explore Services
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {BLOG_COMING_SOON_TOPICS.map((topic) => (
                <article
                  key={topic}
                  className="rounded-2xl border border-[color:rgb(246_239_231/0.18)] bg-[color:rgb(246_239_231/0.08)] p-5"
                >
                  <p className="text-xs font-semibold tracking-[0.18em] text-[color:var(--np-warm-gold)] uppercase">
                    Upcoming Topic
                  </p>
                  <h3 className="font-heading mt-2 text-lg font-semibold text-[color:var(--np-champagne-mist)]">
                    {topic}
                  </h3>
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {hasPublishedPosts ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visiblePosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : null}

      {hasPublishedPosts && !hasVisiblePosts ? (
        <div className="mt-6 rounded-2xl border border-border/80 bg-card/95 p-5 shadow-[0_16px_42px_-34px_rgba(15,10,12,0.8)]">
          <p className="text-sm leading-6 text-muted-foreground">
            No matching articles found. Try another keyword or explore our
            services while new resources are being prepared.
          </p>
        </div>
      ) : null}
    </section>
  )
}
