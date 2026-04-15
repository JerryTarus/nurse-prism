import { GoogleAnalytics } from "@/components/analytics/google-analytics"
import type { Metadata } from "next"

import { SiteLayoutGate } from "@/components/layout/site-layout-gate"
import { JsonLd } from "@/components/shared/json-ld"
import { SITE_CONFIG } from "@/lib/constants"
import { createPageMetadata, getMetadataBase } from "@/lib/seo/metadata"
import {
  createOrganizationSchema,
  createWebsiteSchema,
} from "@/lib/seo/structured-data"

import "./globals.css"

const metadataBase = getMetadataBase()
const rootMetadata = createPageMetadata({
  title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  path: "/",
  keywords: [
    "Nurse Prism",
    "nurse career pivot",
    "remote nursing careers",
    "international nurse coaching",
    "digital health transition",
    "healthcare career coaching",
  ],
})

export const metadata: Metadata = {
  ...rootMetadata,
  metadataBase,
  applicationName: SITE_CONFIG.name,
  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className="h-full scroll-smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <JsonLd data={createOrganizationSchema()} />
        <JsonLd data={createWebsiteSchema()} />
        <GoogleAnalytics />
        <SiteLayoutGate>{children}</SiteLayoutGate>
      </body>
    </html>
  )
}
