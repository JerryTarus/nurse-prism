import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import type { BlogPost } from "@/types/blog"

type BlogCardProps = {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="rounded-2xl border border-border/80 bg-card/95 p-5 shadow-[0_16px_42px_-34px_rgba(15,10,12,0.8)]">
      <p className="text-xs font-semibold tracking-wide text-primary uppercase">
        {post.category}
      </p>
      <h2 className="font-heading mt-2 text-xl font-semibold text-foreground">
        <Link href={`/blog/${post.slug}`} className="hover:text-primary">
          {post.title}
        </Link>
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
      <p className="mt-4 text-xs text-muted-foreground">
        {post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Publishing soon"}{" "}
        | {post.readTimeMinutes} min read
      </p>
      <Link
        href={`/blog/${post.slug}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-[color:var(--np-rich-wine)]"
      >
        Read article
        <ArrowUpRight className="size-4" />
      </Link>
    </article>
  )
}
