import { beforeEach, describe, expect, it, vi } from "vitest"

const usePathname = vi.fn()

vi.mock("next/navigation", () => ({
  usePathname,
}))

vi.mock("@/components/layout/page-shell", () => ({
  PageShell: vi.fn(() => null),
}))

describe("SiteLayoutGate", () => {
  beforeEach(() => {
    usePathname.mockReset()
  })

  it("disables the recent activity toast on the homepage", async () => {
    usePathname.mockReturnValue("/")

    const { SiteLayoutGate } = await import("@/components/layout/site-layout-gate")
    const result = SiteLayoutGate({ children: "home" }) as {
      props: { showSocialProofToast?: boolean }
    }

    expect(result.props.showSocialProofToast).toBe(false)
  })

  it("keeps the recent activity toast enabled on other public pages", async () => {
    usePathname.mockReturnValue("/services")

    const { SiteLayoutGate } = await import("@/components/layout/site-layout-gate")
    const result = SiteLayoutGate({ children: "services" }) as {
      props: { showSocialProofToast?: boolean }
    }

    expect(result.props.showSocialProofToast).toBe(true)
  })
})
