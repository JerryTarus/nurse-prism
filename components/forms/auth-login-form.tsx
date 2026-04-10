"use client"

import { FormEvent, useMemo, useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type LoginFormProps = {
  nextPath: string
  status?: string
  error?: string
}

export function AuthLoginForm({ nextPath, status, error }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const statusMessage = useMemo(() => {
    if (error === "callback_error") {
      return "We could not complete sign-in. Please try again."
    }
    if (error === "forbidden") {
      return "Your account is authenticated but not authorized for admin access."
    }
    if (status === "signed_out") {
      return "You have been signed out successfully."
    }
    return null
  }, [error, status])

  async function submitPasswordLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, next: nextPath }),
      })

      const payload = (await response.json()) as
        | { error?: string; redirectTo?: string }
        | undefined

      if (!response.ok || !payload?.redirectTo) {
        setFormError(payload?.error ?? "Unable to sign in right now.")
        return
      }

      window.location.assign(payload.redirectTo)
    } catch {
      setFormError("Network error. Please try again in a moment.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function submitGoogleLogin() {
    setFormError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ next: nextPath }),
      })

      const payload = (await response.json()) as
        | { error?: string; redirectTo?: string }
        | undefined

      if (!response.ok || !payload?.redirectTo) {
        setFormError(payload?.error ?? "Unable to start Google sign-in.")
        return
      }

      window.location.assign(payload.redirectTo)
    } catch {
      setFormError("Network error. Please try again in a moment.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card/95 p-6 shadow-[0_20px_48px_-30px_rgba(15,10,12,0.68)]">
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Admin Sign-In
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Secure access for Nurse Prism operations, content, and booking
        management.
      </p>

      {statusMessage ? (
        <p className="mt-4 rounded-lg border border-border bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
          {statusMessage}
        </p>
      ) : null}

      {formError ? (
        <p className="mt-4 rounded-lg border border-[color:rgb(199_70_70/0.4)] bg-[color:rgb(199_70_70/0.08)] px-3 py-2 text-xs text-[color:var(--np-error)]">
          {formError}
        </p>
      ) : null}

      <form className="mt-5 space-y-4" onSubmit={submitPasswordLogin}>
        <div className="space-y-1.5">
          <label htmlFor="admin-email" className="text-sm font-medium">
            Work Email
          </label>
          <Input
            id="admin-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-10"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="admin-password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="admin-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-10"
          />
        </div>

        <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in with Email"}
        </Button>
      </form>

      <div className="mt-4 space-y-3">
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full"
          onClick={submitGoogleLogin}
          disabled={isSubmitting}
        >
          Continue with Google
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          By continuing, you acknowledge secure admin access policies and audit
          monitoring.
        </p>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Need support? <Link href="/contact" className="text-primary hover:underline">Contact operations</Link>
      </p>
    </div>
  )
}
