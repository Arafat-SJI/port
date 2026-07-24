-- Add display name for Gemini API keys (safe if column already exists).

alter table public.gemini_api_keys
  add column if not exists name text;

comment on column public.gemini_api_keys.name is 'Optional label shown in dashboard (never exposed publicly).';
