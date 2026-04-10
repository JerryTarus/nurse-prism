import { CalendarClock, FileText, Mail, UsersRound } from "lucide-react"

import { BookingsTable } from "@/components/dashboard/bookings-table"
import { CmsReadinessBanner } from "@/components/dashboard/cms-readiness-banner"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { LeadsTable } from "@/components/dashboard/leads-table"
import { MessagesTable } from "@/components/dashboard/messages-table"
import { StatsCard } from "@/components/dashboard/stats-card"
import { getAdminDashboardSnapshot } from "@/lib/cms/admin"
import { requireAdminSession } from "@/lib/auth/session"

type AdminDashboardPageProps = {
  searchParams: Promise<{ error?: string }>
}

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const params = await searchParams
  const { access } = await requireAdminSession({ nextPath: "/admin" })
  const snapshot = await getAdminDashboardSnapshot()

  return (
    <section className="space-y-4 lg:space-y-6">
      <DashboardHeader
        title="Operations Dashboard"
        description="Track consultations, lead pipeline, inbound messages, and publishing momentum for Nurse Prism."
        cmsReady={snapshot.cmsReady}
        isSuperAdmin={access.isSuperAdmin}
      />
      {params.error === "insufficient_role" ? (
        <div className="rounded-2xl border border-[color:rgb(201_138_19/0.35)] bg-[color:rgb(201_138_19/0.08)] p-4 text-sm text-[color:var(--np-warning)]">
          This section requires super_admin privileges. Your account remains signed
          in with admin-level access.
        </div>
      ) : null}
      <CmsReadinessBanner cmsReady={snapshot.cmsReady} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Leads"
          value={snapshot.totals.leads}
          hint="Total leads in pipeline"
          icon={UsersRound}
        />
        <StatsCard
          label="Bookings"
          value={snapshot.totals.bookings}
          hint="Consultations and sessions"
          icon={CalendarClock}
        />
        <StatsCard
          label="Messages"
          value={snapshot.totals.messages}
          hint="Inbound contact submissions"
          icon={Mail}
        />
        <StatsCard
          label="Published Posts"
          value={snapshot.totals.publishedPosts}
          hint="Live articles on public blog"
          icon={FileText}
        />
      </div>

      <div className="space-y-3">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Latest leads
        </h2>
        <LeadsTable leads={snapshot.recentLeads} />
      </div>

      <div className="space-y-3">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Upcoming bookings
        </h2>
        <BookingsTable bookings={snapshot.upcomingBookings} />
      </div>

      <div className="space-y-3">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Recent messages
        </h2>
        <MessagesTable messages={snapshot.recentMessages} />
      </div>
    </section>
  )
}
