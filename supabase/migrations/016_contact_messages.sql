-- Visitor contact form messages (inbox). Same email = same thread in dashboard.
-- Public can INSERT only; authenticated can SELECT / UPDATE / DELETE.

create extension if not exists pgcrypto;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  email_key text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  constraint contact_messages_name_len check (char_length(trim(name)) between 1 and 120),
  constraint contact_messages_email_len check (char_length(trim(email)) between 3 and 254),
  constraint contact_messages_message_len check (char_length(trim(message)) between 1 and 5000)
);

create index if not exists contact_messages_email_key_created_idx
  on public.contact_messages (email_key, created_at asc);

create index if not exists contact_messages_created_idx
  on public.contact_messages (created_at desc);

create index if not exists contact_messages_unread_idx
  on public.contact_messages (is_read)
  where is_read = false;

grant select, update, delete on public.contact_messages to authenticated, service_role;
grant insert on public.contact_messages to anon, authenticated, service_role;

alter table public.contact_messages enable row level security;

drop policy if exists "contact_messages_insert_public" on public.contact_messages;
create policy "contact_messages_insert_public"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

drop policy if exists "contact_messages_select_auth" on public.contact_messages;
create policy "contact_messages_select_auth"
  on public.contact_messages for select
  to authenticated
  using (true);

drop policy if exists "contact_messages_update_auth" on public.contact_messages;
create policy "contact_messages_update_auth"
  on public.contact_messages for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "contact_messages_delete_auth" on public.contact_messages;
create policy "contact_messages_delete_auth"
  on public.contact_messages for delete
  to authenticated
  using (true);

drop policy if exists "contact_messages_service_all" on public.contact_messages;
create policy "contact_messages_service_all"
  on public.contact_messages for all
  to service_role
  using (true)
  with check (true);
