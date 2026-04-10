import type { AppearanceSetting, SiteSetting } from "@/types/admin"

type SettingsListProps = {
  settings: SiteSetting[] | AppearanceSetting[]
  emptyLabel: string
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function SettingsList({ settings, emptyLabel }: SettingsListProps) {
  if (settings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/70 p-5 text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/95">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Key</th>
              <th className="px-4 py-3 font-medium">Value</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((setting) => (
              <tr key={setting.key} className="border-t border-border/70">
                <td className="px-4 py-3 align-top font-mono text-xs text-foreground">
                  {setting.key}
                </td>
                <td className="max-w-xl px-4 py-3 align-top text-foreground/85">
                  <p className="line-clamp-2">{setting.value}</p>
                </td>
                <td className="px-4 py-3 align-top text-foreground/75">
                  {formatDate(setting.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
