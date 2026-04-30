"use client"

import { FormEvent, useEffect, useMemo, useRef, useState } from "react"

import { CAREER_DESTINATIONS } from "@/data/countries"
import { CalendlyContinueButton } from "@/components/forms/calendly-continue-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  getConsultationIntentOptions,
  getCheckoutAmountUsdForIntent,
  getPlanLabelForIntent,
  getPricingPlanForIntent,
  isPaidConsultationIntent,
  type ConsultationIntent,
} from "@/lib/consultations"
import { trackEvent } from "@/lib/analytics/google"
import { formatCurrencyAmount } from "@/lib/currency"
import type { PricingCategory } from "@/types/pricing"

type ConsultationFormProps = {
  defaultIntent?: ConsultationIntent
  pricingCategories?: PricingCategory[]
  paypalReturn?: {
    status?: "success" | "cancelled"
    bookingId?: string
    orderId?: string
  }
}

const initialState = {
  fullName: "",
  email: "",
  phone: "",
  targetCountry: "",
  intent: "free-clarity-call" as ConsultationIntent,
  notes: "",
}

const BOOKING_PREPARATION_ERROR =
  "Something went wrong while preparing your booking. Please try again or contact support."
const CHECKOUT_START_ERROR =
  "We couldn't start checkout right now. Please try again in a moment."
const PAYMENT_CAPTURE_ERROR =
  "We couldn't confirm your payment right now. Please try again in a moment."

type FlowState =
  | {
      stage: "idle" | "loading" | "redirecting" | "capturing" | "cancelled"
      message: string | null
      error: string | null
      bookingId: null
      calendlyUrl: null
    }
  | {
      stage: "free-ready" | "paid-ready"
      message: string | null
      error: string | null
      bookingId: string
      calendlyUrl: string | null
    }

function getInitialFlowState(
  paypalReturn?: ConsultationFormProps["paypalReturn"]
): FlowState {
  if (paypalReturn?.status === "success") {
    return {
      stage: "capturing",
      message: "Confirming your PayPal payment...",
      error: null,
      bookingId: null,
      calendlyUrl: null,
    }
  }

  if (paypalReturn?.status === "cancelled") {
    return {
      stage: "cancelled",
      message:
        "Your PayPal checkout was cancelled. You can restart below whenever you are ready.",
      error: null,
      bookingId: null,
      calendlyUrl: null,
    }
  }

  return {
    stage: "idle",
    message: null,
    error: null,
    bookingId: null,
    calendlyUrl: null,
  }
}

export function ConsultationForm({
  defaultIntent,
  pricingCategories,
  paypalReturn,
}: ConsultationFormProps) {
  const fallbackIntent = defaultIntent ?? initialState.intent
  const availableIntentOptions = useMemo(
    () => getConsultationIntentOptions(pricingCategories),
    [pricingCategories]
  )
  const [form, setForm] = useState({
    ...initialState,
    intent: fallbackIntent,
  })
  const [flow, setFlow] = useState<FlowState>(() => getInitialFlowState(paypalReturn))
  const handledPaypalReturnRef = useRef(false)

  const selectedPlan = useMemo(
    () => getPricingPlanForIntent(form.intent, pricingCategories),
    [form.intent, pricingCategories]
  )
  const isPaidSelection = isPaidConsultationIntent(form.intent, pricingCategories)
  const checkoutAmountUsd = getCheckoutAmountUsdForIntent(
    form.intent,
    pricingCategories
  )

  useEffect(() => {
    if (availableIntentOptions.length === 0) {
      return
    }

    const isCurrentIntentAvailable = availableIntentOptions.some(
      (option) => option.value === form.intent
    )
    if (isCurrentIntentAvailable) {
      return
    }

    setForm((current) => ({
      ...current,
      intent: availableIntentOptions[0]?.value ?? initialState.intent,
    }))
  }, [availableIntentOptions, form.intent])

  useEffect(() => {
    if (
      handledPaypalReturnRef.current ||
      paypalReturn?.status !== "success" ||
      !paypalReturn.bookingId ||
      !paypalReturn.orderId
    ) {
      return
    }

    handledPaypalReturnRef.current = true
    const bookingId = paypalReturn.bookingId
    const orderId = paypalReturn.orderId

    async function captureOrder() {
      setFlow({
        stage: "capturing",
        message: "Confirming your PayPal payment...",
        error: null,
        bookingId: null,
        calendlyUrl: null,
      })

      try {
        const response = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId,
            orderId,
          }),
        })

        const payload = (await response.json().catch(() => null)) as
          | {
              bookingId?: string
              calendlyUrl?: string | null
              message?: string
              error?: string
            }
          | null

        if (!response.ok || !payload?.bookingId) {
          console.error("PayPal capture response was not usable", {
            status: response.status,
            payload,
            bookingId,
            orderId,
          })
          throw new Error("capture_failed")
        }

        setFlow({
          stage: "paid-ready",
          message:
            payload.message ??
            "Payment confirmed. Continue to Calendly to select your session.",
          error: null,
          bookingId: payload.bookingId,
          calendlyUrl: payload.calendlyUrl ?? null,
        })
        trackEvent("paypal_checkout_success", {
          booking_id: payload.bookingId,
          intent: form.intent,
          flow: "paid_consultation",
        })
      } catch (error) {
        console.error("PayPal capture flow failed", error)
        setFlow({
          stage: "idle",
          message: null,
          error: PAYMENT_CAPTURE_ERROR,
          bookingId: null,
          calendlyUrl: null,
        })
      }
    }

    void captureOrder()
  }, [form.intent, paypalReturn])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFlow({
      stage: "loading",
      message: null,
      error: null,
      bookingId: null,
      calendlyUrl: null,
    })

    try {
      const leadResponse = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const leadPayload = (await leadResponse.json().catch(() => null)) as
        | {
            bookingId?: string
            calendlyUrl?: string | null
            requiresPayment?: boolean
            message?: string
            error?: string
          }
        | null

      if (!leadResponse.ok || !leadPayload?.bookingId) {
        console.error("Consultation lead response was not usable", {
          status: leadResponse.status,
          payload: leadPayload,
        })
        throw new Error("booking_failed")
      }

      if (!leadPayload.requiresPayment) {
        setFlow({
          stage: "free-ready",
          message:
            leadPayload.message ??
            "Consultation saved. Continue to Calendly to choose your free session time.",
          error: null,
          bookingId: leadPayload.bookingId,
          calendlyUrl: leadPayload.calendlyUrl ?? null,
        })
        trackEvent("lead_submit", {
          flow: "free_consultation",
          intent: form.intent,
          destination: form.targetCountry,
        })
        setForm({ ...initialState, intent: fallbackIntent })
        return
      }

      setFlow({
        stage: "redirecting",
        message: "Securely redirecting you to PayPal...",
        error: null,
        bookingId: null,
        calendlyUrl: null,
      })
      trackEvent("lead_submit", {
        flow: "paid_consultation",
        intent: form.intent,
        destination: form.targetCountry,
      })

      const orderResponse = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: leadPayload.bookingId }),
      })

      const orderPayload = (await orderResponse.json().catch(() => null)) as
        | { approvalUrl?: string; error?: string }
        | null

      if (!orderResponse.ok || !orderPayload?.approvalUrl) {
        console.error("PayPal order response was not usable", {
          status: orderResponse.status,
          payload: orderPayload,
          bookingId: leadPayload.bookingId,
        })
        throw new Error("checkout_failed")
      }

      trackEvent("paypal_checkout_start", {
        booking_id: leadPayload.bookingId,
        intent: form.intent,
        package_key: selectedPlan?.id ?? "unknown",
      })
      window.location.assign(orderPayload.approvalUrl)
    } catch (error) {
      console.error("Consultation submission failed", error)
      setFlow({
        stage: "idle",
        message: null,
        error:
          error instanceof Error && error.message === "checkout_failed"
            ? CHECKOUT_START_ERROR
            : BOOKING_PREPARATION_ERROR,
        bookingId: null,
        calendlyUrl: null,
      })
    }
  }

  const submitLabel =
    flow.stage === "loading"
      ? "Saving..."
      : flow.stage === "redirecting"
        ? "Redirecting..."
        : isPaidSelection
          ? "Proceed to Secure Checkout"
          : "Save and Continue to Calendly"

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-border/80 bg-card/95 p-5 sm:p-6"
    >
      <h2 className="font-heading text-xl font-semibold text-foreground">
        Start Your Nurse Pivot
      </h2>
      <p className="text-sm text-muted-foreground">
        Share your goals and choose the support path that fits your next move
        across remote work, digital health, international practice, or a
        strategic transition beyond the bedside.
      </p>

      <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Selected Path
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-heading text-lg font-semibold text-foreground">
              {selectedPlan?.name ??
                getPlanLabelForIntent(form.intent, pricingCategories)}
            </p>
            <p className="text-sm text-muted-foreground">
              {isPaidSelection
                ? "Pay securely with PayPal first, then continue to your paid Calendly booking link."
                : "No payment required. After saving your details, you will continue straight to Calendly."}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-heading text-xl font-semibold text-primary">
              {selectedPlan
                ? formatCurrencyAmount(selectedPlan.basePriceKes, "USD")
                : "Custom"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isPaidSelection && checkoutAmountUsd
                ? `PayPal checkout charges USD $${checkoutAmountUsd}`
                : "Free introductory booking"}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          All prices are shown in USD. Your payment provider may convert the
          amount based on your local currency and exchange rate at checkout.
        </p>
      </div>

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
            Target Destination or Path
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
            <option value="">Select destination or path</option>
            {CAREER_DESTINATIONS.map((destination) => (
              <option key={destination} value={destination}>
                {destination}
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
          {availableIntentOptions.map((option) => (
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
          placeholder="Tell us where you feel stuck, the kind of role you want next, and the support you need most."
        />
      </div>

      <Button
        type="submit"
        className="h-10 w-full sm:w-auto"
        disabled={flow.stage === "loading" || flow.stage === "redirecting"}
      >
        {submitLabel}
      </Button>

      {flow.message ? (
        <p className="text-sm text-muted-foreground">{flow.message}</p>
      ) : null}

      {flow.error ? (
        <p className="text-sm text-destructive">{flow.error}</p>
      ) : null}

      {flow.stage === "free-ready" || flow.stage === "paid-ready" ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="font-medium text-foreground">
            {flow.stage === "paid-ready"
              ? "Your payment is confirmed."
              : "Your consultation request is saved."}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Continue to Calendly to select the time that works best for you.
          </p>
          <div className="mt-4">
            <CalendlyContinueButton
              bookingId={flow.bookingId}
              fallbackUrl={flow.calendlyUrl}
            />
          </div>
        </div>
      ) : null}

      {flow.stage === "idle" || flow.stage === "cancelled" ? (
        <p className="text-xs text-muted-foreground">
          Your details are handled securely and reviewed by the Nurse Prism team.
        </p>
      ) : null}
    </form>
  )
}
