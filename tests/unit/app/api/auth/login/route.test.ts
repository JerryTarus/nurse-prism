import { beforeEach, describe, expect, it, vi } from "vitest"

const signInWithPassword = vi.fn()
const signOut = vi.fn()
const getUser = vi.fn()
const getSession = vi.fn()
const syncAllowlistedUserIfNeeded = vi.fn()

vi.mock("server-only", () => ({}))

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: async () => ({
    auth: {
      signInWithPassword,
      signOut,
      getUser,
      getSession,
    },
  }),
}))

vi.mock("@/lib/auth/profile-sync", () => ({
  syncAllowlistedUserIfNeeded,
}))

vi.mock("@/lib/auth/admin-flow", () => ({
  getPostAuthRedirect: () => "/admin",
}))

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    signInWithPassword.mockReset()
    signOut.mockReset()
    getUser.mockReset()
    getSession.mockReset()
    syncAllowlistedUserIfNeeded.mockReset()
  })

  it("signs unauthorized users back out after password auth succeeds", async () => {
    signInWithPassword.mockResolvedValue({ error: null })
    getUser.mockResolvedValue({
      data: { user: { id: "user-2", email: "someone@example.com" } },
    })
    getSession.mockResolvedValue({
      data: { session: { access_token: "token" } },
    })
    syncAllowlistedUserIfNeeded.mockResolvedValue(null)

    const { POST } = await import("@/app/api/auth/login/route")

    const response = await POST(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "someone@example.com",
          password: "password123",
          next: "/admin",
        }),
      })
    )

    expect(response.status).toBe(403)
    expect(signOut).toHaveBeenCalledTimes(1)
  })
})
