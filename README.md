# prelovedsaerawatt

Butik preloved terkurasi untuk perempuan: katalog online, inventaris admin, dan checkout langsung via WhatsApp. Foto dan kondisi barang ditampilkan apa adanya — satu piece, satu cerita.

- **Storefront:** hero carousel dari katalog, pencarian & filter, detail produk, keranjang lokal, checkout WhatsApp.
- **Admin:** login Supabase Auth, statistik inventaris, CRUD produk, upload foto Cloudinary, toggle status tersedia/terjual.
- **Mode demo:** katalog lokal + login cookie tanpa Supabase, berguna untuk development offline.

## Tech Stack

| Bagian | Teknologi |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack, Proxy) |
| UI | React 19, Tailwind CSS 4, Radix UI, Lucide |
| Bahasa | TypeScript 6 |
| Database & Auth | Supabase (Postgres, Auth, Row Level Security) |
| Media | Cloudinary (upload bertanda tangan + transformasi gambar) |
| State | Zustand (keranjang, persist ke localStorage) |
| Validasi | Zod |
| Package manager | Bun 1.4+ |
| Tool dev | Agentation (visual feedback, hanya development) |

## Struktur Proyek

```
src/
├── app/
│   ├── (store)/              # Storefront: home, shop, produk, keranjang, tentang
│   ├── admin/                # Login + dashboard inventaris
│   ├── actions/              # Server Actions (auth, produk)
│   └── api/                  # health, cart/validate, cloudinary/sign
├── components/
│   ├── store/                # Komponen storefront
│   ├── admin/                # Form, tabel, uploader admin
│   └── ui/                   # Primitif UI
├── content/                  # Copy halaman Tentang & langkah belanja
├── lib/
│   ├── supabase/             # Client public & server (SSR)
│   ├── products.ts           # Query katalog + mapping tipe
│   ├── auth.ts               # Session admin (Supabase / cookie demo)
│   ├── env.ts                # Pembacaan & validasi env
│   └── cloudinary.ts         # Signed upload
├── schemas/                  # Skema Zod
├── stores/                   # Zustand cart
└── types/                    # Tipe produk, katalog, database

supabase/
├── migrations/               # Skema, index, RLS, trigger updated_at
└── seed.sql                  # Seed development lokal (jangan untuk produksi)

images/                       # Foto stok sumber untuk import ke Cloudinary
scripts/
├── seed-admin.ts             # Provision akun admin Supabase
└── import-catalog.ts         # Upload foto + buat katalog demo lokal
```

## Menjalankan Secara Lokal

### Prasyarat

- [Bun](https://bun.sh) 1.4 atau lebih baru
- Node.js 20.9 atau lebih baru
- Project Supabase
- Akun Cloudinary

### 1. Install dependency

```bash
bun install
```

### 2. Siapkan environment

```bash
cp .env.example .env.local
```

Isi variabel berikut di `.env.local`:

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Produksi | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Produksi | Anon/publishable key Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Script saja | Untuk `seed:admin`; jangan dipakai runtime |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Upload | Cloud name Cloudinary |
| `CLOUDINARY_API_KEY` | Upload | API key Cloudinary |
| `CLOUDINARY_API_SECRET` | Upload | API secret Cloudinary |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Ya | Format `62` + 8–15 digit, contoh `62859121494481` |
| `NEXT_PUBLIC_SITE_URL` | Ya | URL publik, contoh `https://prelovedsaerawatt.com` |
| `DEMO_MODE` | Tidak | `true` untuk katalog lokal + login cookie demo |
| `NEXT_PUBLIC_DEMO_MODE` | Tidak | Sisi client dari mode demo |
| `DEMO_ADMIN_EMAIL` | Demo | Email admin demo |
| `DEMO_ADMIN_PASSWORD` | Demo | Password admin demo (min. 8 karakter) |
| `AUTH_SECRET` | Disarankan | Secret HMAC cookie admin demo; generate dengan `openssl rand -base64 32` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Script saja | Dipakai `seed:admin` untuk membuat akun admin |
| `DATABASE_URL` | Migrasi | Connection string pooler, hanya untuk tooling/migrasi |

> **Jangan commit `.env.local`.** File tersebut sudah masuk `.gitignore`. Service role key dan password database tidak boleh terekspos ke client.

### 3. Jalankan migrasi Supabase

Jalankan file di `supabase/migrations/` berurutan, lewat salah satu cara:

- **SQL Editor** di dashboard Supabase (copy-paste isi file), atau
- **Supabase CLI:**

```bash
supabase link --project-ref <project-ref>
supabase db push
```

Catatan: koneksi langsung `db.<project-ref>.supabase.co:5432` umumnya IPv6-only. Jika jaringan tidak mendukung IPv6, gunakan **Session Pooler** dari dashboard Supabase untuk migrasi/manual query.

Skema yang dibuat:

- Tabel `public.products` (UUID, slug & SKU unik, harga, kategori, kondisi, foto array, status)
- Sequence SKU otomatis `PSW-YYMM-XXX`
- Index pencarian (termasuk trigram untuk nama)
- RLS: publik hanya bisa membaca; insert/update/delete hanya `authenticated` dengan `app_metadata.role = "admin"`
- Trigger `updated_at`

### 4. Buat akun admin

```bash
ADMIN_EMAIL=admin@domain.com ADMIN_PASSWORD='password-kuat' bun run seed:admin
```

Script akan membuat user Supabase (email terkonfirmasi) dengan `app_metadata.role = "admin"`. Jika user sudah ada, password dan role-nya diperbarui.

Matikan **public signup** di dashboard Supabase: *Authentication → Providers → Email → Allow new users to sign up*.

### 5. Jalankan development server

```bash
bun run dev
```

Buka [http://localhost:3000](http://localhost:3000). Admin ada di [http://localhost:3000/admin](http://localhost:3000/admin).

## Mode Demo

Set `DEMO_MODE=true` dan `NEXT_PUBLIC_DEMO_MODE=true` untuk:

- Membaca katalog dari `.data/products.json` (bukan Supabase)
- Login admin memakai cookie HMAC lokal, bukan Supabase Auth
- Upload gambar disimulasikan sebagai data URL jika Cloudinary belum diisi

Untuk mengisi katalog demo:

```bash
bun run import:catalog
```

Script ini mengunggah foto dari folder `images/` ke Cloudinary dan menulis entri ke `.data/products.json`. Script **tidak** menulis ke Supabase — untuk produksi, tambahkan produk lewat dashboard admin.

> Mode demo harus `false` (atau tidak diisi) di produksi.

## Scripts

| Perintah | Fungsi |
| --- | --- |
| `bun run dev` | Development server (Turbopack) |
| `bun run build` | Production build |
| `bun run start` | Menjalankan hasil build |
| `bun run lint` | ESLint |
| `bun run typecheck` | Cek TypeScript |
| `bun run format` | Prettier |
| `bun run seed:admin` | Provision akun admin Supabase |
| `bun run import:catalog` | Upload foto stok + katalog demo lokal |

## Alur Singkat

1. **Storefront** membaca produk lewat Supabase anon/publishable key. RLS memastikan hanya operasi baca yang diizinkan untuk publik.
2. **Admin** login lewat Supabase Auth. Server memeriksa `app_metadata.role === "admin"` sebelum mengizinkan akses.
3. **Upload foto** memakai signed upload Cloudinary: client meminta tanda tangan ke `/api/cloudinary/sign`, lalu mengunggah langsung ke Cloudinary.
4. **Keranjang** disimpan di localStorage (Zustand), lalu checkout diarahkan ke WhatsApp dengan ringkasan pesanan.
5. **Validasi stok** dilakukan lewat `/api/cart/validate` sebelum checkout.

Endpoint opsional:

- `GET /api/health` — status aplikasi & koneksi database
- `POST /api/cart/validate` — validasi harga/stok item keranjang
- `POST /api/cloudinary/sign` — tanda tangan upload (khusus admin)

## Deployment

Contoh untuk Vercel:

1. Import repository ini ke Vercel.
2. Set environment variables produksi (Supabase, Cloudinary, WhatsApp, `NEXT_PUBLIC_SITE_URL`).
3. Pastikan `DEMO_MODE=false` dan `NEXT_PUBLIC_DEMO_MODE=false`.
4. Jalankan migrasi Supabase sebelum deploy pertama.
5. Setelah deploy, cek `/api/health` → `mode: production`, `database: up`.
6. Matikan public signup Supabase dan batasi akses dashboard sesuai kebutuhan.

Checklist keamanan:

- Service role key hanya untuk script lokal/CI, tidak pernah di bundle client.
- RLS aktif di semua tabel yang diekspos.
- Rotasi `AUTH_SECRET` dan kredensial jika pernah bocor.
- Jangan jalankan `supabase/seed.sql` di produksi.

## Catatan Development

- `Agentation` dipasang di root layout dan hanya render saat `NODE_ENV=development`.
- Proyek memakai `src/proxy.ts` (bukan `middleware.ts`) untuk melindungi route `/admin`.
- Gambar produk memakai Cloudinary melalui `next/image`; domain harus terdaftar di `next.config.ts`.
- CSP dan security header diatur di `next.config.ts`.

## Repository

[https://github.com/3scode/prelovedsaerawatt](https://github.com/3scode/prelovedsaerawatt)
