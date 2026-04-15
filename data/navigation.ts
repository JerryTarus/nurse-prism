import { SITE_CONFIG } from "@/lib/constants"

export type NavItem = {
  label: string
  href: string
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Program", href: "/program" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
]

export const FOOTER_NAV_ITEMS: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Program", href: "/program" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

export const CONSULTATION_CTA = {
  label: "Start Your Nurse Pivot",
  href: SITE_CONFIG.consultationHref,
} as const
