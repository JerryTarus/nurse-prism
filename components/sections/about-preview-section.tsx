import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { TrackedButtonLink } from "@/components/analytics/tracked-button-link"
import { splitSectionParagraphs } from "@/lib/cms/public-content"

type AboutPreviewSectionProps = {
  title: string
  content: string
  imageSrc: string
}

function isLocalImageSrc(value: string) {
  return value.startsWith("/")
}

export function AboutPreviewSection({
  title,
  content,
  imageSrc,
}: AboutPreviewSectionProps) {
  const paragraphs = splitSectionParagraphs(content)
  const [firstParagraph, secondParagraph] = paragraphs

  return (
    <section className="np-container py-7 sm:py-9">
      <div className="grid items-center gap-5 rounded-3xl border border-border/80 bg-card/95 p-5 shadow-[0_20px_55px_-38px_rgba(15,10,12,0.72)] sm:p-6 lg:grid-cols-[0.95fr_1.05fr] lg:p-7">
        {isLocalImageSrc(imageSrc) ? (
          <Image
            src={imageSrc}
            alt="Nurse Prism founder portrait"
            width={900}
            height={1100}
            className="aspect-[4/5] h-full min-h-72 w-full rounded-2xl object-cover object-top"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt="Nurse Prism founder portrait"
            className="aspect-[4/5] h-full min-h-72 w-full rounded-2xl object-cover object-top"
          />
        )}

        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:rgb(122_22_58/0.16)] bg-white/76 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color:var(--np-rich-wine)] shadow-[0_16px_34px_-26px_rgba(40,8,22,0.55)] backdrop-blur-sm sm:text-xs">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-[color:var(--np-warm-gold)]"
            />
            Founder Led Coaching
          </div>
          <h2 className="font-heading mt-3 text-2xl font-semibold text-foreground sm:text-3xl">
            {title}
          </h2>
          {firstParagraph ? (
            <p className="mt-3 text-muted-foreground">{firstParagraph}</p>
          ) : null}
          {secondParagraph ? (
            <p className="mt-3 text-muted-foreground">{secondParagraph}</p>
          ) : null}

          <TrackedButtonLink
            href="/about"
            eventName="cta_click"
            eventParams={{ placement: "about_preview", cta: "read_founder_story" }}
            variant="outline"
            className="mt-5"
          >
            <>
              Read the Founder Story
              <ArrowRight className="size-4" />
            </>
          </TrackedButtonLink>
        </div>
      </div>
    </section>
  )
}
