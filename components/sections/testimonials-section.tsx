import { TESTIMONIALS } from "@/data/testimonials"

export function TestimonialsSection() {
  return (
    <section className="np-container py-8 sm:py-10">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Real Progress
        </p>
        <h2 className="font-heading mt-2 text-2xl font-semibold text-foreground sm:text-3xl">
          Nurses trust Nurse Prism for clear strategy and measurable outcomes
        </h2>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <article
            key={testimonial.id}
            className="rounded-2xl border border-border/80 bg-card/95 p-5"
          >
            <p className="text-sm leading-6 text-foreground/90">
              &quot;{testimonial.quote}&quot;
            </p>
            <p className="mt-4 text-sm font-semibold text-foreground">
              {testimonial.name} | {testimonial.role}
            </p>
            <p className="text-xs text-muted-foreground">{testimonial.country}</p>
            <p className="mt-2 text-xs font-medium text-primary">{testimonial.result}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
