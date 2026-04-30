"use client"

import { FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { trackEvent } from "@/lib/analytics/google"
import { cn } from "@/lib/utils"

type LeadCaptureFormProps = {
  className?: string
}

export function LeadCaptureForm({ className }: LeadCaptureFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  )
  const [message, setMessage] = useState<string | null>(null)

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
      <label htmlFor="lead-email" className="text-sm font-medium text-foreground">
        Get weekly nurse pivot insights
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="lead-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your best email"
          className="h-10"
        />
        <Button
          type="submit"
          className="h-10 sm:px-5"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Joining..." : "Join Free"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {status === "success"
          ? message
          : status === "error"
            ? message
            : "No spam. Just practical strategy for nurses exploring global, remote, and non-traditional career paths."}
      </p>
    </form>
  )
}
