import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { formatCurrencyAmount } from "@/lib/currency"
import { cn } from "@/lib/utils"
import type { PricingPlan, SupportedCurrency } from "@/types/pricing"

import { PricingBadge } from "./pricing-badge"

type PricingCardProps = {
  plan: PricingPlan
  currency: SupportedCurrency
  className?: string
}

export function PricingCard({ plan, currency, className }: PricingCardProps) {
  const priceText =
    plan.basePriceKes === 0
      ? "Free"
      : formatCurrencyAmount(plan.basePriceKes, currency, currency !== "KES")

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
        {currency === "KES" ? "Billed in Kenyan Shillings" : "Estimated local value"}
      </p>

      <ul className="mt-5 space-y-2.5 text-sm text-foreground/90">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button asChild className="mt-6 w-full">
        <Link href={plan.ctaHref}>{plan.ctaLabel}</Link>
      </Button>
    </article>
  )
}
