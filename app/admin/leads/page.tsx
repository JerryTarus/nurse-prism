import { UsersRound } from "lucide-react"

import { CmsReadinessBanner } from "@/components/dashboard/cms-readiness-banner"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { LeadsTable } from "@/components/dashboard/leads-table"
import { StatsCard } from "@/components/dashboard/stats-card"
import { requireAdminSession } from "@/lib/auth/session"
import { getAdminLeads } from "@/lib/cms/admin"

export default async function AdminLeadsPage() {
  const { access } = await requireAdminSession({ nextPath: "/admin/leads" })
  const leads = await getAdminLeads()

  const activeLeads = leads.data.filter(
    (lead) => lead.status !== "lost" && lead.status !== "won"
  ).length
  const wonLeads = leads.data.filter((lead) => lead.status === "won").length

  return (
    <section className="space-y-4 lg:space-y-6">
      <DashboardHeader
        title="Leads Pipeline"
        description="Prioritize qualified prospects and move candidates through the Nurse Prism conversion flow."
        cmsReady={leads.cmsReady}
        isSuperAdmin={access.isSuperAdmin}
      />
      <CmsReadinessBanner cmsReady={leads.cmsReady} />

      <div className="grid gap-3 sm:grid-cols-2">
        <StatsCard
          label="Active Leads"
          value={activeLeads}
          hint="Open opportunities needing follow-up"
          icon={UsersRound}
        />
        <StatsCard
          label="Won Leads"
          value={wonLeads}
          hint="Converted to paid services/programs"
          icon={UsersRound}
        />
      </div>

      <LeadsTable leads={leads.data} />
    </section>
  )
}
