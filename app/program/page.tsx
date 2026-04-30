import type { Metadata } from "next"

import { ProgramPricingPanel } from "@/components/pricing/program-pricing-panel"
import { CtaSection } from "@/components/sections/cta-section"
import { FIVE_P_FRAMEWORK } from "@/data/services"
import {
  getPublicPageSections,
  getPublicPricingCategories,
  getPublicSiteSettings,
  resolvePublicSection,
  resolvePublicSetting,
} from "@/lib/cms/public-content"
import { SITE_CONFIG } from "@/lib/constants"
import { createManagedPageMetadata } from "@/lib/seo/metadata"

export async function generateMetadata(): Promise<Metadata> {
  return createManagedPageMetadata({
    pageKey: "program",
    title: "Program",
    description:
      "Discover the Nurse Prism Program and its 5P curriculum for nurses building aligned careers beyond traditional bedside roles.",
    path: "/program",
    keywords: [
      "nurse prism program",
      "5P nursing framework",
      "nurse career transition program",
    ],
  })
}

const outcomes = [
  "Clarity on the best-fit direction for your skills, values, and next career chapter",
  "Stronger positioning across LinkedIn, applications, and professional storytelling",
  "Confidence navigating remote, global, and non-traditional healthcare opportunities",
  "A repeatable framework for long-term growth beyond the first career move",
]

export default async function ProgramPage() {
  const [sections, pricingCategories, settings] = await Promise.all([
    getPublicPageSections("program"),
    getPublicPricingCategories(),
    getPublicSiteSettings(),
  ])

  const intro = resolvePublicSection(sections, "intro", {
    title: "The Nurse Prism Program for confident career transitions beyond the bedside",
    content:
      "A guided, high-touch coaching journey built around the Nurse Prism 5P Framework to move you from uncertainty to intentional, measurable progress across remote, tech, international, and non-traditional career paths.",
  })
  const outcomesIntro = resolvePublicSection(sections, "outcomes", {
    title: "Program outcomes",
    content:
      "The program is designed to strengthen clarity, positioning, momentum, and long-term confidence beyond a single role change.",
  })
  const curriculum = resolvePublicSection(sections, "curriculum", {
    title: "Curriculum structure",
    content:
      "The 5P sequence gives you a repeatable framework for practical transitions, stronger visibility, and aligned career growth.",
  })
  const investment = resolvePublicSection(sections, "investment", {
    title: "Program investment",
    content:
      "Choose the program tier that matches the depth of coaching and accountability you need right now. All pricing is shown in USD for a simpler, more transparent checkout experience.",
  })

  return (
    <>
      <section className="np-container pb-8 pt-10 sm:pt-14">
        <div className="rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Program
          </p>
          <h1 className="font-heading mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
            {intro.title}
          </h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">{intro.content}</p>
        </div>
      </section>

      <section className="np-container py-8 sm:py-10">
        <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          {outcomesIntro.title}
        </h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          {outcomesIntro.content}
        </p>
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
          {curriculum.title}
        </h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          {curriculum.content}
        </p>
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
          {investment.title}
        </h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">{investment.content}</p>
        <div className="mt-5">
          <ProgramPricingPanel pricingCategories={pricingCategories} />
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
