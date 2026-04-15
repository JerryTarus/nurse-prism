"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { trackEvent } from "@/lib/analytics/google"

type ButtonProps = Parameters<typeof Button>[0]

type TrackedButtonLinkProps = {
  href: string
  eventName: string
  eventParams?: Record<string, string | number | boolean | null | undefined>
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  className?: string
  children: React.ReactNode
}

export function TrackedButtonLink({
  href,
  eventName,
  eventParams,
  variant,
  size,
  className,
  children,
}: TrackedButtonLinkProps) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href={href} onClick={() => trackEvent(eventName, eventParams)}>
        {children}
      </Link>
    </Button>
  )
}
