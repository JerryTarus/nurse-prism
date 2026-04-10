import { BlogEditorForm } from "@/components/dashboard/blog-editor-form"
import { CmsReadinessBanner } from "@/components/dashboard/cms-readiness-banner"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { requireAdminSession } from "@/lib/auth/session"
import { getAdminBlogPosts } from "@/lib/cms/admin"

export default async function AdminNewBlogPage() {
  const { access } = await requireAdminSession({ nextPath: "/admin/blog/new" })
  const posts = await getAdminBlogPosts()

  return (
    <section className="space-y-4 lg:space-y-6">
      <DashboardHeader
        title="Create Blog Post"
        description="Draft your article, apply SEO-ready metadata, and control publish timing from one editor."
        cmsReady={posts.cmsReady}
        isSuperAdmin={access.isSuperAdmin}
      />
      <CmsReadinessBanner cmsReady={posts.cmsReady} />
      <BlogEditorForm mode="create" />
    </section>
  )
}
