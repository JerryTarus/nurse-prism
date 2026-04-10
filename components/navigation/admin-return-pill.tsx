"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShieldCheck } from "lucide-react"

type AdminContextPayload = {
  canAccessAdmin: boolean
  isSuperAdmin: boolean
  lastAdminPath: string
}

export function AdminReturnPill() {
  const [context, setContext] = useState<AdminContextPayload | null>(null)

  useEffect(() => {
    let active = true

    async function loadContext() {
      try {
        const response = await fetch("/api/auth/admin-context", {
          method: "GET",
          cache: "no-store",
        })
        if (!response.ok || !active) {
          return
        }
        const payload = (await response.json()) as AdminContextPayload
        if (!active) {
          return
        }
        setContext(payload)
      } catch {
        if (!active) {
          return
        }
        setContext(null)
      }
    }

    void loadContext()

    return () => {
      active = false
    }
  }, [])

  if (!context?.canAccessAdmin) {
    return null
  }

  return (
    <div className="fixed right-4 bottom-20 z-40 hidden md:block">
      <Link
        href={context.lastAdminPath || "/admin"}
        className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card px-3 py-2 text-xs font-medium text-primary shadow-[0_18px_35px_-20px_rgba(91,14,45,0.78)] transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ShieldCheck className="size-4" />
        {context.isSuperAdmin ? "Return to Super Admin" : "Return to Admin"}
      </Link>
    </div>
  )
}
