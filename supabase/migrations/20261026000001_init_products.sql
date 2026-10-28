-- 20261026000001_init_products.sql
-- Tabel katalog preloved. Satu baris = satu piece unik.

create extension if not exists pg_trgm;
create sequence if not exists public.product_sku_seq start with 1 increment by 1;

create table public.products (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  name          text not null check (char_length(name) between 3 and 80),
  slug          text not null unique,
  sku           text not null unique
                default (
                  'PSW-' || to_char(now(), 'YYMM') || '-' ||
                  lpad(nextval('public.product_sku_seq')::text, 3, '0')
                ),
  price         numeric(12, 2) not null check (price > 0),
  size          text not null check (char_length(size) between 1 and 16),
  category      text not null check (
                  category in ('Atasan', 'Bawahan', 'Dress', 'Outerwear', 'Aksesori')
                ),
  description   text not null check (char_length(description) between 1 and 2000),
  defect_notes  text check (defect_notes is null or char_length(defect_notes) <= 500),
  images        text[] not null check (coalesce(array_length(images, 1), 0) between 1 and 8),
  status        boolean not null default true,
  created_by    uuid references auth.users(id) on delete set null,
  request_id    uuid unique
);

comment on table public.products is 'Katalog preloved; satu baris = satu piece unik.';
comment on column public.products.status is 'true = Tersedia, false = Terjual.';
comment on column public.products.sku is 'Format PSW-YYMM-XXX, dibuat otomatis oleh sequence.';
comment on column public.products.request_id is 'Idempotency key untuk create product.';

-- Hak akses tabel. RLS tetap menjadi pertahanan utama.
grant select on table public.products to anon, authenticated;
grant insert, update, delete on table public.products to authenticated;
grant usage, select on sequence public.product_sku_seq to authenticated;
