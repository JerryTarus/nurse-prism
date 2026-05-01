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
    <section className="np-container pb-6 pt-4 sm:pt-6 lg:pt-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-[color:rgb(122_22_58/0.12)] bg-[linear-gradient(145deg,rgba(248,241,237,0.98),rgba(255,255,255,0.98)_56%,rgba(248,233,237,0.96))] px-5 py-5 shadow-[0_30px_75px_-48px_rgba(40,8,22,0.44)] sm:px-7 sm:py-6 lg:px-10 lg:py-7 xl:px-12 xl:py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(224,184,90,0.16),transparent_34%),radial-gradient(circle_at_82%_14%,rgba(122,22,58,0.12),transparent_28%),radial-gradient(circle_at_74%_88%,rgba(122,22,58,0.09),transparent_30%)]" />
        <div className="absolute -left-10 top-10 size-40 rounded-full bg-[color:rgb(224_184_90/0.11)] blur-3xl" />
        <div className="absolute -right-12 bottom-6 size-48 rounded-full bg-[color:rgb(122_22_58/0.11)] blur-3xl" />

        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
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

            <h1 className="mt-4 max-w-xl text-4xl leading-[0.98] font-bold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-[3.85rem] xl:text-[4.2rem]">
              {title.startsWith(HERO_HEADLINE_LEAD) ? (
                <>
                  <span
                    data-slot="hero-headline-lead"
                    className="block font-serif italic text-[color:var(--np-rich-wine)]"
                  >
                    {HERO_HEADLINE_LEAD}
                  </span>
                  <span className="font-heading mt-2.5 block text-foreground">
                    {titleWithoutLead}
                  </span>
                </>
              ) : (
                <span className="font-heading">{title}</span>
              )}
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-[color:var(--np-slate-text)] sm:text-lg">
              {body}
            </p>
            {trustLine ? (
              <p className="mt-4 max-w-xl text-sm font-semibold text-[color:var(--np-rich-wine)] sm:text-base">
                {trustLine}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <TrackedButtonLink
                href={primaryCta.href}
                eventName="cta_click"
                eventParams={{ placement: "hero", cta: "start_nurse_pivot" }}
                size="lg"
                className="h-12 w-full rounded-full px-8 text-[15px] shadow-[0_22px_42px_-24px_rgba(91,14,45,0.72)] sm:w-auto"
              >
                {primaryCta.label}
              </TrackedButtonLink>
              <TrackedButtonLink
                href={secondaryCta.href}
                eventName="cta_click"
                eventParams={{ placement: "hero", cta: "book_career_consultation" }}
                variant="outline"
                size="lg"
                className="h-12 w-full rounded-full border-[color:rgb(122_22_58/0.14)] bg-white/72 px-8 text-[15px] font-semibold text-[color:var(--np-rich-wine)] shadow-[0_18px_38px_-28px_rgba(40,8,22,0.42)] hover:bg-white sm:w-auto"
              >
                {secondaryCta.label}
              </TrackedButtonLink>
            </div>
          </div>

          <div className="relative flex justify-center lg:self-center lg:justify-end">
            <div className="absolute inset-0 top-1/4 rounded-full bg-[radial-gradient(circle_at_center,rgba(224,184,90,0.18),transparent_65%)] blur-2xl" />
            <div className="absolute inset-0 top-1/3 rounded-full bg-[radial-gradient(circle_at_center,rgba(122,22,58,0.12),transparent_60%)] blur-2xl" />
            <div className="relative flex h-[clamp(420px,46vw,620px)] w-full items-center justify-center lg:w-[48vw] lg:max-w-[650px]">
              {isLocalImageSrc(imageSrc) ? (
                <Image
                  src={imageSrc}
                  alt="Nurse Prism founder seated in nursing scrubs representing nurse career coaching"
                  width={1200}
                  height={1400}
                  className="relative z-10 h-full w-auto max-w-full object-contain object-bottom drop-shadow-[0_25px_35px_rgba(40,8,22,0.35)]"
                  priority
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageSrc}
                  alt="Nurse Prism founder seated in nursing scrubs representing nurse career coaching"
                  className="relative z-10 h-full w-auto max-w-full object-contain object-bottom drop-shadow-[0_25px_35px_rgba(40,8,22,0.35)]"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
