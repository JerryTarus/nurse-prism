import { z } from "zod"

import { CONSULTATION_INTENTS } from "@/lib/consultations"

function optionalTrimmedString(maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength)
    .optional()
    .transform((value) => {
      if (!value) {
        return null
      }

      return value
    })
}

export const publicSourceSchema = z.enum([
  "website",
  "contact_form",
  "pricing_page",
  "program_page",
  "referral",
  "manual",
])

export const consultationLeadPayloadSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.email().trim().toLowerCase(),
  phone: optionalTrimmedString(40),
  targetCountry: z.string().trim().min(2).max(120),
  intent: z.enum(CONSULTATION_INTENTS),
  notes: optionalTrimmedString(2000),
  source: publicSourceSchema.optional().default("website"),
})

export const contactSubmissionPayloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().trim().toLowerCase(),
  country: z.string().trim().min(2).max(120),
  phone: optionalTrimmedString(40),
  subject: optionalTrimmedString(140),
  message: z.string().trim().min(10).max(3000),
})

export const newsletterPayloadSchema = z.object({
  email: z.email().trim().toLowerCase(),
  source: z.string().trim().min(2).max(80).optional().default("lead-capture"),
})

export const paypalCreateOrderPayloadSchema = z.object({
  bookingId: z.string().uuid(),
})

export const paypalCaptureOrderPayloadSchema = z.object({
  bookingId: z.string().uuid(),
  orderId: z.string().trim().min(3).max(120),
})

export const calendlyClickPayloadSchema = z.object({
  bookingId: z.string().uuid(),
})

export type ConsultationLeadPayload = z.infer<
  typeof consultationLeadPayloadSchema
>
export type ContactSubmissionPayload = z.infer<
  typeof contactSubmissionPayloadSchema
>
export type NewsletterPayload = z.infer<typeof newsletterPayloadSchema>
export type PaypalCreateOrderPayload = z.infer<
  typeof paypalCreateOrderPayloadSchema
>
export type PaypalCaptureOrderPayload = z.infer<
  typeof paypalCaptureOrderPayloadSchema
>
