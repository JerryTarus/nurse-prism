"use client"

import { useCurrency } from "@/hooks/use-currency"
import type { PricingCategory } from "@/types/pricing"

import { CurrencySwitcher } from "./currency-switcher"
import { PricingCard } from "./pricing-card"

type ProgramPricingPanelProps = {
  pricingCategories: PricingCategory[]
}

export function ProgramPricingPanel({
  pricingCategories,
}: ProgramPricingPanelProps) {
  const { currency, setCurrency } = useCurrency("KES")
  const programPlans =
    pricingCategories.find((category) => category.id === "program")?.plans ?? []

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/95 p-4">
        <p className="text-sm text-muted-foreground">
          Display program pricing in your preferred currency.
        </p>
        <CurrencySwitcher value={currency} onChange={setCurrency} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {programPlans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} currency={currency} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Non-KES values are estimated planning values and may differ slightly at
        PayPal checkout.
      </p>
    </div>
  )
}
