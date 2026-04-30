import { describe, expect, it } from "vitest"

import { buildAdminContextPayload } from "@/lib/auth/admin-context"

describe("buildAdminContextPayload", () => {
  it("always points the return pill at the shared admin root", () => {
    expect(
      buildAdminContextPayload({ canAccessAdmin: true, isSuperAdmin: true })
    ).toEqual({
      canAccessAdmin: true,
      isSuperAdmin: true,
      adminPath: "/admin",
    })
  })
})
