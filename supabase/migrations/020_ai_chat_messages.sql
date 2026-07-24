-- Visitor AI chat questions (dashboard inbox). Same IP = same thread.
-- Inserts only via service_role from /api/chat; authenticated can SELECT / UPDATE / DELETE.
-- Private dashboard-only. Never synced to ai_knowledge.

create extension if not exists pgcrypto;

create table if not exists public.ai_chat_messages (
  id uuid primary key default gen_random_uuid(),
  ip text not null,
  ip_key text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  constraint ai_chat_messages_ip_len check (char_length(trim(ip)) between 1 and 64),
  constraint ai_chat_messages_message_len check (char_length(trim(message)) between 1 and 5000)
);

create index if not exists ai_chat_messages_ip_key_created_idx
  on public.ai_chat_messages (ip_key, created_at asc);

create index if not exists ai_chat_messages_created_idx
  on public.ai_chat_messages (created_at desc);

create index if not exists ai_chat_messages_unread_idx
  on public.ai_chat_messages (is_read)
  where is_read = false;

revoke all on public.ai_chat_messages from anon;
grant select, update, delete on public.ai_chat_messages to authenticated, service_role;
grant insert on public.ai_chat_messages to service_role;

alter table public.ai_chat_messages enable row level security;

drop policy if exists "ai_chat_messages_select_auth" on public.ai_chat_messages;
create policy "ai_chat_messages_select_auth"
  on public.ai_chat_messages for select
  to authenticated
  using (true);

drop policy if exists "ai_chat_messages_update_auth" on public.ai_chat_messages;
create policy "ai_chat_messages_update_auth"
  on public.ai_chat_messages for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "ai_chat_messages_delete_auth" on public.ai_chat_messages;
create policy "ai_chat_messages_delete_auth"
  on public.ai_chat_messages for delete
  to authenticated
  using (true);

drop policy if exists "ai_chat_messages_service_all" on public.ai_chat_messages;
create policy "ai_chat_messages_service_all"
  on public.ai_chat_messages for all
  to service_role
  using (true)
  with check (true);
