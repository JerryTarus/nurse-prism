import Link from "next/link"
import { CalendarCheck2 } from "lucide-react"

import { LeadCaptureForm } from "@/components/forms/lead-capture-form"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/lib/constants"

export function CtaSection() {
  return (
    <section className="np-container py-10 sm:py-14">
      <div className="relative overflow-hidden rounded-3xl border border-[color:rgb(122_22_58/0.35)] bg-[linear-gradient(145deg,rgba(91,14,45,0.96),rgba(26,18,22,0.97))] p-6 text-[color:var(--np-champagne-mist)] shadow-[0_25px_55px_-28px_rgba(15,10,12,0.88)] sm:p-8 lg:p-10">
        <div className="absolute -right-16 -top-20 size-64 rounded-full bg-[color:rgb(224_184_90/0.2)] blur-3xl" />

        <div className="relative z-10 grid gap-7 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[color:var(--np-warm-gold)] uppercase">
              Start Your Move
            </p>
            <h2 className="font-heading mt-3 text-2xl font-semibold sm:text-3xl">
              Ready to illuminate your global nursing career?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:rgb(246_239_231/0.88)] sm:text-base">
              Book a consultation and get a practical roadmap tailored to your
              target country, timeline, and professional goals.
            </p>
            <Button
              asChild
              className="mt-6 border border-[color:rgb(224_184_90/0.3)] bg-[color:rgb(224_184_90/0.95)] text-[color:var(--np-near-black)] hover:bg-[color:rgb(224_184_90/0.85)]"
            >
              <Link href={SITE_CONFIG.consultationHref}>
                <CalendarCheck2 className="size-4" />
                Book Consultation
              </Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-[color:rgb(246_239_231/0.18)] bg-[color:rgb(246_239_231/0.08)] p-4 sm:p-5">
            <LeadCaptureForm />
          </div>
        </div>
      </div>
    </section>
  )
}
