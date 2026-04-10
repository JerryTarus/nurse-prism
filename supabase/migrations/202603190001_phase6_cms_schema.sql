-- Nurse Prism CMS baseline schema + RLS policies
-- Phase 6 migration

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum ('nurse', 'admin', 'super_admin');
  end if;

  if not exists (select 1 from pg_type where typname = 'blog_status') then
    create type public.blog_status as enum ('draft', 'scheduled', 'published', 'archived');
  end if;

  if not exists (select 1 from pg_type where typname = 'lead_status') then
    create type public.lead_status as enum ('new', 'qualified', 'follow_up', 'won', 'lost');
  end if;

  if not exists (select 1 from pg_type where typname = 'lead_source') then
    create type public.lead_source as enum ('website', 'contact_form', 'pricing_page', 'program_page', 'referral', 'manual');
  end if;

  if not exists (select 1 from pg_type where typname = 'booking_status') then
    create type public.booking_status as enum ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
  end if;

  if not exists (select 1 from pg_type where typname = 'contact_status') then
    create type public.contact_status as enum ('new', 'in_progress', 'replied', 'closed');
  end if;

  if not exists (select 1 from pg_type where typname = 'pricing_category') then
    create type public.pricing_category as enum ('consultation', 'relocation', 'program');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role public.app_role not null default 'nurse',
  mfa_required boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.roles (
  id text primary key,
  label text not null
);

create table if not exists public.role_mappings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id text not null references public.roles(id) on delete cascade,
  assigned_at timestamptz not null default timezone('utc', now()),
  assigned_by uuid references auth.users(id) on delete set null,
  unique (user_id, role_id)
);

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_key text not null,
  section_key text not null,
  title text not null,
  content text not null,
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null,
  unique (page_key, section_key)
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  details text[] not null default '{}',
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  package_key text not null unique,
  name text not null,
  category public.pricing_category not null,
  base_price_kes numeric(12,2) not null check (base_price_kes >= 0),
  is_active boolean not null default true,
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  quote text not null,
  rating int check (rating between 1 and 5),
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blog_tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null,
  category_id uuid references public.blog_categories(id) on delete set null,
  tags text[] not null default '{}',
  status public.blog_status not null default 'draft',
  cover_image_url text,
  read_time_minutes int not null default 5 check (read_time_minutes > 0),
  published_at timestamptz,
  author_name text,
  author_role text,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blog_post_tags (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  tag_id uuid not null references public.blog_tags(id) on delete cascade,
  unique (post_id, tag_id)
);

create table if not exists public.media_files (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null,
  title text not null,
  alt_text text,
  mime_type text,
  size_bytes bigint,
  public_url text,
  created_at timestamptz not null default timezone('utc', now()),
  created_by uuid references auth.users(id) on delete set null,
  unique (bucket, path)
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  target_country text,
  intent text not null,
  status public.lead_status not null default 'new',
  source public.lead_source not null default 'website',
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status public.contact_status not null default 'new',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  intent text not null,
  status public.booking_status not null default 'pending',
  scheduled_for timestamptz,
  assigned_coach text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete set null,
  package_key text,
  amount_kes numeric(12,2) not null check (amount_kes >= 0),
  currency text not null default 'KES',
  status text not null default 'created',
  provider text not null default 'paypal',
  provider_order_id text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete cascade,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.outbound_email_logs (
  id uuid primary key default gen_random_uuid(),
  sent_by_user_id uuid references auth.users(id) on delete set null,
  provider text not null,
  provider_message_id text,
  recipient_email text not null,
  subject text not null,
  status text not null default 'queued',
  error_message text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.version_logs (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  version_number int not null default 1,
  data jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (entity_type, entity_id, version_number)
);

create index if not exists idx_role_mappings_user_id on public.role_mappings(user_id);
create index if not exists idx_page_sections_page_key on public.page_sections(page_key);
create index if not exists idx_services_sort_order on public.services(sort_order);
create index if not exists idx_packages_category on public.packages(category);
create index if not exists idx_faqs_sort_order on public.faqs(sort_order);
create index if not exists idx_blog_posts_status on public.blog_posts(status);
create index if not exists idx_blog_posts_published_at on public.blog_posts(published_at desc);
create index if not exists idx_media_files_created_at on public.media_files(created_at desc);
create index if not exists idx_leads_status_created_at on public.leads(status, created_at desc);
create index if not exists idx_contact_submissions_status on public.contact_submissions(status);
create index if not exists idx_bookings_status_scheduled_for on public.bookings(status, scheduled_for);
create index if not exists idx_payments_provider_order_id on public.payments(provider_order_id);
create index if not exists idx_payment_events_payment_id on public.payment_events(payment_id);
create index if not exists idx_outbound_email_logs_created_at on public.outbound_email_logs(created_at desc);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);
create index if not exists idx_version_logs_entity on public.version_logs(entity_type, entity_id);

insert into public.roles (id, label)
values
  ('admin', 'Admin'),
  ('super_admin', 'Super Admin')
on conflict (id) do nothing;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_services_updated_at on public.services;
create trigger trg_services_updated_at before update on public.services
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_packages_updated_at on public.packages;
create trigger trg_packages_updated_at before update on public.packages
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_testimonials_updated_at on public.testimonials;
create trigger trg_testimonials_updated_at before update on public.testimonials
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_faqs_updated_at on public.faqs;
create trigger trg_faqs_updated_at before update on public.faqs
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_blog_posts_updated_at on public.blog_posts;
create trigger trg_blog_posts_updated_at before update on public.blog_posts
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at before update on public.leads
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_contact_submissions_updated_at on public.contact_submissions;
create trigger trg_contact_submissions_updated_at before update on public.contact_submissions
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_bookings_updated_at on public.bookings;
create trigger trg_bookings_updated_at before update on public.bookings
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_payments_updated_at on public.payments;
create trigger trg_payments_updated_at before update on public.payments
for each row execute procedure public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'super_admin')
    )
    or exists (
      select 1
      from public.role_mappings rm
      where rm.user_id = auth.uid()
        and rm.role_id in ('admin', 'super_admin')
    );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'super_admin'
    )
    or exists (
      select 1
      from public.role_mappings rm
      where rm.user_id = auth.uid()
        and rm.role_id = 'super_admin'
    );
$$;

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.role_mappings enable row level security;
alter table public.site_settings enable row level security;
alter table public.page_sections enable row level security;
alter table public.services enable row level security;
alter table public.packages enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_tags enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_post_tags enable row level security;
alter table public.media_files enable row level security;
alter table public.leads enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.payment_events enable row level security;
alter table public.outbound_email_logs enable row level security;
alter table public.audit_logs enable row level security;
alter table public.version_logs enable row level security;

drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select on public.profiles
for select using (auth.uid() = id or public.is_admin());

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
for update using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

drop policy if exists roles_super_admin_manage on public.roles;
create policy roles_super_admin_manage on public.roles
for all using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists role_mappings_super_admin_manage on public.role_mappings;
create policy role_mappings_super_admin_manage on public.role_mappings
for all using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists settings_admin_read on public.site_settings;
create policy settings_admin_read on public.site_settings
for select using (public.is_admin());

drop policy if exists settings_super_admin_write on public.site_settings;
create policy settings_super_admin_write on public.site_settings
for all using (public.is_super_admin()) with check (public.is_super_admin());

drop policy if exists page_sections_admin_manage on public.page_sections;
create policy page_sections_admin_manage on public.page_sections
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists services_public_read on public.services;
create policy services_public_read on public.services
for select using (is_active = true);

drop policy if exists services_admin_manage on public.services;
create policy services_admin_manage on public.services
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists packages_public_read on public.packages;
create policy packages_public_read on public.packages
for select using (is_active = true);

drop policy if exists packages_admin_manage on public.packages;
create policy packages_admin_manage on public.packages
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists testimonials_public_read on public.testimonials;
create policy testimonials_public_read on public.testimonials
for select using (is_active = true);

drop policy if exists testimonials_admin_manage on public.testimonials;
create policy testimonials_admin_manage on public.testimonials
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists faqs_public_read on public.faqs;
create policy faqs_public_read on public.faqs
for select using (is_active = true);

drop policy if exists faqs_admin_manage on public.faqs;
create policy faqs_admin_manage on public.faqs
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists blog_categories_admin_manage on public.blog_categories;
create policy blog_categories_admin_manage on public.blog_categories
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists blog_tags_admin_manage on public.blog_tags;
create policy blog_tags_admin_manage on public.blog_tags
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists blog_posts_public_read on public.blog_posts;
create policy blog_posts_public_read on public.blog_posts
for select using (status = 'published');

drop policy if exists blog_posts_admin_manage on public.blog_posts;
create policy blog_posts_admin_manage on public.blog_posts
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists blog_post_tags_admin_manage on public.blog_post_tags;
create policy blog_post_tags_admin_manage on public.blog_post_tags
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists media_files_admin_manage on public.media_files;
create policy media_files_admin_manage on public.media_files
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists leads_public_insert on public.leads;
create policy leads_public_insert on public.leads
for insert with check (true);

drop policy if exists leads_admin_manage on public.leads;
create policy leads_admin_manage on public.leads
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists contact_public_insert on public.contact_submissions;
create policy contact_public_insert on public.contact_submissions
for insert with check (true);

drop policy if exists contact_admin_manage on public.contact_submissions;
create policy contact_admin_manage on public.contact_submissions
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists bookings_public_insert on public.bookings;
create policy bookings_public_insert on public.bookings
for insert with check (true);

drop policy if exists bookings_admin_manage on public.bookings;
create policy bookings_admin_manage on public.bookings
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists payments_admin_manage on public.payments;
create policy payments_admin_manage on public.payments
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists payment_events_admin_manage on public.payment_events;
create policy payment_events_admin_manage on public.payment_events
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists outbound_emails_admin_manage on public.outbound_email_logs;
create policy outbound_emails_admin_manage on public.outbound_email_logs
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists audit_logs_super_admin_read on public.audit_logs;
create policy audit_logs_super_admin_read on public.audit_logs
for select using (public.is_super_admin());

drop policy if exists audit_logs_admin_insert on public.audit_logs;
create policy audit_logs_admin_insert on public.audit_logs
for insert with check (public.is_admin());

drop policy if exists version_logs_admin_manage on public.version_logs;
create policy version_logs_admin_manage on public.version_logs
for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists media_bucket_public_read on storage.objects;
create policy media_bucket_public_read on storage.objects
for select using (bucket_id = 'media');

drop policy if exists media_bucket_admin_insert on storage.objects;
create policy media_bucket_admin_insert on storage.objects
for insert with check (bucket_id = 'media' and public.is_admin());

drop policy if exists media_bucket_admin_update on storage.objects;
create policy media_bucket_admin_update on storage.objects
for update using (bucket_id = 'media' and public.is_admin())
with check (bucket_id = 'media' and public.is_admin());

drop policy if exists media_bucket_admin_delete on storage.objects;
create policy media_bucket_admin_delete on storage.objects
for delete using (bucket_id = 'media' and public.is_admin());
