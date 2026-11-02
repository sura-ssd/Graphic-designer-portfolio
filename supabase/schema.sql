create extension if not exists pgcrypto;

create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null,
  image_url text not null,
  images text[] not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.works enable row level security;
alter table public.messages enable row level security;

grant select on public.works to anon, authenticated;
grant insert, update, delete on public.works to authenticated;
grant insert on public.messages to anon, authenticated;
grant select, update, delete on public.messages to authenticated;

drop policy if exists "Anyone can view works" on public.works;
create policy "Anyone can view works"
  on public.works for select
  using (true);

drop policy if exists "Authenticated users can add works" on public.works;
create policy "Authenticated users can add works"
  on public.works for insert to authenticated
  with check (true);

drop policy if exists "Authenticated users can update works" on public.works;
create policy "Authenticated users can update works"
  on public.works for update to authenticated
  using (true) with check (true);

drop policy if exists "Authenticated users can delete works" on public.works;
create policy "Authenticated users can delete works"
  on public.works for delete to authenticated
  using (true);

drop policy if exists "Anyone can submit a message" on public.messages;
create policy "Anyone can submit a message"
  on public.messages for insert to anon, authenticated
  with check (true);

drop policy if exists "Authenticated users can view messages" on public.messages;
create policy "Authenticated users can view messages"
  on public.messages for select to authenticated
  using (true);

drop policy if exists "Authenticated users can update messages" on public.messages;
create policy "Authenticated users can update messages"
  on public.messages for update to authenticated
  using (true) with check (true);

drop policy if exists "Authenticated users can delete messages" on public.messages;
create policy "Authenticated users can delete messages"
  on public.messages for delete to authenticated
  using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-images', 'portfolio-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view portfolio images" on storage.objects;
create policy "Public can view portfolio images"
  on storage.objects for select
  using (bucket_id = 'portfolio-images');

drop policy if exists "Authenticated users can upload portfolio images" on storage.objects;
create policy "Authenticated users can upload portfolio images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-images');

drop policy if exists "Authenticated users can update portfolio images" on storage.objects;
create policy "Authenticated users can update portfolio images"
  on storage.objects for update to authenticated
  using (bucket_id = 'portfolio-images') with check (bucket_id = 'portfolio-images');

drop policy if exists "Authenticated users can delete portfolio images" on storage.objects;
create policy "Authenticated users can delete portfolio images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-images');
