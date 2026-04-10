"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

type MfaVerificationFormProps = {
  nextPath: string
}

type TotpFactor = {
  id: string
}

type EnrollResult = {
  id: string
  totp?: {
    qr_code?: string
  }
}

export function MfaVerificationForm({ nextPath }: MfaVerificationFormProps) {
  const supabase = createSupabaseBrowserClient()

  const [loadingState, setLoadingState] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [code, setCode] = useState("")
  const [assuranceLevel, setAssuranceLevel] = useState<"aal1" | "aal2" | "unknown">(
    "unknown"
  )
  const [enrolledFactor, setEnrolledFactor] = useState<TotpFactor | null>(null)
  const [pendingFactor, setPendingFactor] = useState<EnrollResult | null>(null)
  const [qrSvg, setQrSvg] = useState<string | null>(null)

  const activeFactorId = pendingFactor?.id ?? enrolledFactor?.id ?? null

  const statusText = useMemo(() => {
    if (assuranceLevel === "aal2") {
      return "Multi-factor verification complete."
    }
    if (pendingFactor) {
      return "Scan the QR code in your authenticator app, then verify with your 6-digit code."
    }
    if (enrolledFactor) {
      return "Enter your 6-digit authenticator code to continue."
    }
    return "Enroll your authenticator app to secure admin access."
  }, [assuranceLevel, enrolledFactor, pendingFactor])

  useEffect(() => {
    let isMounted = true

    async function bootstrap() {
      const [{ data: userData }, { data: aalData }, { data: factorsData }] =
        await Promise.all([
          supabase.auth.getUser(),
          supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
          supabase.auth.mfa.listFactors(),
        ])

      if (!isMounted) {
        return
      }

      if (!userData.user) {
        window.location.assign(`/auth/login?next=${encodeURIComponent(nextPath)}`)
        return
      }

      const currentLevel = aalData?.currentLevel
      setAssuranceLevel(
        currentLevel === "aal1" || currentLevel === "aal2"
          ? currentLevel
          : "unknown"
      )

      const totpFactors = (factorsData?.totp ?? []) as TotpFactor[]
      setEnrolledFactor(totpFactors[0] ?? null)
      setLoadingState(false)
    }

    void bootstrap()

    return () => {
      isMounted = false
    }
  }, [nextPath, supabase])

  async function enrollTotp() {
    setError(null)
    setIsSubmitting(true)

    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Nurse Prism Admin Access",
    })

    if (enrollError || !data) {
      setError("Could not start MFA enrollment. Please try again.")
      setIsSubmitting(false)
      return
    }

    setPendingFactor(data as EnrollResult)
    setQrSvg((data as EnrollResult).totp?.qr_code ?? null)
    setIsSubmitting(false)
  }

  async function verifyFactor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!activeFactorId) {
      setError("No MFA factor is available for verification.")
      return
    }

    setIsSubmitting(true)

    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({
        factorId: activeFactorId,
      })

    if (challengeError || !challengeData?.id) {
      setError("Could not start MFA challenge.")
      setIsSubmitting(false)
      return
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: activeFactorId,
      challengeId: challengeData.id,
      code,
    })

    if (verifyError) {
      setError("Invalid code. Please check and try again.")
      setIsSubmitting(false)
      return
    }

    window.location.assign(nextPath)
  }

  if (loadingState) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card/95 p-6">
        <p className="text-sm text-muted-foreground">Loading MFA status...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card/95 p-6 shadow-[0_20px_48px_-30px_rgba(15,10,12,0.68)]">
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Multi-Factor Verification
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{statusText}</p>

      {error ? (
        <p className="mt-4 rounded-lg border border-[color:rgb(199_70_70/0.4)] bg-[color:rgb(199_70_70/0.08)] px-3 py-2 text-xs text-[color:var(--np-error)]">
          {error}
        </p>
      ) : null}

      {assuranceLevel === "aal2" ? (
        <Button className="mt-5 h-10 w-full" onClick={() => window.location.assign(nextPath)}>
          Continue to Admin Dashboard
        </Button>
      ) : (
        <>
          {!activeFactorId ? (
            <Button
              className="mt-5 h-10 w-full"
              onClick={enrollTotp}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Starting..." : "Enroll Authenticator App"}
            </Button>
          ) : null}

          {qrSvg ? (
            <div
              className="mt-5 rounded-xl border border-border bg-background p-4"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          ) : null}

          {activeFactorId ? (
            <form className="mt-5 space-y-3" onSubmit={verifyFactor}>
              <label htmlFor="mfa-code" className="text-sm font-medium">
                6-digit code
              </label>
              <Input
                id="mfa-code"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                required
                maxLength={6}
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                className="h-10"
              />
              <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify and Continue"}
              </Button>
            </form>
          ) : null}
        </>
      )}
    </div>
  )
}
