# Nurse Prism Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Launch Nurse Prism with real public conversion flows, PayPal-backed paid consultation checkout, Supabase-backed admin editing, and production-ready messaging, SEO, analytics, and security.

**Architecture:** Keep the current Next.js App Router + Supabase structure. Replace placeholder public endpoints with validated Supabase writes, implement PayPal capture with booking/payment persistence, and extend the existing admin dashboard into a usable CMS over current tables.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Supabase Auth/Postgres/Storage, PayPal server SDK, Google Analytics.

---

## File Map

### Public Experience
- Modify: `app/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/services/page.tsx`
- Modify: `app/pricing/page.tsx`
- Modify: `app/program/page.tsx`
- Modify: `components/sections/*.tsx`
- Modify: `components/forms/contact-form.tsx`
- Modify: `components/forms/consultation-form.tsx`
- Modify: `components/forms/lead-capture-form.tsx`
- Modify: `data/services.ts`
- Modify: `data/pricing.ts`
- Modify: `data/faqs.ts`

### Public Backend
- Modify: `app/api/contact/route.ts`
- Modify: `app/api/leads/route.ts`
- Modify: `app/api/newsletter/route.ts`
- Modify: `app/api/paypal/create-order/route.ts`
- Modify: `app/api/paypal/capture-order/route.ts`
- Modify: `app/api/paypal/webhook/route.ts`
- Modify: `app/api/calendly/webhook/route.ts`
- Create: `lib/validations/public.ts`
- Create: `lib/paypal/*.ts`
- Create: `lib/calendly/*.ts`
- Create: `lib/cms/public.ts`

### Admin CMS
- Modify: `app/admin/**/*.tsx`
- Modify: `components/dashboard/*.tsx`
- Modify: `app/api/admin/blog/[id]/route.ts`
- Modify: `app/api/admin/blog/route.ts`
- Modify: `app/api/admin/media/upload/route.ts`
- Create: admin mutation routes for delete/update flows as needed.

### Analytics And SEO
- Create: `components/analytics/*.tsx`
- Modify: `app/layout.tsx`
- Modify: `lib/seo/*.ts`
- Modify: `app/sitemap.ts`

### Database
- Modify: `supabase/migrations/*.sql`
- Modify: `types/database.ts`

## Phased Tasks

### Task 1: Public Messaging And Positioning
- [ ] Update homepage hero, supporting sections, services, pricing, about, and program messaging for broader nurse career transitions.
- [ ] Add LinkedIn coaching as a named service and reflect remote/digital health/non-bedside options.
- [ ] Rewrite founder story around Kenya to Qatar, reflection, innovation, and career evolution.

### Task 2: Validation And Public Persistence
- [ ] Add shared zod schemas for consultation, contact, and newsletter flows.
- [ ] Add public route rate limiting.
- [ ] Persist consultation/package/newsletter interest into `leads`.
- [ ] Persist contact messages into `contact_submissions`.
- [ ] Persist consultation intents into `bookings`.
- [ ] Return structured success/error payloads and update client form UX accordingly.

### Task 3: PayPal And Calendly
- [ ] Add trusted server-side price resolution from package/intent data.
- [ ] Implement PayPal order creation.
- [ ] Implement PayPal order capture with `payments` and `payment_events` persistence.
- [ ] Tie bookings/leads/payments together.
- [ ] Return free and paid Calendly URLs from validated flows.
- [ ] Track Calendly click and post-payment handoff state.

### Task 4: Admin Dashboard Usability
- [ ] Add mutation flows for bookings, leads, and messages status updates.
- [ ] Finish blog CRUD including delete.
- [ ] Add media delete flow and usable library actions.
- [ ] Make page sections editable.
- [ ] Make pricing editable from `packages`.
- [ ] Make settings and appearance editable from `site_settings`.

### Task 5: SEO, Analytics, And Performance
- [ ] Add Google Analytics page-view and conversion events.
- [ ] Expand structured data and metadata for launch positioning.
- [ ] Optimize large image usage and logo handling.
- [ ] Re-run lint, targeted tests, and build verification.

## Risks To Watch
- PayPal API shape must be validated against the installed SDK and env vars.
- Current generated DB types are stale and may slow implementation if not updated early.
- Admin editing should remain additive and should not block safe static fallbacks on public pages.
