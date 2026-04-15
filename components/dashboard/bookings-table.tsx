"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import type { Booking, BookingStatus } from "@/types/booking"

type BookingsTableProps = {
  bookings: Booking[]
}

const BOOKING_STATUS_OPTIONS: BookingStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
]

function formatDateTime(value: string | null) {
  if (!value) {
    return "Not scheduled"
  }

  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function toInputDateTime(value: string | null) {
  if (!value) {
    return ""
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60_000)
  return localDate.toISOString().slice(0, 16)
}

function fromInputDateTime(value: string) {
  if (!value) {
    return null
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

export function BookingsTable({ bookings }: BookingsTableProps) {
  const router = useRouter()
  const [rows, setRows] = useState(bookings)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setRows(bookings)
  }, [bookings])

  const sortedRows = useMemo(
    () =>
      [...rows].sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      ),
    [rows]
  )

  function updateRow(id: string, updates: Partial<Booking>) {
    setRows((current) =>
      current.map((booking) =>
        booking.id === id ? { ...booking, ...updates } : booking
      )
    )
  }

  async function saveBooking(booking: Booking) {
    setSavingId(booking.id)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: booking.status,
          assignedCoach: booking.assignedCoach,
          scheduledFor: booking.scheduledFor,
          notes: booking.notes,
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to save booking.")
      }

      router.refresh()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save booking."
      )
    } finally {
      setSavingId(null)
    }
  }

  if (sortedRows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/70 p-5 text-sm text-muted-foreground">
        No bookings yet. Consultation and strategy sessions will appear after user
        submissions.
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
                <th className="px-4 py-3 font-medium">Schedule</th>
                <th className="px-4 py-3 font-medium">Coach</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Save</th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((booking) => (
                <tr key={booking.id} className="border-t border-border/70">
                  <td className="px-4 py-3 align-top">
                    <p className="font-medium text-foreground">{booking.fullName}</p>
                    <p className="text-xs text-muted-foreground">{booking.email}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDateTime(booking.scheduledFor)}
                    </p>
                  </td>
                  <td className="px-4 py-3 align-top text-foreground/90">
                    {booking.intent}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <input
                      type="datetime-local"
                      value={toInputDateTime(booking.scheduledFor)}
                      onChange={(event) =>
                        updateRow(booking.id, {
                          scheduledFor: fromInputDateTime(event.target.value),
                        })
                      }
                      className="h-9 min-w-48 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  </td>
                  <td className="px-4 py-3 align-top">
                    <input
                      value={booking.assignedCoach ?? ""}
                      onChange={(event) =>
                        updateRow(booking.id, {
                          assignedCoach: event.target.value || null,
                        })
                      }
                      className="h-9 min-w-40 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  </td>
                  <td className="px-4 py-3 align-top">
                    <select
                      value={booking.status}
                      onChange={(event) =>
                        updateRow(booking.id, {
                          status: event.target.value as BookingStatus,
                        })
                      }
                      className="h-9 min-w-32 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {BOOKING_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => void saveBooking(booking)}
                      disabled={savingId === booking.id}
                    >
                      {savingId === booking.id ? "Saving..." : "Save"}
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
