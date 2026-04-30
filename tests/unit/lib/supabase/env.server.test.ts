import { afterEach, describe, expect, it, vi } from "vitest"

const ORIGINAL_ENV = { ...process.env }

afterEach(() => {
  process.env = { ...ORIGINAL_ENV }
  vi.resetModules()
})

describe("getSupabaseServerEnv", () => {
  it("parses the shared auth and Supabase environment values", async () => {
    vi.mock("server-only", () => ({}))

    process.env.NEXT_PUBLIC_SITE_URL = "https://nurseprism.com"
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co"
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test"
    process.env.SUPABASE_SECRET_KEY = "sb_secret_test"
    process.env.AUTH_ADMIN_EMAILS = "nurseprism@gmail.com"
    process.env.AUTH_SUPER_ADMIN_EMAILS = "crotonnbyte@gmail.com"

    const { getSupabaseServerEnv } = await import("@/lib/supabase/env.server")

    expect(getSupabaseServerEnv()).toMatchObject({
      NEXT_PUBLIC_SITE_URL: "https://nurseprism.com",
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      AUTH_ADMIN_EMAILS: "nurseprism@gmail.com",
      AUTH_SUPER_ADMIN_EMAILS: "crotonnbyte@gmail.com",
    })
  })
})
