import Link from "next/link"
import { PencilLine, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { BlogPost } from "@/types/blog"

type BlogPostsTableProps = {
  posts: BlogPost[]
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not scheduled"
  }

  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function BlogPostsTable({ posts }: BlogPostsTableProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card/95">
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
        <div>
          <p className="font-medium text-foreground">Blog publishing workflow</p>
          <p className="text-xs text-muted-foreground">
            Draft in admin and publish only when content is production-ready.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/blog/new">
            <Plus className="size-4" />
            New Post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="px-4 py-5 text-sm text-muted-foreground">
          No blog posts yet. Create your first article, save as draft, and publish
          when approved.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-muted/35 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-t border-border/70">
                  <td className="px-4 py-3 align-top">
                    <p className="font-medium text-foreground">{post.title}</p>
                    <p className="text-xs text-muted-foreground">/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 align-top text-foreground/90">{post.category}</td>
                  <td className="px-4 py-3 align-top">
                    <span className="inline-flex rounded-full border border-border bg-background px-2 py-0.5 text-xs">
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top text-foreground/80">
                    {formatDate(post.publishedAt)}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/blog/${post.id}`}>
                        <PencilLine className="size-4" />
                        Edit
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
