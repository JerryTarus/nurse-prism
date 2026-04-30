import type { ReactNode } from "react"

import { AdminReturnPill } from "@/components/navigation/admin-return-pill"
import { FloatingCta } from "@/components/navigation/floating-cta"
import { ScrollToTopButton } from "@/components/navigation/scroll-to-top-button"

import { SiteFooter } from "./site-footer"
import { SiteHeader } from "./site-header"

type PageShellProps = {
  children: ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <SiteHeader />
      <main id="main-content" className="relative z-10 flex-1 pb-24 md:pb-0">
        {children}
      </main>
      <SiteFooter />
      <AdminReturnPill />
      <ScrollToTopButton />
      <FloatingCta />
    </div>
  )
}
