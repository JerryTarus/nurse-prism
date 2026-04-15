"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import type { Lead, LeadStatus } from "@/types/lead"

type LeadsTableProps = {
  leads: Lead[]
}

const LEAD_STATUS_OPTIONS: LeadStatus[] = [
  "new",
  "qualified",
  "follow_up",
  "won",
  "lost",
]

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const router = useRouter()
  const [rows, setRows] = useState(leads)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setRows(leads)
  }, [leads])

  const sortedRows = useMemo(
    () =>
      [...rows].sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      ),
    [rows]
  )

  function updateRow(id: string, updates: Partial<Lead>) {
    setRows((current) =>
      current.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead))
    )
  }

  async function saveLead(lead: Lead) {
    setSavingId(lead.id)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: lead.status,
          notes: lead.notes,
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to save lead.")
      }

      router.refresh()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save lead."
      )
    } finally {
      setSavingId(null)
    }
  }

  if (sortedRows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/70 p-5 text-sm text-muted-foreground">
        No leads yet. New consultation and package inquiries will appear here.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {errorMessage ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/95">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Candidate</th>
                <th className="px-4 py-3 font-medium">Intent</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Notes</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Save</th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((lead) => (
                <tr key={lead.id} className="border-t border-border/70">
                  <td className="px-4 py-3 align-top">
                    <p className="font-medium text-foreground">{lead.fullName}</p>
                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                    {lead.phone ? (
                      <p className="text-xs text-muted-foreground">{lead.phone}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 align-top text-foreground/90">
                    {lead.intent}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <select
                      value={lead.status}
                      onChange={(event) =>
                        updateRow(lead.id, {
                          status: event.target.value as LeadStatus,
                        })
                      }
                      className="h-9 min-w-32 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {LEAD_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="min-w-56 px-4 py-3 align-top">
                    <textarea
                      rows={2}
                      value={lead.notes ?? ""}
                      onChange={(event) =>
                        updateRow(lead.id, { notes: event.target.value || null })
                      }
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  </td>
                  <td className="px-4 py-3 align-top text-foreground/90">
                    {lead.source}
                  </td>
                  <td className="px-4 py-3 align-top text-foreground/80">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => void saveLead(lead)}
                      disabled={savingId === lead.id}
                    >
                      {savingId === lead.id ? "Saving..." : "Save"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
