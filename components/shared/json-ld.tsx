type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>

type JsonLdProps = {
  data: JsonLdValue
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // The script body is serialized JSON-LD for search engines.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
