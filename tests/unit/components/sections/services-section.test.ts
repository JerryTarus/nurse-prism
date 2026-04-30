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

describe("ServicesSection", () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it("renders the premium five-card homepage preview with the new CTA label", async () => {
    const { ServicesSection } = await import("@/components/sections/services-section")

    const html = renderToStaticMarkup(
      createElement(
        ServicesSection as unknown as (props: Record<string, unknown>) => JSX.Element,
        {
          heading: {
            title: "Career support designed for clarity, visibility, and aligned transition",
            content:
              "Choose focused support for career clarity, LinkedIn positioning, remote work transitions, digital health exploration, international pathways, and the Nurse Prism Career Program.",
          },
        }
      )
    )

    expect(html).toContain("Career Clarity &amp; Nurse Pivot Strategy")
    expect(html).toContain("LinkedIn Coaching &amp; Personal Branding")
    expect(html).toContain("Remote Work &amp; Digital Health Transition")
    expect(html).toContain("International Career Pathway Support")
    expect(html).toContain("Nurse Prism Career Program")
    expect(html).toContain("Explore All Services")
    expect(html).toContain("md:grid-cols-2")
    expect(html).toContain("xl:grid-cols-6")
    expect(html).toContain("xl:col-span-3")
  })
})
