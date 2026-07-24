-- Manual "in use" picker among active Gemini keys (exactly one current).

alter table public.gemini_api_keys
  add column if not exists is_current boolean not null default false;

-- At most one key marked in use
create unique index if not exists gemini_api_keys_one_current
  on public.gemini_api_keys (is_current)
  where is_current = true;

-- Backfill: oldest active key becomes in use if none set
update public.gemini_api_keys k
set is_current = true
where k.id = (
  select id
  from public.gemini_api_keys
  where is_active = true
  order by created_at asc
  limit 1
)
and not exists (
  select 1 from public.gemini_api_keys where is_current = true
);
