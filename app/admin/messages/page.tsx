import { MessageSquareText } from "lucide-react"

import { CmsReadinessBanner } from "@/components/dashboard/cms-readiness-banner"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MessagesTable } from "@/components/dashboard/messages-table"
import { StatsCard } from "@/components/dashboard/stats-card"
import { requireAdminSession } from "@/lib/auth/session"
import { getAdminMessages } from "@/lib/cms/admin"

export default async function AdminMessagesPage() {
  const { access } = await requireAdminSession({ nextPath: "/admin/messages" })
  const messages = await getAdminMessages()

  const unreadCount = messages.data.filter((message) => message.status === "new").length
  const repliedCount = messages.data.filter((message) => message.status === "replied").length

  return (
    <section className="space-y-4 lg:space-y-6">
      <DashboardHeader
        title="Messages Inbox"
        description="Respond to inquiries, maintain service-level response times, and keep outreach organized."
        cmsReady={messages.cmsReady}
        isSuperAdmin={access.isSuperAdmin}
      />
      <CmsReadinessBanner cmsReady={messages.cmsReady} />

      <div className="grid gap-3 sm:grid-cols-2">
        <StatsCard
          label="New Messages"
          value={unreadCount}
          hint="Awaiting first response"
          icon={MessageSquareText}
        />
        <StatsCard
          label="Replied"
          value={repliedCount}
          hint="Conversations with response sent"
          icon={MessageSquareText}
        />
      </div>

      <MessagesTable messages={messages.data} />
    </section>
  )
}
