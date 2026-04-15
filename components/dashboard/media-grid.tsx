"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { MediaFile } from "@/types/admin"

type MediaGridProps = {
  files: MediaFile[]
}

function formatBytes(value: number | null) {
  if (!value || value <= 0) {
    return "Unknown size"
  }

  if (value < 1024) {
    return `${value} B`
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`
}

export function MediaGrid({ files }: MediaGridProps) {
  const router = useRouter()
  const [rows, setRows] = useState(files)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setRows(files)
  }, [files])

  async function handleUpload(file: File) {
    setUploading(true)
    setMessage(null)
    setErrorMessage(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "library")

      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      })

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to upload media.")
      }

      setMessage("Asset uploaded successfully.")
      router.refresh()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to upload media."
      )
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(file: MediaFile) {
    setDeletingId(file.id)
    setMessage(null)
    setErrorMessage(null)

    try {
      const response = await fetch(`/api/admin/media/${file.id}`, {
        method: "DELETE",
      })

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null

      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to delete media.")
      }

      setRows((current) => current.filter((entry) => entry.id !== file.id))
      setMessage("Asset deleted successfully.")
      router.refresh()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to delete media."
      )
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/80 bg-card/95 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-foreground">Upload media</p>
            <p className="text-sm text-muted-foreground">
              Add JPG, PNG, WEBP, or AVIF assets to the shared media library.
            </p>
          </div>
          <label
            htmlFor="media-upload-input"
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {uploading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <ImagePlus className="size-4" />
            )}
            {uploading ? "Uploading..." : "Upload Asset"}
          </label>
          <input
            id="media-upload-input"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            className="sr-only"
            onChange={(event) => {
              const selected = event.target.files?.[0]
              if (!selected) {
                return
              }

              void handleUpload(selected)
              event.target.value = ""
            }}
          />
        </div>
        {message ? (
          <p className="mt-3 text-sm text-muted-foreground">{message}</p>
        ) : null}
        {errorMessage ? (
          <p className="mt-3 text-sm text-destructive">{errorMessage}</p>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/70 p-5 text-sm text-muted-foreground">
          Media library is empty. Upload branded images and icons to start using
          them across the site.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((file) => (
            <article
              key={file.id}
              className="rounded-2xl border border-border/80 bg-card/95 p-4 shadow-[0_14px_35px_-30px_rgba(15,10,12,0.55)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted/30">
                {file.publicUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={file.publicUrl}
                    alt={file.altText ?? file.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    Preview unavailable
                  </div>
                )}
              </div>
              <h3 className="mt-3 line-clamp-1 text-sm font-medium text-foreground">
                {file.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {file.mimeType ?? "Unknown type"} | {formatBytes(file.sizeBytes)}
              </p>
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                {file.path}
              </p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <a
                  href={file.publicUrl ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                >
                  Open asset
                </a>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void handleDelete(file)}
                  disabled={deletingId === file.id}
                >
                  <Trash2 className="size-4" />
                  {deletingId === file.id ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
