import {
  Compass,
  Globe2,
  Laptop2,
  Linkedin,
  MessageSquareQuote,
} from "lucide-react"

import { TrackedButtonLink } from "@/components/analytics/tracked-button-link"
import { CORE_SERVICES } from "@/data/services"

type ServicesSectionProps = {
  mode?: "preview" | "full"
  heading?: {
    title: string
    content: string
  }
}

const iconMap = [Compass, Linkedin, Laptop2, Globe2, MessageSquareQuote]

export function ServicesSection({
  mode = "preview",
  heading,
}: ServicesSectionProps) {
  const visibleServices =
    mode === "preview" ? CORE_SERVICES.slice(0, 3) : CORE_SERVICES

  return (
    <section className="np-container py-10 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Services
          </p>
          <h2 className="font-heading mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
            {heading?.title ?? "Practical support for every stage of your nurse pivot"}
          </h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            {heading?.content ??
              "Choose focused coaching for clarity, LinkedIn strategy, remote roles, global opportunities, and confident career decisions."}
          </p>
        </div>
        {mode === "preview" ? (
          <TrackedButtonLink
            href="/services"
            eventName="cta_click"
            eventParams={{ placement: "services_preview", cta: "view_all_services" }}
            variant="outline"
          >
            View All Services
          </TrackedButtonLink>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {visibleServices.map((service, index) => {
          const Icon = iconMap[index % iconMap.length]
          return (
            <article
              key={service.id}
              className="rounded-2xl border border-border/80 bg-card/95 p-5 shadow-[0_16px_40px_-32px_rgba(15,10,12,0.78)]"
            >
              <Icon className="size-5 text-primary" />
              <h3 className="font-heading mt-3 text-lg font-semibold text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {service.description}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Ideal for:</span>{" "}
                {service.idealFor}
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-foreground/90">
                {service.outcomes.map((outcome) => (
                  <li key={outcome}>- {outcome}</li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>
    </section>
  )
}
