import { describe, expect, it } from "vitest"

import { resolveAllowlistedRole } from "@/lib/auth/admin-identities"

describe("resolveAllowlistedRole", () => {
  it("maps the two launch emails to the correct roles", () => {
    expect(
      resolveAllowlistedRole("nurseprism@gmail.com", {
        AUTH_ADMIN_EMAILS: "",
        AUTH_SUPER_ADMIN_EMAILS: "",
      })
    ).toBe("admin")

    expect(
      resolveAllowlistedRole("crotonnbyte@gmail.com", {
        AUTH_ADMIN_EMAILS: "",
        AUTH_SUPER_ADMIN_EMAILS: "",
      })
    ).toBe("super_admin")
  })

  it("returns null for unprivileged emails", () => {
    expect(
      resolveAllowlistedRole("someone@example.com", {
        AUTH_ADMIN_EMAILS: "",
        AUTH_SUPER_ADMIN_EMAILS: "",
      })
    ).toBeNull()
  })
})
