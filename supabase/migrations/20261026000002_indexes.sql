-- 20261026000002_indexes.sql
-- Index untuk katalog, admin, dan pencarian.

create index if not exists products_created_at_idx
  on public.products (created_at desc);

create index if not exists products_status_idx
  on public.products (status);

create index if not exists products_category_idx
  on public.products (category);

create index if not exists products_price_idx
  on public.products (price);

create index if not exists products_name_trgm_idx
  on public.products using gin (name gin_trgm_ops);

-- SKU dan slug sudah memiliki unique constraint di tabel.
-- request_id juga unik, dipakai untuk idempotency create.
