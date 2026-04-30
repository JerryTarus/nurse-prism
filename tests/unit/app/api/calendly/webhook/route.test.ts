import { describe, expect, it } from "vitest"

describe("POST /api/calendly/webhook", () => {
  it("keeps the launch webhook endpoint safe and explicit while event sync is not active", async () => {
    const { POST } = await import("@/app/api/calendly/webhook/route")

    const response = await POST()

    expect(response.status).toBe(202)
    await expect(response.json()).resolves.toEqual({
      message:
        "Calendly webhook event sync is not active for launch yet. Booking links and tracked click flow remain active.",
    })
  })
})
