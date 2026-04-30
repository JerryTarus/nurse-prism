import { describe, expect, it } from "vitest"

describe("POST /api/paypal/webhook", () => {
  it("keeps the launch webhook endpoint explicit while verified reconciliation is not active", async () => {
    const { POST } = await import("@/app/api/paypal/webhook/route")

    const response = await POST()

    expect(response.status).toBe(202)
    await expect(response.json()).resolves.toEqual({
      message:
        "PayPal webhook reconciliation is not active for launch yet. Checkout create and capture remain active.",
    })
  })
})
