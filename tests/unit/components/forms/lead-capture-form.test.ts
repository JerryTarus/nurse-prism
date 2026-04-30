import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/analytics/google", () => ({
  trackEvent: vi.fn(),
}))

describe("LeadCaptureForm", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("renders the cleaner homepage newsletter form without duplicate helper copy", async () => {
    const { LeadCaptureForm } = await import("@/components/forms/lead-capture-form")

    const html = renderToStaticMarkup(
      createElement(
        LeadCaptureForm as unknown as (props: Record<string, unknown>) => JSX.Element,
        {
          variant: "homepage",
        }
      )
    )

    expect(html).toContain("placeholder:text-white/72")
    expect(html).toContain("border-white/30")
    expect(html).not.toContain("Get weekly nurse pivot insights")
    expect(html).not.toContain("No spam. Just practical strategy")
  })
})
