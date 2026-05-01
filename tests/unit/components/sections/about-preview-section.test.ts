import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("next/image", () => ({
  default: ({
    alt,
    ...props
  }: {
    alt: string
  }) => createElement("img", { alt, ...props }),
}))

vi.mock("@/components/analytics/tracked-button-link", () => ({
  TrackedButtonLink: ({
    children,
    href,
    className,
  }: {
    children: unknown
    href: string
    className?: string
  }) => createElement("a", { href, className }, children),
}))

vi.mock("@/lib/cms/public-content", () => ({
  splitSectionParagraphs: (content: string) => content.split(/\n{2,}/),
}))

describe("AboutPreviewSection", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("renders the founder-led coaching copy as a premium badge instead of plain text", async () => {
    const { AboutPreviewSection } = await import("@/components/sections/about-preview-section")

    const html = renderToStaticMarkup(
      createElement(
        AboutPreviewSection as unknown as (props: Record<string, unknown>) => JSX.Element,
        {
          title: "Built from real nursing experience and a broader vision for what comes next",
          content:
            "Nurse Prism was shaped by lived nursing experience.\n\nThat perspective informs every coaching path.",
          imageSrc: "/images/about/nurse-prism-founder.webp",
        }
      )
    )

    expect(html).toContain("Founder Led Coaching")
    expect(html).toContain("rounded-full")
    expect(html).toContain("tracking-[0.22em]")
    expect(html).toContain("bg-[color:rgb(255_249_246/0.92)]")
    expect(html).toContain("bg-[color:var(--np-warm-gold)]")
  })
})
