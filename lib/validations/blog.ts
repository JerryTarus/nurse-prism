import { z } from "zod"

export const blogStatusSchema = z.enum([
  "draft",
  "scheduled",
  "published",
  "archived",
])

export const blogPostPayloadSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase and hyphenated."),
  title: z.string().trim().min(5).max(160),
  excerpt: z.string().trim().min(15).max(260),
  category: z.string().trim().min(2).max(80),
  tags: z.array(z.string().trim().min(1).max(35)).max(10),
  body: z.string().trim().min(50),
  image: z
    .string()
    .trim()
    .max(500)
    .nullable()
    .refine(
      (value) => value === null || value.startsWith("/") || URL.canParse(value),
      "Image must be an absolute URL or a local /images path."
    ),
  status: blogStatusSchema,
  publishedAt: z.string().datetime().nullable(),
  readTimeMinutes: z.number().int().min(1).max(120),
})

export type BlogPostPayload = z.infer<typeof blogPostPayloadSchema>
