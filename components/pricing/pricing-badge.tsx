import { cn } from "@/lib/utils"

type PricingBadgeProps = {
  children: string
  className?: string
}

export function PricingBadge({ children, className }: PricingBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide text-primary uppercase",
        className
      )}
    >
      {children}
    </span>
  )
}
