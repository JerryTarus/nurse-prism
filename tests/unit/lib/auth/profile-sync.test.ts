import { describe, expect, it, vi } from "vitest"
import type { User } from "@supabase/supabase-js"

vi.mock("server-only", () => ({}))
vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: vi.fn(),
}))
vi.mock("@/lib/supabase/env.server", () => ({
  getSupabaseServerEnv: vi.fn(),
}))

import { buildProfileSyncPayload } from "@/lib/auth/profile-sync"

describe("buildProfileSyncPayload", () => {
  it("marks launch admins as MFA-required profile records", () => {
    const user = {
      id: "user-1",
      email: "nurseprism@gmail.com",
      user_metadata: { full_name: "Nurse Prism" },
    } as unknown as User

    expect(buildProfileSyncPayload(user, "admin")).toEqual({
      profile: {
        id: "user-1",
        email: "nurseprism@gmail.com",
        full_name: "Nurse Prism",
        role: "admin",
        mfa_required: true,
      },
      roleMappings: ["admin"],
    })
  })
})
