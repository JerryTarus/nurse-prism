import type { Metadata } from "next"
import { CalendarClock, Mail, MessageSquareText } from "lucide-react"

import { ConsultationForm } from "@/components/forms/consultation-form"
import { ContactForm } from "@/components/forms/contact-form"
import { type ConsultationIntent, isConsultationIntent } from "@/lib/consultations"
import {
  getPublicPageSections,
  getPublicPricingCategories,
  getPublicSiteSettings,
  resolvePublicSection,
  resolvePublicSetting,
} from "@/lib/cms/public-content"
import { SITE_CONFIG } from "@/lib/constants"
import { createManagedPageMetadata } from "@/lib/seo/metadata"

type ContactPageProps = {
  searchParams: Promise<{
    intent?: string
    paypal?: string
    booking?: string
    token?: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  return createManagedPageMetadata({
    pageKey: "contact",
    title: "Contact",
    description:
      "Book a consultation with Nurse Prism for career clarity, remote and digital health pivots, LinkedIn strategy, and global nursing opportunities.",
    path: "/contact",
    keywords: [
      "contact nurse prism",
      "book nursing consultation",
      "nurse career pivot coach",
    ],
  })
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedSearchParams = await searchParams
  const [sections, pricingCategories, settings] = await Promise.all([
    getPublicPageSections("contact"),
    getPublicPricingCategories(),
    getPublicSiteSettings(),
  ])

  const intent = resolvedSearchParams.intent
  const intentAliases: Record<string, ConsultationIntent> = {
    consultation: "strategy-session",
    "paid-strategy-session": "strategy-session",
  }
  const normalizedIntent = intent ? intentAliases[intent] ?? intent : undefined
  const defaultIntent =
    normalizedIntent && isConsultationIntent(normalizedIntent)
      ? normalizedIntent
      : undefined
  const paypalStatus =
    resolvedSearchParams.paypal === "success" ||
    resolvedSearchParams.paypal === "cancelled"
      ? resolvedSearchParams.paypal
      : undefined
  const intro = resolvePublicSection(sections, "intro", {
    title: "Book your next step with Nurse Prism",
    content:
      "Reach out for strategy guidance, LinkedIn coaching, international pathways, remote work transitions, or program enrollment. We reply with practical and transparent next steps.",
  })

  return (
    <section className="np-container pb-12 pt-10 sm:pt-14">
      <div className="rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Contact
        </p>
        <h1 className="font-heading mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          {intro.title}
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">{intro.content}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-border/80 bg-card/95 p-5">
          <Mail className="size-5 text-primary" />
          <h2 className="font-heading mt-3 text-lg font-semibold text-foreground">
            Email
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {resolvePublicSetting(settings, "contact.email", SITE_CONFIG.email)}
          </p>
        </article>
        <article className="rounded-2xl border border-border/80 bg-card/95 p-5">
          <CalendarClock className="size-5 text-primary" />
          <h2 className="font-heading mt-3 text-lg font-semibold text-foreground">
            Consultation Window
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {resolvePublicSetting(
              settings,
              "contact.consultation_window",
              "Monday to Friday, by scheduled slots."
            )}
          </p>
        </article>
        <article className="rounded-2xl border border-border/80 bg-card/95 p-5">
          <MessageSquareText className="size-5 text-primary" />
          <h2 className="font-heading mt-3 text-lg font-semibold text-foreground">
            Response Time
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {resolvePublicSetting(
              settings,
              "contact.response_time",
              "Typical response within one business day."
            )}
          </p>
        </article>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ConsultationForm
          defaultIntent={defaultIntent}
          pricingCategories={pricingCategories}
          paypalReturn={{
            status: paypalStatus,
            bookingId: resolvedSearchParams.booking,
            orderId: resolvedSearchParams.token,
          }}
        />
        <ContactForm />
      </div>
    </section>
  )
}
