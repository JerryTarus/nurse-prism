"use client"

import { FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type LeadCaptureFormProps = {
  className?: string
}

export function LeadCaptureForm({ className }: LeadCaptureFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  )

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("loading")

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "lead-capture" }),
      })

      if (!response.ok) {
        throw new Error("Request failed")
      }

      setStatus("success")
      setEmail("")
    } catch {
      setStatus("error")
    }
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-3", className)}>
      <label htmlFor="lead-email" className="text-sm font-medium text-foreground">
        Get weekly Gulf career insights
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
        <Button type="submit" className="h-10 sm:px-5" disabled={status === "loading"}>
          {status === "loading" ? "Joining..." : "Join Free"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {status === "success"
          ? "You are in. Check your inbox for your first coaching insight."
          : status === "error"
            ? "We could not submit right now. Please try again shortly."
            : "No spam. Just practical strategy for internationally trained nurses."}
      </p>
    </form>
  )
}
