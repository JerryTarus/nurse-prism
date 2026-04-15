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
      "Transforming Nursing Careers: Find Clarity, Transition Beyond the Bedside, and Build Aligned Roles in Remote, Tech, and International Spaces",
    content:
      "Through coaching, digital health insights, and LinkedIn strategy, I help nurses move from feeling stuck to building flexible, purpose-driven careers beyond traditional roles - whether in remote work, healthcare technology, or global opportunities.",
  })
  const heroNote = resolvePublicSection(sections, "hero-note", {
    title: "",
    content: "Because nursing is not one path - it's a prism.",
  })
  const services = resolvePublicSection(sections, "services", {
    title: "Practical support for every stage of your nurse pivot",
    content:
      "Choose focused coaching for clarity, LinkedIn strategy, remote roles, global opportunities, and confident career decisions.",
  })
  const aboutPreview = resolvePublicSection(sections, "about-preview", {
    title: "Built from a real nursing journey across Kenya, Qatar, and beyond",
    content:
      "Nurse Prism was shaped by lived nursing experience, international practice, reflection, and the realization that many talented nurses need more than relocation advice - they need help reimagining what their careers can become.\n\nThat is why the platform now supports nurses exploring global mobility, digital health, remote work, LinkedIn visibility, and aligned growth beyond one narrow path.",
  })
  const pricingPreview = resolvePublicSection(sections, "pricing-preview", {
    title: "Choose the support level that matches your transition pace",
    content:
      "Transparent pricing with clear outcomes. The Professional Plan is our most selected option for balanced depth, visibility, and momentum.",
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
          "Career Coaching for Nurses"
        )}
        title={hero.title}
        body={hero.content}
        note={heroNote.content}
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
            SITE_CONFIG.consultationHref
          ),
        }}
        secondaryCta={{
          label: resolvePublicSetting(
            settings,
            "hero.secondary_cta_label",
            "Explore Program"
          ),
          href: resolvePublicSetting(
            settings,
            "hero.secondary_cta_href",
            "/program"
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
