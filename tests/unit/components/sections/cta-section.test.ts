import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

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

vi.mock("@/components/forms/lead-capture-form", () => ({
  LeadCaptureForm: ({ variant }: { variant?: string }) =>
    createElement("form", { "data-variant": variant }, "LeadCaptureForm"),
}))

describe("CtaSection", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("renders the higher-contrast homepage CTA card styling", async () => {
    const { CtaSection } = await import("@/components/sections/cta-section")

    const html = renderToStaticMarkup(
      createElement(CtaSection as unknown as (props: Record<string, unknown>) => JSX.Element, {
        variant: "homepage",
        title: "Get practical career insights for modern nurses",
        content: "Actionable guidance. No noise.",
        primaryCta: {
          label: "Start Your Nurse Pivot",
          href: "/contact?intent=strategy-session",
        },
      })
    )

    expect(html).toContain("text-white")
    expect(html).toContain("data-variant=\"homepage\"")
    expect(html).toContain("Get practical career insights for modern nurses")
    expect(html).toContain("Actionable guidance. No noise.")
  })
})
