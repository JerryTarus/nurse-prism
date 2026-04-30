import { TrackedButtonLink } from "@/components/analytics/tracked-button-link"
import { PricingCard } from "@/components/pricing/pricing-card"
import { PUBLIC_USD_PRICING_DISCLAIMER } from "@/lib/currency"
import type { PricingCategory } from "@/types/pricing"

type PricingPreviewSectionProps = {
  pricingCategories: PricingCategory[]
  heading?: {
    title: string
    content: string
  }
}

export function PricingPreviewSection({
  pricingCategories,
  heading,
}: PricingPreviewSectionProps) {
  const relocationPlans =
    pricingCategories.find((category) => category.id === "relocation")?.plans ?? []

  return (
    <section className="np-container py-10 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Pricing
          </p>
          <h2 className="font-heading mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            {heading?.title ??
              "Choose the support level that matches your transition pace"}
          </h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            {heading?.content ??
              "Transparent USD pricing with clear outcomes. The Professional Pivot is our most selected option for balanced depth, visibility, and momentum."}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {relocationPlans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} />
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          {PUBLIC_USD_PRICING_DISCLAIMER}
        </p>
        <TrackedButtonLink
          href="/pricing"
          eventName="cta_click"
          eventParams={{ placement: "pricing_preview", cta: "explore_full_pricing" }}
          variant="outline"
        >
          Explore Full Pricing
        </TrackedButtonLink>
      </div>
    </section>
  )
}
