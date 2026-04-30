import { beforeEach, describe, expect, it, vi } from "vitest"

const createContactSubmission = vi.fn()
const enforceRateLimit = vi.fn()
const getRequestIp = vi.fn()

vi.mock("@/lib/cms/public", () => ({
  createContactSubmission,
}))

vi.mock("@/lib/security/rate-limit", () => ({
  enforceRateLimit,
  getRequestIp,
}))

describe("POST /api/contact", () => {
  beforeEach(() => {
    createContactSubmission.mockReset()
    enforceRateLimit.mockReset()
    getRequestIp.mockReset()

    getRequestIp.mockReturnValue("127.0.0.1")
    enforceRateLimit.mockReturnValue({ ok: true, retryAfterSeconds: 60 })
  })

  it("returns a safe error message when contact persistence fails", async () => {
    createContactSubmission.mockRejectedValue(new Error("db exploded"))

    const { POST } = await import("@/app/api/contact/route")

    const response = await POST(
      new Request("http://localhost/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Nurse Example",
          email: "nurse@example.com",
          country: "Kenya",
          message: "I need help planning my next move.",
        }),
      })
    )

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      error: "We couldn't save your details right now. Please try again.",
    })
  })
})
