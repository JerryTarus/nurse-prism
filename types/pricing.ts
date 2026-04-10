export type SupportedCurrency = "KES" | "USD" | "QAR" | "AED" | "SAR"

export type PricingCategoryId = "consultation" | "relocation" | "program"

export type PricingPlan = {
  id: string
  name: string
  summary: string
  basePriceKes: number
  ctaLabel: string
  ctaHref: string
  badge?: string
  isPopular?: boolean
  features: string[]
}

export type PricingCategory = {
  id: PricingCategoryId
  title: string
  description: string
  plans: PricingPlan[]
}

export type CurrencyConfig = {
  code: SupportedCurrency
  label: string
  locale: string
  symbol: string
  kesMultiplier: number
}
