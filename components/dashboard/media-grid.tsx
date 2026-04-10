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
  if (files.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/70 p-5 text-sm text-muted-foreground">
        Media library is empty. Upload branded images and icons from the admin CMS
        pipeline when storage migration is ready.
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {files.map((file) => (
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
          <h3 className="mt-3 line-clamp-1 text-sm font-medium text-foreground">{file.title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {file.mimeType ?? "Unknown type"} | {formatBytes(file.sizeBytes)}
          </p>
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{file.path}</p>
        </article>
      ))}
    </div>
  )
}
