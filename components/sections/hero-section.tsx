import Image from "next/image"
import { ArrowRight, CalendarCheck2 } from "lucide-react"

import { TrackedButtonLink } from "@/components/analytics/tracked-button-link"

import { LiveCounterPill } from "./live-counter-pill"

type HeroSectionProps = {
  badge?: string
  title: string
  body: string
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

function isLocalImageSrc(value: string) {
  return value.startsWith("/")
}

export function HeroSection({
  badge = "Transforming Nursing Careers",
  title,
  body,
  imageSrc,
  primaryCta,
  secondaryCta,
}: HeroSectionProps) {
  return (
    <section className="np-container pb-8 pt-8 sm:pt-12 lg:pt-16">
      <div className="np-surface relative overflow-hidden p-6 sm:p-8 lg:p-10 xl:p-12">
        <div className="absolute -right-20 top-0 size-64 rounded-full bg-[color:rgb(122_22_58/0.12)] blur-3xl" />
        <div className="absolute -bottom-24 right-10 size-72 rounded-full bg-[color:rgb(224_184_90/0.18)] blur-3xl" />

        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-10">
          <div className="max-w-xl">
            <p className="text-sm font-medium italic tracking-[0.08em] text-primary/90 sm:text-base">
              {badge}
            </p>

            <h1 className="font-heading mt-4 text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl lg:text-[3.25rem]">
              {title}
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              {body}
            </p>

            <LiveCounterPill className="mt-5" />

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <TrackedButtonLink
                href={primaryCta.href}
                eventName="cta_click"
                eventParams={{ placement: "hero", cta: "start_nurse_pivot" }}
                size="lg"
                className="h-11"
              >
                <>
                  <CalendarCheck2 className="size-4" />
                  {primaryCta.label}
                </>
              </TrackedButtonLink>
              <TrackedButtonLink
                href={secondaryCta.href}
                eventName="cta_click"
                eventParams={{ placement: "hero", cta: "book_career_consultation" }}
                variant="outline"
                size="lg"
                className="h-11"
              >
                <>
                  {secondaryCta.label}
                  <ArrowRight className="size-4" />
                </>
              </TrackedButtonLink>
            </div>
          </div>

          <div className="relative min-h-[360px] sm:min-h-[430px] lg:min-h-[560px]">
            <div className="absolute -inset-4 rounded-3xl bg-[radial-gradient(circle_at_30%_25%,rgba(122,22,58,0.24),transparent_65%)] blur-xl" />
            {isLocalImageSrc(imageSrc) ? (
              <Image
                src={imageSrc}
                alt="Nurse coaching discussion at Nurse Prism"
                width={1600}
                height={1000}
                className="relative z-10 h-full w-full rounded-[1.75rem] object-cover object-center shadow-[0_30px_70px_-42px_rgba(15,10,12,0.8)]"
                priority
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt="Nurse coaching discussion at Nurse Prism"
                className="relative z-10 h-full w-full rounded-[1.75rem] object-cover object-center shadow-[0_30px_70px_-42px_rgba(15,10,12,0.8)]"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
