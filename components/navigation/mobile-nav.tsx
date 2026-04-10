"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { CalendarCheck2, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CONSULTATION_CTA, MAIN_NAV_ITEMS } from "@/data/navigation"
import { cn } from "@/lib/utils"

type MobileNavProps = {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isItemActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <div className={cn("relative", className)}>
      <Button
        aria-controls="mobile-navigation-sheet"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        variant="outline"
        size="icon"
        onClick={() => setIsOpen((value) => !value)}
      >
        {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
      </Button>

      <AnimatePresence>
        {isOpen ? (
          <motion.nav
            id="mobile-navigation-sheet"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-14 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border/70 bg-card/95 p-3 shadow-2xl backdrop-blur"
            aria-label="Mobile navigation"
          >
            <ul className="grid gap-1">
              {MAIN_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary",
                      isItemActive(item.href) ? "bg-primary/10 text-primary" : "text-foreground/85"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Button asChild className="mt-3 w-full justify-center">
              <Link href={CONSULTATION_CTA.href} onClick={() => setIsOpen(false)}>
                <CalendarCheck2 className="size-4" />
                {CONSULTATION_CTA.label}
              </Link>
            </Button>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
