import Image from "next/image"
import Link from "next/link"

import { MainNav } from "@/components/navigation/main-nav"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { Button } from "@/components/ui/button"
import { CONSULTATION_CTA } from "@/data/navigation"
import { SITE_CONFIG } from "@/lib/constants"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--np-border-soft)] bg-[color:rgb(248_243_241/0.88)] backdrop-blur-md">
      <div className="np-container flex h-16 items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Nurse Prism home"
        >
          <Image
            src="/images/logos/nurse-prism-mark.svg"
            alt="Nurse Prism logo mark"
            width={34}
            height={34}
            className="h-[34px] w-[34px]"
            priority
          />
          <span className="font-heading text-lg font-semibold tracking-tight text-primary">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <MainNav className="ml-auto hidden lg:flex" />

        <Button asChild className="ml-auto hidden lg:inline-flex">
          <Link href={CONSULTATION_CTA.href}>{CONSULTATION_CTA.label}</Link>
        </Button>

        <MobileNav className="ml-auto lg:hidden" />
      </div>
    </header>
  )
}
