import type { Booking } from "@/types/booking"

type BookingsTableProps = {
  bookings: Booking[]
}

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

export function BookingsTable({ bookings }: BookingsTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/70 p-5 text-sm text-muted-foreground">
        No bookings yet. Consultation and strategy sessions will appear after user
        submissions.
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
              <th className="px-4 py-3 font-medium">Schedule</th>
              <th className="px-4 py-3 font-medium">Coach</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-border/70">
                <td className="px-4 py-3 align-top">
                  <p className="font-medium text-foreground">{booking.fullName}</p>
                  <p className="text-xs text-muted-foreground">{booking.email}</p>
                </td>
                <td className="px-4 py-3 align-top text-foreground/90">
                  {booking.intent}
                </td>
                <td className="px-4 py-3 align-top text-foreground/80">
                  {formatDateTime(booking.scheduledFor)}
                </td>
                <td className="px-4 py-3 align-top text-foreground/80">
                  {booking.assignedCoach ?? "Unassigned"}
                </td>
                <td className="px-4 py-3 align-top">
                  <span className="inline-flex rounded-full border border-border bg-background px-2 py-0.5 text-xs">
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
