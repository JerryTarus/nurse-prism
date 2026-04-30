import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

const HERO_SUBHEADLINE =
  "Nurse Prism helps nurses transition into remote roles, digital health, LinkedIn visibility, and international opportunities with a practical plan that feels aligned, not overwhelming."
const HERO_TRUST_LINE =
  "Because nursing is not one path \u2014 it\u2019s a prism."

vi.mock("next/image", () => ({
  default: ({
    alt,
    priority: _priority,
    ...props
  }: {
    alt: string
    priority?: boolean
  }) => {
    void _priority

    return createElement("img", { alt, ...props })
  },
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

describe("HeroSection", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("renders the premium homepage hero with a styled lead phrase and a contained founder image", async () => {
    const { HeroSection } = await import("@/components/sections/hero-section")

    const html = renderToStaticMarkup(
      createElement(HeroSection as unknown as (props: Record<string, unknown>) => JSX.Element, {
        badge: "Transforming Nursing Careers",
        title: "Find clarity. Move beyond the bedside. Build a career that fits your life.",
        body: HERO_SUBHEADLINE,
        trustLine: HERO_TRUST_LINE,
        imageSrc: "/images/hero/nurse-prism-hero.webp",
        primaryCta: {
          label: "Start Your Nurse Pivot",
          href: "/contact?intent=free-clarity-call",
        },
        secondaryCta: {
          label: "Book a Career Consultation \u2192",
          href: "/contact?intent=strategy-session",
        },
      })
    )

    expect(html).toContain("max-w-xl")
    expect(html).toContain('data-slot="hero-badge"')
    expect(html).toContain("rounded-full")
    expect(html).toContain("tracking-[0.22em]")
    expect(html).toContain('data-slot="hero-headline-lead"')
    expect(html).toContain("font-serif")
    expect(html).toContain("italic")
    expect(html).toContain("lg:grid-cols-2")
    expect(html).toContain("object-contain")
    expect(html).toContain(HERO_TRUST_LINE)
    expect(html).not.toContain("Global Opportunities")
    expect(html).not.toContain("Remote &amp; Digital Roles")
    expect(html).not.toContain("LinkedIn Strategy")
  })
})
