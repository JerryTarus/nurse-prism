import type { Metadata } from "next"

import { AboutPreviewSection } from "@/components/sections/about-preview-section"
import { CtaSection } from "@/components/sections/cta-section"
import { HeroSection } from "@/components/sections/hero-section"
import { PricingPreviewSection } from "@/components/sections/pricing-preview-section"
import { ServicesSection } from "@/components/sections/services-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { SITE_CONFIG } from "@/lib/constants"
import { createPageMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = createPageMetadata({
  title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
  description:
    "Nurse Prism is a premium healthcare career coaching platform helping internationally trained nurses secure confident Gulf career transitions.",
  path: "/",
  keywords: [
    "Nurse Prism",
    "Gulf nursing opportunities",
    "nurse career coaching",
    "international nursing relocation",
  ],
})

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <AboutPreviewSection />
      <PricingPreviewSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  )
}
