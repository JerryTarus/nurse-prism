import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <section className="np-container py-16 sm:py-20">
      <p className="text-sm font-semibold tracking-wide text-primary uppercase">404</p>
      <h1 className="font-heading mt-2 text-3xl font-semibold text-foreground sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        The page you requested is unavailable. Use the home page to continue exploring Nurse Prism.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Back to Home</Link>
      </Button>
    </section>
  )
}
