import {
  Compass,
  Globe,
  Laptop,
  Linkedin,
  type LucideIcon,
  Route,
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

const iconMap: Record<string, LucideIcon> = {
  "career-clarity": Compass,
  "linkedin-positioning": Linkedin,
  "remote-digital-health": Laptop,
  "global-opportunities": Globe,
  "career-program": Route,
} as const

export function ServicesSection({
  mode = "preview",
  heading,
}: ServicesSectionProps) {
  const visibleServices = CORE_SERVICES
  const isPreview = mode === "preview"

  return (
    <section className="np-container py-10 sm:py-12">
      <div className={isPreview ? "max-w-3xl" : ""}>
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Services
        </p>
        <h2 className="font-heading mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
          {heading?.title ?? "Practical support for every stage of your nurse pivot"}
        </h2>
        <p
          className={
            isPreview
              ? "mt-3 text-base leading-7 text-muted-foreground"
              : "mt-2 max-w-3xl text-muted-foreground"
          }
        >
          {heading?.content ??
            "Choose focused support for clarity, LinkedIn strategy, remote transitions, and international career opportunities."}
        </p>
      </div>

      {isPreview ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-6">
          {visibleServices.map((service, index) => {
            const Icon = iconMap[service.id]

            return (
              <article
                key={service.id}
                className={[
                  "rounded-[1.75rem] border border-[color:rgb(231_216_221/0.88)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,250,247,0.98))] p-6 shadow-[0_24px_60px_-42px_rgba(40,8,22,0.42)]",
                  index >= 3 ? "xl:col-span-3" : "xl:col-span-2",
                ].join(" ")}
              >
                <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[color:rgb(122_22_58/0.08)] text-[color:var(--np-rich-wine)]">
                  <Icon className="size-5" />
                </div>
                <h3 className="font-heading mt-5 text-xl font-semibold text-[color:var(--np-rich-wine)]">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--np-slate-text)] sm:text-[0.95rem]">
                  {service.description}
                </p>
                <p className="mt-4 text-sm leading-6 text-[color:var(--np-slate-text)]">
                  <span className="font-semibold text-foreground">Ideal for:</span>{" "}
                  {service.idealFor}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-foreground/92">
                  {service.outcomes.map((outcome) => (
                    <li key={outcome} className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-[color:var(--np-warm-gold)]"
                      />
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {visibleServices.map((service) => {
            const Icon = iconMap[service.id]

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
      )}

      {isPreview ? (
        <div className="mt-8 flex justify-center lg:justify-start">
          <TrackedButtonLink
            href="/services"
            eventName="cta_click"
            eventParams={{ placement: "services_preview", cta: "explore_all_services" }}
            variant="outline"
            size="lg"
            className="h-11 rounded-full border-[color:rgb(122_22_58/0.16)] bg-white/72 px-5 text-[color:var(--np-rich-wine)] shadow-[0_20px_44px_-34px_rgba(40,8,22,0.48)] hover:bg-white"
          >
            Explore All Services
          </TrackedButtonLink>
        </div>
      ) : null}
    </section>
  )
}
