import type { Metadata } from "next"

import { CtaSection } from "@/components/sections/cta-section"
import { ProgramPricingPanel } from "@/components/pricing/program-pricing-panel"
import { FIVE_P_FRAMEWORK } from "@/data/services"
import { createPageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = createPageMetadata({
  title: "Program",
  description:
    "Discover the Nurse Prism Program and its 5P curriculum designed for high-confidence Gulf nursing relocation and career progression.",
  path: "/program",
  keywords: [
    "nurse prism program",
    "5P nursing framework",
    "gulf nursing career program",
  ],
})

const outcomes = [
  "Clarity on country choice, licensing pathway, and realistic timeline",
  "High-trust professional positioning for Gulf recruiters and hospitals",
  "Interview confidence and structured offer-evaluation support",
  "Practical relocation readiness and progression planning",
]

export default function ProgramPage() {
  return (
    <>
      <section className="np-container pb-8 pt-10 sm:pt-14">
        <div className="rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Program
          </p>
          <h1 className="font-heading mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
            The Nurse Prism Program for confident Gulf career transitions
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            A guided, high-touch coaching journey built around the Nurse Prism 5P
            Framework to move you from uncertainty to measurable progression.
          </p>
        </div>
      </section>

      <section className="np-container py-8 sm:py-10">
        <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Program outcomes
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {outcomes.map((outcome) => (
            <article key={outcome} className="np-surface p-4">
              <p className="text-sm text-foreground/90">{outcome}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="np-container py-8 sm:py-10">
        <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Curriculum structure
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {FIVE_P_FRAMEWORK.map((pillar) => (
            <article key={pillar.pillar} className="np-surface p-4">
              <p className="font-heading text-base font-semibold text-primary">
                {pillar.pillar}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{pillar.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="np-container py-8 sm:py-10">
        <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Program investment
        </h2>
        <div className="mt-5">
          <ProgramPricingPanel />
        </div>
      </section>

      <CtaSection />
    </>
  )
}
