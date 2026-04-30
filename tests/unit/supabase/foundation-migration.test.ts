import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

import { describe, expect, it } from "vitest"

const migrationPath = resolve(
  process.cwd(),
  "supabase/migrations/202604300001_foundation_auth_rls.sql"
)
const seedPath = resolve(process.cwd(), "supabase/seed.sql")

describe("foundation auth migration", () => {
  it("creates the profile sync trigger and removes anonymous write policies", () => {
    expect(existsSync(migrationPath)).toBe(true)

    const sql = readFileSync(migrationPath, "utf8")
    expect(sql).toContain(
      "create or replace function public.sync_profile_from_auth_user()"
    )
    expect(sql).toContain(
      "drop policy if exists leads_public_insert on public.leads;"
    )
    expect(sql).toContain(
      "drop policy if exists contact_public_insert on public.contact_submissions;"
    )
    expect(sql).toContain(
      "drop policy if exists bookings_public_insert on public.bookings;"
    )
  })

  it("adds a seed file for the admin role catalog", () => {
    expect(existsSync(seedPath)).toBe(true)

    const sql = readFileSync(seedPath, "utf8")
    expect(sql).toContain("insert into public.roles")
    expect(sql).toContain("'admin', 'Admin'")
    expect(sql).toContain("'super_admin', 'Super Admin'")
  })
})
