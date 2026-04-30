import { beforeEach, describe, expect, it, vi } from "vitest"

const getCheckoutAmountForBooking = vi.fn()
const getPaymentByProviderOrderId = vi.fn()
const markPaymentCaptured = vi.fn()
const getCalendlyUrlForIntent = vi.fn()
const captureHostedPaypalOrder = vi.fn()
const extractPaypalCaptureDetails = vi.fn()
const enforceRateLimit = vi.fn()
const getRequestIp = vi.fn()

vi.mock("@/lib/cms/public", () => ({
  getCheckoutAmountForBooking,
  getPaymentByProviderOrderId,
  markPaymentCaptured,
}))

vi.mock(import("@/lib/consultations"), async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    getCalendlyUrlForIntent,
  }
})

vi.mock("@/lib/paypal/orders", () => ({
  captureHostedPaypalOrder,
  extractPaypalCaptureDetails,
}))

vi.mock("@/lib/security/rate-limit", () => ({
  enforceRateLimit,
  getRequestIp,
}))

describe("POST /api/paypal/capture-order", () => {
  beforeEach(() => {
    getCheckoutAmountForBooking.mockReset()
    getPaymentByProviderOrderId.mockReset()
    markPaymentCaptured.mockReset()
    getCalendlyUrlForIntent.mockReset()
    captureHostedPaypalOrder.mockReset()
    extractPaypalCaptureDetails.mockReset()
    enforceRateLimit.mockReset()
    getRequestIp.mockReset()

    getRequestIp.mockReturnValue("127.0.0.1")
    enforceRateLimit.mockReturnValue({ ok: true, retryAfterSeconds: 60 })
    getCalendlyUrlForIntent.mockReturnValue("https://calendly.com/example/paid")
  })

  it("rejects completed captures whose amount does not match the expected booking checkout amount", async () => {
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
    getPaymentByProviderOrderId.mockResolvedValue({
      id: "payment-1",
      status: "created",
      providerOrderId: "order-1",
    })
    captureHostedPaypalOrder.mockResolvedValue({
      status: "COMPLETED",
    })
    extractPaypalCaptureDetails.mockReturnValue({
      captureId: "capture-1",
      status: "COMPLETED",
      amount: "80.00",
      currency: "USD",
    })

    const { POST } = await import("@/app/api/paypal/capture-order/route")

    const response = await POST(
      new Request("http://localhost/api/paypal/capture-order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          bookingId: "123e4567-e89b-42d3-a456-426614174000",
          orderId: "order-1",
        }),
      })
    )

    expect(response.status).toBe(422)
    await expect(response.json()).resolves.toEqual({
      error: "The captured PayPal amount did not match this booking.",
    })
    expect(markPaymentCaptured).not.toHaveBeenCalled()
  })
})
