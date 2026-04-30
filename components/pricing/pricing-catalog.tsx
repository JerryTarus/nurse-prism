import { PUBLIC_USD_PRICING_DISCLAIMER } from "@/lib/currency"
import type { PricingCategory, PricingCategoryId } from "@/types/pricing"

import { PricingCard } from "./pricing-card"

type PricingCatalogProps = {
  highlightedCategory?: PricingCategoryId
  pricingCategories: PricingCategory[]
}

export function PricingCatalog({
  highlightedCategory,
  pricingCategories,
}: PricingCatalogProps) {
  return (
    <div className="space-y-10">
      {pricingCategories.map((category) => (
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
        {PUBLIC_USD_PRICING_DISCLAIMER}
      </p>
    </div>
  )
}
