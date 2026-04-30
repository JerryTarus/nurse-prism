"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"

import { APP_SHELL_EXCLUDED_PREFIXES } from "@/lib/constants"

import { PageShell } from "./page-shell"

type SiteLayoutGateProps = {
  children: ReactNode
}

export function SiteLayoutGate({ children }: SiteLayoutGateProps) {
  const pathname = usePathname() ?? "/"
  const isShellExcluded = APP_SHELL_EXCLUDED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  )
  const showSocialProofToast = pathname !== "/"

  if (isShellExcluded) {
    return <>{children}</>
  }

  return (
    <PageShell showSocialProofToast={showSocialProofToast}>
      {children}
    </PageShell>
  )
}
