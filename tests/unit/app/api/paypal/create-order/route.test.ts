import { beforeEach, describe, expect, it, vi } from "vitest"

const getCheckoutAmountForBooking = vi.fn()
const getReusablePaymentForBooking = vi.fn()
const createPaymentRecord = vi.fn()
const createHostedPaypalOrder = vi.fn()
const enforceRateLimit = vi.fn()
const getRequestIp = vi.fn()

vi.mock("@/lib/cms/public", () => ({
  getCheckoutAmountForBooking,
  getReusablePaymentForBooking,
  createPaymentRecord,
}))

vi.mock("@/lib/paypal/orders", () => ({
  createHostedPaypalOrder,
}))

vi.mock("@/lib/security/rate-limit", () => ({
  enforceRateLimit,
  getRequestIp,
}))

describe("POST /api/paypal/create-order", () => {
  beforeEach(() => {
    getCheckoutAmountForBooking.mockReset()
    getReusablePaymentForBooking.mockReset()
    createPaymentRecord.mockReset()
    createHostedPaypalOrder.mockReset()
    enforceRateLimit.mockReset()
    getRequestIp.mockReset()

    getRequestIp.mockReturnValue("127.0.0.1")
    enforceRateLimit.mockReturnValue({ ok: true, retryAfterSeconds: 60 })
    getCheckoutAmountForBooking.mockResolvedValue({
      booking: {
        id: "123e4567-e89b-42d3-a456-426614174000",
        intent: "professional-plan",
        email: "nurse@example.com",
        fullName: "Nurse Example",
        packageKey: "professional-plan",
        paymentStatus: "pending",
      },
      plan: {
        id: "professional-plan",
        basePriceKes: 10000,
      },
      checkoutAmount: "76.00",
    })
  })

  it("reuses an open PayPal checkout for the same booking instead of creating a duplicate order", async () => {
    getReusablePaymentForBooking.mockResolvedValue({
      id: "payment-1",
      providerOrderId: "order-1",
      approvalUrl: "https://paypal.example/approve/order-1",
      checkoutAmount: "76.00",
    })

    const { POST } = await import("@/app/api/paypal/create-order/route")

    const response = await POST(
      new Request("http://localhost/api/paypal/create-order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          bookingId: "123e4567-e89b-42d3-a456-426614174000",
        }),
      })
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      bookingId: "123e4567-e89b-42d3-a456-426614174000",
      paymentId: "payment-1",
      orderId: "order-1",
      approvalUrl: "https://paypal.example/approve/order-1",
      currency: "USD",
      checkoutAmount: "76.00",
    })
    expect(createHostedPaypalOrder).not.toHaveBeenCalled()
    expect(createPaymentRecord).not.toHaveBeenCalled()
  })
})
