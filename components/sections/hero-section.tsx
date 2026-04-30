import Image from "next/image"

import { TrackedButtonLink } from "@/components/analytics/tracked-button-link"

type HeroSectionProps = {
  badge?: string
  title: string
  body: string
  trustLine?: string
  imageSrc: string
  primaryCta: {
    label: string
    href: string
  }
  secondaryCta: {
    label: string
    href: string
  }
}

const HERO_HEADLINE_LEAD = "Find clarity."

function isLocalImageSrc(value: string) {
  return value.startsWith("/")
}

export function HeroSection({
  badge = "Transforming Nursing Careers",
  title,
  body,
  trustLine,
  imageSrc,
  primaryCta,
  secondaryCta,
}: HeroSectionProps) {
  const titleWithoutLead = title.startsWith(HERO_HEADLINE_LEAD)
    ? title.slice(HERO_HEADLINE_LEAD.length).trimStart()
    : title

  return (
    <section className="np-container pb-8 pt-8 sm:pt-12 lg:pt-16">
      <div className="relative overflow-hidden rounded-[2rem] border border-[color:rgb(122_22_58/0.12)] bg-[linear-gradient(145deg,rgba(248,241,237,0.98),rgba(255,255,255,0.98)_56%,rgba(248,233,237,0.96))] px-6 py-8 shadow-[0_30px_75px_-48px_rgba(40,8,22,0.44)] sm:px-8 lg:px-10 lg:py-10 xl:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(224,184,90,0.16),transparent_34%),radial-gradient(circle_at_82%_14%,rgba(122,22,58,0.12),transparent_28%),radial-gradient(circle_at_74%_88%,rgba(122,22,58,0.09),transparent_30%)]" />
        <div className="absolute -left-10 top-14 size-44 rounded-full bg-[color:rgb(224_184_90/0.12)] blur-3xl" />
        <div className="absolute -right-14 bottom-8 size-56 rounded-full bg-[color:rgb(122_22_58/0.12)] blur-3xl" />

        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2 xl:gap-16">
          <div className="max-w-xl">
            <div
              data-slot="hero-badge"
              className="inline-flex items-center gap-2 rounded-full border border-[color:rgb(122_22_58/0.16)] bg-white/76 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--np-rich-wine)] shadow-[0_16px_34px_-26px_rgba(40,8,22,0.55)] backdrop-blur-sm sm:text-xs"
            >
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-[color:var(--np-warm-gold)]"
              />
              {badge}
            </div>

            <h1 className="mt-6 max-w-xl text-4xl leading-[0.98] font-bold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-[4rem] xl:text-[4.45rem]">
              {title.startsWith(HERO_HEADLINE_LEAD) ? (
                <>
                  <span
                    data-slot="hero-headline-lead"
                    className="block font-serif italic text-[color:var(--np-rich-wine)]"
                  >
                    {HERO_HEADLINE_LEAD}
                  </span>
                  <span className="font-heading mt-3 block text-foreground">
                    {titleWithoutLead}
                  </span>
                </>
              ) : (
                <span className="font-heading">{title}</span>
              )}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[color:var(--np-slate-text)] sm:text-lg">
              {body}
            </p>
            {trustLine ? (
              <p className="mt-5 max-w-xl text-sm font-semibold text-[color:var(--np-rich-wine)] sm:text-base">
                {trustLine}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <TrackedButtonLink
                href={primaryCta.href}
                eventName="cta_click"
                eventParams={{ placement: "hero", cta: "start_nurse_pivot" }}
                size="lg"
                className="h-12 rounded-full px-6 text-sm shadow-[0_22px_42px_-24px_rgba(91,14,45,0.72)] sm:w-auto sm:min-w-[220px]"
              >
                {primaryCta.label}
              </TrackedButtonLink>
              <TrackedButtonLink
                href={secondaryCta.href}
                eventName="cta_click"
                eventParams={{ placement: "hero", cta: "book_career_consultation" }}
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-[color:rgb(122_22_58/0.14)] bg-white/72 px-6 text-[color:var(--np-rich-wine)] shadow-[0_18px_38px_-28px_rgba(40,8,22,0.42)] hover:bg-white sm:w-auto sm:min-w-[280px]"
              >
                {secondaryCta.label}
              </TrackedButtonLink>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-10 top-8 h-32 rounded-full bg-[color:rgb(224_184_90/0.14)] blur-3xl" />
            <div className="absolute -left-2 bottom-8 size-44 rounded-full bg-[color:rgb(122_22_58/0.14)] blur-3xl" />
            <div className="relative flex min-h-[340px] items-end justify-center rounded-[2rem] border border-white/70 bg-[linear-gradient(160deg,rgba(255,255,255,0.92),rgba(248,241,237,0.94)_52%,rgba(250,236,240,0.94))] px-4 pt-8 shadow-[0_32px_80px_-40px_rgba(40,8,22,0.52)] sm:min-h-[430px] sm:px-8 lg:min-h-[620px] lg:px-10">
              <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(224,184,90,0.16),transparent_38%),radial-gradient(circle_at_70%_24%,rgba(122,22,58,0.12),transparent_34%)]" />
              {isLocalImageSrc(imageSrc) ? (
                <Image
                  src={imageSrc}
                  alt="Nurse Prism founder portrait"
                  width={1200}
                  height={1400}
                  className="relative z-10 h-auto max-h-[660px] w-full object-contain drop-shadow-xl"
                  priority
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageSrc}
                  alt="Nurse Prism founder portrait"
                  className="relative z-10 h-auto max-h-[660px] w-full object-contain drop-shadow-xl"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
