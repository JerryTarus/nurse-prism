import { z } from "zod"

const leadStatusSchema = z.enum([
  "new",
  "qualified",
  "follow_up",
  "won",
  "lost",
])

const bookingStatusSchema = z.enum([
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
])

const contactStatusSchema = z.enum([
  "new",
  "in_progress",
  "replied",
  "closed",
])

function nullableTrimmedString(maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength)
    .nullable()
    .optional()
    .transform((value) => {
      if (!value) {
        return null
      }

      return value
    })
}

export const leadAdminUpdateSchema = z.object({
  status: leadStatusSchema,
  notes: nullableTrimmedString(2000),
})

export const bookingAdminUpdateSchema = z.object({
  status: bookingStatusSchema,
  assignedCoach: nullableTrimmedString(120),
  scheduledFor: z.string().datetime().nullable().optional(),
  notes: nullableTrimmedString(2000),
})

export const messageAdminUpdateSchema = z.object({
  status: contactStatusSchema,
})

export const pageSectionCreateSchema = z.object({
  pageKey: z.string().trim().min(2).max(80),
  sectionKey: z.string().trim().min(2).max(80),
  title: z.string().trim().min(2).max(160),
  content: z.string().trim().min(2).max(6000),
})

export const pageSectionUpdateSchema = z.object({
  title: z.string().trim().min(2).max(160),
  content: z.string().trim().min(2).max(6000),
})

export const packageAdminUpdateSchema = z.object({
  name: z.string().trim().min(2).max(160),
  basePriceKes: z.number().min(0).max(5_000_000),
  isActive: z.boolean(),
})

export const siteSettingUpsertSchema = z.object({
  key: z.string().trim().min(2).max(120),
  value: z.string().trim().min(1).max(6000),
})
