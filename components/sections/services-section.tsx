import Link from "next/link"
import { ArrowRight, Compass, FileCheck2, PlaneTakeoff, Stethoscope } from "lucide-react"

import { CORE_SERVICES } from "@/data/services"
import { Button } from "@/components/ui/button"

type ServicesSectionProps = {
  mode?: "preview" | "full"
}

const iconMap = [Compass, FileCheck2, Stethoscope, PlaneTakeoff]

export function ServicesSection({ mode = "preview" }: ServicesSectionProps) {
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
            Practical support at every stage of your Gulf transition
          </h2>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            Choose focused consultations or complete coaching pathways designed
            for internationally trained nurses.
          </p>
        </div>
        {mode === "preview" ? (
          <Button asChild variant="outline">
            <Link href="/services">
              View All Services
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                  <li key={outcome}>• {outcome}</li>
                ))}
              </ul>
            </article>
          )
        })}
      </div>
    </section>
  )
}
