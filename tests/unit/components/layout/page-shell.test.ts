import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/components/navigation/admin-return-pill", () => ({
  AdminReturnPill: () => createElement("div", null, "AdminReturnPill"),
}))

vi.mock("@/components/navigation/floating-cta", () => ({
  FloatingCta: () => createElement("div", null, "FloatingCta"),
}))

vi.mock("@/components/layout/site-footer", () => ({
  SiteFooter: () => createElement("footer", null, "SiteFooter"),
}))

vi.mock("@/components/layout/site-header", () => ({
  SiteHeader: () => createElement("header", null, "SiteHeader"),
}))

vi.mock("@/components/sections/social-proof-toast", () => ({
  SocialProofToast: () => createElement("div", null, "Recent activity"),
}))

describe("PageShell", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("does not render the recent activity popup on public pages", async () => {
    const { PageShell } = await import("@/components/layout/page-shell")

    const html = renderToStaticMarkup(
      PageShell({
        children: createElement("div", null, "Public content"),
      })
    )

    expect(html).toContain("Public content")
    expect(html).not.toContain("Recent activity")
  })
})
