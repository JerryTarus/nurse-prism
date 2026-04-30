import { describe, expect, it } from "vitest"

import type { AuthAccess } from "@/lib/auth/access"
import { getPostAuthRedirect } from "@/lib/auth/admin-flow"

const adminAal1Access: AuthAccess = {
  isAuthenticated: true,
  roles: ["user", "admin"],
  isAdmin: true,
  isSuperAdmin: false,
  mfa: {
    required: true,
    hasEnrolledFactor: true,
    assuranceLevel: "aal1",
    verified: false,
  },
}

describe("getPostAuthRedirect", () => {
  it("sends allowlisted admins without AAL2 to MFA first", () => {
    expect(getPostAuthRedirect(adminAal1Access, "/admin/bookings")).toBe(
      "/auth/mfa?next=%2Fadmin%2Fbookings"
    )
  })
})
