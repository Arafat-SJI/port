-- Multiple Gemini API keys with one active toggle.
-- Private: anon denied; authenticated CRUD; service_role all.
-- Migrates any single key previously stored in dashboard_secrets.

create extension if not exists pgcrypto;

create table if not exists public.gemini_api_keys (
  id uuid primary key default gen_random_uuid(),
  name text,
  value text not null,
  is_active boolean not null default false,
  last_error text,
  last_error_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gemini_api_keys_value_len check (char_length(trim(value)) >= 16)
);

-- At most one active key
create unique index if not exists gemini_api_keys_one_active
  on public.gemini_api_keys (is_active)
  where is_active = true;

create index if not exists gemini_api_keys_created_idx
  on public.gemini_api_keys (created_at desc);

revoke all on public.gemini_api_keys from anon;
grant select, insert, update, delete on public.gemini_api_keys to authenticated;
grant all on public.gemini_api_keys to service_role;

alter table public.gemini_api_keys enable row level security;

drop policy if exists "gemini_api_keys_select_auth" on public.gemini_api_keys;
create policy "gemini_api_keys_select_auth"
  on public.gemini_api_keys for select
  to authenticated
  using (true);

drop policy if exists "gemini_api_keys_insert_auth" on public.gemini_api_keys;
create policy "gemini_api_keys_insert_auth"
  on public.gemini_api_keys for insert
  to authenticated
  with check (true);

drop policy if exists "gemini_api_keys_update_auth" on public.gemini_api_keys;
create policy "gemini_api_keys_update_auth"
  on public.gemini_api_keys for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "gemini_api_keys_delete_auth" on public.gemini_api_keys;
create policy "gemini_api_keys_delete_auth"
  on public.gemini_api_keys for delete
  to authenticated
  using (true);

drop policy if exists "gemini_api_keys_service_all" on public.gemini_api_keys;
create policy "gemini_api_keys_service_all"
  on public.gemini_api_keys for all
  to service_role
  using (true)
  with check (true);

-- Move legacy single key from dashboard_secrets (if any)
insert into public.gemini_api_keys (value, is_active, created_at, updated_at)
select trim(value), true, coalesce(updated_at, now()), now()
from public.dashboard_secrets
where key = 'gemini_api_key'
  and char_length(trim(value)) >= 16
  and not exists (select 1 from public.gemini_api_keys limit 1);
