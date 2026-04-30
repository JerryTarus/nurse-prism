import "server-only"

import { z } from "zod"

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_SECRET_KEY: z.string().min(1),
  AUTH_ADMIN_EMAILS: z.string().optional(),
  AUTH_SUPER_ADMIN_EMAILS: z.string().optional(),
})

export type SupabaseServerEnv = z.infer<typeof serverEnvSchema>

let cachedEnv: SupabaseServerEnv | null = null

export function getSupabaseServerEnv() {
  if (cachedEnv) {
    return cachedEnv
  }

  cachedEnv = serverEnvSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    AUTH_ADMIN_EMAILS: process.env.AUTH_ADMIN_EMAILS,
    AUTH_SUPER_ADMIN_EMAILS: process.env.AUTH_SUPER_ADMIN_EMAILS,
  })

  return cachedEnv
}
