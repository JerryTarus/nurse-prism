"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import type { ContactMessage, ContactMessageStatus } from "@/types/admin"

type MessagesTableProps = {
  messages: ContactMessage[]
}

const MESSAGE_STATUS_OPTIONS: ContactMessageStatus[] = [
  "new",
  "in_progress",
  "replied",
  "closed",
]

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function MessagesTable({ messages }: MessagesTableProps) {
  const router = useRouter()
  const [rows, setRows] = useState(messages)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setRows(messages)
  }, [messages])

  const sortedRows = useMemo(
    () =>
      [...rows].sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      ),
    [rows]
  )

  function updateRow(id: string, updates: Partial<ContactMessage>) {
    setRows((current) =>
      current.map((message) =>
        message.id === id ? { ...message, ...updates } : message
      )
    )
  }

  async function saveMessage(message: ContactMessage) {
    setSavingId(message.id)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/admin/messages/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: message.status,
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to save message.")
      }

      router.refresh()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save message."
      )
    } finally {
      setSavingId(null)
    }
  }

  if (sortedRows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/70 p-5 text-sm text-muted-foreground">
        No contact messages yet. Submissions from the contact page will populate this
        inbox.
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
                <th className="px-4 py-3 font-medium">Sender</th>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Received</th>
                <th className="px-4 py-3 font-medium">Save</th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((message) => (
                <tr key={message.id} className="border-t border-border/70">
                  <td className="px-4 py-3 align-top">
                    <p className="font-medium text-foreground">{message.fullName}</p>
                    <p className="text-xs text-muted-foreground">{message.email}</p>
                  </td>
                  <td className="px-4 py-3 align-top text-foreground/90">
                    {message.subject ?? "General inquiry"}
                  </td>
                  <td className="max-w-md px-4 py-3 align-top text-foreground/80">
                    <p className="whitespace-pre-wrap">{message.message}</p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <select
                      value={message.status}
                      onChange={(event) =>
                        updateRow(message.id, {
                          status: event.target.value as ContactMessageStatus,
                        })
                      }
                      className="h-9 min-w-32 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {MESSAGE_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 align-top text-foreground/80">
                    {formatDate(message.createdAt)}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => void saveMessage(message)}
                      disabled={savingId === message.id}
                    >
                      {savingId === message.id ? "Saving..." : "Save"}
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
