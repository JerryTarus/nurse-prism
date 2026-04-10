import type { EditablePageSection } from "@/types/admin"

type PageSectionsTableProps = {
  sections: EditablePageSection[]
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function PageSectionsTable({ sections }: PageSectionsTableProps) {
  if (sections.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/70 p-5 text-sm text-muted-foreground">
        No editable page sections yet. Once the `page_sections` table is migrated,
        content blocks will be managed from this panel.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/95">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Page</th>
              <th className="px-4 py-3 font-medium">Section</th>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Preview</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <tr key={section.id} className="border-t border-border/70">
                <td className="px-4 py-3 align-top text-foreground/90">{section.pageKey}</td>
                <td className="px-4 py-3 align-top text-foreground/90">{section.sectionKey}</td>
                <td className="px-4 py-3 align-top font-medium text-foreground">
                  {section.title}
                </td>
                <td className="max-w-md px-4 py-3 align-top text-foreground/80">
                  <p className="line-clamp-2">{section.content}</p>
                </td>
                <td className="px-4 py-3 align-top text-foreground/80">
                  {formatDate(section.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
