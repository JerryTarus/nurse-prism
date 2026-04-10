import type { Metadata } from "next"
import { CalendarClock, Mail, MessageSquareText } from "lucide-react"

import {
  type ConsultationIntent,
  ConsultationForm,
} from "@/components/forms/consultation-form"
import { ContactForm } from "@/components/forms/contact-form"
import { SITE_CONFIG } from "@/lib/constants"
import { createPageMetadata } from "@/lib/seo/metadata"

type ContactPageProps = {
  searchParams: Promise<{ intent?: string }>
}

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Book a consultation with Nurse Prism for Gulf nursing career strategy, relocation support, and program guidance.",
  path: "/contact",
  keywords: [
    "contact nurse prism",
    "book nursing consultation",
    "gulf nurse coaching contact",
  ],
})

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const intent = (await searchParams).intent
  const intentAliases: Record<string, ConsultationIntent> = {
    consultation: "strategy-session",
  }
  const normalizedIntent = intent ? intentAliases[intent] ?? intent : undefined
  const allowedIntentValues: ConsultationIntent[] = [
    "free-clarity-call",
    "strategy-session",
    "starter-plan",
    "professional-plan",
    "elite-plan",
    "standard-program",
    "premium-program",
  ]
  const defaultIntent = allowedIntentValues.includes(
    normalizedIntent as ConsultationIntent
  )
    ? (normalizedIntent as ConsultationIntent)
    : undefined

  return (
    <section className="np-container pb-12 pt-10 sm:pt-14">
      <div className="rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Contact
        </p>
        <h1 className="font-heading mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          Book your next step with Nurse Prism
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Reach out for strategy guidance, program enrollment, or package support.
          We reply with practical and transparent next steps.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-border/80 bg-card/95 p-5">
          <Mail className="size-5 text-primary" />
          <h2 className="font-heading mt-3 text-lg font-semibold text-foreground">
            Email
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{SITE_CONFIG.email}</p>
        </article>
        <article className="rounded-2xl border border-border/80 bg-card/95 p-5">
          <CalendarClock className="size-5 text-primary" />
          <h2 className="font-heading mt-3 text-lg font-semibold text-foreground">
            Consultation Window
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Monday to Friday, by scheduled slots.
          </p>
        </article>
        <article className="rounded-2xl border border-border/80 bg-card/95 p-5">
          <MessageSquareText className="size-5 text-primary" />
          <h2 className="font-heading mt-3 text-lg font-semibold text-foreground">
            Response Time
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Typical response within one business day.
          </p>
        </article>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ConsultationForm defaultIntent={defaultIntent} />
        <ContactForm />
      </div>
    </section>
  )
}
