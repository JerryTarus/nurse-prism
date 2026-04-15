"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { AppearanceSetting, SiteSetting } from "@/types/admin"

type SettingsListProps = {
  settings: SiteSetting[] | AppearanceSetting[]
  emptyLabel: string
  editable?: boolean
  keyPrefix?: string
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function SettingsList({
  settings,
  emptyLabel,
  editable = false,
  keyPrefix = "",
}: SettingsListProps) {
  const router = useRouter()
  const [rows, setRows] = useState(settings)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [newSetting, setNewSetting] = useState({
    key: keyPrefix,
    value: "",
  })

  useEffect(() => {
    setRows(settings)
  }, [settings])

  function updateRow(key: string, value: string) {
    setRows((current) =>
      current.map((setting) =>
        setting.key === key ? { ...setting, value } : setting
      )
    )
  }

  async function saveSetting(key: string, value: string) {
    setSavingKey(key)
    setMessage(null)
    setErrorMessage(null)

    try {
      const response = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to save setting.")
      }

      setMessage(`Saved ${key}.`)
      router.refresh()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save setting."
      )
    } finally {
      setSavingKey(null)
    }
  }

  async function createSetting() {
    setCreating(true)
    setMessage(null)
    setErrorMessage(null)

    try {
      const response = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSetting),
      })

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to create setting.")
      }

      setMessage(`Saved ${newSetting.key}.`)
      setNewSetting({ key: keyPrefix, value: "" })
      router.refresh()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create setting."
      )
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-4">
      {editable ? (
        <div className="rounded-2xl border border-border/80 bg-card/95 p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_auto]">
            <Input
              value={newSetting.key}
              onChange={(event) =>
                setNewSetting((current) => ({ ...current, key: event.target.value }))
              }
              placeholder="Setting key"
              className="h-10"
            />
            <Input
              value={newSetting.value}
              onChange={(event) =>
                setNewSetting((current) => ({
                  ...current,
                  value: event.target.value,
                }))
              }
              placeholder="Setting value"
              className="h-10"
            />
            <Button type="button" onClick={() => void createSetting()} disabled={creating}>
              {creating ? "Saving..." : "Add Setting"}
            </Button>
          </div>
        </div>
      ) : null}

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

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/70 p-5 text-sm text-muted-foreground">
          {emptyLabel}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/95">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Key</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  {editable ? (
                    <th className="px-4 py-3 font-medium">Save</th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {rows.map((setting) => (
                  <tr key={setting.key} className="border-t border-border/70">
                    <td className="px-4 py-3 align-top font-mono text-xs text-foreground">
                      {setting.key}
                    </td>
                    <td className="min-w-80 px-4 py-3 align-top text-foreground/85">
                      {editable ? (
                        <Textarea
                          rows={3}
                          value={setting.value}
                          onChange={(event) =>
                            updateRow(setting.key, event.target.value)
                          }
                        />
                      ) : (
                        <p className="line-clamp-2">{setting.value}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-foreground/75">
                      {formatDate(setting.updatedAt)}
                    </td>
                    {editable ? (
                      <td className="px-4 py-3 align-top">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => void saveSetting(setting.key, setting.value)}
                          disabled={savingKey === setting.key}
                        >
                          {savingKey === setting.key ? "Saving..." : "Save"}
                        </Button>
                      </td>
                    ) : null}
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
