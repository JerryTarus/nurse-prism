import type { Metadata } from "next"
import Image from "next/image"
import { Compass, HeartHandshake, Sparkles } from "lucide-react"

import { CtaSection } from "@/components/sections/cta-section"
import { FIVE_P_FRAMEWORK } from "@/data/services"
import { createPageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = createPageMetadata({
  title: "About Nurse Prism",
  description:
    "Meet the founder of Nurse Prism and explore the 5P coaching framework guiding internationally trained nurses toward Gulf career success.",
  path: "/about",
  keywords: [
    "about Nurse Prism",
    "nurse coaching founder story",
    "5P framework",
  ],
})

export default function AboutPage() {
  return (
    <>
      <section className="np-container pb-8 pt-10 sm:pt-14">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <Image
            src="/images/about/nurse-prism-founder.webp"
            alt="Nurse Prism founder portrait"
            width={900}
            height={1100}
            className="h-full min-h-80 w-full rounded-3xl object-cover"
          />

          <div className="rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8">
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              <Sparkles className="size-3.5" />
              Founder Narrative
            </p>
            <h1 className="font-heading mt-3 text-3xl font-semibold text-foreground sm:text-4xl">
              The story behind Nurse Prism
            </h1>
            <p className="mt-4 text-muted-foreground">
              Nurse Prism was born from one clear mission: make global career
              pathways easier, safer, and more empowering for internationally
              trained nurses.
            </p>
            <p className="mt-3 text-muted-foreground">
              After seeing talented nurses lose confidence in confusing relocation
              processes, our founder built a coaching model that combines strategy,
              accountability, and compassionate guidance.
            </p>
            <p className="mt-3 text-muted-foreground">
              Today, Nurse Prism supports nurses with premium coaching grounded in
              the 5P Framework so each client can move from uncertainty to
              confident progression.
            </p>
          </div>
        </div>
      </section>

      <section className="np-container py-8 sm:py-10">
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-border/80 bg-card/95 p-5">
            <Compass className="size-5 text-primary" />
            <h2 className="font-heading mt-3 text-xl font-semibold text-foreground">
              Our Mission
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              To equip nurses pursuing Gulf opportunities with strategic clarity,
              practical support, and sustainable long-term career growth.
            </p>
          </article>
          <article className="rounded-2xl border border-border/80 bg-card/95 p-5">
            <HeartHandshake className="size-5 text-primary" />
            <h2 className="font-heading mt-3 text-xl font-semibold text-foreground">
              Our Promise
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Every client receives thoughtful, ethical guidance designed to
              protect their time, money, confidence, and professional reputation.
            </p>
          </article>
        </div>
      </section>

      <section className="np-container py-10">
        <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          The Nurse Prism 5P Framework
        </h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Our entire coaching methodology follows five stages that turn complexity
          into clear and actionable progress.
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

      <CtaSection />
    </>
  )
}
