import { CheckCircle2 } from "lucide-react"

import { TrackedButtonLink } from "@/components/analytics/tracked-button-link"
import { formatCurrencyAmount } from "@/lib/currency"
import { cn } from "@/lib/utils"
import type { PricingPlan } from "@/types/pricing"

import { PricingBadge } from "./pricing-badge"

type PricingCardProps = {
  plan: PricingPlan
  className?: string
}

export function PricingCard({ plan, className }: PricingCardProps) {
  const isFreePlan = plan.basePriceKes === 0
  const priceText =
    isFreePlan ? "Free" : formatCurrencyAmount(plan.basePriceKes, "USD")
  const ctaLabel = isFreePlan ? plan.ctaLabel : "Proceed to Secure Checkout"

  return (
    <article
      className={cn(
        "relative rounded-2xl border border-border/80 bg-card/95 p-6 shadow-[0_20px_50px_-34px_rgba(15,10,12,0.62)]",
        plan.isPopular && "np-popular-halo border-primary/35",
        className
      )}
    >
      {plan.badge ? (
        <PricingBadge className="mb-4 bg-[color:rgb(224_184_90/0.16)] text-[color:var(--np-rich-wine)]">
          {plan.badge}
        </PricingBadge>
      ) : null}

      <h3 className="font-heading text-xl font-semibold text-foreground">{plan.name}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
        {plan.summary}
      </p>

      <p className="mt-5 font-heading text-3xl font-semibold text-primary">{priceText}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {isFreePlan
          ? "No payment required to reserve this call."
          : "Secure checkout handled in USD."}
      </p>

      <ul className="mt-5 space-y-2.5 text-sm text-foreground/90">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <TrackedButtonLink
        href={plan.ctaHref}
        eventName="cta_click"
        eventParams={{
          placement: "pricing_card",
          plan_id: plan.id,
          plan_name: plan.name,
        }}
        className="mt-6 w-full"
      >
        {ctaLabel}
      </TrackedButtonLink>
    </article>
  )
}
