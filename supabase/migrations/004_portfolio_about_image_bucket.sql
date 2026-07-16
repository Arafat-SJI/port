-- Public About portrait image storage.
-- Safe to re-run.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-about',
  'portfolio-about',
  true,
  3145728,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "portfolio_about_public_read" on storage.objects;
create policy "portfolio_about_public_read"
  on storage.objects for select
  using (bucket_id = 'portfolio-about');

drop policy if exists "portfolio_about_auth_insert" on storage.objects;
create policy "portfolio_about_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-about');

drop policy if exists "portfolio_about_auth_update" on storage.objects;
create policy "portfolio_about_auth_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-about')
  with check (bucket_id = 'portfolio-about');

drop policy if exists "portfolio_about_auth_delete" on storage.objects;
create policy "portfolio_about_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-about');
