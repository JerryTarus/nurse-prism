import type { Metadata } from "next"

import { JsonLd } from "@/components/shared/json-ld"
import { FAQ_ITEMS } from "@/data/faqs"
import { createManagedPageMetadata } from "@/lib/seo/metadata"
import { createFaqSchema } from "@/lib/seo/structured-data"

const categories = ["Program", "Pricing", "Global Pathways", "Coaching"] as const

export async function generateMetadata(): Promise<Metadata> {
  return createManagedPageMetadata({
    pageKey: "faq",
    title: "FAQ",
    description:
      "Find answers to common Nurse Prism questions about pricing, coaching, global pathways, and the 5P program journey.",
    path: "/faq",
    keywords: ["nurse prism faq", "nursing coaching questions", "global nursing pathways"],
  })
}

export default function FaqPage() {
  return (
    <section className="np-container pb-12 pt-10 sm:pt-14">
      <JsonLd data={createFaqSchema(FAQ_ITEMS)} />

      <div className="rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          FAQ
        </p>
        <h1 className="font-heading mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Answers to common questions about coaching, pricing, global career
          pathways, and the Nurse Prism program.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {categories.map((category) => (
          <section key={category} aria-labelledby={`faq-${category}`}>
            <h2
              id={`faq-${category}`}
              className="font-heading text-xl font-semibold text-foreground"
            >
              {category}
            </h2>
            <div className="mt-3 space-y-2">
              {FAQ_ITEMS.filter((faq) => faq.category === category).map((faq) => (
                <details
                  key={faq.id}
                  className="group rounded-xl border border-border/80 bg-card/95 p-4"
                >
                  <summary className="cursor-pointer list-none font-medium text-foreground">
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-block size-1.5 rounded-full bg-primary" />
                      {faq.question}
                    </span>
                  </summary>
                  <p className="mt-3 pl-3 text-sm leading-6 text-muted-foreground">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}
