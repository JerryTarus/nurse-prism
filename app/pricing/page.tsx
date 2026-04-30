import type { Metadata } from "next"

import { PricingCatalog } from "@/components/pricing/pricing-catalog"
import {
  getPublicPageSections,
  getPublicPricingCategories,
  resolvePublicSection,
} from "@/lib/cms/public-content"
import { createManagedPageMetadata } from "@/lib/seo/metadata"

export async function generateMetadata(): Promise<Metadata> {
  return createManagedPageMetadata({
    pageKey: "pricing",
    title: "Pricing",
    description:
      "Compare Nurse Prism consultation, coaching, and program plans with transparent USD pricing for nurses exploring clearer, more aligned career moves.",
    path: "/pricing",
    keywords: [
      "nurse coaching pricing",
      "career pivot coaching pricing",
      "nurse program cost",
    ],
  })
}

export default async function PricingPage() {
  const [sections, pricingCategories] = await Promise.all([
    getPublicPageSections("pricing"),
    getPublicPricingCategories(),
  ])

  const intro = resolvePublicSection(sections, "intro", {
    title: "Transparent plans for every stage of your career transition",
    content:
      "Start free, choose a strategic consultation, or commit to deeper coaching support. All public pricing is shown in USD for a clearer launch-ready checkout experience.",
  })

  return (
    <section className="np-container pb-12 pt-10 sm:pt-14">
      <div className="rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Pricing
        </p>
        <h1 className="font-heading mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          {intro.title}
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">{intro.content}</p>
      </div>

      <div className="mt-8">
        <PricingCatalog
          highlightedCategory="relocation"
          pricingCategories={pricingCategories}
        />
      </div>
    </section>
  )
}
