alter table public.contact_submissions
add column if not exists country text;

alter table public.bookings
add column if not exists lead_id uuid references public.leads(id) on delete set null,
add column if not exists target_country text,
add column if not exists package_key text,
add column if not exists payment_status text not null default 'not_required',
add column if not exists calendly_url text,
add column if not exists calendly_clicked_at timestamptz,
add column if not exists payment_completed_at timestamptz;

alter table public.payments
add column if not exists checkout_amount numeric(12,2) check (checkout_amount >= 0),
add column if not exists approval_url text,
add column if not exists provider_capture_id text,
add column if not exists captured_at timestamptz;

create index if not exists idx_bookings_lead_id on public.bookings(lead_id);
create index if not exists idx_bookings_package_key on public.bookings(package_key);
create index if not exists idx_bookings_payment_status on public.bookings(payment_status);
create index if not exists idx_payments_booking_status on public.payments(booking_id, status);
