import { beforeEach, describe, expect, it, vi } from "vitest"

const markCalendlyClick = vi.fn()
const enforceRateLimit = vi.fn()
const getRequestIp = vi.fn()

vi.mock("@/lib/cms/public", () => ({
  markCalendlyClick,
}))

vi.mock("@/lib/security/rate-limit", () => ({
  enforceRateLimit,
  getRequestIp,
}))

describe("POST /api/calendly/click", () => {
  beforeEach(() => {
    markCalendlyClick.mockReset()
    enforceRateLimit.mockReset()
    getRequestIp.mockReset()

    getRequestIp.mockReturnValue("127.0.0.1")
    enforceRateLimit.mockReturnValue({ ok: true, retryAfterSeconds: 60 })
  })

  it("returns a safe error message when scheduling preparation fails", async () => {
    markCalendlyClick.mockRejectedValue(new Error("db exploded"))

    const { POST } = await import("@/app/api/calendly/click/route")

    const response = await POST(
      new Request("http://localhost/api/calendly/click", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          bookingId: "123e4567-e89b-42d3-a456-426614174000",
        }),
      })
    )

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      error:
        "Something went wrong while preparing your booking. Please try again or contact support.",
    })
  })
})
