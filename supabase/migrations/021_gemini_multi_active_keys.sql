-- Allow multiple active Gemini keys (app enforces max 5).
-- Chat failover deactivates exhausted keys automatically.

drop index if exists public.gemini_api_keys_one_active;
