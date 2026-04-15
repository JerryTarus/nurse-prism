import { Settings } from "lucide-react"

import { CmsReadinessBanner } from "@/components/dashboard/cms-readiness-banner"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ResendEmailForm } from "@/components/dashboard/resend-email-form"
import { SettingsList } from "@/components/dashboard/settings-list"
import { StatsCard } from "@/components/dashboard/stats-card"
import { requireSuperAdminSession } from "@/lib/auth/session"
import { getAdminSettings } from "@/lib/cms/admin"

export default async function AdminSettingsPage() {
  const { access } = await requireSuperAdminSession({ nextPath: "/admin/settings" })
  const settings = await getAdminSettings()

  return (
    <section className="space-y-4 lg:space-y-6">
      <DashboardHeader
        title="Settings"
        description="Manage platform integrations, contact configuration, and operational controls."
        cmsReady={settings.cmsReady}
        isSuperAdmin={access.isSuperAdmin}
      />
      <CmsReadinessBanner cmsReady={settings.cmsReady} />

      <div className="grid gap-3 sm:grid-cols-2">
        <StatsCard
          label="Config Entries"
          value={settings.data.length}
          hint="Rows in site_settings"
          icon={Settings}
        />
        <StatsCard
          label="Global Settings"
          value={settings.data.filter((setting) => !setting.key.startsWith("appearance.")).length}
          hint="Non-appearance configuration keys"
          icon={Settings}
        />
      </div>

      <SettingsList
        settings={settings.data}
        emptyLabel="No settings found yet. Add site_settings rows after migrations to manage integrations."
        editable
      />
      <p className="rounded-xl border border-border bg-card/90 px-4 py-3 text-xs text-muted-foreground">
        Recommended launch keys: `contact.email`, `contact.consultation_window`,
        `contact.response_time`, `hero.primary_cta_label`, `hero.primary_cta_href`,
        `hero.secondary_cta_label`, `hero.secondary_cta_href`, `cta.primary_label`,
        and `cta.primary_href`.
      </p>

      <ResendEmailForm />
    </section>
  )
}
