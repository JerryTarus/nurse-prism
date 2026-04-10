import { notFound } from "next/navigation"

import { BlogEditorForm } from "@/components/dashboard/blog-editor-form"
import { CmsReadinessBanner } from "@/components/dashboard/cms-readiness-banner"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { requireAdminSession } from "@/lib/auth/session"
import { getAdminBlogPosts } from "@/lib/cms/admin"

type AdminEditBlogPageProps = {
  params: Promise<{ id: string }>
}

export default async function AdminEditBlogPage({ params }: AdminEditBlogPageProps) {
  const { id } = await params
  const { access } = await requireAdminSession({ nextPath: `/admin/blog/${id}` })
  const posts = await getAdminBlogPosts()
  const post = posts.data.find((entry) => entry.id === id) ?? null

  if (!post) {
    notFound()
  }

  return (
    <section className="space-y-4 lg:space-y-6">
      <DashboardHeader
        title="Edit Blog Post"
        description="Update copy, tags, and publishing state while preserving SEO-ready structure."
        cmsReady={posts.cmsReady}
        isSuperAdmin={access.isSuperAdmin}
      />
      <CmsReadinessBanner cmsReady={posts.cmsReady} />
      <BlogEditorForm mode="edit" postId={id} initialPost={post} />
    </section>
  )
}
