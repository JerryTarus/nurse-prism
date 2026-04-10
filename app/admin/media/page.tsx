import { Image as ImageIcon } from "lucide-react"

import { CmsReadinessBanner } from "@/components/dashboard/cms-readiness-banner"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MediaGrid } from "@/components/dashboard/media-grid"
import { StatsCard } from "@/components/dashboard/stats-card"
import { requireAdminSession } from "@/lib/auth/session"
import { getAdminMediaFiles } from "@/lib/cms/admin"

export default async function AdminMediaPage() {
  const { access } = await requireAdminSession({ nextPath: "/admin/media" })
  const media = await getAdminMediaFiles()

  return (
    <section className="space-y-4 lg:space-y-6">
      <DashboardHeader
        title="Media Library"
        description="Manage brand imagery, reusable assets, and public media references for the marketing site."
        cmsReady={media.cmsReady}
        isSuperAdmin={access.isSuperAdmin}
      />
      <CmsReadinessBanner cmsReady={media.cmsReady} />

      <div className="grid gap-3 sm:grid-cols-2">
        <StatsCard
          label="Total Assets"
          value={media.data.length}
          hint="Stored media entries"
          icon={ImageIcon}
        />
        <StatsCard
          label="With Public URL"
          value={media.data.filter((item) => Boolean(item.publicUrl)).length}
          hint="Ready for public page usage"
          icon={ImageIcon}
        />
      </div>

      <MediaGrid files={media.data} />
    </section>
  )
}
