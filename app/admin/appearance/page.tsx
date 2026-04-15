import { Palette } from "lucide-react"

import { CmsReadinessBanner } from "@/components/dashboard/cms-readiness-banner"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { SettingsList } from "@/components/dashboard/settings-list"
import { StatsCard } from "@/components/dashboard/stats-card"
import { requireSuperAdminSession } from "@/lib/auth/session"
import { getAdminAppearanceSettings } from "@/lib/cms/admin"

export default async function AdminAppearancePage() {
  const { access } = await requireSuperAdminSession({ nextPath: "/admin/appearance" })
  const appearance = await getAdminAppearanceSettings()

  return (
    <section className="space-y-4 lg:space-y-6">
      <DashboardHeader
        title="Appearance"
        description="Configure logo, hero, and visual defaults used across public pages and social previews."
        cmsReady={appearance.cmsReady}
        isSuperAdmin={access.isSuperAdmin}
      />
      <CmsReadinessBanner cmsReady={appearance.cmsReady} />

      <div className="grid gap-3 sm:grid-cols-2">
        <StatsCard
          label="Appearance Keys"
          value={appearance.data.length}
          hint="Visual configuration entries"
          icon={Palette}
        />
        <StatsCard
          label="Required Assets"
          value={["appearance.logo", "appearance.favicon", "appearance.hero"].length}
          hint="Core recommended appearance keys"
          icon={Palette}
        />
      </div>

      <SettingsList
        settings={appearance.data}
        emptyLabel="No appearance settings found. Add appearance.* keys in site_settings when CMS migrations are ready."
        editable
        keyPrefix="appearance."
      />
      <p className="rounded-xl border border-border bg-card/90 px-4 py-3 text-xs text-muted-foreground">
        Recommended launch keys: `appearance.hero` and `appearance.founder`.
        Local `/images/...` paths work best; public remote URLs are also supported.
      </p>
    </section>
  )
}
