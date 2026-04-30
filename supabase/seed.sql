insert into public.roles (id, label)
values
  ('admin', 'Admin'),
  ('super_admin', 'Super Admin')
on conflict (id) do update
set label = excluded.label;
