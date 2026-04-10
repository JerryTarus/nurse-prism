import type { Lead } from "@/types/lead"

type LeadsTableProps = {
  leads: Lead[]
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function LeadsTable({ leads }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/70 p-5 text-sm text-muted-foreground">
        No leads yet. New consultation and package inquiries will appear here.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/95">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Candidate</th>
              <th className="px-4 py-3 font-medium">Intent</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-border/70">
                <td className="px-4 py-3 align-top">
                  <p className="font-medium text-foreground">{lead.fullName}</p>
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                  {lead.phone ? (
                    <p className="text-xs text-muted-foreground">{lead.phone}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 align-top text-foreground/90">{lead.intent}</td>
                <td className="px-4 py-3 align-top">
                  <span className="inline-flex rounded-full border border-border bg-background px-2 py-0.5 text-xs">
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-3 align-top text-foreground/90">{lead.source}</td>
                <td className="px-4 py-3 align-top text-foreground/80">
                  {formatDate(lead.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
