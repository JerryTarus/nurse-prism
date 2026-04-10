import type { Metadata } from "next"

import { MfaVerificationForm } from "@/components/forms/mfa-verification-form"
import { sanitizeRedirectPath } from "@/lib/auth/redirect"
import { createPageMetadata } from "@/lib/seo/metadata"

type MfaPageProps = {
  searchParams: Promise<{
    next?: string
  }>
}

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Admin MFA",
    description:
      "Multi-factor authentication for Nurse Prism administrators to protect sensitive bookings and candidate data.",
    path: "/auth/mfa",
  }),
  robots: {
    index: false,
    follow: false,
  },
}

export default async function MfaPage({ searchParams }: MfaPageProps) {
  const params = await searchParams
  const nextPath = sanitizeRedirectPath(params.next, "/admin")

  return (
    <section className="np-container flex min-h-[calc(100vh-6rem)] items-center justify-center py-10">
      <MfaVerificationForm nextPath={nextPath} />
    </section>
  )
}
