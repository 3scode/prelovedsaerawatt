# TECH-SPEC.md — prelovedsaerawatt

> **Technical Specification**
> Versi: 1.0 · Tanggal: 26 Oktober 2026 · Status: Final Draft
> Referensi: `.agents/PRD.md` + `.agents/DESIGN.md`
> Platform: Web Application (responsive, mobile-first)
> Stack: Next.js 16 App Router + Supabase + Cloudinary + Vercel
> Design references: tidak ada (Stitch prompt tidak dibuat)

---

## Ringkasan Eksekutif

prelovedsaerawatt adalah katalog preloved satu-orang-satu-barang dengan checkout via WhatsApp. Tidak ada pembayaran online, tidak ada akun pembeli, dan tidak ada order table. Prioritas teknis:

1. **Storefront cepat & visual** — Server Components + ISR, foto Cloudinary teroptimasi.
2. **Cart yang jujur** — Zustand + localStorage, direvalidasi ke server sebelum checkout.
3. **Admin ringan** — Supabase Auth, CRUD produk, upload Cloudinary bertanda tangan.
4. **Satu sumber kebenaran** — Supabase Postgres + RLS, semua mutasi lewat Server Actions.

**Yang sengaja TIDAK dibuat di MVP:** payment gateway, akun pembeli, wishlist, order tracking, multi-admin roles, email transaksional, dark mode, dan Google Stitch references.

---

# BAGIAN 1 — TECH STACK & ARSITEKTUR

## 1.1 Tech Stack

| Layer | Technology | Version | Catatan |
|---|---|---|---|
| Runtime lokal | **Bun** | 1.4.4 | Semua script & install memakai Bun |
| Runtime produksi | **Node.js LTS** | 24.22.1 (Krypton) | Vercel Node runtime |
| Framework | **Next.js** | 16.4.3 | App Router, RSC, Server Actions, `proxy.ts` |
| UI runtime | **React / React DOM** | 19.3.1 | `useActionState`, `useOptimistic` |
| Language | **TypeScript** | 7.0.2 | `strict: true` |
| Styling | **Tailwind CSS** | 4.3.3 | CSS-first `@theme` |
| UI components | **shadcn CLI** | 4.22.1 | Radix primitives, dikustomisasi token DESIGN.md |
| Icons | **Lucide React** | 1.61.0 | Outline, stroke 1.5 |
| State | **Zustand** | 5.0.16 | `persist` → localStorage |
| Database | **Supabase Postgres** | PostgreSQL 17 (managed) | Region `ap-southeast-1` |
| DB client | **@supabase/supabase-js** | 2.118.0 | Anon key + RLS |
| SSR auth | **@supabase/ssr** | 0.12.7 | Cookie-based session |
| Auth | **Supabase Auth** | — | Email/password, admin-only |
| Media | **Cloudinary** | 2.11.0 (SDK) | Signed upload |
| Media React | **next-cloudinary** | 6.19.3 | Optimasi gambar |
| Validation | **Zod** | 4.6.7 | Server + client schema |
| Utility | **nanoid** | 6.0.2 | Slug suffix & request ID |
| Utility | **slugify** | 1.6.9 | Slug produk |
| Hosting | **Vercel** | — | Region `sin1` |
| Monitoring | **Sentry** | 11.9.0 | Error tracking + tracing |
| Analytics | **@vercel/analytics** | 2.0.1 | Page views + custom events |
| Speed | **@vercel/speed-insights** | 2.0.0 | Core Web Vitals |
| Unit test | **Vitest + Vite + Testing Library** | 5.0.5 / 8.3.5 / 16.3.3 | `@vitejs/plugin-react` 6.1.2 |
| E2E test | **Playwright** | 1.64.1 | + `@axe-core/playwright` 4.14.0 |
| Lint / format | **ESLint / Prettier** | 10.13.0 / 3.9.10 | Flat config |

## 1.2 Arsitektur Sistem

```
┌──────────────────────────────────────────────────────────────────┐
│                        BROWSER (Vercel Edge)                       │
│                                                                  │
│  Public RSC pages ──────┐        Cart (Zustand + localStorage)   │
│  Admin RSC pages ───────┤                    │                    │
│  Client islands ────────┘                    │                    │
└──────────────┬───────────────────────────────┼───────────────────┘
               │ HTML / RSC payload            │ POST /api/cart/validate
               ▼                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                    NEXT.JS 16 ON VERCEL (sin1)                    │
│                                                                  │
│  App Router                                                      │
│  ├── Public pages (ISR 60s)  ──┐                                 │
│  ├── Shop (dynamic searchParams)│                                │
│  ├── PDP (ISR 60s)            ├──► Supabase Postgres (anon+RLS)  │
│  ├── Admin (auth cookie)      │                                 │
│  ├── Server Actions ──────────┘                                 │
│  ├── /api/cloudinary/sign ───────► Cloudinary Admin API          │
│  ├── /api/cart/validate ─────────► Supabase (read-only)          │
│  └── /api/health                                                 │
└──────────────┬───────────────────────────────┬───────────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────┐      ┌───────────────────────────────┐
│ SUPABASE                 │      │ CLOUDINARY                    │
│ ├── Postgres 17          │      │ ├── Upload (signed)           │
│ ├── Auth (admin only)    │      │ ├── Transform f_auto,q_auto   │
│ └── RLS                  │      │ └── CDN global                │
└──────────────────────────┘      └───────────────────────────────┘

External: wa.me (checkout) · Sentry · Vercel Analytics
```

**Prinsip arsitektur:**
- Storefront **read-only** langsung dari Server Components ke Supabase dengan anon key + RLS. Tidak perlu API layer untuk katalog.
- Semua **mutasi admin** lewat Server Actions, bukan REST publik. Auth dicek dua kali: `proxy.ts` (redirect) + action (role).
- **Cart tetap client-side**; server hanya memvalidasi status/harga lewat satu endpoint.
- **Cloudinary upload langsung dari browser** memakai signature dari server; file tidak melewati Vercel function.

## 1.3 Rendering Strategy

| Route | Rendering | Cache | Alasan |
|---|---|---|---|
| `/` | RSC + ISR | `revalidate = 60` | Koleksi terbaru, jarang berubah |
| `/shop` | RSC dynamic | No cache (searchParams) | Filter/search harus real-time |
| `/produk/[slug]` | RSC + ISR | `revalidate = 60` + tag `products` | PDP stabil, tetap bisa invalidasi saat admin edit |
| `/keranjang` | Client Component | — | Data dari localStorage |
| `/tentang` | Static RSC | Build-time | Konten statis |
| `/admin/login` | RSC shell + Client form | No cache | Auth |
| `/admin` | RSC dynamic | No cache | Data inventaris |
| `/admin/produk/baru` | RSC shell + Client form | No cache | Form |
| `/admin/produk/[id]/edit` | RSC + Client form | No cache | Data terbaru |
| `/404` | Static | Build-time | `not-found.tsx` |

Setelah mutasi produk: `revalidatePath("/")`, `revalidatePath("/shop")`, `revalidatePath("/produk/[slug]", "page")`, dan `revalidateTag("products")`.

## 1.4 Struktur Folder

```
prelovedsaerawatt/
├── src/
│   ├── app/
│   │   ├── (store)/
│   │   │   ├── layout.tsx              # Header + Footer storefront
│   │   │   ├── page.tsx                # Screen 01 Beranda
│   │   │   ├── shop/page.tsx           # Screen 02 Katalog
│   │   │   ├── produk/[slug]/page.tsx  # Screen 03 PDP
│   │   │   ├── keranjang/page.tsx      # Screen 04 Cart (client)
│   │   │   ├── tentang/page.tsx        # Screen 05 Tentang
│   │   │   └── not-found.tsx           # Screen 09 404 (store)
│   │   ├── admin/
│   │   │   ├── login/page.tsx          # Screen 06 Login
│   │   │   ├── layout.tsx              # Admin shell (auth guard visual)
│   │   │   ├── page.tsx                # Screen 07 Dashboard
│   │   │   └── produk/
│   │   │       ├── baru/page.tsx       # Screen 08 Create
│   │   │       └── [id]/edit/page.tsx  # Screen 08 Edit
│   │   ├── api/
│   │   │   ├── cart/validate/route.ts
│   │   │   ├── cloudinary/sign/route.ts
│   │   │   └── health/route.ts
│   │   ├── actions/
│   │   │   ├── auth.ts
│   │   │   └── products.ts
│   │   ├── globals.css
│   │   ├── layout.tsx                  # Root layout, fonts, metadata
│   │   ├── not-found.tsx               # Global 404
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── ui/                         # shadcn: button, input, dialog, sheet, toast...
│   │   ├── store/
│   │   │   ├── site-header.tsx
│   │   │   ├── product-card.tsx
│   │   │   ├── product-gallery.tsx
│   │   │   ├── cart-line-item.tsx
│   │   │   ├── cart-summary.tsx
│   │   │   ├── checkout-sheet.tsx
│   │   │   ├── shop-filters.tsx
│   │   │   ├── search-field.tsx
│   │   │   └── empty-state.tsx
│   │   └── admin/
│   │       ├── admin-sidebar.tsx
│   │       ├── stat-card.tsx
│   │       ├── product-table.tsx
│   │       ├── product-row-card.tsx
│   │       ├── image-uploader.tsx
│   │       ├── product-form.tsx
│   │       └── status-toggle.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── public.ts               # Stateless anon client
│   │   │   ├── server.ts               # Cookie-aware server client
│   │   │   └── queries.ts              # Query functions + cache tags
│   │   ├── cloudinary.ts               # Signature + URL validation
│   │   ├── whatsapp.ts                 # Message builder
│   │   ├── resilience.ts               # Retry + circuit breaker
│   │   ├── rate-limit.ts               # Upstash / in-memory fallback
│   │   ├── logger.ts                   # JSON logger
│   │   ├── env.ts                      # Zod env validation
│   │   └── utils.ts                    # cn, formatIDR, dates
│   ├── schemas/
│   │   ├── product.ts                  # Zod product schemas
│   │   ├── shop.ts                     # Query param schema
│   │   └── cart.ts                     # Cart validate schema
│   ├── stores/
│   │   └── cart.ts                     # Zustand persist
│   ├── types/
│   │   └── product.ts
│   └── proxy.ts                        # Next.js 16 auth proxy
├── supabase/
│   ├── migrations/
│   │   ├── 20261026000001_init_products.sql
│   │   ├── 20261026000002_indexes.sql
│   │   ├── 20261026000003_rls.sql
│   │   └── 20261026000004_updated_at.sql
│   └── seed.sql
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/
├── .env.example
├── components.json
├── next.config.ts
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── vitest.config.ts
```

## 1.5 Justifikasi

| Pilihan | Alasan |
|---|---|
| **Next.js App Router** | RSC mengurangi JS bundle untuk katalog visual; Server Actions menghilangkan kebutuhan API layer admin; ISR cocok untuk katalog yang jarang berubah. |
| **Supabase** | Postgres + Auth + RLS dalam satu layanan; admin hanya butuh email/password, tidak perlu membangun auth sendiri. |
| **Zustand + localStorage** | Cart hanya berisi maksimal belasan item; tidak butuh server cart. Persistensi lintas refresh sesuai PRD. |
| **Cloudinary signed upload** | Upload langsung dari browser mengurangi beban Vercel; transformasi gambar otomatis untuk LCP. |
| **Server Actions** | Mutasi admin tidak perlu endpoint publik; CSRF/origin handling built-in; tipe aman end-to-end. |
| **Zod** | Validasi yang sama dipakai di client dan server; schema produk menjadi kontrak tunggal. |
| **Vercel** | Deploy Next.js native, preview per PR, edge cache, rollback instan. Region `sin1` dekat audiens Indonesia. |
| **Bun** | Install & script cepat; dipakai untuk dev, test, dan CI. |

> **Catatan rendering Cloudinary:** PRD menyebut `next-cloudinary`, tetapi schema menyimpan URL gambar penuh. Storefront merender foto dengan `next/image` + transformasi Cloudinary (`f_auto,q_auto,w_800`) agar `sizes` dan `priority` bisa dikontrol per grid. `next-cloudinary` tetap terpasang dan bisa dipakai untuk `CldUploadWidget`; jika nanti schema menyimpan `public_id`, migrasi render ke `CldImage` dilakukan tanpa mengubah alur bisnis.

## 1.6 Konfigurasi Kunci

### `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

> **Next.js 16:** `middleware.ts` diganti `proxy.ts`. Jika project terpaksa memakai versi < 16, rename ke `middleware.ts` dan sesuaikan signature.

### `src/lib/supabase/public.ts`

```ts
import { createClient } from "@supabase/supabase-js";

export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "X-Client-Info": "prelovedsaerawatt-storefront" } },
  },
);
```

### `src/lib/supabase/server.ts`

```ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component: cookie write diabaikan; proxy yang me-refresh session.
          }
        },
      },
    },
  );
}
```

---

# BAGIAN 2 — DATABASE DESIGN

## 2.1 Ringkasan Database

| Item | Detail |
|---|---|
| Database | Supabase Postgres 17 (managed) |
| Driver | `@supabase/supabase-js` + `@supabase/ssr` |
| Pendekatan | Relational, single table utama |
| Migrasi | Supabase CLI (`supabase/migrations/*.sql`) |
| RLS | Aktif; public read, admin write |
| Backup | Supabase daily backup + PITR (plan berbayar) |
| Region | `ap-southeast-1` (Singapore) |

## 2.2 Entity Overview — `products`

| Field | Type | Constraints | Keterangan |
|---|---|---|---|
| `id` | `uuid` | PK, NOT NULL, DEFAULT `gen_random_uuid()` | ID internal |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Urutan "Baru masuk" |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Diisi trigger |
| `name` | `text` | NOT NULL, CHECK 3–80 char | Nama produk |
| `slug` | `text` | NOT NULL, UNIQUE | Route `/produk/[slug]` |
| `sku` | `text` | NOT NULL, UNIQUE, DEFAULT sequence | Format `PSW-YYMM-XXX` |
| `price` | `numeric(12,2)` | NOT NULL, CHECK > 0 | IDR, tanpa desimal tampil |
| `size` | `text` | NOT NULL | `XS–XXL` atau `36–44` |
| `category` | `text` | NOT NULL, CHECK enum | Atasan, Bawahan, Dress, Outerwear, Aksesori |
| `description` | `text` | NOT NULL, CHECK 1–2000 char | Deskripsi |
| `defect_notes` | `text` | NULL, CHECK ≤ 500 char | Null = "Mulus, tanpa defect berarti." |
| `images` | `text[]` | NOT NULL, CHECK 1–8 elemen | URL Cloudinary; index 0 = cover |
| `status` | `boolean` | NOT NULL, DEFAULT `true` | `true` = Tersedia, `false` = Terjual |
| `created_by` | `uuid` | NULL, FK → `auth.users(id)` ON DELETE SET NULL | Audit admin |
| `request_id` | `uuid` | NULL, UNIQUE | Idempotency create product |

**Catatan penambahan dari PRD:**
- `slug` dibutuhkan DESIGN.md untuk route `/produk/[slug]`.
- `sku` dibutuhkan template WhatsApp dan tampilan cart/PDP.
- `updated_at` untuk audit & cache invalidation.
- `created_by` & `request_id` untuk keamanan dan reliabilitas; tidak mengubah alur bisnis.

**Catatan tipe `numeric`:** PostgREST mengembalikan `numeric` sebagai string. Semua query memetakan `price` dengan `Number(row.price)` di boundary (`queries.ts` / API route) sebelum masuk ke komponen. Tipe `Product` di aplikasi memakai `price: number`.

## 2.3 Cardinality Summary

| Relation | Type | Description |
|---|---|---|
| `auth.users` → `products` | 1:N | Satu admin membuat banyak produk; `created_by` nullable untuk seed |
| `products` → `images` | 1:N (embedded array) | Satu produk punya 1–8 URL gambar |
| `products` → `cart` | — | Cart tidak disimpan di DB; referensi hanya `product.id` di localStorage |

## 2.4 Index Strategy

| Index | Kolom | Type | Alasan |
|---|---|---|---|
| `products_pkey` | `id` | B-tree PK | Lookup by ID |
| `products_slug_key` | `slug` | B-tree UNIQUE | PDP lookup |
| `products_sku_key` | `sku` | B-tree UNIQUE | Cart/WhatsApp & admin search |
| `products_created_at_idx` | `created_at DESC` | B-tree | Beranda "Baru masuk" |
| `products_status_idx` | `status` | B-tree | Filter tersedia/terjual |
| `products_category_idx` | `category` | B-tree | Filter kategori |
| `products_price_idx` | `price` | B-tree | Sort harga |
| `products_name_trgm_idx` | `name` | GIN `gin_trgm_ops` | Pencarian `ilike` |
| `products_request_id_key` | `request_id` | B-tree UNIQUE | Idempotency |

**Tidak perlu index:** `images`, `description`, `defect_notes` (kecil, tidak difilter).

## 2.5 Row Level Security

| Policy | Table | Operation | Role | Rule |
|---|---|---|---|---|
| `products_public_read` | `products` | SELECT | `anon`, `authenticated` | `true` — katalog publik, termasuk sold out untuk PDP |
| `products_admin_insert` | `products` | INSERT | `authenticated` | `auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'` |
| `products_admin_update` | `products` | UPDATE | `authenticated` | role admin |
| `products_admin_delete` | `products` | DELETE | `authenticated` | role admin |

**Admin provisioning:** buat user via Supabase Dashboard, lalu set `app_metadata.role = "admin"` lewat Admin API/seed script. Public signup **dimatikan** di Supabase Auth settings.

> **Catatan exposure kolom:** policy `select using (true)` membuat `created_by` dan `request_id` ikut terbaca anon. Keduanya bukan data sensitif. Jika ingin menyembunyikannya, buat view `public.products_public` dengan kolom publik + `security_invoker = true`, lalu arahkan storefront ke view tersebut.

## 2.6 Data Migration Strategy

- **Legacy:** tidak ada sistem lama. Ini greenfield.
- **Versioning:** setiap perubahan schema via file migration bernomor timestamp; tidak ada edit manual di production.
- **Apply:** `bunx supabase db push` ke staging dulu, lalu production setelah backup.
- **Rollback:** setiap migration punya file down/revert; production rollback memakai PITR Supabase atau restore backup sebelum migrasi.
- **Zero downtime:** additive migration (tambah kolom nullable/index `CONCURRENTLY`) untuk perubahan lanjutan.

## 2.7 Seed Data

| Data | Purpose | Quantity |
|---|---|---|
| Admin user | Akses development | 1 (`admin@prelovedsaerawatt.local`) |
| Produk demo | Testing visual & filter | 8 item (5 kategori, campuran status) |
| FAQ statis | Halaman Tentang | 5 item (di `content/faq.ts`, bukan DB) |

Seed produk memakai URL Cloudinary demo untuk dev. Ganti dengan aset asli sebelum production.

## 2.8 Data Flow

```
Admin create/edit
  └─► Server Action (auth + Zod)
        └─► Supabase products
              └─► revalidateTag("products")
                    └─► Beranda / Shop / PDP fresh

Pembeli browse
  └─► RSC query Supabase (anon + RLS)
        └─► HTML/RSC + Cloudinary images

Pembeli cart
  └─► Zustand + localStorage
        └─► POST /api/cart/validate
              └─► Supabase (id, price, status, slug)
                    └─► update cart / block checkout

Checkout
  └─► buildWhatsAppMessage()
        └─► wa.me/62...?text=...
              └─► Admin memproses manual
                    └─► Admin toggle status → Terjual
```

## 2.9 SQL Migration

### `20261026000001_init_products.sql`

```sql
create extension if not exists pg_trgm;
create sequence if not exists public.product_sku_seq start with 1 increment by 1;

create table public.products (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  name          text not null check (char_length(name) between 3 and 80),
  slug          text not null unique,
  sku           text not null unique
                default ('PSW-' || to_char(now(), 'YYMM') || '-' ||
                         lpad(nextval('public.product_sku_seq')::text, 3, '0')),
  price         numeric(12,2) not null check (price > 0),
  size          text not null,
  category      text not null check (category in ('Atasan', 'Bawahan', 'Dress', 'Outerwear', 'Aksesori')),
  description   text not null check (char_length(description) between 1 and 2000),
  defect_notes  text check (char_length(defect_notes) <= 500),
  images        text[] not null check (array_length(images, 1) between 1 and 8),
  status        boolean not null default true,
  created_by    uuid references auth.users(id) on delete set null,
  request_id    uuid unique
);

comment on table public.products is 'Katalog preloved; satu baris = satu piece unik.';
comment on column public.products.status is 'true = Tersedia, false = Terjual.';
comment on column public.products.request_id is 'Idempotency key untuk create product.';
```

### `20261026000002_indexes.sql`

```sql
create index products_created_at_idx on public.products (created_at desc);
create index products_status_idx on public.products (status);
create index products_category_idx on public.products (category);
create index products_price_idx on public.products (price);
create index products_name_trgm_idx on public.products using gin (name gin_trgm_ops);
```

### `20261026000003_rls.sql`

```sql
alter table public.products enable row level security;

create policy "products_public_read"
  on public.products for select
  to anon, authenticated
  using (true);

create policy "products_admin_insert"
  on public.products for insert
  to authenticated
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "products_admin_update"
  on public.products for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "products_admin_delete"
  on public.products for delete
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
```

### `20261026000004_updated_at.sql`

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();
```

### `supabase/seed.sql`

```sql
insert into public.products
  (name, slug, price, size, category, description, defect_notes, images, status)
values
  ('Linen Blouse Cream', 'linen-blouse-cream', 125000, 'M', 'Atasan',
   'Blouse linen warna cream, bahan adem, cocok untuk daily.',
   'Ada bekas lipatan halus di bagian lengan, tidak mengganggu.',
   array['https://res.cloudinary.com/demo/image/upload/w_800,h_1000,c_fill/sample.jpg'],
   true),
  ('Pleated Midi Skirt', 'pleated-midi-skirt', 165000, 'S', 'Bawahan',
   'Rok plisket midi warna sage, jatuh di badan.',
   null,
   array['https://res.cloudinary.com/demo/image/upload/w_800,h_1000,c_fill/sample.jpg'],
   true),
  ('Vintage Denim Jacket', 'vintage-denim-jacket', 245000, 'L', 'Outerwear',
   'Jaket denim vintage, wash medium, unisex fit.',
   'Kancing atas sedikit longgar; sudah diperbaiki.',
   array['https://res.cloudinary.com/demo/image/upload/w_800,h_1000,c_fill/sample.jpg'],
   false)
on conflict (slug) do nothing;
```

---

# BAGIAN 3 — INTERFACE DESIGN

## 3.1 Screen → Data Source Matrix

| # | Screen | Route | Rendering | Data source | Auth |
|---|---|---|---|---|---|
| 01 | Beranda | `/` | RSC + ISR 60s | `getLatestProducts(8)` + static content | Public |
| 02 | Katalog | `/shop` | RSC dynamic | `getProducts(searchParams)` | Public |
| 03 | Detail Produk | `/produk/[slug]` | RSC + ISR 60s | `getProductBySlug(slug)` + `getRelatedProducts()` | Public |
| 04 | Keranjang | `/keranjang` | Client Component | Zustand + `POST /api/cart/validate` | Public |
| 05 | Tentang | `/tentang` | Static RSC | `content/about.ts` + `content/faq.ts` | Public |
| 06 | Login Admin | `/admin/login` | RSC shell + Client form | `signInAction` | Public (redirect if logged in) |
| 07 | Dashboard | `/admin` | RSC dynamic | `getAdminProducts(searchParams)` | Admin |
| 08 | Form Produk | `/admin/produk/baru`, `/admin/produk/[id]/edit` | RSC shell + Client form | `getProductById` + `createProductAction` / `updateProductAction` | Admin |
| 09 | 404 | `not-found.tsx` | Static | Static + `getLatestProducts(4)` opsional | Public |

**Route-level UI states:** setiap route menambahkan `loading.tsx` (skeleton) dan `error.tsx` (error boundary) sesuai DESIGN.md Bagian 3. Root menyediakan `global-error.tsx` untuk error fatal.

## 3.2 Page Routes

| Method | Path | Description | Auth | Query / Params |
|---|---|---|---|---|
| GET | `/` | Beranda + 8 produk terbaru | No | — |
| GET | `/shop` | Katalog + filter/search/sort/pagination | No | `q`, `category`, `size`, `hideSold`, `sort`, `page` |
| GET | `/produk/[slug]` | Detail produk + related | No | `slug` |
| GET | `/keranjang` | Cart client-side | No | — |
| GET | `/tentang` | Tentang & cara belanja + FAQ | No | — |
| GET | `/admin/login` | Login admin | No | `next` (internal path) |
| GET | `/admin` | Dashboard inventaris | Admin | `q`, `status`, `page` |
| GET | `/admin/produk/baru` | Form create | Admin | — |
| GET | `/admin/produk/[id]/edit` | Form edit | Admin | `id` |
| GET | `/sitemap.xml` | Sitemap dinamis | No | — |
| GET | `/robots.txt` | Robots | No | — |
| — | `not-found.tsx` | 404 storefront | No | — |

**Catatan Next.js 16:** `params` dan `searchParams` adalah `Promise`; selalu `await` di page/layout.

## 3.3 API Routes

| Method | Path | Description | Auth | Request Body | Response |
|---|---|---|---|---|---|
| POST | `/api/cart/validate` | Validasi status & harga item cart | No (rate-limited) | `{ ids: string[] }` | `{ items: CartSnapshot[], missingIds: string[], validatedAt: string }` |
| POST | `/api/cloudinary/sign` | Buat signature upload Cloudinary | Admin | `{ folder?: string }` | `{ cloudName, apiKey, timestamp, signature, folder, allowedFormats, maxFileSize }` |
| GET | `/api/health` | Health check untuk uptime monitor | No | — | `{ status: "ok" \| "degraded", checks: { database: boolean } }` |
| GET | `/sitemap.xml` | Sitemap produk | No | — | XML |
| GET | `/robots.txt` | Aturan crawler | No | — | Text |

**Tidak ada public API untuk katalog.** Beranda, katalog, dan PDP query langsung dari Server Components ke Supabase. Ini mengurangi endpoint yang perlu diamankan dan memanfaatkan cache Next.js.

## 3.4 Server Actions

| Action | Invoked from | Description | Auth | Input | Output |
|---|---|---|---|---|---|
| `signInAction` | `/admin/login` form | Login Supabase + cek role admin | No | `email`, `password`, `next` | `redirect("/admin")` atau `{ ok:false, error }` |
| `signOutAction` | Admin topbar | Logout + hapus cookie | Admin | — | `redirect("/admin/login")` |
| `createProductAction` | `/admin/produk/baru` | Insert produk + revalidate | Admin | `FormData` produk | `{ ok:true, productId }` / error |
| `updateProductAction` | `/admin/produk/[id]/edit` | Update produk + revalidate | Admin | `FormData` + `id` | `{ ok:true }` / error |
| `toggleProductStatusAction` | Toggle di dashboard | Ubah `status` boolean | Admin | `{ id, status }` | `{ ok:true, status }` / error |
| `deleteProductAction` | Modal hapus | Hapus produk + revalidate | Admin | `{ id }` | `{ ok:true }` / error |

**Server Action result type (bukan HTTP envelope):**

```ts
type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | {
      ok: false;
      error: {
        code: ErrorCode;
        message: string;
        fieldErrors?: Record<string, string[]>;
      };
    };
```

## 3.5 Standarisasi Response Format (API Routes)

**Success:**

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": { "page": 1, "limit": 12, "total": 24, "totalPages": 2 }
}
```

**Error:**

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Periksa kembali data yang dikirim.",
    "details": { "ids": "Maksimal 20 item" }
  },
  "meta": null
}
```

Helper:

```ts
// src/lib/api-response.ts
export type ApiErrorCode =
  | "VALIDATION_ERROR" | "NOT_FOUND" | "UNAUTHORIZED" | "FORBIDDEN"
  | "CONFLICT" | "CART_ITEM_UNAVAILABLE" | "RATE_LIMITED"
  | "UPLOAD_FAILED" | "SERVICE_UNAVAILABLE" | "INTERNAL_ERROR";

export function ok<T>(data: T, meta: ApiMeta | null = null) {
  return Response.json({ success: true, data, error: null, meta });
}

export function fail(code: ApiErrorCode, message: string, status: number, details?: unknown) {
  return Response.json(
    { success: false, data: null, error: { code, message, details }, meta: null },
    { status },
  );
}
```

## 3.6 Error Codes

| Code | HTTP | Description | Contoh |
|---|---|---|---|
| `VALIDATION_ERROR` | 422 | Input tidak valid | ID bukan UUID, harga ≤ 0 |
| `NOT_FOUND` | 404 | Resource tidak ditemukan | Slug produk tidak ada |
| `UNAUTHORIZED` | 401 | Belum login / sesi expired | Admin action tanpa user |
| `FORBIDDEN` | 403 | Login tapi bukan admin | `app_metadata.role ≠ admin` |
| `CONFLICT` | 409 | Duplikat natural key | Slug/SKU sudah ada |
| `CART_ITEM_UNAVAILABLE` | 409 | Item sold out / dihapus saat validasi | Cart berisi produk terjual |
| `RATE_LIMITED` | 429 | Terlalu banyak request | Login brute force |
| `UPLOAD_FAILED` | 422 | Cloudinary menolak file | Format tidak didukung |
| `SERVICE_UNAVAILABLE` | 503 | Dependency down | Supabase/Cloudinary timeout |
| `INTERNAL_ERROR` | 500 | Error tak terduga | Bug server |

## 3.7 Pagination

**Method:** page-based (cocok untuk katalog < 1.000 item).

**Request publik:**
```
GET /shop?page=1&category=Dress&size=M&sort=newest
```
- `limit` **tidak** dikirim client; server menetapkan 12.
- `page` minimal 1; jika melebihi total halaman → redirect ke halaman terakhir atau empty state (pilih empty state agar URL tidak dimanipulasi).

**Request admin:**
```
GET /admin?page=2&status=sold
```
- `limit` server-side 20.

**Response meta:**
```json
{
  "page": 1,
  "limit": 12,
  "total": 24,
  "totalPages": 2
}
```

**Supabase query:**
```ts
const from = (page - 1) * limit;
const to = from + limit - 1;
const { data, count } = await query.range(from, to);
```

## 3.8 Cache & Revalidation

| Data | Cache | Invalidasi |
|---|---|---|
| 8 produk terbaru | `revalidate = 60`, tag `products` | `revalidateTag("products")` setelah create/update/delete/toggle |
| PDP | `revalidate = 60`, tag `product:{slug}` | `revalidatePath("/produk/[slug]", "page")` + tag |
| Katalog | Dynamic (searchParams) | Tidak di-cache; query langsung |
| Admin | Dynamic | Tidak di-cache |
| Sitemap | `revalidate = 3600` | Revalidate harian / after mutation |
| Gambar Cloudinary | CDN immutable | URL berubah jika gambar diganti |

Setelah setiap mutasi:
```ts
revalidateTag("products");
revalidatePath("/");
revalidatePath("/shop");
revalidatePath(`/produk/${slug}`);
```

## 3.9 Code Snippets

### `src/app/api/cart/validate/route.ts`

```ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { supabasePublic } from "@/lib/supabase/public";
import { fail, ok } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(20),
});

export async function POST(request: Request) {
  const limited = await rateLimit(request, { key: "cart-validate", limit: 60, windowMs: 60_000 });
  if (!limited.ok) return fail("RATE_LIMITED", "Terlalu banyak permintaan.", 429);

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return fail("VALIDATION_ERROR", "Daftar item tidak valid.", 422, parsed.error.flatten());
  }

  const { data, error } = await supabasePublic
    .from("products")
    .select("id, slug, name, price, size, images, status")
    .in("id", parsed.data.ids);

  if (error) return fail("SERVICE_UNAVAILABLE", "Gagal mengecek stok.", 503);

  const found = data ?? [];
  const foundIds = new Set(found.map((p) => p.id));
  const missingIds = parsed.data.ids.filter((id) => !foundIds.has(id));

  return ok({
    items: found.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: Number(p.price),
      size: p.size,
      image: p.images?.[0] ?? null,
      status: p.status,
    })),
    missingIds,
    validatedAt: new Date().toISOString(),
  });
}
```

### `src/app/actions/products.ts` (create)

```ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isCloudinaryUrl } from "@/lib/cloudinary";
import type { ActionResult } from "@/lib/types";

const productSchema = z.object({
  name: z.string().trim().min(3).max(80),
  price: z.coerce.number().positive().max(100_000_000),
  category: z.enum(["Atasan", "Bawahan", "Dress", "Outerwear", "Aksesori"]),
  size: z.string().trim().min(1).max(8),
  description: z.string().trim().min(1).max(2000),
  defectNotes: z.string().trim().max(500).optional(),
  images: z.array(z.string().url()).min(1).max(8),
  status: z.boolean().default(true),
  requestId: z.string().uuid().optional(),
});

export async function createProductAction(formData: FormData): Promise<ActionResult<{ productId: string }>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: { code: "UNAUTHORIZED", message: "Sesi tidak valid." } };
  if (user.app_metadata.role !== "admin") {
    return { ok: false, error: { code: "FORBIDDEN", message: "Akses ditolak." } };
  }

  let images: string[] = [];
  try {
    const raw = JSON.parse(String(formData.get("images") ?? "[]"));
    if (Array.isArray(raw)) images = raw.filter((x): x is string => typeof x === "string");
  } catch {
    images = [];
  }

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    category: formData.get("category"),
    size: formData.get("size"),
    description: formData.get("description"),
    defectNotes: formData.get("defectNotes") || undefined,
    images,
    status: formData.get("status") === "true",
    requestId: formData.get("requestId") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Periksa kembali data produk.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
    };
  }

  if (!parsed.data.images.every(isCloudinaryUrl)) {
    return { ok: false, error: { code: "VALIDATION_ERROR", message: "Foto harus dari Cloudinary." } };
  }

  // Idempotency: request_id unik; kalau sudah ada, kembalikan produk lama.
  if (parsed.data.requestId) {
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("request_id", parsed.data.requestId)
      .maybeSingle();
    if (existing) return { ok: true, data: { productId: existing.id } };
  }

  const baseSlug = slugify(parsed.data.name, { lower: true, strict: true });
  const slug = `${baseSlug}-${nanoid(4).toLowerCase()}`;

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: parsed.data.name,
      slug,
      price: parsed.data.price,
      category: parsed.data.category,
      size: parsed.data.size,
      description: parsed.data.description,
      defect_notes: parsed.data.defectNotes ?? null,
      images: parsed.data.images,
      status: parsed.data.status,
      created_by: user.id,
      request_id: parsed.data.requestId ?? null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: { code: "CONFLICT", message: "Produk dengan slug serupa sudah ada." } };
    }
    return { ok: false, error: { code: "INTERNAL_ERROR", message: "Produk gagal disimpan." } };
  }

  revalidateTag("products");
  revalidatePath("/");
  revalidatePath("/shop");

  return { ok: true, data: { productId: data.id } };
}
```

### `src/lib/supabase/queries.ts` (shop query)

```ts
import { supabasePublic } from "./public";
import type { ShopParams } from "@/schemas/shop";

export async function getProducts(params: ShopParams) {
  const { q, category, sizes, hideSold, sort, page } = params;
  const limit = 12;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabasePublic
    .from("products")
    .select("id, slug, name, price, size, category, images, status, created_at", { count: "exact" });

  if (q) query = query.ilike("name", `%${q}%`);
  if (category) query = query.eq("category", category);
  if (sizes.length) query = query.in("size", sizes);
  if (hideSold) query = query.eq("status", true);

  query = sort === "price_asc"
    ? query.order("price", { ascending: true })
    : sort === "price_desc"
      ? query.order("price", { ascending: false })
      : query.order("created_at", { ascending: false });

  const { data, count, error } = await query.range(from, to);
  if (error) throw new Error("Gagal memuat katalog");

  return {
    items: (data ?? []).map((product) => ({
      ...product,
      price: Number(product.price),
    })),
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil((count ?? 0) / limit)),
  };
}
```

---

# BAGIAN 4 — ALUR LOGIKA & BUSINESS RULES

## 4.1 Alur Per Fitur

### 4.1.1 Browse & filter katalog

1. User membuka `/` → RSC `getLatestProducts(8)` query Supabase (anon + RLS), ISR 60s.
2. User klik "Jelajahi koleksi" → `/shop`.
3. `page.tsx` membaca `searchParams` (await), memvalidasi dengan `shopParamsSchema` (Zod):
   - `q` ≤ 80 char, trim.
   - `category` harus salah satu enum; invalid → fallback `undefined`.
   - `size` array, maksimal 6, masing-masing ≤ 8 char.
   - `hideSold` boolean.
   - `sort` enum; invalid → `newest`.
   - `page` integer 1–1000; invalid → 1.
4. Query Supabase dengan filter + `range`.
5. Render grid; hasil count diumumkan lewat `aria-live`.
6. Filter berubah → `router.replace` query baru; grid re-fetch di server.
7. `loading.tsx` menampilkan skeleton 8 card selama stream.

### 4.1.2 Detail produk

1. `/produk/[slug]` → `getProductBySlug(slug)`.
2. Jika Supabase error → `error.tsx` dengan retry.
3. Jika tidak ada baris → `notFound()` → 404 page.
4. Jika `status=false` → tetap render PDP dengan badge "Terjual", CTA add-to-cart disabled, secondary "Tanya stok serupa" WhatsApp.
5. Related: kategori sama, `status=true`, exclude `id`, limit 4. Jika kosong → section disembunyikan.
6. Metadata dinamis: title, description, OG image dari `images[0]`.
7. JSON-LD `Product` schema (nama, harga, availability, image) untuk SEO.

### 4.1.3 Tambah ke keranjang

1. User klik "Tambah ke keranjang" di PDP.
2. Client memeriksa `product.status === true`; jika false → tombol disabled (tidak mungkin diklik).
3. Cek item sudah ada di cart (by `id`); jika ada → toast "Sudah ada di keranjang", tidak menambah qty.
4. Simpan snapshot: `{ id, slug, name, sku, price, size, image, status, addedAt }`.
5. Zustand `persist` menulis ke `localStorage` key `psw-cart-v1`.
6. `cartCount` update; badge `aria-live="polite"`.
7. Toast sukses 4 detik; tombol morph ke "Ditambahkan ✓" 1.5 detik.
8. Vercel Analytics event `add_to_cart` (product id, price).

### 4.1.4 Revalidasi cart

1. Saat `/keranjang` mount, `CartHydrator` menunggu Zustand rehydrate (`skipHydration: true` + `useEffect`).
2. Ambil semua `id` (maks. 20) → `POST /api/cart/validate`.
3. Respons:
   - `items`: snapshot terbaru (harga, status, nama, gambar).
   - `missingIds`: produk sudah dihapus.
4. Client:
   - Update harga jika berubah; tampilkan notice "Harga diperbarui admin".
   - Tandai item `status=false` / `missing` sebagai `unavailable`.
   - `validatedAt` disimpan di store (bukan localStorage).
5. Jika ada item unavailable → CTA checkout disabled; user harus menghapus item.
6. Jika request gagal setelah retry → CTA disabled + banner "Status stok belum bisa dicek" + tombol retry.
7. Jika localStorage corrupt → reset cart + toast.

### 4.1.5 Checkout WhatsApp

1. CTA aktif hanya jika: cart tidak kosong, semua item available, `validatedAt` < 5 menit, dan `NEXT_PUBLIC_WHATSAPP_NUMBER` valid.
2. Klik CTA → `CheckoutSheet` terbuka (DESIGN.md Screen 04).
3. Sheet menampilkan preview pesan (list item + total) dan tombol "Buka WhatsApp".
4. Klik "Buka WhatsApp":
   - `buildWhatsAppMessage(items, total)` menghasilkan teks.
   - `encodeURIComponent` → `https://wa.me/{number}?text={encoded}`.
   - `window.open(url, "_blank", "noopener,noreferrer")`.
   - Vercel Analytics event `checkout_whatsapp`.
5. Tidak ada mutasi server; status produk tidak berubah otomatis.
6. Admin menandai "Terjual" manual setelah pembayaran dikonfirmasi.

### 4.1.6 Login & logout admin

1. `/admin/login` → form email/password.
2. `signInAction`:
   - Zod validasi email/password.
   - `supabase.auth.signInWithPassword`.
   - Cek `user.app_metadata.role === "admin"`; jika bukan → `signOut()` + error generik.
   - Redirect ke `next` hanya jika path diawali `/admin` dan bukan `/admin/login`.
3. `proxy.ts` me-refresh session cookie di setiap request `/admin/*`.
4. Route `/admin/*` selain login tanpa user → redirect `/admin/login?next=...`.
5. Logout → `signOutAction` → hapus cookie → redirect login.
6. Session expired saat Server Action → `UNAUTHORIZED`; client redirect login.

### 4.1.7 Create / edit produk + upload foto

1. Admin membuka `/admin/produk/baru` (create) atau `/edit` (fetch produk).
2. Form client memakai `useActionState` + Zod client-side.
3. Upload foto:
   - User memilih file (jpg/png/webp, ≤ 5MB, maks. 8).
   - Client `POST /api/cloudinary/sign` (auth admin) → signature.
   - Client upload langsung ke `https://api.cloudinary.com/v1_1/{cloud}/image/upload` dengan `file`, `api_key`, `timestamp`, `signature`, `folder`.
   - Respons `secure_url` disimpan di state form.
   - Foto pertama = cover; drag reorder mengubah urutan array.
4. Submit:
   - `requestId` = `crypto.randomUUID()` dibuat saat form mount.
   - FormData berisi field + `images` (JSON array URL).
   - `createProductAction` / `updateProductAction` validasi + auth + insert/update.
5. Sukses → toast + redirect `/admin`; `revalidateTag("products")`.
6. Gagal validasi → inline error + error summary; field pertama difokuskan.
7. Unsaved changes → modal discard saat navigasi.

### 4.1.8 Toggle status terjual

1. Admin klik toggle di dashboard.
2. Client optimistic update (`useOptimistic` atau state lokal) → UI langsung berubah.
3. Panggil `toggleProductStatusAction({ id, status })`.
4. Server auth + update `products.status`.
5. Sukses → `revalidateTag("products")` + `revalidatePath("/")` + `/shop` + PDP.
6. Gagal → rollback UI + toast error.
7. Stat card "Tersedia"/"Terjual" ikut update setelah revalidasi.

### 4.1.9 Delete produk

1. Admin klik "Hapus" → modal konfirmasi (judul produk disebut).
2. Konfirmasi → `deleteProductAction({ id })`.
3. Server auth + delete row.
4. Cloudinary assets **tidak dihapus otomatis** (hanya URL di DB). Cleanup job opsional di masa depan.
5. Sukses → toast + revalidate; jika produk sedang di cart pembeli, validasi berikutnya mengembalikan `missingIds`.
6. Gagal → toast error; modal tetap terbuka.

### 4.1.10 404

1. `notFound()` dari RSC → `not-found.tsx`.
2. Fetch 4 produk terbaru (opsional); jika gagal → section related disembunyikan.
3. CTA ke `/shop` dan `/`.
4. Page title "Halaman tidak ditemukan — prelovedsaerawatt".

## 4.2 Business Rules

| ID | Rule | Sumber |
|---|---|---|
| BR-01 | Satu produk = satu piece unik; qty di cart selalu 1, tidak ada stepper. | PRD + DESIGN |
| BR-02 | Produk `status=false` tidak bisa ditambahkan ke cart. | PRD |
| BR-03 | Produk `status=false` tetap bisa dilihat di PDP dengan badge "Terjual". | DESIGN |
| BR-04 | Cart disimpan di `localStorage`; bertahan setelah refresh. | PRD |
| BR-05 | Harga di cart adalah snapshot; saat revalidasi, harga server menang. | DESIGN |
| BR-06 | Checkout diblokir jika ada item sold out/missing, validasi gagal, atau WA number tidak valid. | DESIGN |
| BR-07 | Checkout hanya membuka WhatsApp; tidak ada pembayaran/order di web. | PRD |
| BR-08 | Pesan WhatsApp memuat nama, SKU, harga per item, dan total. | PRD |
| BR-09 | Semua rute `/admin/*` kecuali login wajib user dengan role `admin`. | PRD |
| BR-10 | Foto 1–8, format jpg/png/webp, maks. 5MB; foto pertama = cover. | DESIGN |
| BR-11 | Harga > 0, nama 3–80 char, deskripsi 1–2000 char, defect ≤ 500 char. | DESIGN |
| BR-12 | Kategori hanya: Atasan, Bawahan, Dress, Outerwear, Aksesori. | DESIGN |
| BR-13 | Produk baru default `status=true`; admin bisa langsung set terjual. | PRD |
| BR-14 | Delete produk tidak menghapus aset Cloudinary (audit/cleanup terpisah). | Tech decision |
| BR-15 | Public read RLS `true`; write hanya role admin. | Security |

## 4.3 Auth Flow & Proxy

### `src/proxy.ts`

```ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export default async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin && !isLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isLogin && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = { matcher: ["/admin/:path*"] };
```

> Role `admin` **tidak** dicek di proxy (proxy hanya cek login) agar redirect tetap murah. Role dicek di setiap Server Action dan di `admin/layout.tsx` sebelum render data sensitif.

## 4.4 Error Handling

### Mapping error

| Sumber | Kondisi | Code | HTTP/Action |
|---|---|---|---|
| Zod | Field invalid | `VALIDATION_ERROR` | 422 + `fieldErrors` |
| Supabase | `PGRST116` / 0 rows | `NOT_FOUND` | 404 |
| Supabase | `23505` unique | `CONFLICT` | 409 |
| Supabase | `23514` check | `VALIDATION_ERROR` | 422 |
| Supabase | JWT expired | `UNAUTHORIZED` | 401 |
| Supabase | RLS denied | `FORBIDDEN` | 403 |
| Supabase | Timeout/network | `SERVICE_UNAVAILABLE` | 503 |
| Cloudinary | 400/420 | `UPLOAD_FAILED` | 422 |
| Rate limiter | Limit exceeded | `RATE_LIMITED` | 429 |
| Unknown | Exception | `INTERNAL_ERROR` | 500; log ke Sentry |

### Global error middleware

- **API routes:** wrapper `withApiHandler(handler)` → try/catch, map error, log `requestId`, return envelope.
- **Server Actions:** wrapper `withAction(handler)` → auth check, try/catch, return `ActionResult`, log.
- **RSC pages:** `error.tsx` per segment + `global-error.tsx`; error tidak membocorkan stack ke user.
- **Client fetch:** `fetchJson<T>()` → parse envelope, throw `ApiError` dengan code.

### Retry mechanism

| Operasi | Retry | Backoff | Timeout | Catatan |
|---|---|---|---|---|
| `POST /api/cart/validate` | 2× | 300ms, 900ms + jitter | 5s/attempt | Aman (read-only) |
| `GET` produk di RSC | 1× | 250ms | 5s | Next.js fetch cache |
| `POST /api/cloudinary/sign` | 1× | 500ms | 5s | Read-only signature |
| Cloudinary upload | 1× manual | tombol "Coba lagi" | 60s | File besar |
| `createProductAction` | 0× | — | 10s | Gunakan `requestId` idempotency |
| `toggleProductStatusAction` | 1× | 300ms | 5s | Idempotent by status |
| `signInAction` | 0× | — | 10s | Hindari brute force |

**Implementasi retry:**
```ts
// src/lib/resilience.ts
export async function withRetry<T>(
  fn: () => Promise<T>,
  { retries = 2, baseMs = 300, timeoutMs = 5_000 } = {},
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      const jitter = Math.random() * 100;
      await new Promise((r) => setTimeout(r, baseMs * 2 ** attempt + jitter));
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}
```

## 4.5 Circuit Breaker

**Dependency:** Supabase (cart validate, admin actions), Cloudinary (signature endpoint).

| Atribut | Nilai |
|---|---|
| Failure threshold | 5 kegagalan dalam 30 detik |
| Open duration | 30 detik |
| Half-open | 1 request percobaan setelah 30 detik |
| Success threshold | 2 sukses berturut-turut → closed |
| Scope | Per lambda instance (best-effort); bukan distributed breaker |
| Fallback | Public pages: cache ISR terakhir; cart: checkout disabled; admin: banner + retry |

```ts
// src/lib/resilience.ts
type BreakerState = { failures: number; openedAt: number | null; successes: number };
const breakers = new Map<string, BreakerState>();

export async function withBreaker<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const state = breakers.get(key) ?? { failures: 0, openedAt: null, successes: 0 };

  if (state.openedAt && now - state.openedAt < 30_000) {
    throw new Error(`CIRCUIT_OPEN:${key}`);
  }
  if (state.openedAt && now - state.openedAt >= 30_000) {
    state.openedAt = null; // half-open
  }

  try {
    const result = await fn();
    state.failures = 0;
    state.successes += 1;
    if (state.successes >= 2) state.openedAt = null;
    breakers.set(key, state);
    return result;
  } catch (error) {
    state.failures += 1;
    state.successes = 0;
    if (state.failures >= 5) state.openedAt = now;
    breakers.set(key, state);
    throw error;
  }
}
```

## 4.6 Fallback Strategy

| Fitur | Primary | Fallback | Degradasi |
|---|---|---|---|
| Beranda | Supabase query | ISR cache halaman terakhir | Produk mungkin stale ≤ 60s |
| Katalog | Supabase query | Error state + retry | Filter tidak tersedia |
| PDP | Supabase query | ISR cache / 404 | Produk baru mungkin belum muncul |
| Cart validate | `/api/cart/validate` | Item dari localStorage + banner | Checkout disabled sampai retry |
| Cloudinary sign | API route | Tombol retry upload | Foto gagal diunggah |
| WhatsApp | `wa.me` | Salin pesan manual | User mengirim manual |
| Admin dashboard | Supabase | Error banner + data terakhir | Mutasi disabled |
| Login | Supabase Auth | — | Tidak bisa masuk |

## 4.7 Idempotency

| Endpoint/Action | Strategy |
|---|---|
| `createProductAction` | `requestId` UUID dari client + kolom `products.request_id UNIQUE`; duplikat → return produk existing |
| `updateProductAction` | Natural key `id`; update berulang menghasilkan state sama |
| `toggleProductStatusAction` | Payload berisi `status` target (bukan toggle), jadi retry aman |
| `deleteProductAction` | Delete by `id`; kedua kali → `NOT_FOUND`, client treat sebagai sukses |
| `POST /api/cart/validate` | Read-only; aman di-retry |
| `POST /api/cloudinary/sign` | Signature baru tiap request; upload idempotent by `public_id` opsional |

## 4.8 Code Snippets

### `src/stores/cart.ts`

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  size: string;
  image: string | null;
  status: boolean;
  addedAt: string;
};

type CartState = {
  items: CartItem[];
  validatedAt: string | null;
  addItem: (item: CartItem) => { ok: boolean; reason?: "sold_out" | "exists" };
  removeItem: (id: string) => void;
  updateFromServer: (items: CartItem[], missingIds: string[]) => void;
  setValidatedAt: (iso: string | null) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      validatedAt: null,
      addItem: (item) => {
        if (!item.status) return { ok: false, reason: "sold_out" };
        if (get().items.some((i) => i.id === item.id)) return { ok: false, reason: "exists" };
        set((s) => ({ items: [...s.items, item], validatedAt: null }));
        return { ok: true };
      },
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id), validatedAt: null })),
      updateFromServer: (serverItems, missingIds) =>
        set((s) => ({
          items: s.items
            .filter((i) => !missingIds.includes(i.id))
            .map((i) => {
              const fresh = serverItems.find((x) => x.id === i.id);
              return fresh ? { ...i, ...fresh } : i;
            }),
        })),
      setValidatedAt: (iso) => set({ validatedAt: iso }),
      clear: () => set({ items: [], validatedAt: null }),
    }),
    {
      name: "psw-cart-v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (s) => ({ items: s.items }),
      skipHydration: true,
    },
  ),
);
```

### `src/lib/whatsapp.ts`

```ts
import type { CartItem } from "@/stores/cart";

export function buildWhatsAppMessage(items: CartItem[], total: number) {
  const lines = items.map(
    (item, index) =>
      `${index + 1}. ${item.name} — ${item.sku} — ${formatIDR(item.price)}`,
  );

  return [
    "Halo Admin @prelovedsaerawatt,",
    "Saya mau order:",
    "",
    ...lines,
    "",
    `Total: ${formatIDR(total)}`,
    "",
    "Nama:",
    "Alamat:",
    "Catatan:",
  ].join("\n");
}

export function buildWhatsAppUrl(number: string, message: string) {
  const normalized = number.replace(/\D/g, "");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function formatIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
```

### `src/app/api/cloudinary/sign/route.ts`

```ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fail, ok } from "@/lib/api-response";
import { rateLimit } from "@/lib/rate-limit";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return fail("UNAUTHORIZED", "Sesi tidak valid.", 401);
  if (user.app_metadata.role !== "admin") return fail("FORBIDDEN", "Akses ditolak.", 403);

  const limited = await rateLimit(request, { key: `sign:${user.id}`, limit: 10, windowMs: 60_000 });
  if (!limited.ok) return fail("RATE_LIMITED", "Terlalu banyak upload.", 429);

  const timestamp = Math.round(Date.now() / 1000);
  const folder = process.env.CLOUDINARY_FOLDER ?? "prelovedsaerawatt/products";

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder, allowed_formats: "jpg,png,webp" },
    process.env.CLOUDINARY_API_SECRET!,
  );

  return ok({
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder,
    allowedFormats: ["jpg", "png", "webp"],
    maxFileSize: 5 * 1024 * 1024,
  });
}
```

---

# BAGIAN 5 — KEAMANAN, PERFORMA, CI/CD & DEPLOYMENT

## 5.1 Keamanan

### Auth & Authorization

| Layer | Kontrol |
|---|---|
| Proxy | Redirect `/admin/*` tanpa session ke login; refresh cookie Supabase |
| Admin layout | `getUser()` + cek `app_metadata.role === "admin"` sebelum render data |
| Server Actions | Cek user + role di setiap action; jangan hanya mengandalkan UI |
| RLS | Public read, admin write; policy memakai `auth.jwt()` |
| Public signup | **Dimatikan** di Supabase Auth |
| Admin provisioning | Manual via Supabase Dashboard/Admin API; set `app_metadata.role="admin"` |
| Session | Cookie `Secure`, `SameSite=Lax`, di-refresh oleh `@supabase/ssr` |
| Logout | Hapus cookie + `supabase.auth.signOut()` |

### Secrets

- `CLOUDINARY_API_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `SENTRY_AUTH_TOKEN` **hanya server**.
- Jangan pernah memakai prefix `NEXT_PUBLIC_` untuk secret; Next.js meng-inline nilainya ke bundle.
- `.env.local` masuk `.gitignore`; `.env.example` hanya berisi placeholder.
- Rotasi kunci Cloudinary/Supabase jika ada indikasi bocor.

### Input & Upload

- Semua input divalidasi Zod di client **dan** server.
- URL gambar wajib `https://res.cloudinary.com/{cloud_name}/...`; tolak `javascript:`, `data:`, SVG.
- Format upload: jpg, png, webp; maks. 5MB; maks. 8 foto.
- Nama file di-generate Cloudinary; jangan memakai nama asli user.
- Tidak ada `dangerouslySetInnerHTML`; konten teks dirender sebagai React children.
- Deskripsi/defect adalah plain text; tidak ada rich text editor di MVP.

### CSRF & CORS

- Server Actions Next.js memvalidasi `Origin` terhadap host secara default.
- API routes:
  - `POST /api/cloudinary/sign` wajib auth + cek `Origin` sama dengan `NEXT_PUBLIC_SITE_URL`.
  - `POST /api/cart/validate` read-only; tetap rate-limited dan hanya menerima JSON.
- Tidak ada CORS wildcard; browser hanya memanggil origin sendiri.

### Rate Limiting

| Endpoint | Limit | Window | Key |
|---|---|---|---|
| `POST /api/cart/validate` | 60 | 1 menit | IP |
| `POST /api/cloudinary/sign` | 10 | 1 menit | User ID |
| `signInAction` | 5 | 1 menit | IP + email (best-effort) |
| `GET /api/health` | 30 | 1 menit | IP |

Implementasi: Upstash Redis jika env tersedia; fallback in-memory Map untuk local/dev. Di Vercel serverless, in-memory tidak konsisten — untuk production gunakan Upstash.

### Security Headers

`next.config.ts` sudah memasang HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, dan `Permissions-Policy`.

CSP (tambahkan setelah domain final):

```
default-src 'self';
img-src 'self' data: https://res.cloudinary.com;
script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com;
style-src 'self' 'unsafe-inline';
font-src 'self' data:;
connect-src 'self' https://*.supabase.co https://api.cloudinary.com https://vitals.vercel-insights.com;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

> `unsafe-inline` pada script diperlukan untuk inline runtime Next.js. Tighten dengan nonce di fase berikutnya jika security review meminta.

### Dependency & Data

- Dependabot mingguan untuk npm + GitHub Actions.
- Review manual untuk major update Next/React/Supabase.
- Tidak menyimpan PII pembeli; cart hanya di localStorage.
- Admin email hanya di Supabase Auth; log memakai `user.id`, bukan email.
- Backup Supabase harian; akses dashboard dibatasi 2FA.

## 5.2 Performa

### Target

| Metric | Target | Warning |
|---|---|---|
| LCP (mobile, p75) | < 2.5s | > 4s |
| INP | < 200ms | > 500ms |
| CLS | < 0.1 | > 0.25 |
| TTFB (p75) | < 800ms | > 1.8s |
| Lighthouse Performance | ≥ 90 | < 80 |
| Lighthouse Accessibility | ≥ 95 | < 90 |
| Initial JS (storefront) | < 200KB gzip | > 300KB |
| PDP image (cover) | < 250KB | > 500KB |

### Strategi

- **RSC by default:** katalog, PDP, tentang tidak mengirim JS data fetching.
- **ISR:** beranda & PDP `revalidate=60`; admin mutation memicu `revalidateTag("products")`.
- **Client islands minimal:** header menu, gallery, cart, admin form.
- **Cloudinary:** `f_auto,q_auto,w_800` untuk card, `w_1200` untuk PDP; `sizes` sesuai grid; `priority` hanya hero + 4 card pertama.
- **next/image:** `formats: ["image/avif","image/webp"]`, `remotePatterns` Cloudinary, placeholder blur jika tersedia.
- **Font:** `next/font/google` subset latin, `display: swap`, hanya weight yang dipakai (Fraunces 400–600, Manrope 400–700, IBM Plex Mono 500).
- **DB:** select kolom spesifik, index sesuai Bagian 2, limit 12/20, `count: "exact"` hanya saat perlu.
- **Cache:** public page cache + Cloudinary CDN; admin `no-store`.
- **Bundle:** route group `(store)` dan `admin` memisahkan bundle; tidak ada library admin di storefront.
- **Third-party:** Sentry & Vercel Analytics dimuat setelah hydrate; jangan block LCP.
- **Skeleton:** `loading.tsx` mencegah layout shift; rasio gambar 4:5 eksplisit.
- **Monitoring:** Vercel Speed Insights + Lighthouse CI opsional di PR.

## 5.3 CI/CD Pipeline

**Branch strategy:** trunk-based dengan short-lived feature branch (`feat/...`, `fix/...`). `main` selalu deployable.

| Stage | Trigger | Actions |
|---|---|---|
| **Build** | Push ke branch mana pun | `bun install --frozen-lockfile` → lint → typecheck → unit test → `next build` |
| **Test** | Pull request ke `main` | Integration test (Supabase local) → E2E terhadap Vercel Preview |
| **Preview** | PR dibuka/update | Vercel auto-deploy preview + smoke test |
| **Staging** | Merge ke `staging` (opsional) | Deploy staging + `supabase db push` ke staging |
| **Production** | Merge ke `main` + manual approval | Deploy Vercel + migrasi DB + smoke test + health check |
| **Nightly** | Cron 02:00 WIB | E2E smoke terhadap production (read-only) + dependency audit |

**Required checks:** lint, typecheck, unit, build, integration, E2E critical path, Vercel preview.

**GitHub Actions — `.github/workflows/ci.yml`:**

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.4.4
      - run: bun install --frozen-lockfile
      - run: bun run lint
      - run: bun run typecheck
      - run: bun run test:unit
      - run: bun run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
          NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: ${{ secrets.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME }}
          NEXT_PUBLIC_WHATSAPP_NUMBER: ${{ secrets.NEXT_PUBLIC_WHATSAPP_NUMBER }}

  integration:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: 1.4.4
      - run: bun install --frozen-lockfile
      - run: bunx supabase start
      - run: bunx supabase db reset
      - run: bun run test:integration
        env:
          SUPABASE_URL: http://127.0.0.1:54321
          SUPABASE_ANON_KEY: ${{ secrets.LOCAL_SUPABASE_ANON_KEY }}
```

**E2E:** job terpisah, trigger `deployment_status` dari Vercel Preview; set `PLAYWRIGHT_BASE_URL` ke URL preview. Simpan trace/screenshot sebagai artifact saat gagal.

## 5.4 Rollback Strategy

| Layer | Cara | Verifikasi |
|---|---|---|
| **Code** | Vercel Dashboard → Deployments → Rollback ke deployment sebelumnya; atau revert commit + redeploy | Homepage, PDP, checkout sheet |
| **Database** | Jalankan down migration; jika gagal → restore backup/PITR sebelum migrasi | Count produk, RLS test |
| **Env** | Rollback env var di Vercel; redeploy | `/api/health` |
| **Cloudinary** | Aset tidak dihapus saat delete produk; tidak ada rollback yang diperlukan | URL masih resolve |
| **DNS/CDN** | Vercel mengelola; rollback deployment cukup | SSL & domain |

**Aturan migrasi production:**
1. Backup/PITR snapshot.
2. Apply migration additive (tidak drop kolom di rilis yang sama).
3. Smoke test.
4. Baru hapus kolom lama di rilis berikutnya (expand-contract).

## 5.5 Deployment

| Komponen | Environment | Catatan |
|---|---|---|
| Vercel | Production + Preview | Region `sin1`; Node 24 LTS |
| Supabase | Production + Staging | Region `ap-southeast-1`; staging project terpisah |
| Cloudinary | Production | Folder `prelovedsaerawatt/products`; staging `prelovedsaerawatt/staging` |
| Domain | `prelovedsaerawatt.com` (atau domain final) | SSL otomatis Vercel |
| WhatsApp | Nomor admin production | Format `62...`, tanpa `+` |

**Langkah rilis pertama:**
1. Buat project Supabase production + staging.
2. Jalankan migration + seed reference (bukan demo) di production.
3. Set env Vercel (Production & Preview terpisah).
4. Buat admin user + set `app_metadata.role="admin"`.
5. Deploy preview → uji 9 screen.
6. Promote ke production.
7. Aktifkan uptime monitor `/api/health`.

## 5.6 Development Setup

```bash
# 1. Clone & install
git clone <repo-url>
cd prelovedsaerawatt
bun install

# 2. Env
cp .env.example .env.local
# isi Supabase, Cloudinary, WhatsApp

# 3. Supabase lokal (butuh Docker)
bunx supabase start
bunx supabase db reset   # migration + seed.sql

# 4. Admin lokal
bun run seed:admin
# login: admin@prelovedsaerawatt.local / password dari env lokal

# 5. Jalankan
bun run dev
# http://localhost:3000

# 6. E2E (sekali per mesin)
bunx playwright install --with-deps
bun run test:e2e
```

**`package.json` scripts:**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:unit": "vitest run --project unit",
    "test:integration": "vitest run --project integration",
    "test:e2e": "playwright test",
    "db:reset": "supabase db reset",
    "db:push": "supabase db push",
    "seed:admin": "bun run scripts/seed-admin.ts",
    "format": "prettier --write ."
  }
}
```

> Script `supabase` dijalankan via `bunx` jika CLI tidak global: `bunx supabase start`.

---

# BAGIAN 6 — MONITORING & OBSERVABILITY

## 6.1 Logging

| Item | Detail |
|---|---|
| Format | JSON structured (`level`, `msg`, `time`, `requestId`, `route`, `userId`, `durationMs`, `code`) |
| Levels | `debug` (dev), `info`, `warn`, `error`, `fatal` |
| Aggregation | Vercel Logs (default) + Sentry (error) + Axiom opsional |
| Retention | Vercel 7 hari (Hobby) / 30 hari (Pro); Axiom 30–90 hari |
| PII | Jangan log email, password, token, isi pesan WhatsApp |
| Request ID | Generate di `proxy.ts` (`crypto.randomUUID()`), kirim `x-request-id`, teruskan ke Server Actions/API |

**Logger wrapper:**

```ts
// src/lib/logger.ts
type Level = "debug" | "info" | "warn" | "error" | "fatal";

export function log(level: Level, msg: string, meta: Record<string, unknown> = {}) {
  const entry = { level, msg, time: new Date().toISOString(), ...meta };
  const line = JSON.stringify(entry);
  if (level === "error" || level === "fatal") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}
```

## 6.2 Metrics

| Metric | Target | Warning | Critical |
|---|---|---|---|
| Request rate | baseline | — | — |
| Error rate (5xx) | < 1% | > 1% | > 5% |
| Latency P50 | < 200ms | > 500ms | > 1s |
| Latency P95 | < 500ms | > 1s | > 3s |
| Latency P99 | < 1s | > 2s | > 5s |
| Supabase DB CPU | < 70% | > 80% | > 90% |
| Supabase DB connections | < 80% pool | > 80% | > 95% |
| Cloudinary upload failure | < 2% | > 5% | > 10% |
| Cart validation failure | < 1% | > 3% | > 5% |
| Checkout WhatsApp click | tracking only | — | — |
| LCP p75 | < 2.5s | > 4s | > 6s |
| INP p75 | < 200ms | > 500ms | > 1s |
| CLS p75 | < 0.1 | > 0.25 | > 0.5 |

**Custom events (Vercel Analytics):**
- `add_to_cart` — productId, price.
- `checkout_whatsapp` — itemCount, total.
- `admin_product_created`, `admin_product_updated`, `admin_status_toggled`, `admin_product_deleted`.

## 6.3 Distributed Tracing

- **Tool:** Sentry Performance (default) + OpenTelemetry opsional.
- **Trace ID:** `x-request-id` dari proxy → header ke Supabase/Cloudinary → log & Sentry tag.
- **Sampling:** 100% error, 10% success, 100% admin mutations.
- **Spans:** RSC data fetch, Supabase query, Cloudinary sign, Server Action.

## 6.4 Alerting

| Alert | Condition | Channel | Priority |
|---|---|---|---|
| Error rate spike | 5xx > 5% selama 5 menit | Email + Slack | Critical |
| Health check fail | `/api/health` non-200 2× berturut | Email + PagerDuty (opsional) | Critical |
| Supabase down | Health check DB false | Email + Slack | Critical |
| DB CPU high | > 80% selama 10 menit | Email | Warning |
| DB connections | > 80% pool | Email | Warning |
| Cloudinary failures | > 10% upload gagal 10 menit | Slack | Warning |
| Cart validation errors | > 5% 10 menit | Slack | Warning |
| LCP regression | p75 > 4s selama 24 jam | Slack | Warning |
| New Sentry issue | First seen, unhandled | Email/Slack | Warning |

## 6.5 Error Tracking

- **Service:** Sentry (`@sentry/nextjs` 11.9.0).
- **Release:** commit SHA Vercel (`VERCEL_GIT_COMMIT_SHA`).
- **Source maps:** upload otomatis saat build (`SENTRY_AUTH_TOKEN`).
- **Alert:** new issue group, regression, error spike.
- **Redaction:** hapus cookie, authorization header, email dari event.

## 6.6 Dashboard

| Tool | Panel |
|---|---|
| Vercel Analytics | Page views, top pages, referrers, custom events |
| Vercel Speed Insights | LCP, INP, CLS per route/device |
| Sentry | Error rate, issue list, slow transactions, release health |
| Supabase Dashboard | DB size, CPU, connections, slow queries, auth users |
| Axiom (opsional) | Log search, `requestId` trace, error grouping |
| Grafana (opsional, fase 2) | Business metrics: produk baru, checkout clicks, sold-out ratio |

---

# BAGIAN 7 — ENVIRONMENT VARIABLES

## 7.1 Kategori & Daftar

### App Config

| Variable | Deskripsi | Contoh | Public? |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canonical | `https://prelovedsaerawatt.com` | ✅ |
| `NODE_ENV` | Environment | `production` | ❌ (otomatis) |

### Supabase

| Variable | Deskripsi | Contoh | Public? |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL | `https://xxxx.supabase.co` | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (RLS) | `eyJhbGci...` | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (seed/admin script) | `eyJhbGci...` | ❌ **server only** |
| `SUPABASE_ACCESS_TOKEN` | CLI/CI migration | `sbp_...` | ❌ |
| `SUPABASE_DB_PASSWORD` | DB password untuk `db push` | `••••` | ❌ |

### Cloudinary

| Variable | Deskripsi | Contoh | Public? |
|---|---|---|---|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloud name | `prelovedsaerawatt` | ✅ |
| `CLOUDINARY_API_KEY` | API key | `1234567890` | ❌ (server) |
| `CLOUDINARY_API_SECRET` | API secret | `••••` | ❌ |
| `CLOUDINARY_FOLDER` | Folder upload | `prelovedsaerawatt/products` | ❌ (opsional) |

### WhatsApp

| Variable | Deskripsi | Contoh | Public? |
|---|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Nomor admin, format `62...` tanpa `+` | `6281234567890` | ✅ |

Validasi: `/^62\d{8,15}$/`. Jika invalid → CTA checkout disabled + log warning (bukan crash seluruh halaman).

### Monitoring

| Variable | Deskripsi | Contoh | Public? |
|---|---|---|---|
| `SENTRY_DSN` | DSN server | `https://xxx@sentry.io/xxx` | ❌ |
| `NEXT_PUBLIC_SENTRY_DSN` | DSN client | `https://xxx@sentry.io/xxx` | ✅ |
| `SENTRY_AUTH_TOKEN` | Upload source maps | `sntrys_...` | ❌ |
| `SENTRY_ORG` | Organisasi Sentry | `prelovedsaerawatt` | ❌ |
| `SENTRY_PROJECT` | Project Sentry | `storefront` | ❌ |
| `AXIOM_TOKEN` | Token Axiom (opsional) | `xaat-...` | ❌ |
| `AXIOM_DATASET` | Dataset Axiom | `prelovedsaerawatt-prod` | ❌ |

### Rate Limiting (opsional, production)

| Variable | Deskripsi | Contoh | Public? |
|---|---|---|---|
| `UPSTASH_REDIS_REST_URL` | URL Upstash | `https://xxx.upstash.io` | ❌ |
| `UPSTASH_REDIS_REST_TOKEN` | Token Upstash | `AX...` | ❌ |

### CI / Testing

| Variable | Deskripsi | Contoh | Public? |
|---|---|---|---|
| `VERCEL_TOKEN` | Deploy/rollback | `vercel_...` | ❌ |
| `VERCEL_ORG_ID` | Vercel org | `team_...` | ❌ |
| `VERCEL_PROJECT_ID` | Vercel project | `prj_...` | ❌ |
| `PLAYWRIGHT_BASE_URL` | Base URL E2E | `https://preview-xxx.vercel.app` | ❌ |
| `TEST_ADMIN_EMAIL` | Akun E2E | `admin@test.local` | ❌ |
| `TEST_ADMIN_PASSWORD` | Password E2E | `••••` | ❌ |
| `CRON_SECRET` | Proteksi cron cleanup (fase 2) | `••••` | ❌ |

## 7.2 `.env.example`

```dotenv
# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=prelovedsaerawatt/dev

# WhatsApp (62..., tanpa +)
NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890

# Monitoring (opsional di dev)
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=

# Rate limit (opsional di dev)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Testing
PLAYWRIGHT_BASE_URL=http://localhost:3000
TEST_ADMIN_EMAIL=admin@prelovedsaerawatt.local
TEST_ADMIN_PASSWORD=change-me
```

## 7.3 Env Validation

```ts
// src/lib/env.ts
import { z } from "zod";

const serverSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20).optional(),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().regex(/^62\d{8,15}$/),
});

export const env = serverSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
});
```

> `env.ts` hanya diimpor dari server modules. Untuk client, akses `process.env.NEXT_PUBLIC_*` langsung atau buat `publicEnv` terpisah.

## 7.4 Environment Matrix

| Variable | Local | Preview | Production |
|---|---|---|---|
| Supabase URL/key | Local Supabase | Staging project | Production project |
| Cloudinary folder | `prelovedsaerawatt/dev` | `prelovedsaerawatt/staging` | `prelovedsaerawatt/products` |
| WhatsApp | Nomor testing | Nomor testing | Nomor admin asli |
| Sentry | Optional | Staging project | Production project |
| Upstash | Optional | Optional | Wajib untuk rate limit konsisten |

---

# BAGIAN 8 — TESTING STRATEGY

## 8.1 Ringkasan

| Layer | Framework | Scope | Target |
|---|---|---|---|
| Unit | Vitest 5.0.5 + Testing Library | Fungsi murni, store, schema, komponen kecil | ≥ 80% line |
| Integration | Vitest + Supabase local | Server Actions, RLS, API route, query | ≥ 70% branch |
| E2E | Playwright 1.64.1 | 3 flow utama + admin | Critical path 100% |
| Accessibility | axe-core (Playwright) | 9 screen utama | 0 critical violation |
| Performance | Lighthouse CI (opsional) | Beranda, Katalog, PDP | ≥ 90 performance |

## 8.2 Unit Testing

**Contoh test case:**

| Modul | Test case |
|---|---|
| `formatIDR` | `125000` → `Rp 125.000`; `0` → `Rp 0`; desimal dibulatkan |
| `buildWhatsAppMessage` | Urutan item, SKU, total, baris Nama/Alamat/Catatan |
| `buildWhatsAppUrl` | Nomor `+62 812-3456-7890` → `6281234567890`; encoding newline |
| `cartStore.addItem` | Sold out ditolak; duplikat ditolak; item valid masuk |
| `cartStore.removeItem` | Item hilang; `validatedAt` reset |
| `cartStore.updateFromServer` | Harga berubah; missingIds dihapus; status update |
| `productSchema` | Nama < 3 char gagal; harga ≤ 0 gagal; images > 8 gagal; category invalid gagal |
| `shopParamsSchema` | `page=-1` → 1; `sort=xxx` → newest; `size` maks. 6 |
| `isCloudinaryUrl` | URL valid; domain lain ditolak; `javascript:` ditolak |
| `mapError` | `23505` → CONFLICT; `PGRST116` → NOT_FOUND |
| `formatRelativeDate` | "2 hari lalu", "12 Jan 2026" |

**Contoh test:**

```ts
// tests/unit/whatsapp.test.ts
import { describe, expect, it } from "vitest";
import { buildWhatsAppMessage, buildWhatsAppUrl, formatIDR } from "@/lib/whatsapp";

const items = [
  {
    id: "1", slug: "linen-blouse", name: "Linen Blouse", sku: "PSW-2610-001",
    price: 125000, size: "M", image: null, status: true, addedAt: "2026-10-26T00:00:00Z",
  },
];

describe("WhatsApp checkout", () => {
  it("formats IDR without decimals", () => {
    expect(formatIDR(125000)).toBe("Rp 125.000");
  });

  it("includes item, SKU, and total", () => {
    const message = buildWhatsAppMessage(items, 125000);
    expect(message).toContain("Linen Blouse — PSW-2610-001 — Rp 125.000");
    expect(message).toContain("Total: Rp 125.000");
  });

  it("normalizes phone number", () => {
    const url = buildWhatsAppUrl("+62 812-3456-7890", "Halo");
    expect(url).toBe("https://wa.me/6281234567890?text=Halo");
  });
});
```

## 8.3 Integration Testing

**Strategi:** jalankan Supabase lokal (Docker) + migration + seed; test Server Actions/route handler dengan cookie admin asli.

| Skenario | Ekspektasi |
|---|---|
| Anon SELECT products | Berhasil, termasuk sold out |
| Anon INSERT products | Ditolak RLS |
| Admin INSERT products | Berhasil |
| Admin UPDATE status | Berhasil |
| User login tanpa role admin | Ditolak |
| `createProductAction` valid | Produk masuk + revalidate dipanggil |
| `createProductAction` duplikat `requestId` | Mengembalikan produk existing, tidak duplikat |
| `createProductAction` images domain luar | `VALIDATION_ERROR` |
| `POST /api/cart/validate` 3 ID valid | 3 item + missingIds kosong |
| `POST /api/cart/validate` ID tidak ada | `missingIds` berisi ID |
| `POST /api/cart/validate` body invalid | 422 envelope |
| `POST /api/cloudinary/sign` tanpa auth | 401 |
| `POST /api/cloudinary/sign` admin | Signature + timestamp |

**RLS test wajib** dijalankan di CI karena ini pertahanan terakhir jika Server Action salah.

```ts
// tests/integration/rls.test.ts
import { createClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

describe("products RLS", () => {
  it("allows anon read", async () => {
    const anon = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
    const { error } = await anon.from("products").select("id").limit(1);
    expect(error).toBeNull();
  });

  it("blocks anon write", async () => {
    const anon = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
    const { error } = await anon.from("products").insert({ name: "Hack" });
    expect(error?.code).toBe("42501");
  });
});
```

## 8.4 E2E Testing

**Coverage — flow dari DESIGN.md:**

| Flow | Langkah |
|---|---|
| **Belanja** | Beranda → Katalog → filter kategori → PDP → add to cart → badge +1 |
| **Cart** | Keranjang → item tampil → total benar → refresh → item tetap ada |
| **Checkout** | Cart → sheet preview → klik "Buka WhatsApp" → stub `window.open` menerima URL `wa.me` |
| **Sold out** | PDP produk `status=false` → CTA disabled → tidak bisa add |
| **Cart stale** | Mock validate → item sold out → CTA disabled + tombol hapus |
| **Admin login** | `/admin` tanpa session → redirect → login → dashboard |
| **Admin CRUD** | Tambah produk (stub upload) → muncul di tabel → toggle terjual → edit → hapus |
| **Auth guard** | Login user non-admin → error; akses `/admin` ditolak |
| **404** | Slug tidak ada → halaman 404 + CTA katalog |
| **Mobile** | Viewport 390×844: grid 2 kolom, sticky CTA, filter sheet |

**Playwright config:**

```ts
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["html"], ["github"]] : "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone 13"] } },
  ],
  webServer: process.env.CI
    ? undefined
    : { command: "bun run dev", url: "http://localhost:3000", reuseExistingServer: true },
});
```

**Mocking:**
- WhatsApp: `page.addInitScript` override `window.open`; assert URL contains `wa.me` + encoded text.
- Cloudinary upload: intercept `api.cloudinary.com` dan kembalikan `secure_url` palsu.
- Supabase: E2E memakai Supabase staging/local, bukan mock penuh; data di-reset sebelum suite.

## 8.5 Test Folder Structure

```
tests/
├── unit/
│   ├── whatsapp.test.ts
│   ├── cart-store.test.ts
│   ├── product-schema.test.ts
│   ├── shop-params.test.ts
│   └── cloudinary-url.test.ts
├── integration/
│   ├── rls.test.ts
│   ├── products-action.test.ts
│   ├── cart-validate.test.ts
│   └── auth-action.test.ts
├── e2e/
│   ├── shopping.spec.ts
│   ├── cart-checkout.spec.ts
│   ├── admin.spec.ts
│   └── auth.spec.ts
└── setup/
    ├── vitest.setup.ts
    └── seed-test.ts
```

## 8.6 Vitest Config

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      thresholds: { lines: 80, branches: 70, functions: 80 },
      exclude: ["src/components/ui/**", "src/app/**/layout.tsx", "**/*.d.ts"],
    },
    projects: [
      {
        test: {
          name: "unit",
          environment: "jsdom",
          include: ["tests/unit/**/*.test.ts"],
          setupFiles: ["./tests/setup/vitest.setup.ts"],
        },
      },
      {
        test: {
          name: "integration",
          environment: "node",
          include: ["tests/integration/**/*.test.ts"],
        },
      },
    ],
  },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
```

## 8.7 Test Database & CI

| Item | Detail |
|---|---|
| Test DB | Supabase lokal via Docker (`supabase start`) |
| Reset | `bunx supabase db reset` sebelum integration/E2E |
| Seed | `supabase/seed.sql` + `bun run seed:admin` |
| Isolation | Satu suite = satu reset; E2E memakai project staging khusus |
| CI commands | `bun run test:unit`, `bun run test:integration`, `bun run test:e2e` |
| Coverage gate | CI gagal jika < threshold |
| Artifacts | Playwright trace/screenshot/video saat gagal |

---

# BAGIAN 9 — DATA MIGRATION & SEEDING

## 9.1 Ringkasan

**Tidak ada legacy system.** Project greenfield; yang dibutuhkan adalah migrasi schema awal dan seeding data operasional. Bagian ini tetap mendokumentasikan urutan apply, verifikasi, dan rollback agar rilis pertama aman.

## 9.2 Migration Plan

| Urutan | Migration | Isi | Downtime |
|---|---|---|---|
| 1 | `20261026000001_init_products.sql` | Extension `pg_trgm`, sequence SKU, tabel `products` | No |
| 2 | `20261026000002_indexes.sql` | Index created_at, status, category, price, trigram | No |
| 3 | `20261026000003_rls.sql` | Enable RLS + 4 policy | No |
| 4 | `20261026000004_updated_at.sql` | Fungsi + trigger `updated_at` | No |
| 5 | `supabase/seed.sql` | 8 produk demo (dev/staging saja) | No |

**Production tidak menjalankan seed demo.** Produk asli diinput admin via UI.

## 9.3 Process

1. **Local:** `bunx supabase start` → `bunx supabase db reset` → cek seed.
2. **Staging:** backup → `bunx supabase db push --linked` → jalankan integration test → smoke test preview.
3. **Production:** backup/PITR snapshot → apply migration → jalankan query verifikasi → deploy aplikasi → smoke test.
4. **Verifikasi:**
   ```sql
   select count(*) from public.products;
   select count(*) from pg_policies where schemaname = 'public' and tablename = 'products';
   select proname from pg_proc where proname = 'set_updated_at';
   ```
5. **Cutover:** promote Vercel deployment; update DNS jika domain baru.

## 9.4 Seed Data

| Data | Purpose | Cara | Production? |
|---|---|---|---|
| Admin user | Akses dashboard | `bun run seed:admin` (service role) | Ya, manual |
| Produk demo | Testing visual/filter | `supabase/seed.sql` | Tidak |
| FAQ | Halaman Tentang | `src/content/faq.ts` | Ya (build-time) |
| Kategori | Filter & form | Enum di Zod + DB check | Ya |

**`scripts/seed-admin.ts` (ringkas):**

```ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const email = process.env.TEST_ADMIN_EMAIL ?? "admin@prelovedsaerawatt.local";
const password = process.env.TEST_ADMIN_PASSWORD ?? "change-me-please";

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  app_metadata: { role: "admin" },
});

if (error) throw error;
console.log("Admin created:", data.user.id);
```

> Untuk production, jalankan script dengan env production secara lokal/CI yang aman; jangan mengekspos service role ke browser.

## 9.5 Rollback Plan

| Skenario | Tindakan |
|---|---|
| Migration gagal di tengah | Supabase migration transactional per file; perbaiki file lalu reset staging. Production: restore PITR/backup sebelum migration. |
| Aplikasi error setelah deploy | Vercel instant rollback ke deployment sebelumnya. |
| Data produk rusak | Restore tabel dari backup; export CSV sebelum operasi besar. |
| RLS salah | Disable policy baru, revert migration RLS, redeploy; test anon write harus gagal. |
| Cloudinary asset hilang | Cloudinary versioning/backup; URL lama tetap valid jika asset tidak dihapus. |

## 9.6 Post-Launch Data Ops

- **Cloudinary orphan cleanup:** fase 2; script membandingkan asset folder dengan `products.images`. Jangan hapus otomatis di MVP.
- **Backup verification:** restore bulanan ke staging.
- **Product archive:** jika katalog > 500 item, pertimbangkan `archived_at` (bukan delete) di fase 2.
- **Analytics:** export event `checkout_whatsapp` untuk mengukur konversi.

---

# LAMPIRAN — RINGKASAN KEPUTUSAN

| Keputusan | Nilai |
|---|---|
| Jumlah screen | 9 (sesuai DESIGN.md) |
| API routes | 3 inti (`cart/validate`, `cloudinary/sign`, `health`) + sitemap/robots |
| Server Actions | 6 (login, logout, create, update, toggle, delete) |
| Database table | 1 (`products`) + Supabase Auth |
| Auth | Supabase Auth, admin-only, role via `app_metadata` |
| Cart | Zustand + localStorage, revalidasi server |
| Checkout | WhatsApp deep link, tanpa order table |
| Upload | Cloudinary signed upload, 1–8 foto |
| Cache | ISR 60s + tag `products` |
| Hosting | Vercel `sin1` + Supabase `ap-southeast-1` |
| Testing | Vitest + Playwright + Supabase local |

> **Langkah berikutnya:** pecah spec ini menjadi task atomik dengan `create-issues`:
> `"Buat Task berdasarkan Tech Spec dan DESIGN.md yang sudah dibuat"`
