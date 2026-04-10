import { AlertTriangle } from "lucide-react"

type CmsReadinessBannerProps = {
  cmsReady: boolean
}

export function CmsReadinessBanner({ cmsReady }: CmsReadinessBannerProps) {
  if (cmsReady) {
    return null
  }

  return (
    <div className="rounded-2xl border border-[color:rgb(201_138_19/0.35)] bg-[color:rgb(201_138_19/0.08)] p-4 text-sm text-[color:var(--np-warning)]">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        <p>
          CMS tables are not fully available yet. The dashboard remains usable, but
          persistent data requires Supabase migrations and RLS policies from Phase 6.
        </p>
      </div>
    </div>
  )
}
