"use client"

import { FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type SubmitState = "idle" | "sending" | "success" | "error"

export function ResendEmailForm() {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [html, setHtml] = useState("")
  const [state, setState] = useState<SubmitState>("idle")
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState("sending")
    setMessage(null)

    try {
      const response = await fetch("/api/admin/resend-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, html }),
      })

      const payload = (await response.json()) as { error?: string; message?: string }

      if (!response.ok) {
        setState("error")
        setMessage(payload.error ?? "Could not queue email right now.")
        return
      }

      setState("success")
      setMessage(payload.message ?? "Email request accepted.")
      setTo("")
      setSubject("")
      setHtml("")
    } catch {
      setState("error")
      setMessage("Network error while sending email request.")
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-2xl border border-border/80 bg-card/95 p-5"
    >
      <h2 className="font-heading text-xl font-semibold text-foreground">
        Admin outreach email
      </h2>
      <p className="text-sm text-muted-foreground">
        Use this to scaffold candidate email sends while provider integration is being
        finalized.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="resend-to" className="text-sm font-medium">
            Recipient
          </label>
          <Input
            id="resend-to"
            type="email"
            required
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="resend-subject" className="text-sm font-medium">
            Subject
          </label>
          <Input
            id="resend-subject"
            required
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="h-10"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="resend-body" className="text-sm font-medium">
          HTML body
        </label>
        <Textarea
          id="resend-body"
          rows={6}
          required
          value={html}
          onChange={(event) => setHtml(event.target.value)}
        />
      </div>

      {message ? (
        <p className="text-xs text-muted-foreground">{message}</p>
      ) : null}

      <Button type="submit" className="h-10" disabled={state === "sending"}>
        {state === "sending" ? "Sending..." : "Queue Email Request"}
      </Button>
    </form>
  )
}
