import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/components/navigation/admin-return-pill", () => ({
  AdminReturnPill: () => createElement("div", null, "AdminReturnPill"),
}))

vi.mock("@/components/navigation/floating-cta", () => ({
  FloatingCta: () => createElement("div", null, "FloatingCta"),
}))

vi.mock("@/components/navigation/scroll-to-top-button", () => ({
  ScrollToTopButton: () => createElement("div", null, "ScrollToTopButton"),
}))

vi.mock("@/components/layout/site-footer", () => ({
  SiteFooter: () => createElement("footer", null, "SiteFooter"),
}))

vi.mock("@/components/layout/site-header", () => ({
  SiteHeader: () => createElement("header", null, "SiteHeader"),
}))

describe("PageShell", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("renders the shared scroll-to-top control without bringing back recent activity", async () => {
    const { PageShell } = await import("@/components/layout/page-shell")

    const html = renderToStaticMarkup(
      PageShell({
        children: createElement("div", null, "Public content"),
      })
    )

    expect(html).toContain("Public content")
    expect(html).toContain("ScrollToTopButton")
    expect(html).not.toContain("Recent activity")
  })
})
