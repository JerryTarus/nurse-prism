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
      <p className="rounded-xl border border-border bg-card/90 px-4 py-3 text-xs text-muted-foreground">
        Suggested combinations: page key `home` with section keys `hero`,
        `hero-note`, `services`, `about-preview`, `pricing-preview`, and `cta`;
        page key `about` with `intro`, `mission`, `promise`, and `framework`;
        page key `services` with `intro`, `services-grid`, and `process`; page
        key `program` with `intro`, `outcomes`, `curriculum`, and `investment`;
        page key `pricing` with `intro`; and page key `contact` with `intro`.
      </p>
    </section>
  )
}
