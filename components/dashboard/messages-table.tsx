import type { ContactMessage } from "@/types/admin"

type MessagesTableProps = {
  messages: ContactMessage[]
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function MessagesTable({ messages }: MessagesTableProps) {
  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/70 p-5 text-sm text-muted-foreground">
        No contact messages yet. Submissions from the contact page will populate this
        inbox.
      </div>
    )
  }

  return (
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
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => (
              <tr key={message.id} className="border-t border-border/70">
                <td className="px-4 py-3 align-top">
                  <p className="font-medium text-foreground">{message.fullName}</p>
                  <p className="text-xs text-muted-foreground">{message.email}</p>
                </td>
                <td className="px-4 py-3 align-top text-foreground/90">
                  {message.subject ?? "General inquiry"}
                </td>
                <td className="max-w-md px-4 py-3 align-top text-foreground/80">
                  <p className="line-clamp-2">{message.message}</p>
                </td>
                <td className="px-4 py-3 align-top">
                  <span className="inline-flex rounded-full border border-border bg-background px-2 py-0.5 text-xs">
                    {message.status}
                  </span>
                </td>
                <td className="px-4 py-3 align-top text-foreground/80">
                  {formatDate(message.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
