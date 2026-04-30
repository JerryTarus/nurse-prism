import { PRICING_CATEGORIES } from "@/data/pricing"
import { convertKesToCurrency } from "@/lib/currency"
import type { PricingCategory, PricingCategoryId, PricingPlan } from "@/types/pricing"

export const CONSULTATION_INTENTS = [
  "free-clarity-call",
  "strategy-session",
  "starter-plan",
  "professional-plan",
  "elite-plan",
  "standard-program",
  "premium-program",
] as const

export type ConsultationIntent = (typeof CONSULTATION_INTENTS)[number]

const INTENT_FALLBACK_LABELS: Record<ConsultationIntent, string> = {
  "free-clarity-call": "Free Clarity Call",
  "strategy-session": "Career Clarity Session",
  "starter-plan": "Starter Pivot",
  "professional-plan": "Professional Pivot",
  "elite-plan": "Elite Pivot",
  "standard-program": "Core Program",
  "premium-program": "Premium Program",
}

export const INTENT_TO_PLAN_ID: Record<ConsultationIntent, string> = {
  "free-clarity-call": "free-clarity-call",
  "strategy-session": "paid-strategy-session",
  "starter-plan": "starter-plan",
  "professional-plan": "professional-plan",
  "elite-plan": "elite-plan",
  "standard-program": "standard-program",
  "premium-program": "premium-program",
}

function buildPlanIndex(categories: PricingCategory[]) {
  return new Map(
    categories.flatMap((category) =>
      category.plans.map((plan) => [plan.id, { categoryId: category.id, plan }] as const)
    )
  )
}

const CALENDLY_FREE_URL = process.env.NEXT_PUBLIC_CALENDLY_FREE_URL?.trim()
const CALENDLY_PAID_URL = process.env.NEXT_PUBLIC_CALENDLY_PAID_URL?.trim()

function normalizeUrl(value?: string) {
  return value && URL.canParse(value) ? value : null
}

export function isConsultationIntent(value: string): value is ConsultationIntent {
  return CONSULTATION_INTENTS.includes(value as ConsultationIntent)
}

export function resolvePlanIdForIntent(intent: ConsultationIntent) {
  return INTENT_TO_PLAN_ID[intent]
}

export function getPricingPlanForIntent(
  intent: ConsultationIntent,
  categories: PricingCategory[] = PRICING_CATEGORIES
): PricingPlan | null {
  return buildPlanIndex(categories).get(resolvePlanIdForIntent(intent))?.plan ?? null
}

export function getPricingCategoryForIntent(
  intent: ConsultationIntent,
  categories: PricingCategory[] = PRICING_CATEGORIES
): PricingCategoryId | null {
  return buildPlanIndex(categories).get(resolvePlanIdForIntent(intent))?.categoryId ?? null
}

export function isPaidConsultationIntent(
  intent: ConsultationIntent,
  categories: PricingCategory[] = PRICING_CATEGORIES
) {
  const plan = getPricingPlanForIntent(intent, categories)
  return Boolean(plan && plan.basePriceKes > 0)
}

export function getCheckoutAmountUsdForIntent(
  intent: ConsultationIntent,
  categories: PricingCategory[] = PRICING_CATEGORIES
) {
  const plan = getPricingPlanForIntent(intent, categories)
  if (!plan || plan.basePriceKes <= 0) {
    return null
  }

  return convertKesToCurrency(plan.basePriceKes, "USD").toFixed(2)
}

export function getCalendlyUrlForIntent(intent: ConsultationIntent) {
  return isPaidConsultationIntent(intent)
    ? normalizeUrl(CALENDLY_PAID_URL)
    : normalizeUrl(CALENDLY_FREE_URL)
}

export function getPlanLabelForIntent(
  intent: ConsultationIntent,
  categories: PricingCategory[] = PRICING_CATEGORIES
) {
  return getPricingPlanForIntent(intent, categories)?.name ?? INTENT_FALLBACK_LABELS[intent]
}

export function getConsultationIntentOptions(
  categories: PricingCategory[] = PRICING_CATEGORIES
) {
  return CONSULTATION_INTENTS.filter((intent) =>
    Boolean(getPricingPlanForIntent(intent, categories))
  ).map((intent) => ({
    label: getPlanLabelForIntent(intent, categories),
    value: intent,
  }))
}

export const CONSULTATION_INTENT_OPTIONS = getConsultationIntentOptions(PRICING_CATEGORIES)
