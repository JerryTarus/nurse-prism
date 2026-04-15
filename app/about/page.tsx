import type { Metadata } from "next"
import Image from "next/image"
import { Compass, HeartHandshake, Sparkles } from "lucide-react"

import { CtaSection } from "@/components/sections/cta-section"
import { FIVE_P_FRAMEWORK } from "@/data/services"
import {
  getPublicPageSections,
  getPublicSiteSettings,
  resolvePublicSection,
  resolvePublicSetting,
  splitSectionParagraphs,
} from "@/lib/cms/public-content"
import { SITE_CONFIG } from "@/lib/constants"
import { createManagedPageMetadata } from "@/lib/seo/metadata"

export async function generateMetadata(): Promise<Metadata> {
  return createManagedPageMetadata({
    pageKey: "about",
    title: "About Nurse Prism",
    description:
      "Meet the founder of Nurse Prism and explore the 5P framework guiding nurses toward clearer, more flexible careers beyond one narrow path.",
    path: "/about",
    keywords: [
      "about Nurse Prism",
      "nurse coaching founder story",
      "5P framework",
    ],
  })
}

function isLocalImageSrc(value: string) {
  return value.startsWith("/")
}

export default async function AboutPage() {
  const [sections, settings] = await Promise.all([
    getPublicPageSections("about"),
    getPublicSiteSettings(),
  ])

  const intro = resolvePublicSection(sections, "intro", {
    title: "The story behind Nurse Prism",
    content:
      "Nurse Prism grew from a real nursing journey that began in Kenya, expanded through clinical work in Qatar, and opened a wider reflection on what nursing careers can become when they are no longer limited to one definition of success.\n\nThat journey built clinical credibility, cultural awareness, and a deep understanding of what nurses need when they are trying to make brave career decisions in unfamiliar territory.\n\nNurse Prism exists to help nurses move with more clarity into global pathways, digital health, remote work, stronger visibility, and aligned career growth beyond the bedside.",
  })
  const mission = resolvePublicSection(sections, "mission", {
    title: "Our Mission",
    content:
      "To equip nurses with strategic clarity, practical positioning, and confidence as they grow into remote, digital, international, and purpose-aligned roles.",
  })
  const promise = resolvePublicSection(sections, "promise", {
    title: "Our Promise",
    content:
      "Every nurse receives thoughtful, ethical guidance designed to protect their time, money, confidence, and long-term career direction.",
  })
  const framework = resolvePublicSection(sections, "framework", {
    title: "The Nurse Prism 5P Framework",
    content:
      "Our coaching methodology follows five stages that turn uncertainty into clearer, more intentional progress.",
  })
  const introParagraphs = splitSectionParagraphs(intro.content)
  const founderImageSrc = resolvePublicSetting(
    settings,
    "appearance.founder",
    "/images/about/nurse-prism-founder.webp"
  )

  return (
    <>
      <section className="np-container pb-8 pt-10 sm:pt-14">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          {isLocalImageSrc(founderImageSrc) ? (
            <Image
              src={founderImageSrc}
              alt="Nurse Prism founder portrait"
              width={900}
              height={1100}
              className="h-full min-h-80 w-full rounded-3xl object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={founderImageSrc}
              alt="Nurse Prism founder portrait"
              className="h-full min-h-80 w-full rounded-3xl object-cover"
            />
          )}

          <div className="rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              <Sparkles className="size-3.5" />
              Founder Narrative
            </p>
            <h1 className="font-heading mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
              {intro.title}
            </h1>
            {introParagraphs.map((paragraph, index) => (
              <p
                key={`${paragraph}-${index}`}
                className={
                  index === 0 ? "mt-4 text-muted-foreground" : "mt-3 text-muted-foreground"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="np-container py-8 sm:py-10">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-border/80 bg-card/95 p-5">
            <Compass className="size-5 text-primary" />
            <h2 className="font-heading mt-3 text-xl font-semibold text-foreground">
              {mission.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {mission.content}
            </p>
          </article>
          <article className="rounded-2xl border border-border/80 bg-card/95 p-5">
            <HeartHandshake className="size-5 text-primary" />
            <h2 className="font-heading mt-3 text-xl font-semibold text-foreground">
              {promise.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {promise.content}
            </p>
          </article>
        </div>
      </section>

      <section className="np-container py-10">
        <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          {framework.title}
        </h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          {framework.content}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {FIVE_P_FRAMEWORK.map((pillar) => (
            <article key={pillar.pillar} className="np-surface p-4">
              <h3 className="font-heading text-base font-semibold text-primary">
                {pillar.pillar}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{pillar.detail}</p>
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
