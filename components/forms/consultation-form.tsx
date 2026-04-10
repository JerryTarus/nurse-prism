"use client"

import { FormEvent, useState } from "react"

import { GULF_COUNTRIES } from "@/data/countries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export type ConsultationIntent =
  | "free-clarity-call"
  | "strategy-session"
  | "starter-plan"
  | "professional-plan"
  | "elite-plan"
  | "standard-program"
  | "premium-program"

type ConsultationFormProps = {
  defaultIntent?: ConsultationIntent
}

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  targetCountry: "",
  intent: "free-clarity-call" as ConsultationIntent,
  notes: "",
}

const options: { label: string; value: ConsultationIntent }[] = [
  { label: "Free Clarity Call", value: "free-clarity-call" },
  { label: "Paid Strategy Session", value: "strategy-session" },
  { label: "Starter Plan", value: "starter-plan" },
  { label: "Professional Plan", value: "professional-plan" },
  { label: "Elite Plan", value: "elite-plan" },
  { label: "Standard Program", value: "standard-program" },
  { label: "Premium Program", value: "premium-program" },
]

export function ConsultationForm({ defaultIntent }: ConsultationFormProps) {
  const [form, setForm] = useState({
    ...initialState,
    intent: defaultIntent ?? initialState.intent,
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  )

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("loading")

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error("Request failed")
      }

      setStatus("success")
      setForm({ ...initialState, intent: defaultIntent ?? initialState.intent })
    } catch {
      setStatus("error")
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border/80 bg-card/95 p-5 sm:p-6">
      <h2 className="font-heading text-xl font-semibold text-foreground">
        Book Consultation
      </h2>
      <p className="text-sm text-muted-foreground">
        Share your goals and we will recommend the right next step for your Gulf
        nursing journey.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="consult-name" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="consult-name"
            required
            value={form.fullName}
            onChange={(event) =>
              setForm((current) => ({ ...current, fullName: event.target.value }))
            }
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="consult-email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="consult-email"
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="consult-phone" className="text-sm font-medium">
            WhatsApp Number
          </label>
          <Input
            id="consult-phone"
            value={form.phone}
            onChange={(event) =>
              setForm((current) => ({ ...current, phone: event.target.value }))
            }
            placeholder="+254..."
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="consult-country" className="text-sm font-medium">
            Target Country
          </label>
          <select
            id="consult-country"
            required
            value={form.targetCountry}
            onChange={(event) =>
              setForm((current) => ({ ...current, targetCountry: event.target.value }))
            }
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Select country</option>
            {GULF_COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="consult-intent" className="text-sm font-medium">
          I am interested in
        </label>
        <select
          id="consult-intent"
          value={form.intent}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              intent: event.target.value as ConsultationIntent,
            }))
          }
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="consult-notes" className="text-sm font-medium">
          Brief notes
        </label>
        <Textarea
          id="consult-notes"
          rows={4}
          value={form.notes}
          onChange={(event) =>
            setForm((current) => ({ ...current, notes: event.target.value }))
          }
          placeholder="Tell us where you feel stuck or what outcome you need most."
        />
      </div>

      <Button type="submit" className="h-10 w-full sm:w-auto" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Request Consultation"}
      </Button>

      <p className="text-xs text-muted-foreground">
        {status === "success"
          ? "Request received. We will reach out shortly."
          : status === "error"
            ? "Could not submit right now. Please try again."
            : "Submissions are handled securely and reviewed by the Nurse Prism team."}
      </p>
    </form>
  )
}
