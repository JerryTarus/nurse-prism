import type { AppRole } from "@/lib/auth/access"

export type AdminSectionRole = Extract<AppRole, "admin" | "super_admin">

export type AdminNavItem = {
  href: string
  label: string
  description: string
  minimumRole: AdminSectionRole
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    description: "Performance summary and CMS health",
    minimumRole: "admin",
  },
  {
    href: "/admin/bookings",
    label: "Bookings",
    description: "Consultations, sessions, and package onboarding",
    minimumRole: "admin",
  },
  {
    href: "/admin/leads",
    label: "Leads",
    description: "Pipeline and qualification workflow",
    minimumRole: "admin",
  },
  {
    href: "/admin/messages",
    label: "Messages",
    description: "Contact inbox and outreach responses",
    minimumRole: "admin",
  },
  {
    href: "/admin/blog",
    label: "Blog",
    description: "Draft, publish, and optimize articles",
    minimumRole: "admin",
  },
  {
    href: "/admin/media",
    label: "Media",
    description: "Brand assets and image references",
    minimumRole: "admin",
  },
  {
    href: "/admin/pages",
    label: "Pages",
    description: "Editable sections for public website pages",
    minimumRole: "admin",
  },
  {
    href: "/admin/pricing",
    label: "Pricing",
    description: "Package amounts and launch status",
    minimumRole: "admin",
  },
  {
    href: "/admin/settings",
    label: "Settings",
    description: "Platform integrations and business controls",
    minimumRole: "super_admin",
  },
  {
    href: "/admin/appearance",
    label: "Appearance",
    description: "Logo, hero, and visual asset configuration",
    minimumRole: "super_admin",
  },
]

export function canAccessAdminSection(
  minimumRole: AdminSectionRole,
  currentRole: AdminSectionRole
) {
  if (currentRole === "super_admin") {
    return true
  }

  return minimumRole === "admin" && currentRole === "admin"
}
