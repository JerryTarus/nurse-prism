import { z } from "zod"

export const redirectPathSchema = z
  .string()
  .trim()
  .max(300)
  .optional()

export const emailLoginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8).max(128),
  next: redirectPathSchema,
})

export const oauthLoginSchema = z.object({
  next: redirectPathSchema,
})

export const mfaVerifySchema = z.object({
  factorId: z.string().trim().min(1),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Code must be a six-digit number."),
  next: redirectPathSchema,
})
