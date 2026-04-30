# Nurse Prism Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden Nurse Prism's launch foundation by sanitizing tracked environment files, aligning Supabase auth with profile-backed admin roles, closing unsafe anonymous RLS writes, enabling shared Google and email/password admin login, and verifying the protected admin surface end-to-end.

**Architecture:** Keep the current Next.js App Router and Supabase SSR pattern. Make the launch email allowlist the application gate, synchronize privileged identities into `public.profiles` and `role_mappings` for RLS, keep `/admin` as the shared protected surface, and use small pure helper modules so the security-critical rules are testable without rewriting the app.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase Auth/Postgres, Vitest, Tailwind CSS.

---

## File Map

### Environment And Test Harness
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.env.example`
- Modify: `lib/supabase/env.server.ts`
- Modify: `lib/seo/metadata.ts`
- Create: `vitest.config.ts`
- Create: `tests/unit/lib/auth/admin-identities.test.ts`
- Create: `tests/unit/lib/supabase/env.server.test.ts`

### Auth Helpers And Session Flow
- Create: `lib/auth/admin-identities.ts`
- Create: `lib/auth/profile-sync.ts`
- Create: `lib/auth/admin-flow.ts`
- Create: `lib/auth/admin-context.ts`
- Modify: `lib/auth/access.ts`
- Modify: `lib/auth/session.ts`
- Modify: `lib/auth/admin-api.ts`
- Modify: `app/auth/callback/route.ts`
- Modify: `proxy.ts`
- Modify: `app/api/auth/admin-context/route.ts`
- Modify: `components/navigation/admin-return-pill.tsx`
- Create: `tests/unit/lib/auth/profile-sync.test.ts`
- Create: `tests/unit/lib/auth/admin-flow.test.ts`
- Create: `tests/unit/lib/auth/admin-context.test.ts`

### Login Surface
- Modify: `app/api/auth/login/route.ts`
- Modify: `app/auth/login/page.tsx`
- Modify: `components/forms/auth-login-form.tsx`
- Create: `tests/unit/app/api/auth/login/route.test.ts`

### Database And Types
- Create: `supabase/migrations/202604300001_foundation_auth_rls.sql`
- Create: `supabase/seed.sql`
- Modify: `types/database.ts`
- Create: `tests/unit/supabase/foundation-migration.test.ts`

---

### Task 1: Add The Foundation Test Harness And Env Primitives

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.env.example`
- Modify: `lib/supabase/env.server.ts`
- Modify: `lib/seo/metadata.ts`
- Create: `vitest.config.ts`
- Create: `lib/auth/admin-identities.ts`
- Create: `tests/unit/lib/auth/admin-identities.test.ts`
- Create: `tests/unit/lib/supabase/env.server.test.ts`

- [ ] **Step 1: Write the failing unit tests for allowlist resolution and server env parsing**

```ts
// tests/unit/lib/auth/admin-identities.test.ts
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
```

```ts
// tests/unit/lib/supabase/env.server.test.ts
import { afterEach, describe, expect, it } from "vitest"

import { getSupabaseServerEnv } from "@/lib/supabase/env.server"

const ORIGINAL_ENV = { ...process.env }

afterEach(() => {
  process.env = { ...ORIGINAL_ENV }
})

describe("getSupabaseServerEnv", () => {
  it("parses the shared auth and Supabase environment values", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://nurseprism.com"
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co"
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test"
    process.env.SUPABASE_SECRET_KEY = "sb_secret_test"
    process.env.AUTH_ADMIN_EMAILS = "nurseprism@gmail.com"
    process.env.AUTH_SUPER_ADMIN_EMAILS = "crotonnbyte@gmail.com"

    expect(getSupabaseServerEnv()).toMatchObject({
      NEXT_PUBLIC_SITE_URL: "https://nurseprism.com",
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      AUTH_ADMIN_EMAILS: "nurseprism@gmail.com",
      AUTH_SUPER_ADMIN_EMAILS: "crotonnbyte@gmail.com",
    })
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail before the harness exists**

Run: `npm.cmd run test -- tests/unit/lib/auth/admin-identities.test.ts tests/unit/lib/supabase/env.server.test.ts`

Expected: FAIL with `Missing script: "test"` and unresolved imports for the new helper file.

- [ ] **Step 3: Add Vitest, implement the pure allowlist helper, centralize auth env parsing, and sanitize `.env.example`**

```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20.19.37",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.0",
    "prettier": "^3.8.1",
    "prettier-plugin-tailwindcss": "^0.7.2",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^3.2.4"
  }
}
```

```ts
// vitest.config.ts
import path from "node:path"

import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    restoreMocks: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
```

```ts
// lib/auth/admin-identities.ts
export type AllowlistedRole = "admin" | "super_admin"

type AllowlistEnv = {
  AUTH_ADMIN_EMAILS?: string
  AUTH_SUPER_ADMIN_EMAILS?: string
}

const DEFAULT_ADMIN_EMAILS = ["nurseprism@gmail.com"] as const
const DEFAULT_SUPER_ADMIN_EMAILS = ["crotonnbyte@gmail.com"] as const

function parseCsv(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

export function resolveAllowlistedRole(
  email: string | null | undefined,
  env: AllowlistEnv
): AllowlistedRole | null {
  const normalizedEmail = email?.trim().toLowerCase()

  if (!normalizedEmail) {
    return null
  }

  const adminEmails = new Set([
    ...DEFAULT_ADMIN_EMAILS,
    ...parseCsv(env.AUTH_ADMIN_EMAILS),
  ])
  const superAdminEmails = new Set([
    ...DEFAULT_SUPER_ADMIN_EMAILS,
    ...parseCsv(env.AUTH_SUPER_ADMIN_EMAILS),
  ])

  if (superAdminEmails.has(normalizedEmail)) {
    return "super_admin"
  }

  if (adminEmails.has(normalizedEmail)) {
    return "admin"
  }

  return null
}
```

```ts
// lib/supabase/env.server.ts
import "server-only"

import { z } from "zod"

const serverEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  SUPABASE_SECRET_KEY: z.string().min(1),
  AUTH_ADMIN_EMAILS: z.string().optional(),
  AUTH_SUPER_ADMIN_EMAILS: z.string().optional(),
})

export type SupabaseServerEnv = z.infer<typeof serverEnvSchema>

let cachedEnv: SupabaseServerEnv | null = null

export function getSupabaseServerEnv() {
  if (cachedEnv) {
    return cachedEnv
  }

  cachedEnv = serverEnvSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    AUTH_ADMIN_EMAILS: process.env.AUTH_ADMIN_EMAILS,
    AUTH_SUPER_ADMIN_EMAILS: process.env.AUTH_SUPER_ADMIN_EMAILS,
  })

  return cachedEnv
}
```

```ts
// lib/seo/metadata.ts
import { getSupabaseServerEnv } from "@/lib/supabase/env.server"

const FALLBACK_SITE_URL = "http://localhost:3000"

export function getSiteUrl() {
  try {
    return getSupabaseServerEnv().NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
  } catch {
    return FALLBACK_SITE_URL
  }
}
```

```env
# .env.example
NEXT_PUBLIC_SITE_URL=https://your-domain.example

NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_publishable_key
SUPABASE_SECRET_KEY=sb_secret_your_service_role_key
SUPABASE_ACCESS_TOKEN=your_supabase_cli_access_token

AUTH_ADMIN_EMAILS=nurseprism@gmail.com
AUTH_SUPER_ADMIN_EMAILS=crotonnbyte@gmail.com
```

- [ ] **Step 4: Install the new test dependency and run the targeted unit tests**

Run: `npm.cmd install`

Expected: PASS with `vitest` added to `package-lock.json`.

Run: `npm.cmd run test -- tests/unit/lib/auth/admin-identities.test.ts tests/unit/lib/supabase/env.server.test.ts`

Expected: PASS with both test files green.

- [ ] **Step 5: Commit the harness and env hygiene baseline**

```bash
git add package.json package-lock.json .env.example vitest.config.ts lib/auth/admin-identities.ts lib/supabase/env.server.ts lib/seo/metadata.ts tests/unit/lib/auth/admin-identities.test.ts tests/unit/lib/supabase/env.server.test.ts
git commit -m "test: add auth foundation harness and env validation"
```

### Task 2: Bootstrap Profiles, Close Anonymous RLS Writes, And Refresh Types

**Files:**
- Create: `supabase/migrations/202604300001_foundation_auth_rls.sql`
- Create: `supabase/seed.sql`
- Modify: `types/database.ts`
- Create: `tests/unit/supabase/foundation-migration.test.ts`

- [ ] **Step 1: Write the failing migration contract test**

```ts
// tests/unit/supabase/foundation-migration.test.ts
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
```

- [ ] **Step 2: Run the migration contract test to verify it fails**

Run: `npm.cmd run test -- tests/unit/supabase/foundation-migration.test.ts`

Expected: FAIL because the migration file and seed file do not exist yet.

- [ ] **Step 3: Add the migration, add `seed.sql`, and regenerate `types/database.ts` from the updated schema**

```sql
-- supabase/migrations/202604300001_foundation_auth_rls.sql
create or replace function public.sync_profile_from_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    mfa_required
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(
      (select p.role from public.profiles p where p.id = new.id),
      'nurse'
    ),
    coalesce(
      (select p.mfa_required from public.profiles p where p.id = new.id),
      false
    )
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name),
        updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_synced on auth.users;
create trigger on_auth_user_synced
after insert or update of email, raw_user_meta_data on auth.users
for each row execute procedure public.sync_profile_from_auth_user();

drop policy if exists leads_public_insert on public.leads;
drop policy if exists contact_public_insert on public.contact_submissions;
drop policy if exists bookings_public_insert on public.bookings;
```

```sql
-- supabase/seed.sql
insert into public.roles (id, label)
values
  ('admin', 'Admin'),
  ('super_admin', 'Super Admin')
on conflict (id) do update
set label = excluded.label;
```

```bash
npx.cmd supabase db reset
npx.cmd supabase gen types typescript --local --schema public | Out-File -FilePath types\database.ts -Encoding utf8
```

- [ ] **Step 4: Re-run the migration contract test after the schema files and generated types land**

Run: `npm.cmd run test -- tests/unit/supabase/foundation-migration.test.ts`

Expected: PASS with the new migration and seed contract assertions green.

- [ ] **Step 5: Commit the schema hardening checkpoint**

```bash
git add supabase/migrations/202604300001_foundation_auth_rls.sql supabase/seed.sql types/database.ts tests/unit/supabase/foundation-migration.test.ts
git commit -m "db: bootstrap profiles and close anonymous RLS writes"
```

### Task 3: Synchronize Allowlisted Users Into `profiles` And Unify Post-Auth Flow Rules

**Files:**
- Create: `lib/auth/profile-sync.ts`
- Create: `lib/auth/admin-flow.ts`
- Modify: `lib/auth/access.ts`
- Modify: `lib/auth/session.ts`
- Modify: `lib/auth/admin-api.ts`
- Modify: `app/auth/callback/route.ts`
- Create: `tests/unit/lib/auth/profile-sync.test.ts`
- Create: `tests/unit/lib/auth/admin-flow.test.ts`

- [ ] **Step 1: Write the failing unit tests for profile sync payloads and post-auth redirects**

```ts
// tests/unit/lib/auth/profile-sync.test.ts
import { describe, expect, it } from "vitest"
import type { User } from "@supabase/supabase-js"

import { buildProfileSyncPayload } from "@/lib/auth/profile-sync"

describe("buildProfileSyncPayload", () => {
  it("marks launch admins as MFA-required profile records", () => {
    const user = {
      id: "user-1",
      email: "nurseprism@gmail.com",
      user_metadata: { full_name: "Nurse Prism" },
    } as unknown as User

    expect(buildProfileSyncPayload(user, "admin")).toEqual({
      profile: {
        id: "user-1",
        email: "nurseprism@gmail.com",
        full_name: "Nurse Prism",
        role: "admin",
        mfa_required: true,
      },
      roleMappings: ["admin"],
    })
  })
})
```

```ts
// tests/unit/lib/auth/admin-flow.test.ts
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
```

- [ ] **Step 2: Run the profile sync and flow tests to verify they fail**

Run: `npm.cmd run test -- tests/unit/lib/auth/profile-sync.test.ts tests/unit/lib/auth/admin-flow.test.ts`

Expected: FAIL because the new helper modules do not exist yet.

- [ ] **Step 3: Implement profile synchronization, reuse it in the callback and server guards, and centralize the post-auth redirect rule**

```ts
// lib/auth/profile-sync.ts
import "server-only"

import type { User } from "@supabase/supabase-js"

import type { AllowlistedRole } from "@/lib/auth/admin-identities"
import { resolveAllowlistedRole } from "@/lib/auth/admin-identities"
import { getSupabaseServerEnv } from "@/lib/supabase/env.server"
import { createSupabaseAdminClient } from "@/lib/supabase/admin"

export function buildProfileSyncPayload(user: User, role: AllowlistedRole) {
  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata?.name === "string"
        ? user.user_metadata.name
        : null

  return {
    profile: {
      id: user.id,
      email: user.email?.trim().toLowerCase() ?? null,
      full_name: fullName,
      role,
      mfa_required: true,
    },
    roleMappings: role === "super_admin" ? ["admin", "super_admin"] : ["admin"],
  }
}

export async function syncAllowlistedUserIfNeeded(user: User) {
  const env = getSupabaseServerEnv()
  const role = resolveAllowlistedRole(user.email, env)

  if (!role) {
    return null
  }

  const client = createSupabaseAdminClient()
  const payload = buildProfileSyncPayload(user, role)

  await client.from("profiles").upsert(payload.profile, { onConflict: "id" })
  await client
    .from("role_mappings")
    .delete()
    .eq("user_id", user.id)
    .in("role_id", ["admin", "super_admin"])

  await client.from("role_mappings").insert(
    payload.roleMappings.map((roleId) => ({
      user_id: user.id,
      role_id: roleId,
    }))
  )

  return role
}
```

```ts
// lib/auth/admin-flow.ts
import type { AuthAccess } from "@/lib/auth/access"

export function getPostAuthRedirect(access: AuthAccess, nextPath: string) {
  if (access.mfa.required && !access.mfa.verified) {
    return `/auth/mfa?next=${encodeURIComponent(nextPath)}`
  }

  return nextPath
}
```

```ts
// lib/auth/access.ts
import { resolveAllowlistedRole } from "@/lib/auth/admin-identities"
import { getSupabaseServerEnv } from "@/lib/supabase/env.server"

export function resolveAuthAccess(user: User | null, session?: Session | null): AuthAccess {
  if (!user) {
    return {
      isAuthenticated: false,
      roles: ["user"],
      isAdmin: false,
      isSuperAdmin: false,
      mfa: {
        required: false,
        hasEnrolledFactor: false,
        assuranceLevel: "unknown",
        verified: false,
      },
    }
  }

  const env = getSupabaseServerEnv()
  const allowlistedRole = resolveAllowlistedRole(user.email, env)
  const roles = new Set<AppRole>(["user"])

  if (allowlistedRole === "admin" || allowlistedRole === "super_admin") {
    roles.add("admin")
  }

  if (allowlistedRole === "super_admin") {
    roles.add("super_admin")
  }

  const hasEnrolledFactor = (user.factors?.length ?? 0) > 0
  const assuranceLevel = decodeJwtAal(session?.access_token)

  return {
    isAuthenticated: true,
    roles: Array.from(roles),
    isAdmin: roles.has("admin"),
    isSuperAdmin: roles.has("super_admin"),
    mfa: {
      required: roles.has("admin"),
      hasEnrolledFactor,
      assuranceLevel,
      verified: assuranceLevel === "aal2",
    },
  }
}
```

```ts
// app/auth/callback/route.ts
import { getPostAuthRedirect } from "@/lib/auth/admin-flow"
import { syncAllowlistedUserIfNeeded } from "@/lib/auth/profile-sync"

const role = user ? await syncAllowlistedUserIfNeeded(user) : null
const access = resolveAuthAccess(user, session)

if (!access.isAuthenticated || !access.isAdmin || !role) {
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL("/auth/login?error=forbidden", request.url))
}

return NextResponse.redirect(
  new URL(getPostAuthRedirect(access, fallbackNext), request.url)
)
```

```ts
// lib/auth/session.ts and lib/auth/admin-api.ts
import { syncAllowlistedUserIfNeeded } from "@/lib/auth/profile-sync"

if (user) {
  await syncAllowlistedUserIfNeeded(user)
}
```

- [ ] **Step 4: Run the new tests for the pure sync and redirect helpers**

Run: `npm.cmd run test -- tests/unit/lib/auth/profile-sync.test.ts tests/unit/lib/auth/admin-flow.test.ts`

Expected: PASS with both helpers covered.

- [ ] **Step 5: Commit the role synchronization layer**

```bash
git add lib/auth/profile-sync.ts lib/auth/admin-flow.ts lib/auth/access.ts lib/auth/session.ts lib/auth/admin-api.ts app/auth/callback/route.ts tests/unit/lib/auth/profile-sync.test.ts tests/unit/lib/auth/admin-flow.test.ts
git commit -m "feat: sync allowlisted admins into profile-backed roles"
```

### Task 4: Enable Shared Email/Password Admin Login Without Relaxing Access Rules

**Files:**
- Modify: `app/api/auth/login/route.ts`
- Modify: `app/auth/login/page.tsx`
- Modify: `components/forms/auth-login-form.tsx`
- Create: `tests/unit/app/api/auth/login/route.test.ts`

- [ ] **Step 1: Write the failing route test for non-allowlisted password sign-ins**

```ts
// tests/unit/app/api/auth/login/route.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest"

const signInWithPassword = vi.fn()
const signOut = vi.fn()
const getUser = vi.fn()
const getSession = vi.fn()
const syncAllowlistedUserIfNeeded = vi.fn()

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: async () => ({
    auth: {
      signInWithPassword,
      signOut,
      getUser,
      getSession,
    },
  }),
}))

vi.mock("@/lib/auth/profile-sync", () => ({
  syncAllowlistedUserIfNeeded,
}))

vi.mock("@/lib/auth/admin-flow", () => ({
  getPostAuthRedirect: () => "/admin",
}))

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    signInWithPassword.mockReset()
    signOut.mockReset()
    getUser.mockReset()
    getSession.mockReset()
    syncAllowlistedUserIfNeeded.mockReset()
  })

  it("signs unauthorized users back out after password auth succeeds", async () => {
    signInWithPassword.mockResolvedValue({ error: null })
    getUser.mockResolvedValue({
      data: { user: { id: "user-2", email: "someone@example.com" } },
    })
    getSession.mockResolvedValue({
      data: { session: { access_token: "token" } },
    })
    syncAllowlistedUserIfNeeded.mockResolvedValue(null)

    const { POST } = await import("@/app/api/auth/login/route")

    const response = await POST(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: "someone@example.com",
          password: "password123",
          next: "/admin",
        }),
      })
    )

    expect(response.status).toBe(403)
    expect(signOut).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run the route test to confirm the current placeholder route fails it**

Run: `npm.cmd run test -- tests/unit/app/api/auth/login/route.test.ts`

Expected: FAIL because `app/api/auth/login/route.ts` still returns the hard-coded disabled `403` response.

- [ ] **Step 3: Replace the placeholder route with a real password sign-in flow and expand the login UI to support both methods**

```ts
// app/api/auth/login/route.ts
import { NextResponse } from "next/server"

import { getPostAuthRedirect } from "@/lib/auth/admin-flow"
import { resolveAuthAccess } from "@/lib/auth/access"
import { sanitizeRedirectPath } from "@/lib/auth/redirect"
import { syncAllowlistedUserIfNeeded } from "@/lib/auth/profile-sync"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { emailLoginSchema } from "@/lib/validations/auth"

export async function POST(request: Request) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 })
  }

  const parsed = emailLoginSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid email and password." },
      { status: 400 }
    )
  }

  const nextPath = sanitizeRedirectPath(parsed.data.next, "/admin")
  const supabase = await createSupabaseServerClient()
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (signInError) {
    return NextResponse.json(
      { error: "We couldn't sign you in with those details." },
      { status: 401 }
    )
  }

  const [
    {
      data: { user },
    },
    {
      data: { session },
    },
  ] = await Promise.all([supabase.auth.getUser(), supabase.auth.getSession()])

  const role = user ? await syncAllowlistedUserIfNeeded(user) : null
  const access = resolveAuthAccess(user, session)

  if (!access.isAuthenticated || !access.isAdmin || !role) {
    await supabase.auth.signOut()
    return NextResponse.json(
      {
        error: "This account is not authorized for the Nurse Prism dashboard.",
      },
      { status: 403 }
    )
  }

  return NextResponse.json(
    { redirectTo: getPostAuthRedirect(access, nextPath) },
    { status: 200 }
  )
}
```

```tsx
// components/forms/auth-login-form.tsx
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")

async function submitPasswordLogin(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  setFormError(null)
  setIsSubmitting(true)

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, next: nextPath }),
    })

    const payload = (await response.json()) as
      | { error?: string; redirectTo?: string }
      | undefined

    if (!response.ok || !payload?.redirectTo) {
      setFormError(
        payload?.error ?? "We couldn't sign you in right now. Please try again."
      )
      return
    }

    window.location.assign(payload.redirectTo)
  } catch {
    setFormError("Network error. Please try again in a moment.")
  } finally {
    setIsSubmitting(false)
  }
}

return (
  <>
    <form className="mt-6 space-y-3" onSubmit={submitPasswordLogin}>
      <Input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="nurseprism@gmail.com"
        autoComplete="email"
        required
      />
      <Input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Enter your password"
        autoComplete="current-password"
        required
      />
      <Button type="submit" className="h-10 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Continue with Email"}
      </Button>
    </form>

    <div className="mt-4">
      <Button
        type="button"
        variant="outline"
        className="h-10 w-full"
        onClick={submitGoogleLogin}
        disabled={isSubmitting}
      >
        Continue with Google
      </Button>
    </div>
  </>
)
```

```tsx
// app/auth/login/page.tsx
description:
  "Secure Google and email sign-in for authorized Nurse Prism dashboard administrators."
```

- [ ] **Step 4: Re-run the login route test**

Run: `npm.cmd run test -- tests/unit/app/api/auth/login/route.test.ts`

Expected: PASS with unauthorized password sign-ins being signed back out after auth resolves.

- [ ] **Step 5: Commit the shared login surface**

```bash
git add app/api/auth/login/route.ts app/auth/login/page.tsx components/forms/auth-login-form.tsx tests/unit/app/api/auth/login/route.test.ts
git commit -m "feat: enable allowlisted email login for admin access"
```

### Task 5: Remove Admin Breadcrumb Leakage And Tighten Proxy/Admin Context Behavior

**Files:**
- Create: `lib/auth/admin-context.ts`
- Modify: `proxy.ts`
- Modify: `app/api/auth/admin-context/route.ts`
- Modify: `components/navigation/admin-return-pill.tsx`
- Create: `tests/unit/lib/auth/admin-context.test.ts`

- [ ] **Step 1: Write the failing unit test for the admin context payload helper**

```ts
// tests/unit/lib/auth/admin-context.test.ts
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
```

- [ ] **Step 2: Run the admin context test to verify the helper does not exist yet**

Run: `npm.cmd run test -- tests/unit/lib/auth/admin-context.test.ts`

Expected: FAIL because `lib/auth/admin-context.ts` has not been created.

- [ ] **Step 3: Remove the client-readable admin path breadcrumb, preserve cookie options during proxy redirects, and return a fixed shared admin destination**

```ts
// lib/auth/admin-context.ts
export function buildAdminContextPayload(input: {
  canAccessAdmin: boolean
  isSuperAdmin: boolean
}) {
  return {
    canAccessAdmin: input.canAccessAdmin,
    isSuperAdmin: input.isSuperAdmin,
    adminPath: "/admin",
  }
}
```

```ts
// app/api/auth/admin-context/route.ts
import { buildAdminContextPayload } from "@/lib/auth/admin-context"

const payload = buildAdminContextPayload({
  canAccessAdmin:
    access.isAdmin && (!access.mfa.required || access.mfa.verified),
  isSuperAdmin: access.isSuperAdmin,
})

return NextResponse.json(payload, { status: 200 })
```

```tsx
// components/navigation/admin-return-pill.tsx
type AdminContextPayload = {
  canAccessAdmin: boolean
  isSuperAdmin: boolean
  adminPath: string
}

<Link
  href={context.adminPath}
  className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card px-3 py-2 text-xs font-medium text-primary shadow-[0_18px_35px_-20px_rgba(91,14,45,0.78)] transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
>
  <ShieldCheck className="size-4" />
  {context.isSuperAdmin ? "Return to Super Admin" : "Return to Admin"}
</Link>
```

```ts
// proxy.ts
function cloneSupabaseCookies(
  source: NextResponse,
  target: NextResponse
): NextResponse {
  source.cookies.getAll().forEach(({ name, value, ...options }) => {
    target.cookies.set(name, value, options)
  })

  return target
}
```

- [ ] **Step 4: Re-run the admin context helper test**

Run: `npm.cmd run test -- tests/unit/lib/auth/admin-context.test.ts`

Expected: PASS with the fixed `/admin` destination and no path breadcrumb dependency.

- [ ] **Step 5: Commit the proxy and admin context hardening**

```bash
git add lib/auth/admin-context.ts proxy.ts app/api/auth/admin-context/route.ts components/navigation/admin-return-pill.tsx tests/unit/lib/auth/admin-context.test.ts
git commit -m "fix: remove admin breadcrumb leakage from shared auth flow"
```

### Task 6: Verify The Entire Foundation Phase Before Moving On

**Files:**
- Verify only: `package.json`, `.env.example`, `lib/auth/*.ts`, `lib/supabase/*.ts`, `app/api/auth/*.ts`, `app/auth/*.tsx`, `proxy.ts`, `supabase/migrations/*.sql`, `supabase/seed.sql`, `types/database.ts`

- [ ] **Step 1: Run the focused test suite for every new foundation test file**

Run: `npm.cmd run test -- tests/unit/lib/auth/admin-identities.test.ts tests/unit/lib/supabase/env.server.test.ts tests/unit/supabase/foundation-migration.test.ts tests/unit/lib/auth/profile-sync.test.ts tests/unit/lib/auth/admin-flow.test.ts tests/unit/app/api/auth/login/route.test.ts tests/unit/lib/auth/admin-context.test.ts`

Expected: PASS with all foundation tests green.

- [ ] **Step 2: Run lint for the full repository**

Run: `npm.cmd run lint`

Expected: PASS with no new TypeScript or ESLint violations.

- [ ] **Step 3: Run the production build**

Run: `npm.cmd run build`

Expected: PASS with the login surface, proxy, auth callback, and typed Supabase modules compiling successfully.

- [ ] **Step 4: Inspect the final delta to confirm only expected foundation files changed**

Run: `git status --short`

Expected: Only the files listed in this plan are modified or newly created.

Run: `git diff --stat`

Expected: The diff is concentrated in auth, env, proxy, migration, seed, and generated database types.
