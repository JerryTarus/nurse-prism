import type { Metadata } from "next"

import { AuthLoginForm } from "@/components/forms/auth-login-form"
import { sanitizeRedirectPath } from "@/lib/auth/redirect"
import { createPageMetadata } from "@/lib/seo/metadata"

type LoginPageProps = {
  searchParams: Promise<{
    next?: string
    error?: string
    status?: string
  }>
}

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Admin Login",
    description:
      "Secure Google and email sign-in for authorized Nurse Prism dashboard administrators.",
    path: "/auth/login",
  }),
  robots: {
    index: false,
    follow: false,
  },
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams
  const nextPath = sanitizeRedirectPath(params.next, "/admin")

  return (
    <section className="np-container flex min-h-[calc(100vh-6rem)] items-center justify-center py-10">
      <AuthLoginForm
        nextPath={nextPath}
        error={params.error}
        status={params.status}
      />
    </section>
  )
}
