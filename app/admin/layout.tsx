import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import { Home, ShieldCheck } from "lucide-react"

import { AdminSignOutButton } from "@/components/dashboard/admin-signout-button"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { requireAdminSession } from "@/lib/auth/session"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { user, access } = await requireAdminSession({ nextPath: "/admin" })

  return (
    <div className="min-h-screen bg-muted/35">
      <header className="border-b border-border/80 bg-card/90">
        <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="min-w-0 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            <span className="truncate">
              Signed in as {user?.email}{" "}
              {access.isSuperAdmin ? "(super_admin)" : "(admin)"}
            </span>
          </div>
          <div className="inline-flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <Home className="size-4" />
                View site
              </Link>
            </Button>
            <AdminSignOutButton next="/auth/login?status=signed_out" />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1320px] p-4 sm:p-6 lg:p-8">
        <div className="grid gap-4 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-6">
          <DashboardSidebar isSuperAdmin={access.isSuperAdmin} className="lg:sticky lg:top-24 lg:h-fit" />
          <div className="space-y-4 lg:space-y-6">{children}</div>
        </div>
      </main>
    </div>
  )
}
