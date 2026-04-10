import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function AboutPreviewSection() {
  return (
    <section className="np-container py-8 sm:py-10">
      <div className="grid items-center gap-6 rounded-3xl border border-border/80 bg-card/95 p-5 shadow-[0_20px_55px_-38px_rgba(15,10,12,0.72)] sm:p-8 lg:grid-cols-[0.95fr_1.05fr]">
        <Image
          src="/images/about/nurse-prism-founder.webp"
          alt="Nurse Prism founder portrait"
          width={900}
          height={1100}
          className="h-full min-h-72 w-full rounded-2xl object-cover"
        />

        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Founder-led coaching
          </p>
          <h2 className="font-heading mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
            A strategic partner for your international nursing career journey
          </h2>
          <p className="mt-3 text-muted-foreground">
            Nurse Prism was built to remove guesswork from relocation abroad, especially the Gulf countries. Our
            founder combines practical healthcare career coaching with a
            compassionate, systems-driven approach that helps nurses move with
            confidence.
          </p>
          <p className="mt-3 text-muted-foreground">
            Every strategy is personalized, culturally aware, and focused on
            sustainable professional growth.
          </p>

          <Button asChild variant="outline" className="mt-5">
            <Link href="/about">
              Read the Founder Story
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
