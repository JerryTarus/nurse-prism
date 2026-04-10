import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { CtaSection } from "@/components/sections/cta-section"
import { ServicesSection } from "@/components/sections/services-section"
import { Button } from "@/components/ui/button"
import { createPageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = createPageMetadata({
  title: "Services",
  description:
    "Explore Nurse Prism services for strategy, positioning, interview preparation, and relocation execution for Gulf nursing opportunities.",
  path: "/services",
  keywords: [
    "nurse relocation services",
    "gulf nursing coaching",
    "nurse interview preparation",
  ],
})

const processSteps = [
  {
    title: "Diagnostic Consultation",
    detail:
      "We assess your current readiness, experience profile, and preferred Gulf destination.",
  },
  {
    title: "Strategic Plan",
    detail:
      "You receive a prioritized roadmap with practical actions, timelines, and milestones.",
  },
  {
    title: "Execution Support",
    detail:
      "We coach you through profile updates, interview prep, and decision checkpoints.",
  },
  {
    title: "Placement Momentum",
    detail:
      "You gain guidance on offer decisions, relocation confidence, and career progression.",
  },
]

export default function ServicesPage() {
  return (
    <>
      <section className="np-container pb-6 pt-10 sm:pt-14">
        <div className="rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Services
          </p>
          <h1 className="font-heading mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
            Premium coaching designed for internationally trained nurses
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Whether you need quick clarity or full relocation support, Nurse
            Prism services are built to reduce confusion and accelerate confident
            action.
          </p>
          <Button asChild className="mt-5">
            <Link href="/pricing">
              Compare Pricing Options
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <ServicesSection mode="full" />

      <section className="np-container py-10 sm:py-12">
        <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          How our coaching process works
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {processSteps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-2xl border border-border/80 bg-card/95 p-5"
            >
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                Step {index + 1}
              </p>
              <h3 className="font-heading mt-2 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {step.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <CtaSection />
    </>
  )
}
