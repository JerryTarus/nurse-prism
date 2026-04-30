import { beforeEach, describe, expect, it, vi } from "vitest"

const createConsultationLead = vi.fn()
const getCalendlyUrlForIntent = vi.fn()
const enforceRateLimit = vi.fn()
const getRequestIp = vi.fn()
const convertKesToCurrency = vi.fn()

vi.mock("@/lib/cms/public", () => ({
  createConsultationLead,
}))

vi.mock(import("@/lib/consultations"), async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    getCalendlyUrlForIntent,
  }
})

vi.mock("@/lib/security/rate-limit", () => ({
  enforceRateLimit,
  getRequestIp,
}))

vi.mock("@/lib/currency", () => ({
  convertKesToCurrency,
}))

describe("POST /api/leads", () => {
  beforeEach(() => {
    createConsultationLead.mockReset()
    getCalendlyUrlForIntent.mockReset()
    enforceRateLimit.mockReset()
    getRequestIp.mockReset()
    convertKesToCurrency.mockReset()

    getRequestIp.mockReturnValue("127.0.0.1")
    enforceRateLimit.mockReturnValue({ ok: true, retryAfterSeconds: 60 })
    getCalendlyUrlForIntent.mockReturnValue("https://calendly.com/example/paid")
    convertKesToCurrency.mockReturnValue(76)
  })

  it("returns paid consultation details without exposing internal KES amounts", async () => {
    createConsultationLead.mockResolvedValue({
      bookingId: "booking-1",
      leadId: "lead-1",
      paymentRequired: true,
      calendlyUrl: "https://calendly.com/example/paid",
      plan: {
        id: "professional-plan",
        name: "Professional Pivot",
        basePriceKes: 10000,
      },
    })

    const { POST } = await import("@/app/api/leads/route")

    const response = await POST(
      new Request("http://localhost/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: "Nurse Example",
          email: "nurse@example.com",
          phone: "+254700000000",
          targetCountry: "Canada",
          intent: "professional-plan",
          notes: "Looking for strategy support",
          source: "website",
        }),
      })
    )

    expect(response.status).toBe(201)

    const payload = (await response.json()) as {
      plan?: {
        id: string
        name: string
        amountUsd: string | null
        amountKes?: number
      } | null
    }

    expect(payload.plan).toMatchObject({
      id: "professional-plan",
      name: "Professional Pivot",
      amountUsd: "76.00",
    })
    expect(payload.plan).not.toHaveProperty("amountKes")
  })
})
