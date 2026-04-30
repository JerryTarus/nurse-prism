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
