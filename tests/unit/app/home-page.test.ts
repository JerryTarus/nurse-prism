import { renderToStaticMarkup } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"

const HERO_HEADLINE =
  "Find clarity. Move beyond the bedside. Build a career that fits your life."
const HERO_SUBHEADLINE =
  "Nurse Prism helps nurses transition into remote roles, digital health, LinkedIn visibility, and international opportunities with a practical plan that feels aligned, not overwhelming."
const HERO_TRUST_LINE =
  "Because nursing is not one path \u2014 it\u2019s a prism."
const CTA_HEADING = "Get practical career insights for modern nurses"
const CTA_SUBTEXT = "Actionable guidance. No noise."

const HeroSection = vi.fn(() => null)
const CtaSection = vi.fn(() => null)
const AboutPreviewSection = vi.fn(() => null)
const PricingPreviewSection = vi.fn(() => null)
const ServicesSection = vi.fn(() => null)
const TestimonialsSection = vi.fn(() => null)

const getPublicPageSections = vi.fn()
const getPublicPricingCategories = vi.fn()
const getPublicSiteSettings = vi.fn()
const resolvePublicSection = vi.fn()
const resolvePublicSetting = vi.fn()

vi.mock("server-only", () => ({}))

vi.mock("@/components/sections/about-preview-section", () => ({
  AboutPreviewSection,
}))

vi.mock("@/components/sections/cta-section", () => ({
  CtaSection,
}))

vi.mock("@/components/sections/hero-section", () => ({
  HeroSection,
}))

vi.mock("@/components/sections/pricing-preview-section", () => ({
  PricingPreviewSection,
}))

vi.mock("@/components/sections/services-section", () => ({
  ServicesSection,
}))

vi.mock("@/components/sections/testimonials-section", () => ({
  TestimonialsSection,
}))

vi.mock("@/lib/cms/public-content", () => ({
  getPublicPageSections,
  getPublicPricingCategories,
  getPublicSiteSettings,
  resolvePublicSection,
  resolvePublicSetting,
}))

describe("HomePage", () => {
  beforeEach(() => {
    vi.resetModules()

    HeroSection.mockReset()
    CtaSection.mockReset()
    AboutPreviewSection.mockReset()
    PricingPreviewSection.mockReset()
    ServicesSection.mockReset()
    TestimonialsSection.mockReset()

    getPublicPageSections.mockResolvedValue([])
    getPublicPricingCategories.mockResolvedValue([])
    getPublicSiteSettings.mockResolvedValue([])
    resolvePublicSection.mockImplementation((_sections, _key, fallback) => fallback)
    resolvePublicSetting.mockImplementation((_settings, _key, fallback) => fallback)
  })

  it("passes the exact homepage hero and CTA copy to the public sections", async () => {
    const { default: HomePage } = await import("@/app/page")

    const page = await HomePage()
    renderToStaticMarkup(page)

    const heroProps = HeroSection.mock.calls[0]?.[0]
    const ctaProps = CtaSection.mock.calls[0]?.[0]

    expect(heroProps.badge).toBe("Transforming Nursing Careers")
    expect(heroProps.title).toBe(HERO_HEADLINE)
    expect(heroProps.body).toBe(HERO_SUBHEADLINE)
    expect(heroProps.trustLine).toBe(HERO_TRUST_LINE)
    expect(heroProps.primaryCta.label).toBe("Start Your Nurse Pivot")
    expect(heroProps.secondaryCta.label).toBe(
      "Book a Career Consultation \u2192"
    )

    expect(ctaProps.variant).toBe("homepage")
    expect(ctaProps.title).toBe(CTA_HEADING)
    expect(ctaProps.content).toBe(CTA_SUBTEXT)
    expect(ctaProps.primaryCta.label).toBe("Start Your Nurse Pivot")
  })
})
