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
    <section className="np-container py-8 sm:py-10">
      <div className="grid items-center gap-6 rounded-3xl border border-border/80 bg-card/95 p-5 shadow-[0_20px_55px_-38px_rgba(15,10,12,0.72)] sm:p-8 lg:grid-cols-[0.95fr_1.05fr]">
        {isLocalImageSrc(imageSrc) ? (
          <Image
            src={imageSrc}
            alt="Nurse Prism founder portrait"
            width={900}
            height={1100}
            className="h-full min-h-72 w-full rounded-2xl object-cover"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt="Nurse Prism founder portrait"
            className="h-full min-h-72 w-full rounded-2xl object-cover"
          />
        )}

        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Founder-led coaching
          </p>
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
