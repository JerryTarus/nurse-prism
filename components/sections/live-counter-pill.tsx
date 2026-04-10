"use client"

import { Activity } from "lucide-react"

import { useLiveCounter } from "@/hooks/use-live-counter"

type LiveCounterPillProps = {
  className?: string
}

export function LiveCounterPill({ className }: LiveCounterPillProps) {
  const { formatted } = useLiveCounter({ base: 248, minIncrement: 1, maxIncrement: 2 })

  return (
    <p
      className={className}
      aria-live="polite"
      aria-label={`${formatted} nurses have engaged with Nurse Prism guidance this month`}
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        <Activity className="size-3.5" />
        {formatted}+ nurses guided this month
      </span>
    </p>
  )
}
