"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { PRICING_CATEGORIES } from "@/data/pricing"
import { useCurrency } from "@/hooks/use-currency"
import { Button } from "@/components/ui/button"
import { CurrencySwitcher } from "@/components/pricing/currency-switcher"
import { PricingCard } from "@/components/pricing/pricing-card"

export function PricingPreviewSection() {
  const { currency, setCurrency } = useCurrency("KES")
  const relocationPlans =
    PRICING_CATEGORIES.find((category) => category.id === "relocation")?.plans ?? []

  return (
    <section className="np-container py-10 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Pricing
          </p>
          <h2 className="font-heading mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            Choose the support level that matches your relocation pace
          </h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Transparent pricing with clear outcomes. The Professional Plan is our
            most selected option for balanced speed and depth.
          </p>
        </div>
        <CurrencySwitcher value={currency} onChange={setCurrency} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {relocationPlans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} currency={currency} />
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Non-KES values are estimates based on controlled internal planning rates.
        </p>
        <Button asChild variant="outline">
          <Link href="/pricing">
            Explore Full Pricing
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
