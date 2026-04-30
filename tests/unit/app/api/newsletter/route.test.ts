import { beforeEach, describe, expect, it, vi } from "vitest"

const createNewsletterLead = vi.fn()
const enforceRateLimit = vi.fn()
const getRequestIp = vi.fn()

vi.mock("@/lib/cms/public", () => ({
  createNewsletterLead,
}))

vi.mock("@/lib/security/rate-limit", () => ({
  enforceRateLimit,
  getRequestIp,
}))

describe("POST /api/newsletter", () => {
  beforeEach(() => {
    createNewsletterLead.mockReset()
    enforceRateLimit.mockReset()
    getRequestIp.mockReset()

    getRequestIp.mockReturnValue("127.0.0.1")
    enforceRateLimit.mockReturnValue({ ok: true, retryAfterSeconds: 60 })
  })

  it("returns a safe error message when newsletter persistence fails", async () => {
    createNewsletterLead.mockRejectedValue(new Error("db exploded"))

    const { POST } = await import("@/app/api/newsletter/route")

    const response = await POST(
      new Request("http://localhost/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "nurse@example.com",
          source: "lead-capture",
        }),
      })
    )

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      error: "We couldn't save your details right now. Please try again.",
    })
  })
})
