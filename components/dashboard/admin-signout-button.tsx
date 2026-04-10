"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"

type AdminSignOutButtonProps = {
  next?: string
}

export function AdminSignOutButton({ next = "/auth/login?status=signed_out" }: AdminSignOutButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSignOut() {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ next }),
      })

      const payload = (await response.json()) as { redirectTo?: string }
      window.location.assign(payload.redirectTo ?? next)
    } catch {
      window.location.assign(next)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleSignOut}>
      {isSubmitting ? "Signing out..." : "Sign out"}
    </Button>
  )
}
