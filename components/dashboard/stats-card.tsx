import type { LucideIcon } from "lucide-react"

type StatsCardProps = {
  label: string
  value: string | number
  hint: string
  icon: LucideIcon
}

export function StatsCard({ label, value, hint, icon: Icon }: StatsCardProps) {
  return (
    <article className="rounded-2xl border border-border/80 bg-card/95 p-4 shadow-[0_14px_35px_-30px_rgba(15,10,12,0.55)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="size-4 text-primary" />
      </div>
      <p className="mt-2 font-heading text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </article>
  )
}
