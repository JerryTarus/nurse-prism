import { LayoutTemplate } from "lucide-react"

import { CmsReadinessBanner } from "@/components/dashboard/cms-readiness-banner"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PageSectionsTable } from "@/components/dashboard/page-sections-table"
import { StatsCard } from "@/components/dashboard/stats-card"
import { requireAdminSession } from "@/lib/auth/session"
import { getAdminPageSections } from "@/lib/cms/admin"

export default async function AdminPagesPage() {
  const { access } = await requireAdminSession({ nextPath: "/admin/pages" })
  const sections = await getAdminPageSections()

  return (
    <section className="space-y-4 lg:space-y-6">
      <DashboardHeader
        title="Page Content"
        description="Review editable sections for home, services, pricing, and conversion pages before publishing changes."
        cmsReady={sections.cmsReady}
        isSuperAdmin={access.isSuperAdmin}
      />
      <CmsReadinessBanner cmsReady={sections.cmsReady} />

      <div className="grid gap-3 sm:grid-cols-2">
        <StatsCard
          label="Editable Sections"
          value={sections.data.length}
          hint="Active CMS content blocks"
          icon={LayoutTemplate}
        />
        <StatsCard
          label="Distinct Pages"
          value={new Set(sections.data.map((section) => section.pageKey)).size}
          hint="Public pages with editable content"
          icon={LayoutTemplate}
        />
      </div>

      <PageSectionsTable sections={sections.data} />
    </section>
  )
}
