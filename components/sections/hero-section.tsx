import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarCheck2, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/lib/constants"

import { LiveCounterPill } from "./live-counter-pill"

export function HeroSection() {
  return (
    <section className="np-container pb-8 pt-8 sm:pt-12 lg:pt-16">
      <div className="np-surface relative overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="absolute -right-24 -top-24 size-64 rounded-full bg-[color:rgb(122_22_58/0.12)] blur-3xl" />
        <div className="absolute -bottom-28 right-14 size-64 rounded-full bg-[color:rgb(224_184_90/0.18)] blur-3xl" />

        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
              <Sparkles className="size-3.5" />
              Premium Gulf Career Coaching Platform
            </p>

            <h1 className="font-heading mt-5 text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Build your next nursing chapter in the Gulf with clarity and
              confidence.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {SITE_CONFIG.name} helps internationally trained nurses navigate
              every stage of relocation, from strategy and positioning to
              placement and long-term progression.
            </p>

            <LiveCounterPill className="mt-5" />

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-11">
                <Link href={SITE_CONFIG.consultationHref}>
                  <CalendarCheck2 className="size-4" />
                  Book Consultation
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11">
                <Link href="/program">
                  Explore Program
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-[radial-gradient(circle_at_30%_25%,rgba(122,22,58,0.24),transparent_65%)] blur-xl" />
            <Image
              src="/images/hero/nurse-prism-hero.webp"
              alt="Nurse coaching discussion at Nurse Prism"
              width={1600}
              height={1000}
              className="relative z-10 h-full w-full rounded-2xl object-cover shadow-[0_30px_70px_-42px_rgba(15,10,12,0.8)]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
