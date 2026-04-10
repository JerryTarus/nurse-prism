import Link from "next/link"
import { CalendarCheck2 } from "lucide-react"

import { CONSULTATION_CTA } from "@/data/navigation"
import { Button } from "@/components/ui/button"

export function FloatingCta() {
  return (
    <div className="fixed inset-x-4 bottom-4 z-40 md:hidden">
      <Button
        asChild
        size="lg"
        className="h-11 w-full justify-center rounded-full shadow-[0_16px_28px_-16px_rgba(91,14,45,0.95)]"
      >
        <Link href={CONSULTATION_CTA.href}>
          <CalendarCheck2 className="size-4" />
          {CONSULTATION_CTA.label}
        </Link>
      </Button>
    </div>
  )
}
