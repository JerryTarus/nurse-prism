"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { PackageConfig } from "@/types/admin"

type PricingConfigTableProps = {
  packages: PackageConfig[]
}

function formatKes(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value)
}

export function PricingConfigTable({ packages }: PricingConfigTableProps) {
  const router = useRouter()
  const [rows, setRows] = useState(packages)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setRows(packages)
  }, [packages])

  function updateRow(id: string, updates: Partial<PackageConfig>) {
    setRows((current) =>
      current.map((pkg) => (pkg.id === id ? { ...pkg, ...updates } : pkg))
    )
  }

  async function savePackage(pkg: PackageConfig) {
    setSavingId(pkg.id)
    setMessage(null)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/admin/packages/${pkg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pkg.name,
          basePriceKes: pkg.basePriceKes,
          isActive: pkg.isActive,
        }),
      })

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to save package.")
      }

      setMessage(`Saved ${pkg.name}.`)
      router.refresh()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save package."
      )
    } finally {
      setSavingId(null)
    }
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/70 p-5 text-sm text-muted-foreground">
        Pricing packages are not available yet. Run migrations to start managing
        pricing from CMS.
      </div>
    )
  }

  return (
    <div className="space-y-3">
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
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/95">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Package</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price (KES)</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Save</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((pkg) => (
                <tr key={pkg.id} className="border-t border-border/70">
                  <td className="min-w-56 px-4 py-3 align-top">
                    <Input
                      value={pkg.name}
                      onChange={(event) =>
                        updateRow(pkg.id, { name: event.target.value })
                      }
                      className="h-9"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">{pkg.packageKey}</p>
                  </td>
                  <td className="px-4 py-3 align-top text-foreground/90">
                    {pkg.category}
                  </td>
                  <td className="min-w-44 px-4 py-3 align-top">
                    <Input
                      type="number"
                      min={0}
                      value={pkg.basePriceKes}
                      onChange={(event) =>
                        updateRow(pkg.id, {
                          basePriceKes: Number(event.target.value || 0),
                        })
                      }
                      className="h-9"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatKes(pkg.basePriceKes)}
                    </p>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <label className="inline-flex items-center gap-2 text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={pkg.isActive}
                        onChange={(event) =>
                          updateRow(pkg.id, { isActive: event.target.checked })
                        }
                        className="size-4 rounded border-border"
                      />
                      {pkg.isActive ? "active" : "inactive"}
                    </label>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => void savePackage(pkg)}
                      disabled={savingId === pkg.id}
                    >
                      {savingId === pkg.id ? "Saving..." : "Save"}
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
