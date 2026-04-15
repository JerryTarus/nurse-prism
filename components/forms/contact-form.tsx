"use client"

import { FormEvent, useState } from "react"

import { NURSE_SOURCE_COUNTRIES } from "@/data/countries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { trackEvent } from "@/lib/analytics/google"

const initialState = {
  name: "",
  email: "",
  country: "",
  message: "",
}

export function ContactForm() {
  const [form, setForm] = useState(initialState)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  )
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("loading")
    setMessage(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const payload = (await response.json().catch(() => null)) as
        | { message?: string; error?: string }
        | null

      if (!response.ok) {
        throw new Error(payload?.error ?? "Request failed")
      }

      setStatus("success")
      setMessage(
        payload?.message ?? "Message sent. Nurse Prism will reply via email."
      )
      trackEvent("contact_submit", {
        source: "contact_form",
        country: form.country,
      })
      setForm(initialState)
    } catch (error) {
      setStatus("error")
      setMessage(
        error instanceof Error
          ? error.message
          : "Submission failed. Please try again shortly."
      )
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-border/80 bg-card/95 p-5 sm:p-6"
    >
      <h2 className="font-heading text-xl font-semibold text-foreground">
        Send a Message
      </h2>
      <p className="text-sm text-muted-foreground">
        Tell us about your current stage, target direction, and where you need
        the most support across global opportunities, remote work, or career
        transition.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="contact-name"
            required
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="contact-email"
            type="email"
            required
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            className="h-10"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-country" className="text-sm font-medium">
          Current Country
        </label>
        <select
          id="contact-country"
          required
          value={form.country}
          onChange={(event) =>
            setForm((current) => ({ ...current, country: event.target.value }))
          }
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">Select country</option>
          {NURSE_SOURCE_COUNTRIES.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-message" className="text-sm font-medium">
          Your Message
        </label>
        <Textarea
          id="contact-message"
          required
          rows={5}
          value={form.message}
          onChange={(event) =>
            setForm((current) => ({ ...current, message: event.target.value }))
          }
          placeholder="Share your target path, timeline, and any challenge you need help with."
        />
      </div>

      <Button
        type="submit"
        className="h-10 w-full sm:w-auto"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Submitting..." : "Send Message"}
      </Button>

      <p className="text-xs text-muted-foreground">
        {status === "success"
          ? message
          : status === "error"
            ? message
            : "By submitting, you agree to be contacted about coaching and career support options."}
      </p>
    </form>
  )
}
