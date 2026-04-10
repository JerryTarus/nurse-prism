"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { MAIN_NAV_ITEMS } from "@/data/navigation"
import { cn } from "@/lib/utils"

type MainNavProps = {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()
  const isItemActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <nav className={cn("items-center", className)} aria-label="Primary navigation">
      <ul className="flex items-center gap-1.5">
        {MAIN_NAV_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isItemActive(item.href) ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
