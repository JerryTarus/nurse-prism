import "server-only"

import { createClient } from "@supabase/supabase-js"

import type { Database } from "@/types/database"

import { getSupabaseServerEnv } from "./env.server"

let adminClient: ReturnType<typeof createClient<Database>> | undefined

export function createSupabaseAdminClient() {
  if (!adminClient) {
    const env = getSupabaseServerEnv()

    if (!env.SUPABASE_SECRET_KEY) {
      throw new Error(
        "SUPABASE_SECRET_KEY is required for admin client operations."
      )
    }

    adminClient = createClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.SUPABASE_SECRET_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    )
  }

  return adminClient
}
