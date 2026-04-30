"use client"

import { type FormEvent, useMemo, useState } from "react"
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
      return "This account is not authorized for the Nurse Prism dashboard."
    }
    if (status === "signed_out") {
      return "You have been signed out successfully."
    }
    return null
  }, [error, status])

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
        console.error("Unable to start Google sign-in", {
          status: response.status,
          payload,
        })
        setFormError("Unable to start Google sign-in right now. Please try again.")
        return
      }

      window.location.assign(payload.redirectTo)
    } catch {
      setFormError("Network error. Please try again in a moment.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
        setFormError(
          payload?.error ?? "We couldn't sign you in right now. Please try again."
        )
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
        Nurse Prism Dashboard
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in with an authorized Google or email account to access the Nurse Prism
        dashboard.
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

      <form className="mt-6 space-y-3" onSubmit={submitPasswordLogin}>
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="nurseprism@gmail.com"
          autoComplete="email"
          required
        />
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />
        <Button
          type="submit"
          className="h-10 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Continue with Email"}
        </Button>
      </form>

      <div className="mt-4">
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full"
          onClick={submitGoogleLogin}
          disabled={isSubmitting}
        >
          Continue with Google
        </Button>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Authorized admin and super admin accounts only. Access is protected
        and audited.
      </p>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Need support? <Link href="/contact" className="text-primary hover:underline">Contact operations</Link>
      </p>
    </div>
  )
}
