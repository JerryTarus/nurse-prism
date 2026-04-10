"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { CalendarDays, ImagePlus, LoaderCircle } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import type { BlogPost, BlogPostStatus } from "@/types/blog"

type BlogEditorFormProps = {
  mode: "create" | "edit"
  postId?: string
  initialPost?: BlogPost | null
}

type SubmitState = "idle" | "saving" | "success" | "error"
type UploadState = "idle" | "uploading" | "success" | "error"

function parsePublishedDate(value: string | null | undefined) {
  if (!value) {
    return undefined
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

function parsePublishedTime(value: string | null | undefined) {
  if (!value) {
    return "09:00"
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return "09:00"
  }
  const hours = String(parsed.getHours()).padStart(2, "0")
  const minutes = String(parsed.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}

function combineDateAndTime(date: Date | undefined, time: string) {
  if (!date) {
    return null
  }

  const [hoursRaw, minutesRaw] = time.split(":")
  const hours = Number(hoursRaw)
  const minutes = Number(minutesRaw)
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null
  }

  const combined = new Date(date)
  combined.setHours(hours, minutes, 0, 0)
  return combined.toISOString()
}

async function readImage(file: File) {
  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image()
      nextImage.onload = () => resolve(nextImage)
      nextImage.onerror = reject
      nextImage.src = objectUrl
    })
    return image
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

async function resizeCoverImage(file: File) {
  const image = await readImage(file)
  const maxWidth = 1600
  const maxHeight = 1000
  const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1)

  const width = Math.max(1, Math.round(image.width * ratio))
  const height = Math.max(1, Math.round(image.height * ratio))

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Could not initialize image canvas.")
  }

  context.drawImage(image, 0, 0, width, height)

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", 0.86)
  })

  if (!blob) {
    throw new Error("Could not compress image.")
  }

  const fileName = file.name.replace(/\.[a-zA-Z0-9]+$/, "") || "cover-image"
  return new File([blob], `${fileName}.webp`, { type: "image/webp" })
}

const STATUS_OPTIONS: BlogPostStatus[] = [
  "draft",
  "scheduled",
  "published",
  "archived",
]

export function BlogEditorForm({ mode, postId, initialPost }: BlogEditorFormProps) {
  const [title, setTitle] = useState(initialPost?.title ?? "")
  const [slug, setSlug] = useState(initialPost?.slug ?? "")
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "")
  const [category, setCategory] = useState(initialPost?.category ?? "Career Strategy")
  const [tags, setTags] = useState(initialPost?.tags.join(", ") ?? "")
  const [body, setBody] = useState(initialPost?.body ?? "")
  const [image, setImage] = useState(initialPost?.image ?? "")
  const [previewUrl, setPreviewUrl] = useState(initialPost?.image ?? "")
  const [status, setStatus] = useState<BlogPostStatus>(initialPost?.status ?? "draft")
  const [publishDate, setPublishDate] = useState<Date | undefined>(
    parsePublishedDate(initialPost?.publishedAt)
  )
  const [publishTime, setPublishTime] = useState(
    parsePublishedTime(initialPost?.publishedAt)
  )
  const [submitState, setSubmitState] = useState<SubmitState>("idle")
  const [uploadState, setUploadState] = useState<UploadState>("idle")
  const [error, setError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const estimatedReadTime = useMemo(() => {
    const words = body.trim().split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.round(words / 220))
  }, [body])

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  async function handleImageUpload(file: File) {
    setUploadState("uploading")
    setUploadError(null)

    try {
      const resizedFile = await resizeCoverImage(file)
      const localPreview = URL.createObjectURL(resizedFile)
      setPreviewUrl(localPreview)

      const formData = new FormData()
      formData.append("file", resizedFile)
      formData.append("folder", "blog-covers")

      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      })
      const payload = (await response.json()) as
        | { error?: string; publicUrl?: string }
        | undefined

      if (!response.ok || !payload?.publicUrl) {
        setUploadState("error")
        setUploadError(payload?.error ?? "Upload failed.")
        return
      }

      setImage(payload.publicUrl)
      setPreviewUrl(payload.publicUrl)
      setUploadState("success")
    } catch {
      setUploadState("error")
      setUploadError("Could not process this image. Please try another file.")
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitState("saving")
    setError(null)

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      category: category.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      body: body.trim(),
      image: image.trim().length > 0 ? image.trim() : null,
      status,
      publishedAt: combineDateAndTime(publishDate, publishTime),
      readTimeMinutes: estimatedReadTime,
    }

    const endpoint = mode === "create" ? "/api/admin/blog" : `/api/admin/blog/${postId}`
    const method = mode === "create" ? "POST" : "PATCH"

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const responsePayload = (await response.json()) as
        | { error?: string; redirectTo?: string }
        | undefined

      if (!response.ok || !responsePayload?.redirectTo) {
        setSubmitState("error")
        setError(responsePayload?.error ?? "Unable to save post right now.")
        return
      }

      setSubmitState("success")
      window.location.assign(responsePayload.redirectTo)
    } catch {
      setSubmitState("error")
      setError("Network error. Please try again.")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-border/80 bg-card/95 p-5 shadow-[0_18px_45px_-35px_rgba(15,10,12,0.55)] sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="blog-title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="blog-title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="blog-slug" className="text-sm font-medium">
            Slug
          </label>
          <Input
            id="blog-slug"
            required
            value={slug}
            onChange={(event) =>
              setSlug(event.target.value.toLowerCase().replace(/\s+/g, "-"))
            }
            className="h-10"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="blog-excerpt" className="text-sm font-medium">
          Excerpt
        </label>
        <Textarea
          id="blog-excerpt"
          rows={3}
          required
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label htmlFor="blog-category" className="text-sm font-medium">
            Category
          </label>
          <Input
            id="blog-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-10"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="blog-status" className="text-sm font-medium">
            Status
          </label>
          <select
            id="blog-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as BlogPostStatus)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Schedule Post</label>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 justify-start"
                >
                  <CalendarDays className="size-4" />
                  {publishDate ? format(publishDate, "PPP") : "Pick date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={publishDate}
                  onSelect={(value) => {
                    setPublishDate(value)
                    setDatePickerOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
            <Input
              type="time"
              value={publishTime}
              onChange={(event) => setPublishTime(event.target.value)}
              className="h-10 w-28"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="blog-tags" className="text-sm font-medium">
          Tags (comma separated)
        </label>
        <Input
          id="blog-tags"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="blog-image-file" className="text-sm font-medium">
          Cover image
        </label>
        <div className="rounded-xl border border-border/80 bg-background/70 p-3">
          <div className="flex flex-wrap items-center gap-3">
            <label
              htmlFor="blog-image-file"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ImagePlus className="size-4" />
              Choose image
            </label>
            <input
              id="blog-image-file"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              className="sr-only"
              onChange={(event) => {
                const selected = event.target.files?.[0]
                if (!selected) {
                  return
                }
                void handleImageUpload(selected)
                event.target.value = ""
              }}
            />
            {uploadState === "uploading" ? (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <LoaderCircle className="size-3 animate-spin" />
                Resizing and uploading...
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                Images are resized to optimized cover dimensions automatically.
              </span>
            )}
          </div>
          {uploadError ? (
            <p className="mt-2 text-xs text-[color:var(--np-error)]">{uploadError}</p>
          ) : null}
          {previewUrl ? (
            <div className="mt-3 overflow-hidden rounded-lg border border-border/70">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Cover preview" className="h-44 w-full object-cover" />
            </div>
          ) : null}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="blog-body" className="text-sm font-medium">
          Article body
        </label>
        <Textarea
          id="blog-body"
          rows={16}
          required
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Write the article body here. Use blank lines to separate paragraphs."
        />
        <p className="text-xs text-muted-foreground">
          Estimated read time: {estimatedReadTime} min
        </p>
      </div>

      {error ? (
        <p className="rounded-lg border border-[color:rgb(199_70_70/0.4)] bg-[color:rgb(199_70_70/0.08)] px-3 py-2 text-xs text-[color:var(--np-error)]">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" className="h-10" disabled={submitState === "saving"}>
          {submitState === "saving"
            ? "Saving..."
            : mode === "create"
              ? "Create Post"
              : "Save Changes"}
        </Button>
        <p className="text-xs text-muted-foreground">
          {submitState === "success"
            ? "Saved successfully. Redirecting..."
            : "All updates are tracked via authenticated admin actions."}
        </p>
      </div>
    </form>
  )
}
