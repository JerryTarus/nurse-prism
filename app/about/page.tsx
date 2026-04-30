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
      "Meet the founder of Nurse Prism and explore the story, digital health perspective, and coaching philosophy helping nurses grow beyond one narrow career path.",
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
      "Nurse Prism grew from a real nursing journey that began in Kenya, expanded through international clinical practice, and gradually opened into a bigger question: what happens when a nurse outgrows the narrow version of success the profession often expects?\n\nNursing is deeply human work. It is emotional, complex, meaningful, and demanding. It asks a lot of the people who carry it. Over time, that reality created space for reflection, curiosity, and a wider vision for what a nursing career can become.\n\nNurse Prism was created as a place where nurses can pause, think clearly, and explore career possibilities with honesty, structure, and confidence.",
  })
  const whyCreated = resolvePublicSection(sections, "why-created", {
    title: "Why I Created Nurse Prism",
    content:
      "I created Nurse Prism because too many nurses feel boxed into one story about what comes next. Some want a safer international move. Some want flexibility. Some are drawn to remote work, personal branding, innovation, or a role beyond the bedside, but do not know how to translate their experience into that future.\n\nThis platform exists to make that transition feel less lonely and more practical. It is a space for reflection, strategic coaching, and wider career possibility.",
  })
  const digitalHealth = resolvePublicSection(sections, "digital-health", {
    title: "Bringing Digital Health into the Picture",
    content:
      "Alongside clinical work, my interest kept growing toward digital health, healthcare data analytics, systems thinking, and innovation. I became increasingly interested in how care delivery changes when technology, coordination, insight, and human-centered design work well together.\n\nThat perspective now shapes Nurse Prism. Nurses deserve support that helps them see how bedside experience can connect to telehealth, care operations, healthcare technology, data-informed roles, and future-focused work that still honors the heart of nursing.",
  })
  const careerPossibility = resolvePublicSection(sections, "career-possibility", {
    title: "From Clinical Practice to Career Possibility",
    content:
      "The cross-border nursing journey remains part of Nurse Prism's credibility because it was built through real patient care, adaptation, and cross-cultural practice. But the mission is broader now.\n\nNurse Prism supports nurses who want to grow beyond one narrow path and build aligned careers across international opportunities, remote work, digital health, LinkedIn visibility, and purposeful professional reinvention.",
  })
  const framework = resolvePublicSection(sections, "framework", {
    title: "The Nurse Prism 5P Framework",
    content:
      "The framework below turns reflection into practical momentum so each career move feels clearer, more intentional, and more sustainable.",
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
              className="aspect-[4/5] h-full min-h-80 w-full rounded-3xl object-cover object-top"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={founderImageSrc}
              alt="Nurse Prism founder portrait"
              className="aspect-[4/5] h-full min-h-80 w-full rounded-3xl object-cover object-top"
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
        <div className="grid gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-border/80 bg-card/95 p-5">
            <Compass className="size-5 text-primary" />
            <h2 className="font-heading mt-3 text-xl font-semibold text-foreground">
              {whyCreated.title}
            </h2>
            {splitSectionParagraphs(whyCreated.content).map((paragraph, index) => (
              <p
                key={`${whyCreated.title}-${index}`}
                className={index === 0 ? "mt-2 text-sm leading-6 text-muted-foreground" : "mt-3 text-sm leading-6 text-muted-foreground"}
              >
                {paragraph}
              </p>
            ))}
          </article>
          <article className="rounded-2xl border border-border/80 bg-card/95 p-5">
            <HeartHandshake className="size-5 text-primary" />
            <h2 className="font-heading mt-3 text-xl font-semibold text-foreground">
              {digitalHealth.title}
            </h2>
            {splitSectionParagraphs(digitalHealth.content).map((paragraph, index) => (
              <p
                key={`${digitalHealth.title}-${index}`}
                className={index === 0 ? "mt-2 text-sm leading-6 text-muted-foreground" : "mt-3 text-sm leading-6 text-muted-foreground"}
              >
                {paragraph}
              </p>
            ))}
          </article>
          <article className="rounded-2xl border border-border/80 bg-card/95 p-5">
            <Sparkles className="size-5 text-primary" />
            <h2 className="font-heading mt-3 text-xl font-semibold text-foreground">
              {careerPossibility.title}
            </h2>
            {splitSectionParagraphs(careerPossibility.content).map((paragraph, index) => (
              <p
                key={`${careerPossibility.title}-${index}`}
                className={index === 0 ? "mt-2 text-sm leading-6 text-muted-foreground" : "mt-3 text-sm leading-6 text-muted-foreground"}
              >
                {paragraph}
              </p>
            ))}
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
