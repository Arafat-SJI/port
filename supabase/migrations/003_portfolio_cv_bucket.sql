-- Public CV PDF storage for About secondary CTA (Download CV).
-- Safe to re-run.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-cv',
  'portfolio-cv',
  true,
  5242880,
  array['application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read
drop policy if exists "portfolio_cv_public_read" on storage.objects;
create policy "portfolio_cv_public_read"
  on storage.objects for select
  using (bucket_id = 'portfolio-cv');

-- Authenticated upload/update/delete (dashboard)
drop policy if exists "portfolio_cv_auth_insert" on storage.objects;
create policy "portfolio_cv_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-cv');

drop policy if exists "portfolio_cv_auth_update" on storage.objects;
create policy "portfolio_cv_auth_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-cv')
  with check (bucket_id = 'portfolio-cv');

drop policy if exists "portfolio_cv_auth_delete" on storage.objects;
create policy "portfolio_cv_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-cv');
