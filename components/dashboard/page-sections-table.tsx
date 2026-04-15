"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  const router = useRouter()
  const [rows, setRows] = useState(sections)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [newSection, setNewSection] = useState({
    pageKey: "",
    sectionKey: "",
    title: "",
    content: "",
  })

  useEffect(() => {
    setRows(sections)
  }, [sections])

  const sortedRows = useMemo(
    () =>
      [...rows].sort((left, right) => {
        if (left.pageKey === right.pageKey) {
          return left.sectionKey.localeCompare(right.sectionKey)
        }

        return left.pageKey.localeCompare(right.pageKey)
      }),
    [rows]
  )

  function updateRow(id: string, updates: Partial<EditablePageSection>) {
    setRows((current) =>
      current.map((section) =>
        section.id === id ? { ...section, ...updates } : section
      )
    )
  }

  async function saveSection(section: EditablePageSection) {
    setSavingId(section.id)
    setErrorMessage(null)
    setMessage(null)

    try {
      const response = await fetch(`/api/admin/page-sections/${section.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: section.title,
          content: section.content,
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to save section.")
      }

      setMessage("Section saved.")
      router.refresh()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save section."
      )
    } finally {
      setSavingId(null)
    }
  }

  async function createSection() {
    setCreating(true)
    setErrorMessage(null)
    setMessage(null)

    try {
      const response = await fetch("/api/admin/page-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSection),
      })

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to create section.")
      }

      setMessage("Section created.")
      setNewSection({
        pageKey: "",
        sectionKey: "",
        title: "",
        content: "",
      })
      router.refresh()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create section."
      )
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/80 bg-card/95 p-4">
        <div className="grid gap-3 lg:grid-cols-4">
          <Input
            placeholder="Page key"
            value={newSection.pageKey}
            onChange={(event) =>
              setNewSection((current) => ({
                ...current,
                pageKey: event.target.value,
              }))
            }
            className="h-10"
          />
          <Input
            placeholder="Section key"
            value={newSection.sectionKey}
            onChange={(event) =>
              setNewSection((current) => ({
                ...current,
                sectionKey: event.target.value,
              }))
            }
            className="h-10"
          />
          <Input
            placeholder="Section title"
            value={newSection.title}
            onChange={(event) =>
              setNewSection((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            className="h-10"
          />
          <Button type="button" onClick={() => void createSection()} disabled={creating}>
            {creating ? "Creating..." : "Add Section"}
          </Button>
        </div>
        <Textarea
          rows={4}
          value={newSection.content}
          onChange={(event) =>
            setNewSection((current) => ({
              ...current,
              content: event.target.value,
            }))
          }
          placeholder="Section content"
          className="mt-3"
        />
      </div>

      {message ? (
        <p className="rounded-xl border border-border bg-card/90 px-4 py-3 text-sm text-muted-foreground">
          {message}
        </p>
      ) : null}
      {errorMessage ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}

      {sortedRows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/70 p-5 text-sm text-muted-foreground">
          No editable page sections yet. Add your first section above to start
          managing CMS content from this panel.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/95">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Page</th>
                  <th className="px-4 py-3 font-medium">Section</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Content</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  <th className="px-4 py-3 font-medium">Save</th>
                </tr>
              </thead>
              <tbody>
                {sortedRows.map((section) => (
                  <tr key={section.id} className="border-t border-border/70">
                    <td className="px-4 py-3 align-top text-foreground/90">
                      {section.pageKey}
                    </td>
                    <td className="px-4 py-3 align-top text-foreground/90">
                      {section.sectionKey}
                    </td>
                    <td className="min-w-56 px-4 py-3 align-top">
                      <Input
                        value={section.title}
                        onChange={(event) =>
                          updateRow(section.id, { title: event.target.value })
                        }
                        className="h-9"
                      />
                    </td>
                    <td className="min-w-80 px-4 py-3 align-top">
                      <Textarea
                        rows={3}
                        value={section.content}
                        onChange={(event) =>
                          updateRow(section.id, { content: event.target.value })
                        }
                      />
                    </td>
                    <td className="px-4 py-3 align-top text-foreground/80">
                      {formatDate(section.updatedAt)}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => void saveSection(section)}
                        disabled={savingId === section.id}
                      >
                        {savingId === section.id ? "Saving..." : "Save"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
