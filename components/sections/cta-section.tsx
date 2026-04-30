import { CalendarCheck2 } from "lucide-react"

import { TrackedButtonLink } from "@/components/analytics/tracked-button-link"
import { LeadCaptureForm } from "@/components/forms/lead-capture-form"
import { cn } from "@/lib/utils"

type CtaSectionProps = {
  title?: string
  content?: string
  variant?: "default" | "homepage"
  primaryCta: {
    label: string
    href: string
  }
}

export function CtaSection({
  title = "Ready to build a nursing career that fits who you are now?",
  content = "Book a consultation and get a practical roadmap tailored to your target path, timeline, and professional goals across remote, digital, international, and evolving healthcare roles.",
  variant = "default",
  primaryCta,
}: CtaSectionProps) {
  const isHomepageVariant = variant === "homepage"

  return (
    <section className="np-container py-10 sm:py-14">
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl p-6 shadow-[0_25px_55px_-28px_rgba(15,10,12,0.88)] sm:p-8 lg:p-10",
          isHomepageVariant
            ? "border border-[color:rgb(122_22_58/0.46)] bg-[linear-gradient(145deg,rgba(91,14,45,0.98),rgba(19,9,14,0.98)_58%,rgba(91,14,45,0.9))] text-white shadow-[0_30px_70px_-36px_rgba(40,8,22,0.95)]"
            : "border border-[color:rgb(122_22_58/0.35)] bg-[linear-gradient(145deg,rgba(91,14,45,0.96),rgba(26,18,22,0.97))] text-[color:var(--np-champagne-mist)]"
        )}
      >
        <div className="absolute -right-16 -top-20 size-64 rounded-full bg-[color:rgb(224_184_90/0.2)] blur-3xl" />

        <div className="relative z-10 grid gap-7 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[color:var(--np-warm-gold)] uppercase">
              {isHomepageVariant ? "Career Insights" : "Start Your Nurse Pivot"}
            </p>
            <h2
              className={cn(
                "font-heading mt-3 text-2xl font-semibold sm:text-3xl",
                isHomepageVariant ? "text-white" : ""
              )}
            >
              {title}
            </h2>
            <p
              className={cn(
                "mt-3 max-w-2xl text-sm leading-7 sm:text-base",
                isHomepageVariant
                  ? "text-white/84"
                  : "text-[color:rgb(246_239_231/0.88)]"
              )}
            >
              {content}
            </p>
            <TrackedButtonLink
              href={primaryCta.href}
              eventName="cta_click"
              eventParams={{ placement: "cta_section", cta: "start_nurse_pivot" }}
              className={cn(
                "mt-6 border border-[color:rgb(224_184_90/0.3)] bg-[color:rgb(224_184_90/0.95)] text-[color:var(--np-near-black)] hover:bg-[color:rgb(224_184_90/0.85)]",
                isHomepageVariant
                  ? "shadow-[0_18px_36px_-22px_rgba(224,184,90,0.8)]"
                  : ""
              )}
            >
              <>
                <CalendarCheck2 className="size-4" />
                {primaryCta.label}
              </>
            </TrackedButtonLink>
          </div>

          <div
            className={cn(
              "rounded-2xl p-4 sm:p-5",
              isHomepageVariant
                ? "border border-white/18 bg-white/8"
                : "border border-[color:rgb(246_239_231/0.18)] bg-[color:rgb(246_239_231/0.08)]"
            )}
          >
            <LeadCaptureForm variant={variant} />
          </div>
        </div>
      </div>
    </section>
  )
}
