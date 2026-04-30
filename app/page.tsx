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

  const hero = resolvePublicSection(sections, "hero", {
    title:
      "Find Clarity, Transition Beyond the Bedside, and Build Aligned Roles in Remote, Tech, and International Spaces",
    content:
      "Through coaching, digital health insights, LinkedIn strategy, and international career guidance, Nurse Prism helps nurses move from feeling stuck to building flexible, purpose-driven careers with confidence.",
  })
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
  const cta = resolvePublicSection(sections, "cta", {
    title: "Ready to build a nursing career that fits who you are now?",
    content:
      "Book a consultation and get a practical roadmap tailored to your target path, timeline, and professional goals across remote, digital, international, and evolving healthcare roles.",
  })

  return (
    <>
      <HeroSection
        badge={resolvePublicSetting(
          settings,
          "hero.badge",
          "Transforming Nursing Careers"
        )}
        title={hero.title}
        body={hero.content}
        imageSrc={resolvePublicSetting(
          settings,
          "appearance.hero",
          "/images/hero/nurse-prism-hero.webp"
        )}
        primaryCta={{
          label: resolvePublicSetting(
            settings,
            "hero.primary_cta_label",
            "Start Your Nurse Pivot"
          ),
          href: resolvePublicSetting(
            settings,
            "hero.primary_cta_href",
            SITE_CONFIG.freeCallHref
          ),
        }}
        secondaryCta={{
          label: resolvePublicSetting(
            settings,
            "hero.secondary_cta_label",
            "Book a Career Consultation"
          ),
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
        title={cta.title}
        content={cta.content}
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
