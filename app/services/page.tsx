import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { CtaSection } from "@/components/sections/cta-section"
import { ServicesSection } from "@/components/sections/services-section"
import { Button } from "@/components/ui/button"
import {
  getPublicPageSections,
  getPublicSiteSettings,
  resolvePublicSection,
  resolvePublicSetting,
} from "@/lib/cms/public-content"
import { SITE_CONFIG } from "@/lib/constants"
import { createManagedPageMetadata } from "@/lib/seo/metadata"

export async function generateMetadata(): Promise<Metadata> {
  return createManagedPageMetadata({
    pageKey: "services",
    title: "Services",
    description:
      "Explore Nurse Prism services for career clarity, LinkedIn coaching, remote and digital health pivots, global opportunities, and interview support.",
    path: "/services",
    keywords: [
      "nurse career coaching services",
      "LinkedIn coaching for nurses",
      "remote nursing transition support",
    ],
  })
}

const processSteps = [
  {
    title: "Career Diagnostic",
    detail:
      "We assess your current stage, goals, strengths, blockers, and the kind of work life you want next.",
  },
  {
    title: "Strategic Roadmap",
    detail:
      "You receive a prioritized direction with practical actions, timelines, and the best-fit path for your pivot.",
  },
  {
    title: "Positioning Support",
    detail:
      "We strengthen your narrative across CVs, LinkedIn, interviews, and applications so your value is clear.",
  },
  {
    title: "Execution Momentum",
    detail:
      "You move forward with coaching support around opportunities, decisions, and confident career action.",
  },
]

export default async function ServicesPage() {
  const [sections, settings] = await Promise.all([
    getPublicPageSections("services"),
    getPublicSiteSettings(),
  ])

  const intro = resolvePublicSection(sections, "intro", {
    title: "Coaching built for nurses navigating real career change",
    content:
      "Whether you need quick clarity, stronger positioning, a remote-work pivot, international planning, or deeper guided support, Nurse Prism services are designed to reduce confusion and accelerate aligned action.",
  })
  const servicesHeading = resolvePublicSection(sections, "services-grid", {
    title: "Five focused support paths for the next version of your nursing career",
    content:
      "Choose focused coaching for clarity, LinkedIn strategy, remote and digital health transitions, international pathways, and the Nurse Prism Career Program.",
  })
  const process = resolvePublicSection(sections, "process", {
    title: "How our coaching process works",
    content:
      "Every support path is designed to move you from uncertainty to clear action with the right pace, structure, and visibility.",
  })

  return (
    <>
      <section className="np-container pb-6 pt-10 sm:pt-14">
        <div className="rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Services
          </p>
          <h1 className="font-heading mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
            {intro.title}
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">{intro.content}</p>
          <Button asChild className="mt-5">
            <Link href="/pricing">
              Compare Pricing Options
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <ServicesSection mode="full" heading={servicesHeading} />

      <section className="np-container py-10 sm:py-12">
        <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          {process.title}
        </h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">{process.content}</p>
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

      <CtaSection
        primaryCta={{
          label: resolvePublicSetting(
            settings,
            "cta.primary_label",
            "Start Your Nurse Pivot"
          ),
          href: resolvePublicSetting(
            settings,
            "cta.primary_href",
            SITE_CONFIG.consultationHref
          ),
        }}
      />
    </>
  )
}
