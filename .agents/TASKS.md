# TASKS.md — prelovedsaerawatt

> **Task Breakdown**
> Versi: 1.0 · Tanggal: 26 Oktober 2026 · Status: Ready for Implementation
> Referensi: `.agents/PRD.md` + `.agents/DESIGN.md` + `.agents/TECH-SPEC.md`
> Breakdown: **Hybrid** — foundation/backend per modul, UI per screen
> Project state: **Baru** (belum ada `package.json`)
> Design references: **0** (tanpa Stitch export)

---

## Ringkasan

| Item | Nilai |
|---|---|
| Total task | **21** |
| Phase | 4 (Foundation, Core, Enhancement, Infrastructure) |
| Screen coverage | **9/9** |
| Modul | Foundation, Data, Backend, Storefront, Cart, Admin, Quality, Deployment |
| Estimasi | **± 41,5 dev-days** (≈ 8 minggu solo dev) |
| Task opsional | Testing, CI/CD, Monitoring, Compliance **belum dipilih** → tidak dibuat sebagai task terpisah |
| Data migration | **Tidak ada legacy** → hanya migrasi schema awal + seed |

> **Catatan:** task testing/CI/CD/monitoring tidak dimasukkan karena belum dipilih. Setiap task tetap punya acceptance criteria dan langkah verifikasi manual. Task tersebut bisa ditambahkan nanti tanpa mengubah task core.

## Legend

| Field | Nilai |
|---|---|
| Priority | `P0` = blocker, `P1` = core MVP, `P2` = polish |
| Status | `todo` · `in-progress` · `blocked` · `review` · `done` |
| Effort | `S` ≤ 1 hari · `M` 1–3 hari · `L` 3–5 hari |
| Screen | Nomor screen DESIGN.md atau `—` |
| FR | Referensi fitur PRD (bukan ID formal; PRD tidak memakai FR numbering) |

## Dependency Graph

```
T-01 Setup
 └─ T-02 Design System
     └─ T-03 Env, Config & Clients
         └─ T-04 Database & RLS
             └─ T-05 Data Access & Validation
                 └─ T-06 API Routes & Server Actions
                     ├─ T-07 Storefront Layout & Shared Components
                     │   ├─ T-08 Beranda
                     │   ├─ T-09 Katalog
                     │   ├─ T-13 Tentang
                     │   └─ T-14 404 & Error
                     ├─ T-11 Cart Store
                     │   ├─ T-10 PDP (butuh add-to-cart)
                     │   └─ T-12 Cart + WhatsApp
                     ├─ T-15 Admin Auth
                     │   └─ T-16 Dashboard
                     │       └─ T-17 Form Produk
                     └─ T-18 Error & Resilience
T-08..T-17 ── T-19 A11y, SEO & Performance
T-06, T-15 ── T-20 Security Hardening
T-01..T-20 ── T-21 Deployment
```

---

# PHASE 1 — FOUNDATION

## T-01 — Setup Project & Tooling

| Field | Value |
|---|---|
| Modul | Foundation |
| Phase | Foundation |
| Screen | — |
| Related FR | N/A (greenfield) |
| Priority | P0 |
| Status | `todo` |
| Effort | S (1 hari) |

**Tech:** Bun 1.4.4 · Next.js 16.4.3 · React 19.3.1 · TypeScript 7.0.2 · Tailwind 4.3.3 · shadcn CLI 4.22.1 · ESLint 10 · Prettier 3.9

**File:**
- `package.json`, `bun.lock`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `.prettierrc`
- `.gitignore`, `.env.example`, `components.json`
- `src/app/layout.tsx`, `src/app/globals.css`
- `src/app/(store)/layout.tsx`, `src/app/admin/layout.tsx`

**Dependencies:** —

**Sub-task:**
- [ ] Init Next.js 16 App Router + TypeScript dengan Bun.
- [ ] Aktifkan `strict: true`, path alias `@/* → src/*`.
- [ ] Install Tailwind 4 + PostCSS; setup `@import "tailwindcss"` di `globals.css`.
- [ ] Init shadcn (`bunx shadcn@latest init`) dan set `components.json`.
- [ ] Install dependency core: `zustand`, `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `cloudinary`, `next-cloudinary`, `nanoid`, `slugify`, `lucide-react`.
- [ ] Install dev dependency: `eslint`, `eslint-config-next`, `prettier`, `typescript`, `@types/node`, `@types/react`, `@types/react-dom`.
- [ ] **Testing deps ditunda** (`vitest`, Playwright, Testing Library) sampai task testing ditambahkan.
- [ ] Buat struktur folder sesuai Tech Spec §1.4.
- [ ] Tambahkan scripts `dev`, `build`, `start`, `lint`, `typecheck`, `format`.
- [ ] Buat `.env.example` dengan 6 env wajib PRD + env opsional.
- [ ] Tambahkan `.gitignore` untuk `.env*.local`, `.next`, `node_modules`, `playwright-report`, `test-results`.
- [ ] Init git repository + initial commit; hubungkan remote (dibutuhkan Vercel).
- [ ] Verifikasi dev server, lint, typecheck, dan build.

**Acceptance Criteria:**
- [ ] `bun install` sukses tanpa error.
- [ ] `bun run dev` membuka `http://localhost:3000`.
- [ ] `bun run lint`, `bun run typecheck`, dan `bun run build` lulus.
- [ ] Git repo terinisialisasi dengan initial commit dan `.gitignore` benar.
- [ ] Struktur folder `(store)` dan `admin` ada dan tidak konflik route.
- [ ] `.env.example` memuat: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- [ ] Tidak ada secret nyata yang ter-commit.

**Referensi:** DESIGN.md §1.10 · TECH-SPEC §1.1, §1.4, §7.2

---

## T-02 — Design System & Base UI

| Field | Value |
|---|---|
| Modul | Foundation — Design System |
| Phase | Foundation |
| Screen | Semua screen |
| Related FR | N/A (design system) |
| Priority | P0 |
| Status | `todo` |
| Effort | M (3 hari) |

**Tech:** Tailwind 4 `@theme` · shadcn/ui · next/font · Lucide 1.61 · CSS variables

**File:**
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/ui/button.tsx`, `input.tsx`, `textarea.tsx`, `select.tsx`, `label.tsx`, `badge.tsx`, `dialog.tsx`, `sheet.tsx`, `toast.tsx`, `skeleton.tsx`
- `src/lib/utils.ts`

**Dependencies:** T-01

**Sub-task:**
- [ ] Implement 21 color token DESIGN.md §1.2 sebagai CSS variables + `@theme` Tailwind.
- [ ] Implement typography: Fraunces (display), Manrope (body), IBM Plex Mono (SKU) via `next/font/google`; subset latin; `display: swap`.
- [ ] Implement spacing 4px grid, radius, shadow, dan motion token §1.4–1.9.
- [ ] Override shadcn base: radius, border, ring, focus-visible, disabled, transition.
- [ ] Buat `Button` dengan variant: primary, secondary, outline, ghost, destructive, whatsapp; size sm/md/lg/icon.
- [ ] Buat `FormField` wrapper: label, hint, error, required, `aria-describedby`.
- [ ] Buat `Status Badge`: `available`, `sold-out`, `new`, `low-stock` (jika dipakai).
- [ ] Buat `Modal`/`Dialog` dan `Sheet` dengan focus trap, ESC, overlay, `aria-modal`.
- [ ] Buat `Toast` dengan varian success/error/info dan `aria-live`.
- [ ] Buat `Skeleton` dengan shimmer sesuai DESIGN.md §1.8.
- [ ] Buat `Empty State` base (ikon, judul, deskripsi, CTA).
- [ ] Hormati `prefers-reduced-motion`; durasi 0–0.01ms.
- [ ] Buat halaman/story internal sementara untuk visual check semua komponen.

**Acceptance Criteria:**
- [ ] Tidak ada hardcoded hex setelah token; semua warna lewat CSS variable.
- [ ] Semua komponen base punya state default, hover, focus-visible, active, disabled, loading.
- [ ] Kontras teks memenuhi WCAG AA (≥ 4.5:1 untuk body).
- [ ] Navigasi keyboard: Tab, Shift+Tab, Enter, Space, ESC berfungsi.
- [ ] `prefers-reduced-motion` menonaktifkan animasi non-esensial.
- [ ] Visual check desktop 1440px dan mobile 390px.

**Referensi:** DESIGN.md Bagian 1, §4.1–4.6 · TECH-SPEC §1.1

---

## T-03 — Environment, Config & Core Clients

| Field | Value |
|---|---|
| Modul | Foundation — Infrastructure |
| Phase | Foundation |
| Screen | Semua screen (indirect) |
| Related FR | N/A (infrastruktur) |
| Priority | P0 |
| Status | `todo` |
| Effort | S/M (1,5 hari) |

**Tech:** `@supabase/ssr` 0.12.7 · `@supabase/supabase-js` 2.118 · Cloudinary SDK 2.11 · Zod 4.6 · Next.js config

**File:**
- `src/lib/env.ts`
- `src/lib/supabase/public.ts`, `src/lib/supabase/server.ts`
- `src/lib/cloudinary.ts`
- `src/lib/logger.ts`, `src/lib/resilience.ts`, `src/lib/rate-limit.ts`, `src/lib/api-response.ts`
- `next.config.ts`

**Dependencies:** T-01

**Sub-task:**
- [ ] Buat `env.ts` dengan Zod; fail-fast untuk env server yang wajib.
- [ ] Buat `publicEnv` terpisah untuk `NEXT_PUBLIC_*` (tidak mengimpor schema server).
- [ ] Implement `supabasePublic` stateless (anon, no session).
- [ ] Implement `createSupabaseServerClient` cookie-aware (`cookies()` async).
- [ ] Implement `isCloudinaryUrl` + `extractPublicId` (opsional).
- [ ] Konfigurasi `next.config.ts`: `images.remotePatterns` Cloudinary, format AVIF/WebP, security headers.
- [ ] Implement logger JSON (`level`, `msg`, `time`, `requestId`, `route`, `userId`, `code`).
- [ ] Implement `withRetry` (max 2, exponential + jitter, timeout).
- [ ] Implement `withBreaker` (threshold 5/30s, open 30s, half-open).
- [ ] Implement rate limiter: Upstash jika env ada, fallback in-memory.
- [ ] Implement envelope helper `ok()` / `fail()` + `ApiErrorCode`.
- [ ] Tambahkan validasi `NEXT_PUBLIC_WHATSAPP_NUMBER` regex `/^62\d{8,15}$/`.

**Acceptance Criteria:**
- [ ] Env invalid → build/dev gagal dengan pesan jelas (bukan `undefined` runtime).
- [ ] Service role key tidak pernah masuk bundle client.
- [ ] `supabasePublic` tidak menyimpan session.
- [ ] Server client bisa membaca/menulis cookie auth.
- [ ] `next.config.ts` hanya mengizinkan `res.cloudinary.com` untuk gambar remote.
- [ ] Retry/breaker/rate-limit punya fallback yang aman.

**Referensi:** TECH-SPEC §1.6, §4.4–4.6, §5.1, §7.3

---

# PHASE 2 — CORE

## T-04 — Database Schema, RLS & Seed

| Field | Value |
|---|---|
| Modul | Data Layer |
| Phase | Core |
| Screen | Semua screen data-driven |
| Related FR | PRD §3.1, §3.2, §4 |
| Priority | P0 |
| Status | `todo` |
| Effort | M (1,5 hari) |

**Tech:** Supabase Postgres 17 · Supabase CLI · SQL migrations · RLS

**File:**
- `supabase/config.toml`
- `supabase/migrations/20261026000001_init_products.sql`
- `supabase/migrations/20261026000002_indexes.sql`
- `supabase/migrations/20261026000003_rls.sql`
- `supabase/migrations/20261026000004_updated_at.sql`
- `supabase/seed.sql`
- `scripts/seed-admin.ts`
- `src/types/database.ts` (generated)

**Dependencies:** T-03

**Sub-task:**
- [ ] Init Supabase lokal (`bunx supabase init`).
- [ ] Buat tabel `products` dengan semua kolom Tech Spec §2.2: `id`, `created_at`, `updated_at`, `name`, `slug`, `sku`, `price`, `size`, `category`, `description`, `defect_notes`, `images`, `status`, `created_by`, `request_id`.
- [ ] Buat sequence `product_sku_seq` + default SKU `PSW-YYMM-XXX`.
- [ ] Tambahkan CHECK: nama 3–80, harga > 0, kategori enum, deskripsi 1–2000, defect ≤ 500, images 1–8.
- [ ] Buat index: `created_at desc`, `status`, `category`, `price`, GIN trigram `name`, unique `slug`/`sku`/`request_id`.
- [ ] Aktifkan RLS + 4 policy: public read, admin insert/update/delete via `app_metadata.role`.
- [ ] Buat trigger `updated_at`.
- [ ] Seed 8 produk demo (5 kategori, campuran available/sold out) dengan Cloudinary demo URL.
- [ ] Buat `scripts/seed-admin.ts` (service role) untuk admin lokal.
- [ ] Generate types: `bunx supabase gen types typescript --local > src/types/database.ts`.
- [ ] Verifikasi RLS: anon bisa SELECT, anon INSERT gagal, admin INSERT berhasil.

**Acceptance Criteria:**
- [ ] `bunx supabase db reset` sukses dari nol.
- [ ] Seed menghasilkan 8 produk; SKU unik dan format `PSW-YYMM-###`.
- [ ] Anon write ditolak dengan error `42501`.
- [ ] Admin dengan `app_metadata.role="admin"` bisa CRUD.
- [ ] Search `ilike` memakai index trigram.
- [ ] `products.price` bertipe `numeric(12,2)` dan > 0.
- [ ] Tidak ada migration yang mengedit production secara manual.

**Referensi:** TECH-SPEC Bagian 2 · PRD §4

---

## T-05 — Data Access, Domain Types & Validation

| Field | Value |
|---|---|
| Modul | Data Layer |
| Phase | Core |
| Screen | 01, 02, 03, 04, 07, 08 |
| Related FR | PRD §3.1, §3.2 |
| Priority | P0 |
| Status | `todo` |
| Effort | M (1,5 hari) |

**Tech:** Supabase JS 2.118 · Zod 4.6 · TypeScript 7

**File:**
- `src/lib/supabase/queries.ts`
- `src/types/product.ts`
- `src/schemas/product.ts`, `src/schemas/shop.ts`, `src/schemas/cart.ts`
- `src/lib/utils.ts`
- `src/lib/whatsapp.ts`

**Dependencies:** T-04

**Sub-task:**
- [ ] Definisikan `Product`, `ProductCardData`, `CartSnapshot`, `ShopParams`, `AdminProductFilters`.
- [ ] Implement `getLatestProducts(limit)` untuk beranda.
- [ ] Implement `getProductBySlug(slug)`; return `null` jika tidak ada.
- [ ] Implement `getRelatedProducts(category, excludeId, limit=4)`.
- [ ] Implement `getProducts(params)` untuk katalog: search, category, size, `hideSold`, sort, pagination 12.
- [ ] Implement `getAdminProducts(params)` untuk dashboard: search, status, pagination 20.
- [ ] Implement `getAdminStats()`: total, tersedia, terjual.
- [ ] Map `numeric` PostgREST (`string`) → `number` di boundary query.
- [ ] Buat `productSchema` (create/update) dan `shopParamsSchema` (validasi + fallback).
- [ ] Buat `cartValidateSchema` (UUID array 1–20).
- [ ] Buat `formatIDR`, `formatRelativeDate`, `cn`, `normalizeWhatsAppNumber`.
- [ ] Buat `buildWhatsAppMessage` + `buildWhatsAppUrl` sesuai DESIGN.md §Screen 04.
- [ ] Tambahkan cache tags: `products`, `product:{slug}`.

**Acceptance Criteria:**
- [ ] Semua query mengembalikan tipe yang sama dengan `Product` app (harga `number`).
- [ ] `getProducts` tidak error saat `q` kosong / filter invalid.
- [ ] `getProductBySlug` tidak throw untuk slug tak dikenal.
- [ ] Pagination menghitung `totalPages` minimal 1.
- [ ] `buildWhatsAppMessage` memuat nama, SKU, harga per item, total, dan placeholder Nama/Alamat/Catatan.
- [ ] `formatIDR(125000)` menghasilkan `Rp 125.000`.
- [ ] Schema menolak harga ≤ 0, gambar > 8, kategori invalid, UUID invalid.

**Referensi:** DESIGN.md Screen 01–04, 07–08 · TECH-SPEC §3.9, §4.8

---

## T-06 — API Routes & Server Actions

| Field | Value |
|---|---|
| Modul | Backend |
| Phase | Core |
| Screen | 03, 04, 06, 07, 08 |
| Related FR | PRD §3.1, §3.2 |
| Priority | P0 |
| Status | `todo` |
| Effort | L (4 hari) |

**Tech:** Next.js Route Handlers · Server Actions · Supabase Auth · Cloudinary SDK · Zod

**File:**
- `src/app/api/cart/validate/route.ts`
- `src/app/api/cloudinary/sign/route.ts`
- `src/app/api/health/route.ts`
- `src/app/actions/auth.ts`
- `src/app/actions/products.ts`
- `src/lib/api-response.ts`

**Dependencies:** T-03, T-04, T-05

**Sub-task:**
- [ ] `POST /api/cart/validate`: validasi body, rate limit 60/menit/IP, query status/harga, return `items`, `missingIds`, `validatedAt`.
- [ ] `POST /api/cloudinary/sign`: auth admin, rate limit 10/menit/user, signature `timestamp`, `folder`, `allowed_formats`, return cloud name/key.
- [ ] `GET /api/health`: cek Supabase `select 1`, return `ok`/`degraded`, no cache.
- [ ] `signInAction`: Zod email/password, `signInWithPassword`, cek role admin, redirect `next` internal, logout jika bukan admin.
- [ ] `signOutAction`: `signOut()` + redirect login.
- [ ] `createProductAction`: auth + role, parse FormData, validasi Zod, cek idempotency `request_id`, generate slug, insert, revalidate.
- [ ] `updateProductAction`: auth + role, update by id, revalidate, handle slug berubah.
- [ ] `toggleProductStatusAction`: payload `{ id, status }` (bukan toggle), optimistic-safe, revalidate.
- [ ] `deleteProductAction`: auth + role, delete by id, revalidate; second delete → `NOT_FOUND` dianggap sukses oleh client.
- [ ] Map error Postgres/Cloudinary ke `ApiErrorCode`.
- [ ] Terapkan `withRetry` untuk operasi read-only; jangan retry create product.
- [ ] Pastikan semua response API memakai envelope `{ success, data, error, meta }`.
- [ ] Manual test dengan `curl` / REST client untuk 3 API route.

**Acceptance Criteria:**
- [ ] Request tanpa auth ke sign/CRUD → 401/403.
- [ ] `cart/validate` dengan 3 ID valid → 3 item; ID hilang → masuk `missingIds`.
- [ ] `cart/validate` body invalid → 422 + `VALIDATION_ERROR`.
- [ ] `cloudinary/sign` admin → signature valid dan bisa dipakai upload.
- [ ] Create product duplikat `requestId` → tidak membuat baris kedua.
- [ ] Semua mutasi memicu `revalidateTag("products")` dan path terkait.
- [ ] Error tidak membocorkan stack trace/secret.
- [ ] `GET /api/health` return 200 saat DB sehat.

**Referensi:** TECH-SPEC §3.3–3.9, §4.1.4–4.1.9, §4.7

---

## T-07 — Storefront Layout & Shared Components

| Field | Value |
|---|---|
| Modul | Frontend — Shared |
| Phase | Core |
| Screen | 01, 02, 03, 04, 05, 09 |
| Related FR | PRD §3.1 |
| Priority | P1 |
| Status | `todo` |
| Effort | M (2,5 hari) |

**Tech:** React 19 RSC · Tailwind 4 · shadcn · Lucide · Zustand (badge integration di T-12)

**File:**
- `src/app/(store)/layout.tsx`
- `src/components/store/site-header.tsx`
- `src/components/store/site-footer.tsx`
- `src/components/store/product-card.tsx`
- `src/components/store/search-field.tsx`
- `src/components/store/empty-state.tsx`
- `src/components/store/mobile-nav.tsx`
- `src/components/store/cart-badge.tsx` (placeholder sampai T-11)

**Dependencies:** T-02, T-05

**Sub-task:**
- [ ] Header desktop: logo wordmark serif, nav Beranda/Katalog/Tentang, search, cart icon + badge.
- [ ] Header mobile: logo, search icon, cart, hamburger → sheet nav.
- [ ] Sticky header dengan border tipis saat scroll; tetapaksesibel.
- [ ] Footer: brand, tagline, link katalog/tentang/Instagram/WhatsApp, copyright.
- [ ] `ProductCard`: cover 4:5, nama, harga, size, status badge, hover subtle zoom, sold-out overlay.
- [ ] `ProductCard` variant: default grid, compact related, horizontal (cart/admin jika perlu).
- [ ] `SearchField`: input + submit, navigate `/shop?q=...`, clear button, `aria-label`.
- [ ] `EmptyState`: ikon, judul, deskripsi, CTA; dipakai katalog/cart/404.
- [ ] Skip link "Lewati ke konten".
- [ ] Pastikan semua komponen client boundary minimal (hanya menu/search/cart badge).
- [ ] Placeholder cart badge 0; integrasi store di T-12.

**Acceptance Criteria:**
- [ ] Header/footer tampil benar di 390px, 768px, 1440px.
- [ ] Product card tidak menyebabkan layout shift; gambar punya `width`/`height` atau `aspect-ratio`.
- [ ] Search dari header membawa query ke katalog.
- [ ] Menu mobile bisa dibuka/tutup dengan keyboard dan ESC.
- [ ] Skip link berfungsi.
- [ ] Tidak ada `use client` di layout/store page jika tidak perlu.
- [ ] Sold-out card tetap bisa diklik ke PDP, tetapi tidak menampilkan CTA add.

**Referensi:** DESIGN.md §2.5, §4.2, §4.7–4.9 · TECH-SPEC §1.3

---

## T-08 — Screen 01: Beranda

| Field | Value |
|---|---|
| Modul | Storefront — Home |
| Phase | Core |
| Screen | 01 |
| Related FR | PRD §3.1 Katalog |
| Priority | P1 |
| Status | `todo` |
| Effort | M (2 hari) |

**Tech:** React 19 RSC · ISR `revalidate=60` · next/image · Fraunces/Manrope

**File:**
- `src/app/(store)/page.tsx`
- `src/components/store/hero.tsx`
- `src/components/store/trust-strip.tsx`
- `src/components/store/category-tile.tsx`
- `src/components/store/how-to-shop.tsx`
- `src/app/(store)/loading.tsx`
- `src/app/(store)/error.tsx`

**Dependencies:** T-05, T-07

**Sub-task:**
- [ ] Hero editorial: headline serif, subcopy, CTA "Jelajahi koleksi", foto utama 4:5/3:2.
- [ ] Trust strip 3 poin: kurasi butik, kondisi jujur, checkout WhatsApp.
- [ ] Section "Baru masuk" — 8 produk terbaru dari `getLatestProducts(8)`.
- [ ] Section kategori — 5 tile dengan jumlah produk (opsional jika query mahal).
- [ ] Section "Cara belanja" 3 langkah.
- [ ] CTA penutup ke katalog/WhatsApp.
- [ ] Empty state jika belum ada produk.
- [ ] Loading skeleton sesuai DESIGN.md Screen 01.
- [ ] Error state dengan retry.
- [ ] Metadata: title, description, canonical, OG image.
- [ ] Responsive 390/768/1440; hero tidak overflow.
- [ ] Optimasi LCP: preload hero image, `priority` hanya hero.

**Acceptance Criteria:**
- [ ] Beranda menampilkan maksimal 8 produk terbaru.
- [ ] Produk sold out tetap tampil dengan badge "Terjual".
- [ ] Hero LCP < 2.5s pada Lighthouse mobile (target, bukan hard gate).
- [ ] Semua section punya heading hierarkis (h1 → h2 → h3).
- [ ] CTA keyboard-accessible dan punya focus ring.
- [ ] Empty/loading/error state sesuai DESIGN.md.
- [ ] Tidak ada horizontal scroll di 390px.

**Referensi:** DESIGN.md Screen 01 · TECH-SPEC §1.3, §3.1

---

## T-09 — Screen 02: Katalog

| Field | Value |
|---|---|
| Modul | Storefront — Catalog |
| Phase | Core |
| Screen | 02 |
| Related FR | PRD §3.1 Katalog + filter |
| Priority | P1 |
| Status | `todo` |
| Effort | M (2,5 hari) |

**Tech:** React 19 RSC · `searchParams` (async) · Supabase filters · URL state

**File:**
- `src/app/(store)/shop/page.tsx`
- `src/app/(store)/shop/loading.tsx`
- `src/app/(store)/shop/error.tsx`
- `src/components/store/shop-filters.tsx`
- `src/components/store/active-filters.tsx`
- `src/components/store/sort-select.tsx`
- `src/components/store/pagination.tsx`

**Dependencies:** T-05, T-07

**Sub-task:**
- [ ] Parse `searchParams` async: `q`, `category`, `size`, `hideSold`, `sort`, `page`.
- [ ] Validasi dengan `shopParamsSchema`; fallback aman untuk nilai invalid.
- [ ] Layout desktop: filter rail kiri + grid 3 kolom; mobile: filter sheet.
- [ ] Filter kategori (5), ukuran (multi), toggle "Sembunyikan terjual".
- [ ] Search field + clear; sinkron ke URL.
- [ ] Sort: terbaru, harga terendah, harga tertinggi.
- [ ] Active filter chips + "Hapus semua".
- [ ] Result count `aria-live="polite"`.
- [ ] Grid 2 kolom mobile, 3 desktop; card T-07.
- [ ] Pagination page-based 12 item; pertahankan query filter.
- [ ] Empty state: "Tidak ada produk yang cocok" + reset filter.
- [ ] Loading skeleton 6–8 card; error state retry.
- [ ] Metadata dinamis berdasarkan filter (canonical tanpa parameter tracking).

**Acceptance Criteria:**
- [ ] Filter mengubah URL dan hasil tanpa reload penuh.
- [ ] Refresh URL mempertahankan filter.
- [ ] `page` invalid → fallback 1, tidak crash.
- [ ] `hideSold` default off; saat on, produk terjual hilang.
- [ ] Empty state muncul saat hasil 0.
- [ ] Mobile filter sheet bisa dibuka/tutup via keyboard.
- [ ] Pagination tidak kehilangan filter.
- [ ] Count dan grid konsisten.

**Referensi:** DESIGN.md Screen 02 · TECH-SPEC §3.7, §4.1.1

---

## T-10 — Screen 03: Detail Produk (PDP)

| Field | Value |
|---|---|
| Modul | Storefront — PDP |
| Phase | Core |
| Screen | 03 |
| Related FR | PRD §3.1 Detail Produk |
| Priority | P1 |
| Status | `todo` |
| Effort | M (2,5 hari) |

**Tech:** React 19 RSC · ISR 60s · JSON-LD · next/image · Zustand (via T-11)

**File:**
- `src/app/(store)/produk/[slug]/page.tsx`
- `src/app/(store)/produk/[slug]/loading.tsx`
- `src/app/(store)/produk/[slug]/error.tsx`
- `src/components/store/product-gallery.tsx`
- `src/components/store/condition-callout.tsx`
- `src/components/store/product-accordion.tsx`
- `src/components/store/related-products.tsx`
- `src/components/store/add-to-cart-button.tsx`

**Dependencies:** T-05, T-07, T-11

**Sub-task:**
- [ ] Fetch produk by slug; `notFound()` jika tidak ada.
- [ ] Layout desktop: galeri kiri 60%, info kanan 40%; mobile stacked.
- [ ] Galeri: main image + thumbnail, klik untuk lightbox, swipe mobile, keyboard arrow.
- [ ] Info: nama, harga, size, kategori, SKU mono, status badge.
- [ ] Condition callout: defect notes; fallback "Mulus, tanpa defect berarti."
- [ ] Accordion: deskripsi, ukuran & fit, cara rawat, pengiriman.
- [ ] CTA add to cart (disabled saat sold out) + CTA "Tanya via WhatsApp".
- [ ] Sold-out state: badge, CTA disabled, pesan jelas, related tetap tampil.
- [ ] Related products 4 item (kategori sama, available).
- [ ] Metadata dinamis + OG image; JSON-LD `Product` dengan availability.
- [ ] Loading skeleton dan error state.
- [ ] `generateStaticParams` opsional untuk 50 produk terbaru; ISR tetap.
- [ ] Fokus ke heading saat navigasi dari card (opsional).

**Acceptance Criteria:**
- [ ] PDP bisa diakses via slug; slug invalid → 404.
- [ ] Produk sold out tetap tampil, CTA add disabled.
- [ ] Galeri bisa diganti via klik/thumbnail/keyboard.
- [ ] Defect notes tampil jujur; null → fallback.
- [ ] Add to cart menambah 1 item (unique piece, tanpa qty).
- [ ] Related tidak menampilkan produk yang sama.
- [ ] JSON-LD valid (Rich Results Test).
- [ ] Metadata dan OG image benar.
- [ ] Mobile: CTA tetap terlihat tanpa menutupi konten.

**Referensi:** DESIGN.md Screen 03 · TECH-SPEC §4.1.2–4.1.3

---

## T-11 — Cart Store & Revalidation Logic

| Field | Value |
|---|---|
| Modul | Cart |
| Phase | Core |
| Screen | 04 (support), 03 (add) |
| Related FR | PRD §3.1 Sistem Keranjang |
| Priority | P1 |
| Status | `todo` |
| Effort | S (1 hari) |

**Tech:** Zustand 5.0.16 · `persist` middleware · localStorage · fetch + retry

**File:**
- `src/stores/cart.ts`
- `src/components/store/cart-hydrator.tsx`
- `src/lib/cart-validation.ts`

**Dependencies:** T-05, T-06

**Sub-task:**
- [ ] Buat store `items`, `validatedAt`, `addItem`, `removeItem`, `updateFromServer`, `setValidatedAt`, `clear`.
- [ ] `persist` key `psw-cart-v1`, `version: 1`, `partialize` hanya items.
- [ ] Aktifkan `skipHydration: true`; rehydrate di `CartHydrator` setelah mount.
- [ ] `addItem`: tolak sold out, tolak duplikat, qty selalu 1.
- [ ] `removeItem`: hapus + reset `validatedAt`.
- [ ] `updateFromServer`: update harga/status, hapus missing, pertahankan field lokal.
- [ ] `validateCart`: POST `/api/cart/validate`, retry 2× (300/900ms), timeout 5s.
- [ ] Handle localStorage corrupt / versi lama → reset + toast.
- [ ] Simpan `validatedAt` hanya di memory, bukan localStorage.
- [ ] Expose selector `cartCount`, `cartTotal`, `hasUnavailable`.
- [ ] Integrasi badge header (ganti placeholder T-07).
- [ ] Catat event `add_to_cart` (jika analytics tersedia; opsional).

**Acceptance Criteria:**
- [ ] Item bertahan setelah refresh.
- [ ] Produk sold out tidak bisa masuk.
- [ ] Duplikat tidak menambah baris/qty.
- [ ] Qty selalu 1 (tidak ada stepper).
- [ ] Revalidasi meng-update harga tanpa menghapus item.
- [ ] Produk terhapus → `missingIds` → item dihapus setelah user diberi info.
- [ ] Request gagal → `hasUnavailable`/`validationError` true; checkout diblokir.
- [ ] Tidak ada hydration mismatch di SSR.

**Referensi:** DESIGN.md Screen 04 · TECH-SPEC §4.1.3–4.1.4, §4.8

---

## T-12 — Screen 04: Keranjang & WhatsApp Checkout

| Field | Value |
|---|---|
| Modul | Cart |
| Phase | Core |
| Screen | 04 |
| Related FR | PRD §3.1 Cart + WhatsApp Checkout |
| Priority | P1 |
| Status | `todo` |
| Effort | M (2 hari) |

**Tech:** React 19 Client Components · Zustand · shadcn Sheet · `wa.me`

**File:**
- `src/app/(store)/keranjang/page.tsx`
- `src/components/store/cart-line-item.tsx`
- `src/components/store/cart-summary.tsx`
- `src/components/store/checkout-sheet.tsx`
- `src/components/store/cart-unavailable-alert.tsx`

**Dependencies:** T-06, T-07, T-11

**Sub-task:**
- [ ] Layout 2 kolom desktop: daftar item + ringkasan sticky; mobile stacked.
- [ ] Line item: cover, nama, SKU, size, harga, status, tombol hapus.
- [ ] Ringkasan: subtotal, total, catatan "belum termasuk ongkir", CTA checkout.
- [ ] Banner revalidasi: loading, harga berubah, item terjual, validasi gagal + retry.
- [ ] CTA disabled jika cart kosong / ada unavailable / validasi gagal / `validatedAt` > 5 menit.
- [ ] Modal konfirmasi hapus item + undo toast.
- [ ] `CheckoutSheet`: preview pesan WhatsApp, total, tombol "Buka WhatsApp".
- [ ] Generate pesan via `buildWhatsAppMessage`; buka `wa.me` dengan `noopener,noreferrer`.
- [ ] Empty state: ilustrasi, copy, CTA katalog.
- [ ] Mobile sticky summary (tidak menutupi konten); safe-area inset.
- [ ] `aria-live` untuk perubahan total/status; fokus ke banner saat item invalid.
- [ ] Event `checkout_whatsapp` (opsional).
- [ ] Manual test: refresh, sold out, hapus, checkout, nomor WA invalid.

**Acceptance Criteria:**
- [ ] Cart kosong menampilkan empty state dan CTA katalog.
- [ ] Total = jumlah harga item, format `Rp`.
- [ ] Item sold out ditandai jelas dan memblokir checkout sampai dihapus.
- [ ] Harga berubah → update + notice.
- [ ] Validasi gagal → CTA disabled + tombol retry.
- [ ] Sheet menampilkan preview pesan yang sama dengan yang dikirim.
- [ ] URL WhatsApp berisi nomor `62...` dan teks ter-encode.
- [ ] Tidak ada mutasi server saat checkout.
- [ ] Mobile 390px: summary dan CTA bisa dijangkau tanpa scroll horizontal.

**Referensi:** DESIGN.md Screen 04, §4.5–4.6 · TECH-SPEC §4.1.4–4.1.5, §4.8

---

## T-13 — Screen 05: Tentang & Cara Belanja

| Field | Value |
|---|---|
| Modul | Storefront — Static |
| Phase | Core |
| Screen | 05 |
| Related FR | PRD §3.1 (trust/kurasi) |
| Priority | P2 |
| Status | `todo` |
| Effort | S (1 hari) |

**Tech:** React 19 RSC · static content · accordion

**File:**
- `src/app/(store)/tentang/page.tsx`
- `src/content/about.ts`
- `src/content/faq.ts`
- `src/components/store/faq-accordion.tsx`

**Dependencies:** T-07

**Sub-task:**
- [ ] Hero "Barang bagus, cerita baru" + foto editorial.
- [ ] Section cerita brand: kenapa preloved, proses kurasi.
- [ ] 3 janji: kondisi jujur, foto apa adanya, checkout cepat.
- [ ] "Cara belanja" 4 langkah: pilih → cart → WhatsApp → kirim.
- [ ] FAQ 5–7 item (kondisi, defect, ukuran, ongkir, retur, pembayaran).
- [ ] CTA katalog + WhatsApp.
- [ ] Metadata statis + OG.
- [ ] Responsive dan tipografi editorial.
- [ ] FAQ accordion keyboard-accessible.

**Acceptance Criteria:**
- [ ] Halaman statis tanpa query DB.
- [ ] Semua pertanyaan FAQ bisa dibuka/tutup via keyboard.
- [ ] CTA mengarah ke `/shop` dan nomor WA valid.
- [ ] Tidak ada klaim yang tidak didukung (mis. "garansi uang kembali" jika tidak ada).
- [ ] Metadata dan heading hierarkis benar.
- [ ] Tampil baik di 390px dan 1440px.

**Referensi:** DESIGN.md Screen 05

---

## T-14 — Screen 09: 404 & Global Error Boundaries

| Field | Value |
|---|---|
| Modul | Storefront — System |
| Phase | Core |
| Screen | 09 |
| Related FR | N/A (system) |
| Priority | P2 |
| Status | `todo` |
| Effort | S (0,5 hari) |

**Tech:** Next.js `not-found.tsx`, `error.tsx`, `global-error.tsx`

**File:**
- `src/app/not-found.tsx`
- `src/app/(store)/not-found.tsx`
- `src/app/global-error.tsx`
- `src/app/(store)/error.tsx` (jika belum dari T-08)
- `src/app/admin/error.tsx`

**Dependencies:** T-07

**Sub-task:**
- [ ] Desain 404: headline serif, copy hangat, CTA katalog/beranda.
- [ ] Opsional: 4 produk terbaru; jika query gagal, sembunyikan section.
- [ ] `not-found.tsx` store dan global.
- [ ] `global-error.tsx` minimal, tanpa header/footer yang bergantung data.
- [ ] `error.tsx` per segment dengan tombol "Coba lagi" (`reset()`).
- [ ] Pastikan error tidak menampilkan stack trace.
- [ ] Metadata title 404.
- [ ] Fokus otomatis ke heading 404.

**Acceptance Criteria:**
- [ ] Slug produk tidak ada → 404 dengan layout store.
- [ ] Error server → error boundary + retry, bukan layar putih.
- [ ] `global-error` tetap bisa dirender tanpa provider/data.
- [ ] CTA 404 berfungsi.
- [ ] Tidak ada kebocoran error message internal.
- [ ] Status HTTP 404 benar (bukan 200).

**Referensi:** DESIGN.md Screen 09 · TECH-SPEC §4.1.10, §4.4

---

## T-15 — Screen 06: Admin Auth & Proxy

| Field | Value |
|---|---|
| Modul | Admin — Auth |
| Phase | Core |
| Screen | 06 |
| Related FR | PRD §3.2 Autentikasi |
| Priority | P0 |
| Status | `todo` |
| Effort | M (2 hari) |

**Tech:** Supabase Auth · `@supabase/ssr` · Next.js 16 `proxy.ts` · Server Actions

**File:**
- `src/proxy.ts`
- `src/app/admin/login/page.tsx`
- `src/app/admin/layout.tsx`
- `src/components/admin/login-form.tsx`
- `src/components/admin/admin-sidebar.tsx`
- `src/app/actions/auth.ts` (dari T-06)

**Dependencies:** T-03, T-06

**Sub-task:**
- [ ] `proxy.ts`: refresh session, redirect `/admin/*` tanpa user ke login dengan `next`.
- [ ] Redirect user login dari `/admin/login` ke `/admin`.
- [ ] `admin/layout.tsx`: `getUser()` + cek `app_metadata.role === "admin"`; jika bukan → signOut/redirect.
- [ ] Login form: email, password, show/hide password, error generic, loading state.
- [ ] `signInAction`: validasi, rate limit, sign-in, cek role, redirect aman.
- [ ] `signOutAction` + tombol logout di sidebar/topbar.
- [ ] Session expired saat action → redirect login dengan pesan.
- [ ] Admin shell: sidebar desktop, topbar mobile, active state.
- [ ] Seed admin lokal + dokumentasi provisioning production.
- [ ] Pastikan public signup Supabase dimatikan (dokumentasi).

**Acceptance Criteria:**
- [ ] `/admin` tanpa session → redirect `/admin/login?next=/admin`.
- [ ] Login admin valid → dashboard.
- [ ] Login user non-admin → error generik + tidak masuk.
- [ ] `next` hanya menerima path internal `/admin...` (cegah open redirect).
- [ ] Logout menghapus session dan redirect login.
- [ ] Refresh halaman admin tetap login.
- [ ] Proxy tidak menyebabkan loop redirect.
- [ ] Tidak ada form yang mengirim password ke client log.

**Referensi:** DESIGN.md Screen 06 · TECH-SPEC §4.1.6, §4.3, §5.1

---

## T-16 — Screen 07: Dashboard Inventaris

| Field | Value |
|---|---|
| Modul | Admin — Inventory |
| Phase | Core |
| Screen | 07 |
| Related FR | PRD §3.2 Read + Toggle |
| Priority | P1 |
| Status | `todo` |
| Effort | L (3,5 hari) |

**Tech:** React 19 RSC · Server Actions · `useOptimistic` · shadcn Table/Dialog

**File:**
- `src/app/admin/page.tsx`
- `src/app/admin/loading.tsx`
- `src/app/admin/error.tsx`
- `src/components/admin/stat-card.tsx`
- `src/components/admin/product-table.tsx`
- `src/components/admin/product-row-card.tsx`
- `src/components/admin/status-toggle.tsx`
- `src/components/admin/delete-product-dialog.tsx`
- `src/components/admin/admin-search.tsx`
- `src/components/admin/admin-pagination.tsx`

**Dependencies:** T-06, T-15

**Sub-task:**
- [ ] Stat cards: total produk, tersedia, terjual.
- [ ] Search by nama/SKU; filter status; sort terbaru.
- [ ] Desktop: tabel (cover, nama, SKU, kategori, size, harga, status, aksi).
- [ ] Mobile: card list dengan info ringkas + aksi.
- [ ] Pagination 20 item; pertahankan filter.
- [ ] Toggle status optimistic (`useOptimistic`/state lokal) + rollback saat gagal.
- [ ] Delete modal: sebut nama produk, konfirmasi, loading, error.
- [ ] Empty state: belum ada produk + CTA tambah.
- [ ] Loading skeleton tabel/card.
- [ ] Error state + retry.
- [ ] Quick action "Tambah produk" ke `/admin/produk/baru`.
- [ ] Aksesibilitas: table header scope, toggle `aria-checked`, modal focus trap.
- [ ] Revalidate otomatis via action; UI refresh setelah sukses.

**Acceptance Criteria:**
- [ ] Hanya admin bisa melihat dashboard.
- [ ] Stat cards akurat setelah create/toggle/delete.
- [ ] Search/filter/pagination bekerja dan tersimpan di URL.
- [ ] Toggle mengubah status di UI dan DB; gagal → rollback.
- [ ] Delete menghapus baris dan modal tertutup.
- [ ] Empty state muncul saat katalog kosong.
- [ ] Mobile card tidak overflow.
- [ ] Keyboard bisa mengoperasikan toggle dan modal.
- [ ] Harga tampil `Rp`; SKU mono.

**Referensi:** DESIGN.md Screen 07 · TECH-SPEC §4.1.8–4.1.9

---

## T-17 — Screen 08: Form Produk & Image Upload

| Field | Value |
|---|---|
| Modul | Admin — Product Form |
| Phase | Core |
| Screen | 08 |
| Related FR | PRD §3.2 Create/Update + Cloudinary |
| Priority | P1 |
| Status | `todo` |
| Effort | L (4 hari) |

**Tech:** `useActionState` · Zod · Cloudinary signed upload · shadcn Form · reorder

**File:**
- `src/app/admin/produk/baru/page.tsx`
- `src/app/admin/produk/[id]/edit/page.tsx`
- `src/app/admin/produk/[id]/edit/loading.tsx`
- `src/components/admin/product-form.tsx`
- `src/components/admin/image-uploader.tsx`
- `src/components/admin/image-preview.tsx`
- `src/components/admin/form-section.tsx`
- `src/components/admin/unsaved-changes-dialog.tsx`

**Dependencies:** T-06, T-16

**Sub-task:**
- [ ] Form create: nama, harga, kategori, size, deskripsi, defect notes, status, foto.
- [ ] Form edit: fetch produk by id, prefill, tampilkan slug/SKU read-only.
- [ ] Loading state saat fetch edit (skeleton form), error state jika produk tidak ada.
- [ ] `requestId` UUID dibuat saat form mount (idempotency create).
- [ ] Validasi client (Zod) + inline error + error summary.
- [ ] Image uploader: pilih file, validasi jpg/png/webp ≤ 5MB, maks. 8.
- [ ] Upload via `/api/cloudinary/sign` lalu langsung ke Cloudinary; progress + retry.
- [ ] Preview grid, reorder, set cover (foto pertama), hapus foto.
- [ ] Tampilkan cover badge; drag handle keyboard-accessible (tombol naik/turun).
- [ ] Submit create/update via Server Action; loading + disabled saat submit.
- [ ] Sukses → toast + redirect `/admin`.
- [ ] Error field → fokus ke field pertama; server error banner.
- [ ] Unsaved changes dialog saat navigasi.
- [ ] Form responsif: 2 kolom desktop, 1 kolom mobile.
- [ ] Pastikan upload tidak jalan dua kali saat double-click.

**Acceptance Criteria:**
- [ ] Create produk valid → muncul di dashboard dan katalog setelah revalidate.
- [ ] Edit menyimpan perubahan dan mempertahankan foto.
- [ ] Foto > 8 / > 5MB / format salah ditolak dengan pesan jelas.
- [ ] Reorder mengubah cover; foto pertama tampil di card/PDP.
- [ ] Submit double-click tidak membuat produk ganda (requestId).
- [ ] Validasi server dan client konsisten.
- [ ] Unsaved changes mencegah kehilangan data.
- [ ] Semua field bisa dioperasikan dengan keyboard.
- [ ] Tidak ada secret Cloudinary di bundle client.

**Referensi:** DESIGN.md Screen 08 · TECH-SPEC §4.1.7, §4.8, §5.1

---

# PHASE 3 — ENHANCEMENT

## T-18 — Error Handling & Resilience Integration

| Field | Value |
|---|---|
| Modul | Quality — Reliability |
| Phase | Enhancement |
| Screen | Semua screen |
| Related FR | Tech Spec §4.4–4.6 |
| Priority | P1 |
| Status | `todo` |
| Effort | M (1,5 hari) |

**Tech:** Next.js error boundaries · `withRetry` · `withBreaker` · JSON logger

**File:**
- `src/lib/resilience.ts`
- `src/lib/logger.ts`
- `src/app/global-error.tsx`
- `src/components/store/error-state.tsx`
- `src/components/admin/error-state.tsx`
- `src/app/api/**/route.ts` (wrapper)

**Dependencies:** T-06, T-08, T-09, T-10, T-12, T-13, T-14, T-15, T-16, T-17

**Sub-task:**
- [ ] Terapkan mapping error konsisten: Zod, Postgres, Supabase Auth, Cloudinary, timeout.
- [ ] Bungkus route handler dengan `withApiHandler` (requestId, log, envelope).
- [ ] Bungkus Server Action dengan `withAction` (auth, log, `ActionResult`).
- [ ] Aktifkan retry 2× untuk `/api/cart/validate`; jangan retry create product.
- [ ] Aktifkan circuit breaker untuk Supabase dan Cloudinary.
- [ ] Implement fallback UI:
  - [ ] Cart validate gagal → checkout disabled + retry.
  - [ ] Cloudinary sign gagal → tombol retry upload.
  - [ ] Beranda/PDP gagal → cache ISR terakhir atau error state.
- [ ] Pastikan `error.tsx` tidak menampilkan stack trace.
- [ ] Log `requestId`, route, durasi, error code; redaksi PII/secret.
- [ ] Tambahkan `x-request-id` di response API.
- [ ] Uji simulasi dependency down (matikan Supabase lokal / mock 503).

**Acceptance Criteria:**
- [ ] Semua error API memakai envelope dan kode yang benar.
- [ ] Cart tidak bisa checkout saat validasi gagal.
- [ ] Retry tidak menyebabkan duplikasi produk.
- [ ] Circuit breaker membuka setelah 5 kegagalan dan menutup setelah sukses.
- [ ] Error boundary menampilkan CTA retry, bukan blank page.
- [ ] Log tidak memuat password, token, atau isi pesan WhatsApp.
- [ ] `requestId` bisa dilacak dari response ke log.

**Referensi:** TECH-SPEC §4.4–4.6, §6.1

---

## T-19 — Accessibility, SEO & Performance Pass

| Field | Value |
|---|---|
| Modul | Quality — UX |
| Phase | Enhancement |
| Screen | Semua screen |
| Related FR | DESIGN.md a11y + PRD visual-first |
| Priority | P1 |
| Status | `todo` |
| Effort | M (1,5 hari) |

**Tech:** Lighthouse · axe · Next.js Metadata API · `sitemap.ts` · `robots.ts`

**File:**
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/app/layout.tsx` (metadata)
- Semua page/component terkait
- `public/` (OG fallback)

**Dependencies:** T-08, T-09, T-10, T-12, T-13, T-14, T-15, T-16, T-17, T-18

**Sub-task:**
- [ ] Audit keyboard seluruh screen: Tab order, focus visible, ESC, Enter/Space.
- [ ] Pastikan semua gambar punya `alt` bermakna; dekoratif `alt=""`.
- [ ] Cek kontras warna token (terutama text secondary di background ivory).
- [ ] Tambahkan `aria-live` untuk cart count, result count, toast, error summary.
- [ ] Tambahkan `aria-current` untuk nav aktif; `aria-expanded` untuk accordion/menu.
- [ ] Pastikan form field punya label, hint, error, dan `aria-describedby`.
- [ ] Hormati `prefers-reduced-motion` di semua animasi.
- [ ] Audit heading hierarchy tiap screen (satu h1).
- [ ] Metadata: title template, description, canonical, OG/Twitter.
- [ ] `sitemap.ts`: beranda, shop, tentang, semua PDP published.
- [ ] `robots.ts`: allow public, disallow `/admin`, `/api`, `/keranjang`.
- [ ] JSON-LD `Product` + `Organization` (opsional).
- [ ] Optimasi gambar: `sizes`, `priority` hero, `loading=lazy` sisanya.
- [ ] Cek bundle storefront < 200KB gzip (initial JS).
- [ ] Jalankan Lighthouse mobile untuk Beranda, Katalog, PDP.
- [ ] Perbaiki CLS dari font/image/skeleton.

**Acceptance Criteria:**
- [ ] Tidak ada critical/serious axe violation di 9 screen.
- [ ] Semua interactive element bisa dioperasikan keyboard.
- [ ] Fokus terlihat jelas di light background.
- [ ] Lighthouse mobile Performance ≥ 90, Accessibility ≥ 95 (target).
- [ ] LCP < 2.5s, CLS < 0.1 pada halaman yang diuji.
- [ ] `sitemap.xml` dan `robots.txt` valid.
- [ ] Metadata/OG benar saat dibagikan.
- [ ] Tidak ada heading level yang melompat.

**Referensi:** DESIGN.md Bagian 1 & 3 (a11y/responsive) · TECH-SPEC §5.2

---

## T-20 — Security Hardening

| Field | Value |
|---|---|
| Modul | Quality — Security |
| Phase | Enhancement |
| Screen | Semua screen |
| Related FR | TECH-SPEC §5.1 |
| Priority | P0 |
| Status | `todo` |
| Effort | S (1 hari) |

**Tech:** Next.js headers · CSP · RLS · rate limit · Supabase Auth

**File:**
- `next.config.ts`
- `src/proxy.ts`
- `src/lib/rate-limit.ts`
- `src/lib/cloudinary.ts`
- `supabase/migrations/*_rls.sql`
- `.env.example`

**Dependencies:** T-06, T-15

**Sub-task:**
- [ ] Pasang security headers: HSTS, XCTO, frame deny, referrer, permissions.
- [ ] Tambahkan CSP (setelah domain final) sesuai Tech Spec §5.1.
- [ ] Verifikasi RLS: anon read only; anon write ditolak; admin write lolos.
- [ ] Verifikasi role check di setiap Server Action, bukan hanya UI.
- [ ] Pastikan service role key hanya di script/CI, tidak di runtime client.
- [ ] Batasi upload: jpg/png/webp, ≤ 5MB, maks. 8, folder Cloudinary tetap.
- [ ] Tolak URL gambar di luar `res.cloudinary.com/{cloud}`.
- [ ] Terapkan rate limit cart validate, cloudinary sign, login.
- [ ] Cegah open redirect pada parameter `next`.
- [ ] Pastikan public signup Supabase mati.
- [ ] Cek tidak ada `dangerouslySetInnerHTML` / `eval` / secret di bundle.
- [ ] Review dependency kritis (Next, Supabase, Cloudinary, Zod).
- [ ] Dokumentasikan rotasi kunci dan prosedur insiden singkat.

**Acceptance Criteria:**
- [ ] Anon tidak bisa INSERT/UPDATE/DELETE produk.
- [ ] User non-admin tidak bisa memanggil action admin meski tahu endpoint.
- [ ] Tidak ada secret di `view-source`/bundle client.
- [ ] Upload file berbahaya (SVG/HTML/oversize) ditolak.
- [ ] `next` redirect hanya ke path internal.
- [ ] Rate limit mengembalikan 429 dengan envelope.
- [ ] CSP tidak memblokir Cloudinary/Supabase/font yang dipakai.
- [ ] Security headers terlihat di response production/preview.

**Referensi:** TECH-SPEC §5.1, §7.4

---

# PHASE 4 — INFRASTRUCTURE

## T-21 — Deployment & Production Readiness

| Field | Value |
|---|---|
| Modul | Infrastructure |
| Phase | Infrastructure |
| Screen | Semua screen |
| Related FR | PRD §2 Tech Stack + §6 Env |
| Priority | P0 |
| Status | `todo` |
| Effort | S/M (1,5 hari) |

**Tech:** Vercel `sin1` · Supabase `ap-southeast-1` · Cloudinary · Bun

**File:**
- `README.md`
- `docs/deploy-runbook.md`
- `docs/rollback.md`
- `.env.example`
- `vercel.json` (jika perlu)

**Dependencies:** T-01–T-20

**Sub-task:**
- [ ] Buat Supabase project staging + production (region Singapore).
- [ ] Jalankan migration + RLS di staging, lalu production.
- [ ] Buat admin production + set `app_metadata.role="admin"`.
- [ ] Buat folder Cloudinary production/staging.
- [ ] Set env Vercel per environment (Production, Preview, Development).
- [ ] Hubungkan repo ke Vercel; pastikan build command `bun run build`.
- [ ] Deploy preview; uji 9 screen + admin CRUD + WhatsApp.
- [ ] Smoke test production:
  - [ ] Beranda, katalog, filter, PDP.
  - [ ] Add to cart, refresh, validate, checkout sheet.
  - [ ] Login admin, create, edit, toggle, delete.
  - [ ] 404 dan error boundary.
- [ ] Set domain + SSL + redirect `www` (jika dipakai).
- [ ] Aktifkan uptime monitor `/api/health`.
- [ ] Tulis runbook deploy + rollback (Vercel instant rollback, DB PITR).
- [ ] Backup Supabase + verifikasi restore staging.
- [ ] Konfirmasi `NEXT_PUBLIC_WHATSAPP_NUMBER` produksi benar.

**Acceptance Criteria:**
- [ ] Production dapat diakses via domain final.
- [ ] Semua env wajib terisi; build tidak error.
- [ ] Admin login production berhasil.
- [ ] Create/edit/toggle/delete produk berfungsi di production.
- [ ] Checkout WhatsApp membuka nomor admin yang benar.
- [ ] `/api/health` 200 dan dipantau.
- [ ] Rollback Vercel diuji minimal sekali.
- [ ] Tidak ada seed produk demo di production.
- [ ] Cloudinary upload production masuk folder yang benar.
- [ ] Runbook bisa diikuti orang lain tanpa pengetahuan tribal.

**Referensi:** TECH-SPEC §5.3–5.5, §7.4 · PRD §6

---

# COVERAGE & DEFINITION OF DONE

## Screen Coverage

| # | Screen | Task | Status |
|---|---|---|---|
| 01 | Beranda | T-08 | `todo` |
| 02 | Katalog | T-09 | `todo` |
| 03 | Detail Produk | T-10 | `todo` |
| 04 | Keranjang + WhatsApp | T-11, T-12 | `todo` |
| 05 | Tentang & Cara Belanja | T-13 | `todo` |
| 06 | Login Admin | T-15 | `todo` |
| 07 | Dashboard Inventaris | T-16 | `todo` |
| 08 | Form Produk | T-17 | `todo` |
| 09 | 404 | T-14 | `todo` |

## Module Coverage

| Modul | Task | Status |
|---|---|---|
| Setup & tooling | T-01 | `todo` |
| Design system | T-02 | `todo` |
| Env, config, client | T-03 | `todo` |
| Database & RLS | T-04 | `todo` |
| Data access & validation | T-05 | `todo` |
| API & Server Actions | T-06 | `todo` |
| Storefront shared UI | T-07 | `todo` |
| Home | T-08 | `todo` |
| Catalog | T-09 | `todo` |
| PDP | T-10 | `todo` |
| Cart store | T-11 | `todo` |
| Cart + checkout | T-12 | `todo` |
| About | T-13 | `todo` |
| 404/error | T-14 | `todo` |
| Admin auth | T-15 | `todo` |
| Admin dashboard | T-16 | `todo` |
| Admin form/upload | T-17 | `todo` |
| Error & resilience | T-18 | `todo` |
| A11y/SEO/performance | T-19 | `todo` |
| Security | T-20 | `todo` |
| Deployment | T-21 | `todo` |

## Phase Summary

| Phase | Tasks | Estimasi |
|---|---|---|
| Foundation | T-01–T-03 | 5,5 hari |
| Core | T-04–T-17 | 30,5 hari |
| Enhancement | T-18–T-20 | 4 hari |
| Infrastructure | T-21 | 1,5 hari |
| **Total** | **21 task** | **± 41,5 hari** |

## Global Definition of Done

Setiap task dianggap selesai jika:

- [ ] Semua sub-task checklist selesai.
- [ ] Acceptance criteria task terpenuhi.
- [ ] `bun run lint` lulus.
- [ ] `bun run typecheck` lulus.
- [ ] `bun run build` lulus.
- [ ] UI dicek di 390px, 768px, dan 1440px.
- [ ] State default, loading, empty, error, dan success tersedia (jika relevan).
- [ ] Keyboard navigation dan focus visible berfungsi.
- [ ] Tidak ada hardcoded color di luar token DESIGN.md.
- [ ] Tidak ada secret/PII di log atau bundle.
- [ ] Cache/revalidasi dipanggil setelah mutasi.
- [ ] `PROGRESS.md` diupdate.
- [ ] Perubahan di-commit dengan pesan deskriptif.

## Backlog — Belum Dibuat

Task berikut **tidak** dimasukkan karena opsi belum dipilih saat generator berjalan:

| Kandidat Task | Cakupan | Cara Menambah |
|---|---|---|
| Testing Suite | Vitest unit/integration, Playwright E2E, RLS test | Minta "tambah task testing" |
| CI/CD Pipeline | GitHub Actions, preview/production gate, rollback | Minta "tambah task CI/CD" |
| Monitoring | Sentry, Vercel Analytics/Speed Insights, alerting | Minta "tambah task monitoring" |
| Compliance | Privacy policy, cookie consent, data deletion | Minta "tambah task compliance" |
| Cloudinary Cleanup | Script orphan asset cleanup | Fase 2 |
| Order Archive | `archived_at` untuk katalog > 500 item | Fase 2 |

> **Catatan:** Testing manual tetap bagian dari acceptance criteria tiap task. Task testing terpisah baru diperlukan untuk otomasi dan regression gate.
