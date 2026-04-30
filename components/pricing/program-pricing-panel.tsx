import { PUBLIC_USD_PRICING_DISCLAIMER } from "@/lib/currency"
import type { PricingCategory } from "@/types/pricing"

import { PricingCard } from "./pricing-card"

type ProgramPricingPanelProps = {
  pricingCategories: PricingCategory[]
}

export function ProgramPricingPanel({
  pricingCategories,
}: ProgramPricingPanelProps) {
  const programPlans =
    pricingCategories.find((category) => category.id === "program")?.plans ?? []

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {programPlans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>
      <p className="rounded-xl border border-border bg-card/80 px-4 py-3 text-xs leading-5 text-muted-foreground">
        {PUBLIC_USD_PRICING_DISCLAIMER}
      </p>
    </div>
  )
}
