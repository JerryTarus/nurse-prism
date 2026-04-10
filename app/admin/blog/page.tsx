import { FilePenLine } from "lucide-react"

import { BlogPostsTable } from "@/components/dashboard/blog-posts-table"
import { CmsReadinessBanner } from "@/components/dashboard/cms-readiness-banner"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { requireAdminSession } from "@/lib/auth/session"
import { getAdminBlogPosts } from "@/lib/cms/admin"

export default async function AdminBlogPage() {
  const { access } = await requireAdminSession({ nextPath: "/admin/blog" })
  const posts = await getAdminBlogPosts()

  const draftCount = posts.data.filter((post) => post.status === "draft").length
  const publishedCount = posts.data.filter((post) => post.status === "published").length

  return (
    <section className="space-y-4 lg:space-y-6">
      <DashboardHeader
        title="Blog Manager"
        description="Control article drafts, SEO visibility, and publishing cadence from one editorial workspace."
        cmsReady={posts.cmsReady}
        isSuperAdmin={access.isSuperAdmin}
      />
      <CmsReadinessBanner cmsReady={posts.cmsReady} />

      <div className="grid gap-3 sm:grid-cols-2">
        <StatsCard
          label="Drafts"
          value={draftCount}
          hint="Posts pending review"
          icon={FilePenLine}
        />
        <StatsCard
          label="Published"
          value={publishedCount}
          hint="Live blog posts visible to public"
          icon={FilePenLine}
        />
      </div>

      <BlogPostsTable posts={posts.data} />
    </section>
  )
}
