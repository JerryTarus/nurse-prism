"use client"

import { FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { trackEvent } from "@/lib/analytics/google"
import { cn } from "@/lib/utils"

type LeadCaptureFormProps = {
  className?: string
  variant?: "default" | "homepage"
}

export function LeadCaptureForm({
  className,
  variant = "default",
}: LeadCaptureFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  )
  const [message, setMessage] = useState<string | null>(null)
  const isHomepageVariant = variant === "homepage"

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("loading")
    setMessage(null)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "lead-capture" }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { message?: string; error?: string }
        | null

      if (!response.ok) {
        console.error("Newsletter signup failed", {
          status: response.status,
          payload,
        })
        throw new Error("newsletter_signup_failed")
      }

      setStatus("success")
      setMessage(
        payload?.message ?? "You are on the list for Nurse Prism career insights."
      )
      trackEvent("lead_submit", {
        source: "newsletter",
        placement: "lead_capture",
      })
      setEmail("")
    } catch (error) {
      console.error("Newsletter request failed", error)
      setStatus("error")
      setMessage("We couldn't save your details right now. Please try again.")
    }
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-3", className)}>
      {isHomepageVariant ? null : (
        <label htmlFor="lead-email" className="text-sm font-medium text-foreground">
          Get weekly nurse pivot insights
        </label>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="lead-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your best email"
          className={cn(
            "h-10",
            isHomepageVariant
              ? "border-white/30 bg-white/10 text-white placeholder:text-white/72 focus-visible:border-[color:var(--np-warm-gold)]"
              : ""
          )}
        />
        <Button
          type="submit"
          className={cn(
            "h-10 sm:px-5",
            isHomepageVariant
              ? "border border-[color:rgb(224_184_90/0.55)] bg-[color:var(--np-warm-gold)] text-[color:var(--np-near-black)] hover:bg-[color:rgb(224_184_90/0.88)]"
              : ""
          )}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Joining..." : "Join Free"}
        </Button>
      </div>
      {status === "success" || status === "error" ? (
        <p
          className={cn(
            "text-xs",
            isHomepageVariant ? "text-white/80" : "text-muted-foreground"
          )}
        >
          {message}
        </p>
      ) : isHomepageVariant ? null : (
        <p className="text-xs text-muted-foreground">
          No spam. Just practical strategy for nurses exploring global, remote,
          and non-traditional career paths.
        </p>
      )}
    </form>
  )
}
