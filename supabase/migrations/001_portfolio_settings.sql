-- Dashboard settings (public read, authenticated write)
create table if not exists public.portfolio_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

grant select on public.portfolio_settings to anon, authenticated, service_role;
grant insert, update, delete on public.portfolio_settings to authenticated, service_role;

alter table public.portfolio_settings enable row level security;

drop policy if exists "portfolio_settings_select_public" on public.portfolio_settings;
create policy "portfolio_settings_select_public"
  on public.portfolio_settings for select
  using (true);

drop policy if exists "portfolio_settings_insert_auth" on public.portfolio_settings;
create policy "portfolio_settings_insert_auth"
  on public.portfolio_settings for insert
  to authenticated
  with check (true);

drop policy if exists "portfolio_settings_update_auth" on public.portfolio_settings;
create policy "portfolio_settings_update_auth"
  on public.portfolio_settings for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "portfolio_settings_service_all" on public.portfolio_settings;
create policy "portfolio_settings_service_all"
  on public.portfolio_settings for all
  to service_role
  using (true)
  with check (true);

insert into public.portfolio_settings (key, value)
values (
  'section_order',
  '["about","experience","skills","projects","education","awards","publication","gallery","clubing","mentorship"]'::jsonb
)
on conflict (key) do nothing;
