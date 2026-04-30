"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics/google"

type CalendlyContinueButtonProps = {
  bookingId: string
  fallbackUrl: string | null
  label?: string
}

export function CalendlyContinueButton({
  bookingId,
  fallbackUrl,
  label = "Continue to Calendly",
}: CalendlyContinueButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function onClick() {
    setStatus("loading")
    setErrorMessage(null)

    try {
      const response = await fetch("/api/calendly/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { redirectUrl?: string; error?: string }
        | null

      const redirectUrl = payload?.redirectUrl ?? fallbackUrl

      if (!response.ok || !redirectUrl) {
        throw new Error("calendly_redirect_failed")
      }

      trackEvent("calendly_click", {
        booking_id: bookingId,
        source: "booking_continue",
      })
      window.location.assign(redirectUrl)
    } catch (error) {
      if (fallbackUrl) {
        trackEvent("calendly_click", {
          booking_id: bookingId,
          source: "booking_continue_fallback",
        })
        window.location.assign(fallbackUrl)
        return
      }

      console.error("Calendly continuation failed", error)
      setStatus("error")
      setErrorMessage(
        "Something went wrong while preparing your booking. Please try again or contact support."
      )
      return
    }

    setStatus("idle")
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={onClick}
        className="w-full sm:w-auto"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Opening Calendly..." : label}
      </Button>
      {errorMessage ? (
        <p className="text-xs text-destructive">{errorMessage}</p>
      ) : null}
    </div>
  )
}
