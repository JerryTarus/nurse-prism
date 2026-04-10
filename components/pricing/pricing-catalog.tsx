"use client"

import { PRICING_CATEGORIES } from "@/data/pricing"
import { useCurrency } from "@/hooks/use-currency"
import { type PricingCategoryId } from "@/types/pricing"

import { CurrencySwitcher } from "./currency-switcher"
import { PricingCard } from "./pricing-card"

type PricingCatalogProps = {
  highlightedCategory?: PricingCategoryId
}

export function PricingCatalog({ highlightedCategory }: PricingCatalogProps) {
  const { currency, setCurrency } = useCurrency("KES")

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card/95 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading text-lg font-semibold text-foreground">
            Choose your display currency
          </p>
          <p className="text-sm text-muted-foreground">
            Local currencies are shown as estimates using controlled Nurse Prism
            planning rates.
          </p>
        </div>
        <CurrencySwitcher value={currency} onChange={setCurrency} />
      </div>

      {PRICING_CATEGORIES.map((category) => (
        <section
          key={category.id}
          className="space-y-4"
          aria-labelledby={`pricing-${category.id}`}
        >
          <div>
            <h2
              id={`pricing-${category.id}`}
              className="font-heading text-2xl font-semibold text-foreground"
            >
              {category.title}
            </h2>
            <p className="mt-1 max-w-3xl text-muted-foreground">
              {category.description}
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {category.plans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                currency={currency}
                className={
                  highlightedCategory === category.id && plan.isPopular
                    ? "ring-1 ring-primary/40"
                    : undefined
                }
              />
            ))}
          </div>
        </section>
      ))}

      <p className="rounded-xl border border-border bg-card/80 px-4 py-3 text-xs leading-5 text-muted-foreground">
        Currency values in USD, QAR, AED, and SAR are estimates for planning and
        may differ slightly at checkout due to processor conditions and billing
        settings.
      </p>
    </div>
  )
}
