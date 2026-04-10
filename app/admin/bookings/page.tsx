import { CalendarClock } from "lucide-react"

import { BookingsTable } from "@/components/dashboard/bookings-table"
import { CmsReadinessBanner } from "@/components/dashboard/cms-readiness-banner"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { requireAdminSession } from "@/lib/auth/session"
import { getAdminBookings } from "@/lib/cms/admin"

export default async function AdminBookingsPage() {
  const { access } = await requireAdminSession({ nextPath: "/admin/bookings" })
  const bookings = await getAdminBookings()

  const pendingCount = bookings.data.filter((booking) => booking.status === "pending").length
  const confirmedCount = bookings.data.filter((booking) => booking.status === "confirmed").length

  return (
    <section className="space-y-4 lg:space-y-6">
      <DashboardHeader
        title="Bookings"
        description="Manage consultations, strategy sessions, and onboarding calls from one timeline."
        cmsReady={bookings.cmsReady}
        isSuperAdmin={access.isSuperAdmin}
      />
      <CmsReadinessBanner cmsReady={bookings.cmsReady} />

      <div className="grid gap-3 sm:grid-cols-2">
        <StatsCard
          label="Pending"
          value={pendingCount}
          hint="Requires scheduling confirmation"
          icon={CalendarClock}
        />
        <StatsCard
          label="Confirmed"
          value={confirmedCount}
          hint="Already scheduled with candidate"
          icon={CalendarClock}
        />
      </div>

      <BookingsTable bookings={bookings.data} />
    </section>
  )
}
