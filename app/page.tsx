import type { Metadata } from "next"

import { AboutPreviewSection } from "@/components/sections/about-preview-section"
import { CtaSection } from "@/components/sections/cta-section"
import { HeroSection } from "@/components/sections/hero-section"
import { PricingPreviewSection } from "@/components/sections/pricing-preview-section"
import { ServicesSection } from "@/components/sections/services-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import {
  getPublicPageSections,
  getPublicPricingCategories,
  getPublicSiteSettings,
  resolvePublicSection,
  resolvePublicSetting,
} from "@/lib/cms/public-content"
import { SITE_CONFIG } from "@/lib/constants"
import { createManagedPageMetadata } from "@/lib/seo/metadata"

const HOME_HERO_HEADLINE =
  "Find clarity. Move beyond the bedside. Build a career that fits your life."
const HOME_HERO_SUBHEADLINE =
  "Nurse Prism helps nurses transition into remote roles, digital health, LinkedIn visibility, and international opportunities with a practical plan that feels aligned, not overwhelming."
const HOME_HERO_TRUST_LINE =
  "Because nursing is not one path \u2014 it\u2019s a prism."
const HOME_CTA_HEADING = "Get practical career insights for modern nurses"
const HOME_CTA_SUBTEXT = "Actionable guidance. No noise."

export async function generateMetadata(): Promise<Metadata> {
  return createManagedPageMetadata({
    pageKey: "home",
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description:
      "Nurse Prism helps nurses find clarity, transition beyond the bedside, and build aligned roles across remote work, healthcare technology, and global opportunities.",
    path: "/",
    keywords: [
      "Nurse Prism",
      "nurse career pivot",
      "remote nursing careers",
      "digital health coaching",
      "nurse career coaching",
      "international nursing opportunities",
    ],
  })
}

export default async function HomePage() {
  const [sections, pricingCategories, settings] = await Promise.all([
    getPublicPageSections("home"),
    getPublicPricingCategories(),
    getPublicSiteSettings(),
  ])

  const services = resolvePublicSection(sections, "services", {
    title: "Career support designed for clarity, visibility, and aligned transition",
    content:
      "Choose focused support for career clarity, LinkedIn positioning, remote work transitions, digital health exploration, international pathways, and the Nurse Prism Career Program.",
  })
  const aboutPreview = resolvePublicSection(sections, "about-preview", {
    title: "Built from real nursing experience and a broader vision for what comes next",
    content:
      "Nurse Prism was shaped by lived nursing experience, international practice, reflection, and the realization that many talented nurses need more than relocation advice. They need support reimagining what their careers can become.\n\nThat is why the platform now helps nurses pursue remote roles, digital health opportunities, stronger LinkedIn visibility, global mobility, and aligned growth beyond one narrow path.",
  })
  const pricingPreview = resolvePublicSection(sections, "pricing-preview", {
    title: "Choose the support level that matches your transition pace",
    content:
      "Transparent USD pricing with clear outcomes. The Professional Pivot is our most selected option for balanced depth, visibility, and momentum.",
  })

  return (
    <>
      <HeroSection
        badge="Transforming Nursing Careers"
        title={HOME_HERO_HEADLINE}
        body={HOME_HERO_SUBHEADLINE}
        trustLine={HOME_HERO_TRUST_LINE}
        imageSrc={resolvePublicSetting(
          settings,
          "appearance.hero",
          "/images/hero/nurse-prism-hero.webp"
        )}
        primaryCta={{
          label: "Start Your Nurse Pivot",
          href: resolvePublicSetting(
            settings,
            "hero.primary_cta_href",
            SITE_CONFIG.freeCallHref
          ),
        }}
        secondaryCta={{
          label: "Book a Career Consultation \u2192",
          href: resolvePublicSetting(
            settings,
            "hero.secondary_cta_href",
            SITE_CONFIG.consultationHref
          ),
        }}
      />
      <ServicesSection heading={services} />
      <AboutPreviewSection
        title={aboutPreview.title}
        content={aboutPreview.content}
        imageSrc={resolvePublicSetting(
          settings,
          "appearance.founder",
          "/images/about/nurse-prism-founder.webp"
        )}
      />
      <PricingPreviewSection
        pricingCategories={pricingCategories}
        heading={pricingPreview}
      />
      <TestimonialsSection />
      <CtaSection
        variant="homepage"
        title={HOME_CTA_HEADING}
        content={HOME_CTA_SUBTEXT}
        primaryCta={{
          label: resolvePublicSetting(
            settings,
            "cta.primary_label",
            "Start Your Nurse Pivot"
          ),
          href: resolvePublicSetting(
            settings,
            "cta.primary_href",
            SITE_CONFIG.consultationHref
          ),
        }}
      />
    </>
  )
}
