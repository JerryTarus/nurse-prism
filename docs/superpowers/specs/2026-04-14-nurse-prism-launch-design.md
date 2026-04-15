# Nurse Prism Launch Design

## Goal
Launch Nurse Prism as a Supabase-backed Next.js application for nurse career transition coaching, with real public conversion flows, working paid consultation checkout, usable admin CMS tooling, and launch-ready SEO, analytics, and security.

## Constraints
- Preserve the current Next.js App Router + Supabase architecture.
- Do not introduce a new CMS or replace the stack.
- Keep the existing file structure and route layout where practical.
- Prioritize launch-critical behavior over optional polish.
- Remove placeholder public conversion endpoints.

## Product Direction
Nurse Prism will be positioned as a broader nurse career transition platform, not only a Gulf relocation brand. Messaging will cover:
- International opportunities across the US, UK, Canada, Australia, the Middle East, and Europe.
- Remote work, digital health, health tech, and non-bedside career pivots.
- LinkedIn coaching as a named service.
- Founder-led credibility grounded in clinical practice, cross-border experience, and career evolution.

## Launch Scope

### Phase 1: Public Funnel And Revenue
- Update public messaging across homepage, about, services, pricing, and program pages.
- Replace placeholder lead, contact, and newsletter routes with validated Supabase-backed handlers.
- Persist leads, contact submissions, newsletter-style leads, booking intents, payment records, and payment events.
- Implement plan-aware PayPal order creation and order capture.
- Use the selected plan or consultation intent to derive the payable amount server-side.
- After successful payment capture for paid consultations, direct the user to the paid Calendly flow.
- For free consultations, persist the request and direct the user to the free Calendly flow.
- Track Calendly click intent for both free and paid flows.

### Phase 2: Admin CMS Completion
- Make bookings, leads, and messages operational, not read-only.
- Complete blog CRUD including delete/publish/archive flows.
- Complete media management with upload and delete support.
- Add editable admin forms for page content, pricing, settings, and appearance using existing Supabase tables.
- Extend page section/content editing to support CTA copy/link, image assignment references, and SEO fields without introducing a new CMS layer.

### Phase 3: Launch Polish
- Add Google Analytics page views and event tracking.
- Strengthen SEO metadata and structured data for core pages.
- Optimize large asset usage and image handling.
- Keep motion subtle and performance-safe.

## Architecture

### Public Content
Public pages remain rendered from the current App Router structure. Static `data/` files continue to act as safe defaults, while CMS-backed reads are introduced where current admin tables already exist. This preserves the current architecture and avoids an invasive rewrite.

### Conversion Flow
Public forms continue to submit through existing route handlers in `app/api/...`. Those handlers will:
- Parse and validate JSON payloads with zod.
- Enforce rate limits on sensitive public endpoints.
- Persist records through Supabase.
- Return structured success/error payloads that the current client forms can display cleanly.

### Paid Consultation Flow
For paid consultation and package intents:
1. User selects a plan or paid consultation intent.
2. Server derives pricing from trusted catalog/config data or CMS package data.
3. Route creates or reuses a `lead` and `booking` record in `pending` state.
4. PayPal order is created with the computed amount.
5. On capture, server verifies the response, updates `payments`, appends a `payment_events` row, updates the linked booking, and returns the paid Calendly URL for the next step.

For free consultations:
1. Submission persists a lead and booking intent.
2. Response includes the free Calendly URL.
3. Calendly click tracking is recorded before redirect or via explicit CTA state.

### Admin CMS
The existing dashboard routes stay in place. The current read-only tables and cards become editable through focused forms and mutation routes against:
- `blog_posts`
- `media_files`
- `page_sections`
- `packages`
- `site_settings`
- `leads`
- `contact_submissions`
- `bookings`

### Settings And Appearance
Site-wide settings continue to live in `site_settings`. Appearance-specific values continue to use the `appearance.*` namespace. Public rendering helpers will resolve these settings with safe static fallbacks to avoid blank UI when tables are empty.

## Data Design

### Existing Tables To Use
- `leads` for consultation/package/newsletter interest.
- `contact_submissions` for contact form messages.
- `bookings` for consultation and paid session scheduling state.
- `payments` and `payment_events` for PayPal lifecycle data.
- `blog_posts`, `media_files`, `page_sections`, `packages`, `site_settings` for CMS/admin.

### Minimal Schema Extension
The current schema is close, but launch work may require additive migration changes only where necessary:
- Add fields for newsletter source handling if current `lead_source` values are insufficient.
- Add page-section metadata columns if CTA links, image refs, or SEO data cannot be safely represented in existing content rows.
- Add booking/payment linkage fields only if the current tables do not cover the needed relationships cleanly.

Any migration changes should stay incremental and compatible with existing RLS patterns.

## Security
- Keep current admin/super_admin allowlisting and route protection.
- Enforce authorization inside every mutation route.
- Keep server-only secret use in route handlers and Supabase admin helpers.
- Add validation to every public/admin write path.
- Keep RLS compatibility by preferring the existing table/policy model.
- Avoid trusting client-provided price amounts or privileged role claims.

## SEO And Analytics
- Continue using existing metadata helpers, sitemap, robots, and JSON-LD patterns.
- Expand structured data where it helps launch pages.
- Add GA page-view/event tracking through a lightweight client-side analytics layer and web vitals-safe integration.

## Testing And Verification
- Add lightweight automated coverage for critical validation and server-side flow helpers.
- Verify linting, targeted tests, and build before completion.

## Implementation Order
1. Messaging and service positioning updates.
2. Real public conversion routes and Supabase persistence.
3. PayPal create/capture flow and paid Calendly handoff.
4. Admin operational editing flows.
5. Analytics, SEO strengthening, and performance polish.
