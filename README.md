# Nurse Prism

Nurse Prism helps nurses find clarity, transition beyond the bedside, and build aligned roles in remote, tech, and international spaces.

## Tech Stack
- **Framework:** Next.js 16.2.0 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database & Auth:** Supabase
- **Payments:** PayPal
- **Scheduling:** Calendly

## Setup Instructions

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Variables**
   Create a \`.env.local\` file in the root directory and use the placeholders from \`.env.local\` (ensure you use the correct secret keys for your environment):
   \`\`\`env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   SUPABASE_SECRET_KEY=your_supabase_service_role_key

   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com # or production URL

   NEXT_PUBLIC_CALENDLY_FREE_URL=your_calendly_free_url
   NEXT_PUBLIC_CALENDLY_PAID_URL=your_calendly_paid_url
   
   AUTH_ADMIN_EMAILS=nurseprism@gmail.com
   AUTH_SUPER_ADMIN_EMAILS=crotonnbyte@gmail.com
   \`\`\`

3. **Supabase Database Setup**
   Run the following migrations in your Supabase SQL editor in this order:
   - \`supabase/migrations/202603190001_phase6_cms_schema.sql\`
   - \`supabase/migrations/202604140001_launch_funnel_fields.sql\`
   - \`supabase/migrations/202604300001_foundation_auth_rls.sql\`
   - \`supabase/seed.sql\`

4. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Application Structure

- \`/app/(public)\`: Public-facing pages (Home, About, Services, Pricing, Blog).
- \`/app/admin\`: Protected admin dashboard for CMS and management.
- \`/app/api\`: API routes for payments, leads, and webhook handlers.
- \`/components\`: Reusable UI components.
- \`/lib\`: Core utilities, Supabase clients, and logic.
- \`/supabase/migrations\`: Database schema definition and RLS policies.

## Admin Dashboard

The Admin Dashboard is strictly gated. Access requires:
1. The user's email to match \`AUTH_ADMIN_EMAILS\` or \`AUTH_SUPER_ADMIN_EMAILS\`.
2. Supabase Authentication (e.g., via Google Auth or email/password).

## Limitations and Future Work
- **Calendly Webhook:** Currently a placeholder in \`/app/api/calendly/webhook\`. Needs a valid signing secret configured in production to handle automatic event tracking.
