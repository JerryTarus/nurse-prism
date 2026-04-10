import type { ReactNode } from "react"

import { BadgeCheck, ShieldAlert } from "lucide-react"

import { cn } from "@/lib/utils"

type DashboardHeaderProps = {
  title: string
  description: string
  isSuperAdmin: boolean
  cmsReady: boolean
  actions?: ReactNode
  className?: string
}

export function DashboardHeader({
  title,
  description,
  isSuperAdmin,
  cmsReady,
  actions,
  className,
}: DashboardHeaderProps) {
  return (
    <header
      className={cn(
        "rounded-2xl border border-border/80 bg-card/95 p-5 shadow-[0_18px_45px_-35px_rgba(15,10,12,0.55)] sm:p-6",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/70 px-2.5 py-1 text-xs text-muted-foreground">
              {isSuperAdmin ? <BadgeCheck className="size-3.5" /> : <ShieldAlert className="size-3.5" />}
              {isSuperAdmin ? "Super Admin" : "Admin"}
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs",
                cmsReady
                  ? "border-[color:rgb(31_157_104/0.32)] bg-[color:rgb(31_157_104/0.08)] text-[color:var(--np-success)]"
                  : "border-[color:rgb(201_138_19/0.32)] bg-[color:rgb(201_138_19/0.08)] text-[color:var(--np-warning)]"
              )}
            >
              {cmsReady
                ? "CMS data source connected"
                : "CMS tables pending migration or policy setup"}
            </span>
          </div>
        </div>

        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </header>
  )
}
