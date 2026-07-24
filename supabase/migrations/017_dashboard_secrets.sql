-- Private dashboard secrets (Gemini API key, etc.).
-- NEVER put these in portfolio_settings (public read) or ai_knowledge.
-- Anon: no access. Authenticated: select/insert/update. Service role: all.

create table if not exists public.dashboard_secrets (
  key text primary key,
  value text not null default '',
  last_error text,
  last_error_at timestamptz,
  updated_at timestamptz not null default now()
);

revoke all on public.dashboard_secrets from anon;
grant select, insert, update on public.dashboard_secrets to authenticated;
grant all on public.dashboard_secrets to service_role;

alter table public.dashboard_secrets enable row level security;

drop policy if exists "dashboard_secrets_select_auth" on public.dashboard_secrets;
create policy "dashboard_secrets_select_auth"
  on public.dashboard_secrets for select
  to authenticated
  using (true);

drop policy if exists "dashboard_secrets_insert_auth" on public.dashboard_secrets;
create policy "dashboard_secrets_insert_auth"
  on public.dashboard_secrets for insert
  to authenticated
  with check (true);

drop policy if exists "dashboard_secrets_update_auth" on public.dashboard_secrets;
create policy "dashboard_secrets_update_auth"
  on public.dashboard_secrets for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "dashboard_secrets_service_all" on public.dashboard_secrets;
create policy "dashboard_secrets_service_all"
  on public.dashboard_secrets for all
  to service_role
  using (true)
  with check (true);

-- Seed empty Gemini key row (safe to re-run)
insert into public.dashboard_secrets (key, value)
values ('gemini_api_key', '')
on conflict (key) do nothing;
