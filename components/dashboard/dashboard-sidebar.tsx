"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarCheck2,
  FilePenLine,
  Gauge,
  Image as ImageIcon,
  LayoutTemplate,
  Lock,
  MessageSquareText,
  Palette,
  Settings,
  SlidersHorizontal,
  Users,
} from "lucide-react"

import { ADMIN_NAV_ITEMS, canAccessAdminSection } from "@/lib/auth/admin-nav"
import { cn } from "@/lib/utils"

type DashboardSidebarProps = {
  isSuperAdmin: boolean
  className?: string
}

const ICON_MAP = {
  "/admin": Gauge,
  "/admin/bookings": CalendarCheck2,
  "/admin/leads": Users,
  "/admin/messages": MessageSquareText,
  "/admin/blog": FilePenLine,
  "/admin/media": ImageIcon,
  "/admin/pages": LayoutTemplate,
  "/admin/pricing": SlidersHorizontal,
  "/admin/settings": Settings,
  "/admin/appearance": Palette,
} as const

export function DashboardSidebar({
  isSuperAdmin,
  className,
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const currentRole = isSuperAdmin ? "super_admin" : "admin"

  return (
    <aside
      className={cn(
        "rounded-2xl border border-border/80 bg-card/95 p-3 shadow-[0_18px_45px_-35px_rgba(15,10,12,0.55)]",
        className
      )}
    >
      <div className="border-b border-border/70 px-2 pb-3">
        <p className="font-heading text-lg font-semibold text-foreground">Admin CMS</p>
        <p className="text-xs text-muted-foreground">
          {isSuperAdmin ? "Super Admin Access" : "Admin Access"}
        </p>
      </div>

      <nav aria-label="Admin navigation" className="mt-3">
        <ul className="space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.href as keyof typeof ICON_MAP] ?? Gauge
            const isActive =
              item.href === "/admin"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`)
            const isAccessible = canAccessAdminSection(item.minimumRole, currentRole)

            if (!isAccessible) {
              return (
                <li key={item.href}>
                  <span className="flex cursor-not-allowed items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground/80">
                    <Lock className="size-4" />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    <span className="text-[10px] font-semibold tracking-wide uppercase">
                      Super Admin
                    </span>
                  </span>
                </li>
              )
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/90 hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
