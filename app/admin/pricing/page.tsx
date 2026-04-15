import { BadgeDollarSign } from "lucide-react"

import { CmsReadinessBanner } from "@/components/dashboard/cms-readiness-banner"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PricingConfigTable } from "@/components/dashboard/pricing-config-table"
import { StatsCard } from "@/components/dashboard/stats-card"
import { requireAdminSession } from "@/lib/auth/session"
import { getAdminPackageConfigs } from "@/lib/cms/admin"

export default async function AdminPricingPage() {
  const { access } = await requireAdminSession({ nextPath: "/admin/pricing" })
  const packages = await getAdminPackageConfigs()

  return (
    <section className="space-y-4 lg:space-y-6">
      <DashboardHeader
        title="Pricing Configuration"
        description="Maintain package values and activation states for consultation, transition, and program products."
        cmsReady={packages.cmsReady}
        isSuperAdmin={access.isSuperAdmin}
      />
      <CmsReadinessBanner cmsReady={packages.cmsReady} />

      <div className="grid gap-3 sm:grid-cols-2">
        <StatsCard
          label="Packages"
          value={packages.data.length}
          hint="Configured sellable offers"
          icon={BadgeDollarSign}
        />
        <StatsCard
          label="Active"
          value={packages.data.filter((pkg) => pkg.isActive).length}
          hint="Visible in conversion funnels"
          icon={BadgeDollarSign}
        />
      </div>

      <PricingConfigTable packages={packages.data} />
      <p className="rounded-xl border border-border bg-card/90 px-4 py-3 text-xs text-muted-foreground">
        Currency conversion multipliers are still controlled from public pricing
        config. Package edits in Supabase now drive the public pricing pages and
        consultation checkout flow.
      </p>
    </section>
  )
}
