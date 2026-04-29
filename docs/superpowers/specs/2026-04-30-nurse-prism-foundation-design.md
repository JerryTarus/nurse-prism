# Nurse Prism Foundation Design

## Goal
Establish a secure, launch-ready foundation for Nurse Prism covering environment hygiene, role-backed authentication, admin session protection, schema alignment, and safe RLS boundaries before conversion, CMS, and UX polish work begins.

## Constraints
- Preserve the current Next.js App Router + TypeScript + Tailwind + shadcn/ui + Supabase architecture.
- Build on top of the current working tree instead of resetting or rewriting the app.
- Keep `/admin` as the shared protected admin surface for both `admin` and `super_admin`.
- Support both Google OAuth and email/password through Supabase Auth.
- Keep the privileged identities explicit at launch:
  - `nurseprism@gmail.com` -> `admin`
  - `crotonnbyte@gmail.com` -> `super_admin`
- Do not expose raw technical errors to end users.
- Keep secrets server-only and fail safely when environment variables are missing.

## Verified Current State
- `lib/auth/access.ts` already contains default allowlists for `nurseprism@gmail.com` and `crotonnbyte@gmail.com`.
- `proxy.ts`, `lib/auth/session.ts`, and `lib/auth/admin-api.ts` already gate `/admin` and MFA at the application layer.
- `app/auth/callback/route.ts` already rejects non-allowlisted Google sign-ins after Supabase session exchange.
- `app/api/auth/login/route.ts` currently disables email/password sign-in with a `403`.
- `supabase/migrations/202603190001_phase6_cms_schema.sql` creates `profiles`, `roles`, `role_mappings`, and RLS helpers such as `public.is_admin()`.
- Current RLS policies still allow anonymous inserts into `leads`, `contact_submissions`, and `bookings`.
- `types/database.ts` is stale and does not reflect the current schema.
- `.env.example` currently contains real-looking Supabase values and must be sanitized.

## Foundation Scope
This foundation spec covers:
- Environment variable hygiene and safe validation
- Authentication flows and admin session rules
- Role synchronization between Supabase Auth identities and database-backed roles
- RLS tightening for launch-safe writes
- Schema and type alignment needed for secure admin and API work

This foundation spec does not cover:
- PayPal hardening
- Calendly webhook/event sync
- Public pricing redesign
- Admin CMS completion
- Blog, SEO, analytics, or performance polish beyond items directly required for secure auth and env handling

## Decision 1: Role Authority Model

### Chosen approach
Use the email allowlist as the launch authority and synchronize that identity into database-backed role records that RLS can trust.

### Why this approach
- It matches the explicit launch requirement for two named Gmail accounts.
- It keeps authorization legible and auditable.
- It avoids granting admin access from client-controlled claims alone.
- It lets RLS depend on database state instead of loosely coupled app metadata.

### Authority chain
1. Supabase Auth proves the user identity.
2. The app normalizes the email and checks it against the allowlist.
3. The server synchronizes the user into `public.profiles`.
4. The synchronized `profiles.role` becomes the primary role value for RLS checks.
5. `role_mappings` may be mirrored for compatibility, but it is secondary to `profiles.role`.

### Launch role mapping
- `nurseprism@gmail.com` -> `admin`
- `crotonnbyte@gmail.com` -> `super_admin`
- `super_admin` inherits `admin` access
- Any non-allowlisted identity is treated as a normal user and cannot access `/admin`

## Decision 2: Shared Admin Entry And Exposure Model

### Chosen approach
Use one shared admin login entry and one shared admin application root, with permissions resolved after authentication.

### Behavior
- `/auth/login` remains the single public admin sign-in entry.
- `/admin` remains the single protected admin shell.
- No public navigation should advertise the admin surface.
- Admin and auth routes remain `noindex` and excluded from public discovery surfaces such as sitemap output.

### Exposure model
The admin URL cannot be made literally unknowable once a person has it, but the system can keep it non-informative and tightly protected:
- unauthenticated users are redirected to `/auth/login`
- authenticated but non-allowlisted users are denied cleanly
- allowlisted users without completed MFA are redirected to `/auth/mfa`
- authenticated `admin` users attempting `super_admin` sections are redirected safely back into `/admin`

### Session expectations
- Secure cookies stay enabled in production
- Redirect destinations remain sanitized
- The app should avoid leaving readable client-side breadcrumbs of privileged navigation where not required
- Auditability stays server-side only

## Decision 3: Authentication Flow Support

### Chosen approach
Support both Supabase Google OAuth and Supabase email/password under the same privilege rules and post-auth synchronization.

### Google flow
- User starts at `/auth/login`
- User selects Google sign-in
- Supabase OAuth redirects back through `app/auth/callback/route.ts`
- The callback resolves the session, synchronizes the role, checks MFA, and redirects to the correct admin destination

### Email/password flow
- User starts at `/auth/login`
- User submits email and password to a real server route instead of the current disabled `403` placeholder
- The route signs in through Supabase Auth, synchronizes the role, checks allowlist status, and returns a safe redirect outcome

### Shared post-auth rules
- Non-allowlisted user: sign out immediately and show a safe access-denied message
- Allowlisted but not MFA-complete: redirect to `/auth/mfa`
- Allowlisted and MFA-complete: redirect to `/admin`
- `super_admin` users use the same `/admin` shell and gain elevated sections through authorization, not a separate public endpoint

## Decision 4: Database And RLS Alignment

### Chosen approach
Tighten the database so launch-critical writes go through validated server routes and privileged access depends on synchronized profile roles.

### Required database behavior
- Ensure every authenticated user can have a `public.profiles` row without manual intervention
- Mark privileged users with the correct `profiles.role`
- Keep `mfa_required = true` for privileged roles
- Preserve compatibility with `public.is_admin()` and `public.is_super_admin()` or update them to follow the chosen authority model clearly

### RLS changes
- Remove anonymous insert policies from:
  - `public.leads`
  - `public.contact_submissions`
  - `public.bookings`
- Route those writes through server-side handlers using the service role where necessary
- Keep public read policies only where they are intentional, such as published content and active packages

### Compatibility changes
- Add the bootstrap/sync path needed for `profiles` so app-layer authorization and RLS do not drift
- Keep `role_mappings` only if it continues to serve a real purpose after the sync model is added

## Decision 5: Environment Hygiene And Safe Failure Behavior

### Chosen approach
Centralize environment validation and make missing configuration fail safely for the relevant feature instead of crashing unrelated pages.

### Environment rules
- `.env.example` must contain placeholders only
- No tracked file should contain real secret values
- Server-only secrets remain inside server utilities and route handlers
- Optional third-party integrations should degrade gracefully when not configured

### Expected validation coverage
- Supabase public URL and publishable key
- Supabase secret key for privileged server operations
- Admin and super-admin allowlist env values
- Auth-related site URL and redirect assumptions
- Other third-party envs remain out of scope for the foundation phase unless they affect auth/session behavior directly

### Safe user-facing behavior
- Login failures must use generic copy such as invalid credentials, sign-in unavailable, or access not authorized
- Missing privileged server configuration should be logged server-side and surfaced to users as safe failure states, not stack traces

## Foundation Deliverables
- Sanitized `.env.example`
- Centralized server env validation updated for auth and privileged server usage
- Real email/password login flow alongside existing Google OAuth flow
- Shared auth synchronization utility for allowlist -> profile role enforcement
- Migration updates for `profiles` bootstrap and RLS hardening
- Updated database types reflecting the current schema used by the app
- Admin route/session logic that is consistent across:
  - `proxy.ts`
  - server component guards
  - admin API guards

## Verification Criteria
- No real secrets remain in tracked env example files
- Both Google and email/password admin sign-in paths exist in code
- Non-allowlisted users cannot render `/admin`
- `admin` users cannot access `super_admin` sections
- Allowlisted users are synchronized into `public.profiles` with the correct role
- MFA is still required before privileged admin content renders
- RLS no longer allows direct anonymous inserts into `leads`, `contact_submissions`, or `bookings`
- `types/database.ts` matches the current schema touched by the app
- `npm run lint` passes
- `npm run build` passes

## Risks And Guardrails
- The current working tree already contains in-progress changes across auth, pricing, public forms, and proxy logic, so implementation must build on those changes rather than reverting them.
- Session protection must remain enforced in both optimistic proxy checks and definitive server-side guards.
- Adding email/password sign-in must not create a second privilege model; role access must still depend on the verified email allowlist and synchronized profile role.
- If profile bootstrapping is not automated, RLS and application checks will drift again after the next login.

## Implementation Order
1. Sanitize `.env.example` and strengthen env validation.
2. Add profile bootstrap and role-sync support in the database and server auth utilities.
3. Tighten RLS for public-write tables.
4. Replace the disabled email/password login path with a real authenticated flow.
5. Align proxy, server session guards, and admin API guards around the synchronized role model.
6. Regenerate or update database types and verify lint/build.
