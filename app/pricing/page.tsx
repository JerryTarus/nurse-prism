import type { Metadata } from "next"

import { PricingCatalog } from "@/components/pricing/pricing-catalog"
import { createPageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = createPageMetadata({
  title: "Pricing",
  description:
    "Compare Nurse Prism consultation, relocation, and program plans with transparent pricing and estimated local currency views.",
  path: "/pricing",
  keywords: [
    "nurse coaching pricing",
    "relocation package pricing",
    "Gulf nurse program cost",
  ],
})

export default function PricingPage() {
  return (
    <section className="np-container pb-12 pt-10 sm:pt-14">
      <div className="rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Pricing
        </p>
        <h1 className="font-heading mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          Transparent plans for every stage of your Gulf career journey
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Start free, choose strategic consultations, or commit to full support.
          The Professional Plan remains our most selected package for balanced
          depth and momentum.
        </p>
      </div>

      <div className="mt-8">
        <PricingCatalog highlightedCategory="relocation" />
      </div>
    </section>
  )
}
