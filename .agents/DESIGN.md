# DESIGN.md — prelovedsaerawatt

> **UI/UX Design Specification**
> Versi: 1.0 · Tanggal: 26 Oktober 2026 · Status: Final Draft
> Platform: **Web Application** (responsive, mobile-first)
> Design style: **Editorial Earth Tone**
> Mode: **Light only** (dark mode di luar MVP)
> Unique Value Proposition: **Preloved yang dikurasi seperti butik — kondisi & defect jujur, checkout langsung ke WhatsApp tanpa drama.**

---

## Ringkasan Brand

**prelovedsaerawatt** adalah katalog e-commerce pakaian wanita preloved yang terkurasi. Setiap item adalah satu-satunya (unique piece), jadi pengalaman belanja harus terasa seperti membuka lemari butik pribadi — bukan marketplace yang ramai dan penuh iklan.

**Tagline:** *Barang bagus, cerita baru.*

**Brand voice:** hangat, jujur, tenang, tidak berlebihan. Gunakan "kamu" di storefront, bahasa Indonesia sehari-hari yang sopan. Hindari kata "murah meriah", "buruan", atau urgensi palsu.

**5 prinsip design:**
1. **Foto dulu, UI belakangan.** Produk adalah bintang; interface harus mundur.
2. **Jujur itu premium.** Kondisi, defect, dan status terjual ditampilkan tanpa disembunyikan.
3. **Satu langkah lagi ke WhatsApp.** Checkout tidak boleh terasa seperti form panjang.
4. **Tenang, tidak ramai.** Whitespace lega, sedikit warna, tanpa banner promo bertumpuk.
5. **Detail kecil terasa mahal.** Tipografi serif, garis tipis, transisi halus, microcopy yang manusiawi.

**Anti-AI-slop guardrails (wajib):**
- ❌ Gradient ungu/biru, glassmorphism, blob 3D, emoji di UI, ilustrasi generic.
- ❌ Card serba rounded besar + shadow tebal + ikon di setiap sudut.
- ❌ Hero centered dengan dua tombol identik dan trust badge berjejer.
- ❌ Dashboard boilerplate putih-biru dengan sidebar default shadcn.
- ✅ Grid editorial asimetris, foto 4:5, serif display, warna earth tone, border tipis.
- ✅ Aksen clay/terracotta secukupnya; sisanya ivory, espresso, dan sage.

---

# BAGIAN 1 — DESIGN SYSTEM

## 1.1 Design Style

| Atribut | Nilai |
|---|---|
| Style | Editorial Earth Tone |
| Platform | Web (mobile < 768px, tablet 768–1024px, desktop > 1024px) |
| Mode | Light only |
| Mood | Hangat, tenang, terkurasi, premium tapi approachable |
| Referensi rasa | Majalah fashion independen, butik vintage, kertas bertekstur |
| UVP acuan | Kurasi butik + transparansi kondisi + checkout WhatsApp cepat |

## 1.2 Color Palette (Light Mode)

| Token | Hex | Usage | Kontras |
|---|---|---|---|
| `--color-primary` | `#8C4A32` | Brand, CTA utama, link aktif | 6.0:1 di background ✅ AA |
| `--color-primary-hover` | `#6F3825` | Hover/pressed CTA | 8.2:1 ✅ AAA |
| `--color-primary-soft` | `#F1E2D8` | Background chip aktif, callout | — |
| `--color-secondary` | `#5E6B52` | Aksen sekunder, status tersedia | 5.1:1 ✅ AA |
| `--color-secondary-soft` | `#E4E8DD` | Background badge "Tersedia" | — |
| `--color-background` | `#F7F3EC` | Page background (warm ivory) | — |
| `--color-surface` | `#FFFDF8` | Card, header, sheet, modal | — |
| `--color-surface-muted` | `#EFE8DC` | Section alternatif, skeleton base | — |
| `--color-text-primary` | `#2B2622` | Heading & body utama | 13.8:1 ✅ AAA |
| `--color-text-secondary` | `#6B6158` | Meta, helper, caption | 5.3:1 ✅ AA |
| `--color-text-inverse` | `#FFFDF8` | Teks di atas primary/WhatsApp | 6.0:1 ✅ AA |
| `--color-border` | `#E3DACB` | Divider dekoratif, garis card | Non-teks |
| `--color-border-strong` | `#8F8274` | Outline input, boundary komponen | 3.7:1 ✅ AA non-teks |
| `--color-error` | `#A33A2F` | Error, destructive, validasi | 5.9:1 ✅ AA |
| `--color-success` | `#3F6B4F` | Sukses, konfirmasi | 5.6:1 ✅ AA |
| `--color-warning` | `#9A6A1F` | Peringatan, data belum lengkap | 4.7:1 ✅ AA |
| `--color-whatsapp` | `#1F6F4A` | CTA checkout WhatsApp | 6.1:1 ✅ AA |
| `--color-soldout` | `#6E655C` | Teks status "Terjual" | 5.2:1 ✅ AA |
| `--color-highlight` | `#E9C9A8` | Aksen editorial, underline, quote mark | — |
| `--color-overlay` | `rgba(43,38,34,0.52)` | Backdrop modal/sheet | — |
| `--color-focus` | `#8C4A32` | Focus ring 2px + offset 2px | 3:1+ ✅ |

**Aturan pemakaian:**
- Primary hanya untuk **satu CTA utama per layar**. CTA WhatsApp memakai `--color-whatsapp` dan tidak dicampur dengan primary di area yang sama.
- Jangan memakai `--color-primary` sebagai background section besar; gunakan `--color-primary-soft` atau `--color-surface-muted`.
- Status tidak boleh dibedakan hanya lewat warna — selalu sertakan label teks/ikon.
- Foto produk di atas background ivory; jangan beri frame tebal atau gradient overlay kecuali untuk badge stok.

## 1.3 Typography

**Font families:**
- **Display / heading:** `Fraunces` (variable serif, optical size, karakter editorial) — fallback `Georgia, serif`.
- **Body / UI:** `Manrope` (geometric sans yang bersih) — fallback `system-ui, sans-serif`.
- **Data / SKU:** `IBM Plex Mono` — fallback `ui-monospace, monospace`.

Load via `next/font/google` dengan `display: "swap"`, subset `latin`, dan variabel CSS. Jangan load weight yang tidak dipakai.

| Token | Value | Usage |
|---|---|---|
| `--font-display` | Fraunces 72px / 1.0 / 500 / -0.03em (mobile 44px) | Hero headline |
| `--font-h1` | Fraunces 48px / 1.08 / 500 / -0.02em (mobile 36px) | Judul halaman |
| `--font-h2` | Fraunces 32px / 1.15 / 550 / -0.01em (mobile 28px) | Judul section |
| `--font-h3` | Fraunces 24px / 1.25 / 550 / 0 | Judul card / produk |
| `--font-body-lg` | Manrope 18px / 1.65 / 400 | Intro, deskripsi panjang |
| `--font-body` | Manrope 16px / 1.6 / 400 | Body default |
| `--font-caption` | Manrope 13px / 1.5 / 500 / 0.02em | Label, meta, helper |
| `--font-button` | Manrope 14px / 1.2 / 700 / 0.04em / uppercase | Semua button |
| `--font-price` | Fraunces 24px / 1.2 / 600 / -0.01em | Harga produk |
| `--font-mono` | IBM Plex Mono 12px / 1.4 / 500 | SKU, kode pesanan |

**Aturan:**
- Maksimal **dua ukuran display** per layar.
- Heading sentence case, bukan Title Case paksa.
- Body measure maksimal 68 karakter per baris.
- Harga selalu format `Rp 125.000` (tanpa desimal), memakai `Intl.NumberFormat("id-ID")`.
- Jangan memakai `text-transform: uppercase` pada paragraf; hanya label kecil dan button.

## 1.4 Spacing (4px Grid)

| Token | Value | Usage |
|---|---|---|
| `--space-2xs` | 4px | Jarak ikon–teks |
| `--space-xs` | 8px | Padding badge, gap kecil |
| `--space-sm` | 12px | Gap form, padding chip |
| `--space-md` | 16px | Padding card mobile, gap grid |
| `--space-lg` | 24px | Padding section mobile, gap grid desktop |
| `--space-xl` | 32px | Padding card desktop |
| `--space-2xl` | 48px | Jarak antar-blok |
| `--space-3xl` | 64px | Padding section desktop |
| `--space-4xl` | 96px | Hero / section besar |
| `--space-5xl` | 128px | Editorial break |

**Layout grid:**
- Public max-width **1320px**, 12 kolom, gutter 24px, margin desktop 64px / tablet 32px / mobile 20px.
- Admin max-width **1280px** dengan sidebar 248px.
- Product grid: mobile 2 kolom, tablet 3, desktop 4. Card ratio foto **4:5**.
- Breakpoint: `sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.

## 1.5 Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-xs` | 2px | Badge kecil, image thumbnail |
| `--radius-sm` | 4px | Input, button, chip |
| `--radius-md` | 10px | Card, image container, dropdown |
| `--radius-lg` | 20px | Modal, bottom sheet |
| `--radius-full` | 999px | Avatar, status pill, search bar |

**Catatan:** hindari `rounded-2xl`/`rounded-3xl` default shadcn. Radius besar hanya untuk sheet/modal. Product card memakai `--radius-md` dengan border tipis, bukan shadow tebal.

## 1.6 Elevation / Shadow

| Token | Value | Usage |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(43,38,34,.06), 0 1px 1px rgba(43,38,34,.04)` | Card hover ringan |
| `--shadow-md` | `0 8px 24px rgba(43,38,34,.08), 0 2px 6px rgba(43,38,34,.04)` | Dropdown, sticky bar |
| `--shadow-lg` | `0 24px 60px rgba(43,38,34,.14), 0 8px 20px rgba(43,38,34,.06)` | Modal, bottom sheet |
| `--shadow-focus` | `0 0 0 2px #FFFDF8, 0 0 0 4px #8C4A32` | Focus ring |

Elevasi dipakai hemat. Card default **tanpa shadow**, hanya border `--color-border`. Shadow muncul saat hover/fokus atau untuk elemen yang benar-benar mengambang.

## 1.7 Icon Style

- **Library:** Lucide (`lucide-react`), outline.
- **Stroke:** 1.5px. **Size:** 16px inline, 20px default, 24px navigasi, 32px empty state.
- **Warna:** mengikuti `currentColor`; jangan memakai ikon berwarna-warni.
- **Ikon filled** hanya untuk status dot dan rating (jika ada di masa depan).
- Semua ikon dekoratif memakai `aria-hidden="true"`; ikon fungsional wajib punya `aria-label`.

## 1.8 Loading Skeleton Style

| Atribut | Nilai |
|---|---|
| Base color | `--color-surface-muted` (`#EFE8DC`) |
| Shimmer | `linear-gradient(100deg, transparent 20%, rgba(255,253,248,.65) 50%, transparent 80%)` |
| Animation | `shimmer 1.6s ease-in-out infinite` |
| Border radius | Mengikuti elemen asli (`--radius-sm` untuk teks, `--radius-md` untuk foto) |
| Reduced motion | Ganti ke pulse opacity `0.65 → 1` 1.8s, atau static |

Skeleton harus meniru layout final (bukan blok abu-abu generik) agar tidak ada layout shift. Foto produk memakai rasio 4:5; teks memakai tinggi line-height asli.

## 1.9 Motion Tokens

| Token | Value | Usage |
|---|---|---|
| `--duration-fast` | 120ms | Hover warna, focus |
| `--duration-base` | 200ms | Button press, chip, toast |
| `--duration-slow` | 320ms | Sheet, modal, accordion |
| `--duration-page` | 420ms | Page transition |
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` | Masuk, hover |
| `--ease-in-out` | `cubic-bezier(.65,0,.35,1)` | Sheet, accordion |
| `--ease-spring` | `cubic-bezier(.34,1.56,.64,1)` | Cart badge pop (hemat) |

Semua animasi wajib menghormati `prefers-reduced-motion: reduce` → durasi 0.01ms, tanpa transform.

## 1.10 Tech Stack Alignment

Dicek dari registry npm pada 26 Okt 2026:

| Paket | Versi | Catatan implementasi |
|---|---|---|
| Next.js | 16.4.3 | App Router, Server Components untuk katalog/PDP, Client Components untuk cart/admin form |
| Tailwind CSS | 4.3.3 | Gunakan CSS-first `@theme` di `globals.css`; `tailwind.config.ts` opsional untuk kompatibilitas |
| Zustand | 5.0.16 | Cart store + `persist` middleware ke `localStorage` |
| Supabase JS | 2.118.0 | Auth admin + query produk; RLS wajib aktif |
| next-cloudinary | 6.19.3 | Upload admin + transformasi `f_auto,q_auto,w_800` |
| Lucide React | 1.61.0 | Ikon outline |
| Motion | 14.6.0 | Micro-interaction; opsional, CSS transition lebih diutamakan |

**Shadcn override wajib** di `globals.css`:
```css
@theme inline {
  --color-background: #F7F3EC;
  --color-foreground: #2B2622;
  --color-primary: #8C4A32;
  --color-primary-foreground: #FFFDF8;
  --color-secondary: #5E6B52;
  --color-border: #E3DACB;
  --color-ring: #8C4A32;
  --radius-sm: 4px;
  --radius-md: 10px;
  --radius-lg: 20px;
  --font-sans: var(--font-manrope);
  --font-serif: var(--font-fraunces);
}
```
Jangan biarkan komponen shadcn memakai default `slate`, `zinc`, atau radius 8px/12px tanpa override.

---

# BAGIAN 2 — SCREEN MAP & USER FLOW

## 2.1 Information Architecture / Sitemap

```
[Depth 0] Beranda (/)
├── [Depth 1] Katalog (/shop)
│   ├── [state] Pencarian & filter (query param, bukan halaman)
│   └── [Depth 2] Detail Produk (/produk/[slug])
├── [Depth 1] Keranjang (/keranjang)
│   └── [overlay] Sheet Checkout WhatsApp
├── [Depth 1] Tentang & Cara Belanja (/tentang)
│   └── [anchor] FAQ
├── [Depth 1] Login Admin (/admin/login)
│   └── [Depth 2] Dashboard Inventaris (/admin)
│       └── [Depth 3] Form Produk (/admin/produk/baru, /admin/produk/[id]/edit)
└── [system] 404 Not Found (/404)
```

**Navigasi depth:** maksimal **3 level** (Beranda → Katalog → Detail Produk; Admin → Dashboard → Form).
**Breadcrumb:** ada di Detail Produk (`Beranda / Katalog / Nama Produk`) dan Form Produk (`Inventaris / Edit Produk`). Tidak ada breadcrumb di Beranda, Katalog, Keranjang, Tentang.
**Nesting rules:** maksimal 2 level visual sebelum memakai tab/section baru. Filter katalog adalah state URL, bukan halaman baru. Checkout adalah overlay, bukan halaman baru.

## 2.2 Screen Inventory

| # | Screen | Route | Module | Depth | Access |
|---|---|---|---|---|---|
| 01 | Beranda | `/` | Storefront | L0 | Public |
| 02 | Katalog | `/shop` | Storefront | L1 | Public |
| 03 | Detail Produk | `/produk/[slug]` | Storefront | L2 | Public |
| 04 | Keranjang | `/keranjang` | Cart | L1 | Public |
| 05 | Tentang & Cara Belanja | `/tentang` | Storefront | L1 | Public |
| 06 | Login Admin | `/admin/login` | Auth | L1 | Public (redirect jika sudah login) |
| 07 | Dashboard Inventaris | `/admin` | Admin | L2 | Auth required |
| 08 | Form Produk (Create/Edit) | `/admin/produk/baru`, `/admin/produk/[id]/edit` | Admin | L3 | Auth required |
| 09 | 404 Not Found | `/404` | System | L0 | Public |

## 2.3 User Flow Diagram

```
                        ┌──────────────┐
                        │   BERANDA    │
                        └──────┬───────┘
              ┌────────────────┼─────────────────┐
              ▼                ▼                 ▼
        ┌──────────┐    ┌────────────┐    ┌───────────┐
        │ KATALOG  │    │  TENTANG   │    │ KERANJANG │
        └────┬─────┘    └────────────┘    └─────┬─────┘
             │                                  │
             ▼                                  ▼
      ┌──────────────┐                  ┌────────────────┐
      │ DETAIL PRODUK│ ─── add cart ──▶ │ SHEET CHECKOUT │
      └──────┬───────┘                  │   WHATSAPP     │
             │                          └───────┬────────┘
             ▼                                  ▼
      ┌──────────────┐                  ┌────────────────┐
      │  SOLD OUT    │                  │  wa.me admin   │
      │ CTA disabled │                  └────────────────┘
      └──────────────┘

      ┌──────────────┐    ┌───────────────┐    ┌──────────────┐
      │ LOGIN ADMIN  │ ─▶ │  DASHBOARD    │ ─▶ │ FORM PRODUK  │
      └──────────────┘    │  INVENTARIS   │ ◀─ │ CREATE/EDIT  │
                          └───────────────┘    └──────────────┘
```

**Legend:** `→` navigasi utama · `⇢` jalur alternatif · `←` kembali · `overlay` sheet/modal tanpa pindah halaman.

## 2.4 Main Flows

### Flow 1 — Belanja dari katalog
1. **Beranda** → user melihat hero dan grid "Baru masuk".
2. Klik **"Jelajahi koleksi"** atau salah satu produk → **Katalog** / **Detail Produk**.
3. Di **Katalog**, user memfilter kategori/ukuran, mencari kata kunci, atau mengurutkan harga.
4. Klik card produk → **Detail Produk**.
5. User membaca foto, harga, ukuran, dan **catatan kondisi/defect**.
6. Jika tersedia, klik **"Tambah ke keranjang"** → toast + badge cart bertambah.
7. Buka **Keranjang** → review item dan total.

### Flow 2 — Checkout via WhatsApp
1. Di **Keranjang**, sistem merevalidasi status semua item (barang unik, qty selalu 1).
2. Jika ada item terjual, item ditandai dan checkout dikunci sampai item dihapus.
3. Klik **"Checkout via WhatsApp"** → **Sheet preview** muncul dengan teks pesanan.
4. User memeriksa daftar barang + total, lalu klik **"Buka WhatsApp"**.
5. Browser membuka `wa.me` dengan pesan terisi otomatis.
6. User mengirim pesan ke admin; status pesanan diproses manual oleh admin.
7. Setelah admin mengonfirmasi, admin menandai produk **"Terjual"** di dashboard.

### Flow 3 — Admin mengelola inventaris
1. Admin membuka `/admin` → diarahkan ke **Login Admin**.
2. Login dengan email/password Supabase → **Dashboard Inventaris**.
3. Admin mencari produk atau memfilter status.
4. **Tambah produk** → isi form, upload foto (min. 1, maks. 8), set harga/ukuran/kondisi.
5. Simpan → toast sukses → produk muncul di tabel dengan status **Tersedia**.
6. Saat barang laku, admin klik toggle status → **Terjual** (optimistic update + toast).
7. Admin bisa edit atau hapus produk lewat menu aksi.

## 2.5 Responsive Behavior

| Area | Mobile (< 768px) | Tablet (768–1024px) | Desktop (> 1024px) |
|---|---|---|---|
| Header | 64px, logo + search icon + cart; menu di sheet | 72px, nav utama terlihat | 80px, nav lengkap + search inline |
| Product grid | 2 kolom, gap 12px | 3 kolom, gap 20px | 4 kolom, gap 24px |
| Filter katalog | Bottom sheet "Filter" | Panel collapsible di atas grid | Rail kiri 240px |
| PDP | 1 kolom, galeri swipe, CTA sticky bawah | 2 kolom 55/45 | 2 kolom 60/40, galeri sticky |
| Cart | 1 kolom, summary sticky bottom bar | 1 kolom, summary di bawah | 2 kolom 65/35, summary sticky |
| Admin | Sidebar jadi drawer, tabel jadi card list | Sidebar icon-only 72px | Sidebar 248px + tabel penuh |
| Form admin | 1 kolom, save bar sticky bawah | 1 kolom + side panel bawah | 2 kolom 70/30, side panel sticky |

---

# BAGIAN 3 — PER-SCREEN DESIGN

> Semua screen memakai token dari Bagian 1. Tidak ada warna, font, spacing, atau radius hardcoded di luar token.

---

## Screen 01 — Beranda

**Purpose:** Pintu masuk brand: memperkenalkan koleksi terbaru, menenangkan keraguan soal kondisi preloved, dan mendorong eksplorasi katalog.
**UVP Highlight:** Hero editorial + trust strip "dikurasi manual · kondisi jujur" menempatkan brand sebagai butik terkurasi, bukan marketplace diskon.
**Route:** `/` · **Access:** Public

### Layout Structure
```
┌────────────────────────────────────────────────────┐
│ Announcement bar (opsional) · "Checkout via WhatsApp"│
├────────────────────────────────────────────────────┤
│ HEADER · wordmark · Katalog · Tentang · [Cari] [Bag]│
├────────────────────────────────────────────────────┤
│ HERO (12 kolom)                                    │
│ ┌──────────────────┐   ┌─────────────────────────┐ │
│ │ Eyebrow          │   │                         │ │
│ │ "Barang bagus,   │   │  Foto editorial 4:5     │ │
│ │  cerita baru."   │   │  (produk unggulan)      │ │
│ │ Subcopy 2 baris  │   │                         │ │
│ │ [Jelajahi] [Cara]│   │  caption kecil          │ │
│ └──────────────────┘   └─────────────────────────┘ │
├────────────────────────────────────────────────────┤
│ TRUST STRIP · Dikurasi manual · Kondisi jujur · WA  │
├────────────────────────────────────────────────────┤
│ "Baru masuk"                          [Lihat semua]│
│ [Card] [Card] [Card] [Card]                        │
├────────────────────────────────────────────────────┤
│ KATEGORI · Atasan · Dress · Outerwear              │
├────────────────────────────────────────────────────┤
│ CARA BELANJA · 01 Pilih · 02 Chat · 03 Kirim       │
├────────────────────────────────────────────────────┤
│ QUOTE / BRAND PROMISE + CTA WhatsApp               │
├────────────────────────────────────────────────────┤
│ FOOTER                                             │
└────────────────────────────────────────────────────┘
```

### Components Used
| Component | Position | Description |
|---|---|---|
| Site Header | Top | Wordmark, nav, search, cart badge |
| Button | Hero, CTA | Primary "Jelajahi koleksi", ghost "Cara belanja" |
| Product Card | Grid | 4 produk terbaru, foto 4:5, status badge |
| Status Badge | Card | "Tersedia" / "Terjual" |
| Category Tile | Section kategori | 3 tile editorial dengan foto & label |
| Search Field | Header (desktop) | Membuka katalog dengan query |
| Empty State | Grid produk | Fallback saat belum ada produk |
| Toast | Global | Konfirmasi add to cart |

### States
| State | Visual | Trigger |
|---|---|---|
| **Default** | Hero + 8 produk (4 terlihat di desktop, 2 baris) + kategori + trust strip | Data tersedia |
| **Empty** | Hero & trust strip tetap; grid diganti empty state editorial | Belum ada produk published |
| **Loading** | Skeleton hero, 4 card, 3 category tile | Fetch pertama / ISR revalidate |
| **Error** | Hero tetap (server-rendered); section produk menampilkan error card + retry + CTA WhatsApp | API produk gagal |
| **Success** | Grid termuat, badge cart tersinkron; toast "Ditambahkan ke keranjang" setelah add | Data termuat / aksi berhasil |

### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|---|---|---|---|
| Hero eyebrow | Line | 120×12 | Shimmer |
| Hero headline | Rect ×2 | 320×56, 260×56 | Shimmer |
| Hero subcopy | Line ×2 | 400×16 | Shimmer |
| Hero CTA | Rect | 160×48 | Shimmer |
| Hero image | Rect | 520×650 (4:5) | Shimmer |
| Product card ×4 | Rect image + 2 line | 280×350, 200×20, 100×20 | Shimmer |
| Category tile ×3 | Rect | 380×220 | Shimmer |

### Empty State Spec
| Elemen | Deskripsi |
|---|---|
| Ilustrasi | Line-art gantungan baju kosong, stroke 1.5px `--color-primary`, 160×120px |
| Title | "Koleksi pertama sedang disiapkan" |
| Description | "Barang pilihan sedang difoto dan dicek kondisinya. Chat admin untuk lihat preview lebih dulu." |
| CTA | "Chat admin" → WhatsApp (secondary button) |
| Link | — |

### Error State Detail
| Error Type | Visual | Interaction |
|---|---|---|
| **API Failure** | Inline error card di section produk: ikon `CloudOff`, "Koleksi gagal dimuat", retry | Tap retry → refetch section |
| **Network Offline** | Banner tipis di atas konten: "Kamu sedang offline — menampilkan koleksi terakhir" | Auto-retry saat online |
| **404 Not Found** | N/A untuk Beranda | — |
| **500 Server Error** | Hero tetap; section produk diganti pesan "Lagi ada gangguan di dapur kami" + CTA WhatsApp | Retry / hubungi admin |
| **Image Failure** | Placeholder netral `--color-surface-muted` + inisial produk | Lazy retry sekali |
| **Validation Error** | N/A | — |

### Data Format Per Screen
| Elemen | Type | Source | Format |
|---|---|---|---|
| Nama produk | Text | `products.name` | Maks. 2 baris, ellipsis |
| Harga | Currency | `products.price` | `Rp 125.000` (IDR, tanpa desimal) |
| Foto card | Image | `products.images[0]` | 4:5, `f_auto,q_auto,w_800`, lazy load |
| Status | Badge | `products.status` | `true` → "Tersedia" (sage); `false` → "Terjual" (muted) |
| Kategori | Text | `products.category` | Label sentence case |
| Ukuran | Text | `products.size` | Uppercase, mis. "M" / "38" |
| Tanggal | Date | `products.created_at` | Tidak tampil di card; dipakai untuk urutan "Baru masuk" |
| Label "Baru" | Badge | `created_at` | Tampil jika < 7 hari, di atas foto kiri |

### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| Header | Scroll > 8px | Border bottom muncul, background solid | 200ms | ease-out |
| Hero image | Load | Fade in + scale 1.02 → 1 | 420ms | ease-out |
| Product card | Hover | Image scale 1.03, border menguat | 400ms | ease-out |
| Product card | Tap | Scale 0.99 | 120ms | ease-out |
| CTA arrow | Hover | Arrow translateX 4px | 200ms | ease-out |
| Cart badge | Item ditambah | Pop scale 1 → 1.25 → 1 | 300ms | spring |
| Skeleton | Auto | Shimmer | 1600ms | linear loop |
| Page transition | Navigasi | Fade + translateY 8px | 240ms | ease-out |

### Interactions
| Element | Interaction | Feedback |
|---|---|---|
| Hero CTA | Click | Navigate ke `/shop` |
| "Cara belanja" | Click | Scroll ke section cara belanja / `/tentang#cara-belanja` |
| Product card | Click | Navigate ke `/produk/[slug]` |
| Category tile | Click | `/shop?category=...` |
| Cart icon | Click | Navigate ke `/keranjang` |
| Search | Submit | `/shop?q=...` |

### Accessibility
- **Keyboard:** Skip link "Langsung ke konten"; urutan tab header → hero → grid → footer; card adalah satu link utuh dengan focus ring.
- **ARIA:** `header`, `nav`, `main`, `footer`; `aria-label="Keranjang, 2 item"` pada cart; badge count `aria-live="polite"`.
- **Contrast:** Semua teks memakai token AA; status tidak hanya warna (label teks).
- **Touch target:** Minimal 44×44px untuk ikon header dan card action.
- **Screen reader:** Alt foto "Foto depan [nama produk]"; hero image alt deskriptif, bukan "banner".
- **Motion:** `prefers-reduced-motion` menonaktifkan parallax/scale.

### Responsive Behavior
- **Mobile (<768px):** Hero 1 kolom (teks lalu foto), headline 44px, grid 2 kolom gap 12px, kategori horizontal scroll snap, nav di sheet.
- **Tablet (768–1024px):** Hero 2 kolom 50/50, grid 3 kolom, trust strip 3 kolom.
- **Desktop (>1024px):** Hero asimetris 5/7, grid 4 kolom, max-width 1320px, margin 64px.

---

## Screen 02 — Katalog

**Purpose:** Menemukan produk berdasarkan kategori, ukuran, kata kunci, dan urutan harga tanpa merasa sedang membuka marketplace besar.
**UVP Highlight:** Filter sederhana + status "Terjual" yang jujur; hasil terasa seperti koleksi butik, bukan listing tak terbatas.
**Route:** `/shop` · **Access:** Public

### Layout Structure
```
┌────────────────────────────────────────────────────┐
│ HEADER                                             │
├────────────────────────────────────────────────────┤
│ "Katalog"  ·  24 piece ditemukan                   │
│ Subcopy satu baris                                 │
├────────────────────────────────────────────────────┤
│ [ 🔍 Cari nama produk...                          ]│
│ [Semua] [Atasan] [Dress] [Bawahan] [Outerwear]    │
├────────────────────────────────────────────────────┤
│ [Filter (mobile)]         [Urutkan: Terbaru  ▾]   │
│ Filter aktif: [Dress ×] [M ×]  [Reset]            │
├──────────────┬─────────────────────────────────────┤
│ FILTER RAIL  │  GRID PRODUK                        │
│ Kategori     │  [Card] [Card] [Card] [Card]        │
│ ○ Semua      │  [Card] [Card] [Card] [Card]        │
│ ○ Atasan     │                                     │
│ ○ Dress      │  [Muat lebih banyak]                │
│ Ukuran       │                                     │
│ [S][M][L][XL]│                                     │
│ Ketersediaan │                                     │
│ [x] Sembunyikan terjual                            │
└──────────────┴─────────────────────────────────────┘
│ FOOTER                                             │
└────────────────────────────────────────────────────┘
```

**Query params:** `q`, `category`, `size`, `hideSold`, `sort` (`newest|price_asc|price_desc`), `page`.
**Filter mobile:** bottom sheet dengan tombol "Terapkan" dan "Reset"; filter desktop langsung menerapkan.

### Components Used
| Component | Position | Description |
|---|---|---|
| Site Header | Top | Nav + search + cart |
| Search Field | Atas grid | Search dengan debounce 300ms |
| Filter Chip | Kategori | Single-select kategori + multi-select ukuran |
| Button | Toolbar / load more | Primary, ghost, secondary |
| Product Card | Grid | Foto 4:5, status, harga |
| Status Badge | Card | Tersedia / Terjual |
| Empty State | Grid | Tidak ada hasil |
| Modal / Sheet | Mobile | Panel filter |
| Toast | Global | Feedback reset filter |

### States
| State | Visual | Trigger |
|---|---|---|
| **Default** | Grid semua produk, filter rail terbuka di desktop | Tanpa query |
| **Empty** | Ilustrasi + "Belum ada yang cocok" + CTA reset filter | Filter/search tidak menghasilkan |
| **Loading** | Skeleton chip + 8 card; toolbar tetap | Fetch / ganti filter |
| **Error** | Grid diganti error card + retry; filter tetap terlihat | API gagal |
| **Success** | Jumlah hasil update, chip filter aktif, URL shareable | Filter berhasil diterapkan |

### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|---|---|---|---|
| Judul & count | Line | 180×32, 120×14 | Shimmer |
| Search bar | Rect | Full width × 48 | Shimmer |
| Chip ×5 | Pill | 80×36 | Shimmer |
| Filter rail | Line/Rect | 200×20 ×6 | Shimmer |
| Product card ×8 | Rect + line | 280×350, 200×20, 100×20 | Shimmer |

### Empty State Spec
| Elemen | Deskripsi |
|---|---|
| Ilustrasi | Line-art hanger + kaca pembesar, 160×140px, `--color-primary` |
| Title | "Belum ada yang cocok" |
| Description | "Coba kata kunci lain atau longgarkan filter. Koleksi baru masuk tiap minggu." |
| CTA | "Reset filter" (primary) · "Lihat semua koleksi" (ghost) |
| Link | "Chat admin" untuk request item tertentu |

### Error State Detail
| Error Type | Visual | Interaction |
|---|---|---|
| **API Failure** | Error card "Katalog gagal dimuat" + retry | Retry mempertahankan filter |
| **Network Offline** | Banner offline + data terakhir dari cache | Auto-retry saat online |
| **404 Not Found** | Kategori/query tidak valid → empty state, bukan 404 | Reset filter |
| **500 Server Error** | Error card + CTA WhatsApp | Retry / hubungi admin |
| **Validation Error** | Query `sort`/`page` tidak valid → fallback ke default | URL dinormalisasi |
| **Image Failure** | Placeholder netral + inisial | Lazy retry |

### Data Format Per Screen
| Elemen | Type | Source | Format |
|---|---|---|---|
| Hasil count | Number | API `count` | `24 piece` |
| Card nama | Text | `products.name` | 2 baris max |
| Harga | Currency | `products.price` | `Rp 125.000` |
| Status | Badge | `products.status` | "Tersedia" / "Terjual" |
| Ukuran | Text | `products.size` | Uppercase |
| Kategori | Text | `products.category` | Sentence case |
| Filter aktif | Chip | Query state | `Dress`, `M`, `Harga terendah` |
| Sort label | Select | Query state | Terbaru / Harga terendah / Harga tertinggi |
| Pagination | Number | `page` | 12 item per halaman; "Muat lebih banyak" |

### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| Filter chip | Select | Background fill + check icon | 160ms | ease-out |
| Grid | Filter berubah | Card stagger fade-up 40ms/item | 240ms | ease-out |
| Filter sheet | Open | Slide up + backdrop fade | 320ms | ease-in-out |
| Search | Type | Debounce 300ms, spinner di kanan | 300ms | linear |
| Load more | Click | Spinner → card append fade | 240ms | ease-out |
| Filter aktif | Hapus | Chip collapse + grid refetch | 200ms | ease-in-out |
| Sticky toolbar | Scroll | Shadow muncul | 200ms | ease-out |

### Interactions
| Element | Interaction | Feedback |
|---|---|---|
| Card | Click | Navigate ke detail |
| Search | Enter | Update `q`, reset page |
| Kategori chip | Click | Single-select; update `category` |
| Ukuran chip | Click | Multi-select; update `size` |
| Toggle terjual | Click | Update `hideSold` |
| Sort | Change | Update `sort`, reset page |
| Reset | Click | Hapus semua query filter |
| Load more | Click | Append halaman berikutnya |

### Accessibility
- **Keyboard:** Chip dapat dioperasikan dengan Enter/Space; filter rail memakai `fieldset`/`legend`; focus pindah ke judul hasil setelah filter diterapkan.
- **ARIA:** `aria-pressed` pada chip; `aria-live="polite"` untuk jumlah hasil; sheet filter `role="dialog"` + focus trap.
- **Contrast:** Chip aktif memakai primary + teks inverse (6.0:1); border input memakai `--color-border-strong`.
- **Touch target:** Chip minimal 44px tinggi; tombol filter 48px.
- **Screen reader:** Setiap card memiliki label gabungan "Nama, harga, status".
- **Motion:** Stagger dimatikan saat reduced motion.

### Responsive Behavior
- **Mobile (<768px):** Search full width; kategori horizontal scroll; filter lewat bottom sheet; grid 2 kolom.
- **Tablet (768–1024px):** Filter rail collapsible di atas grid; grid 3 kolom.
- **Desktop (>1024px):** Filter rail 240px sticky; grid 4 kolom; toolbar satu baris.

---

## Screen 03 — Detail Produk

**Purpose:** Meyakinkan pembeli bahwa kondisi barang sesuai ekspektasi, lalu mengarahkan ke keranjang dengan satu klik.
**UVP Highlight:** Blok "Kondisi & defect" yang eksplisit — kejujuran adalah fitur utama, bukan catatan kecil di bawah.
**Route:** `/produk/[slug]` · **Access:** Public

### Layout Structure
```
┌────────────────────────────────────────────────────┐
│ HEADER                                             │
│ Beranda / Katalog / Nama Produk                    │
├──────────────────────────┬─────────────────────────┤
│ GALERI (60%)             │ INFO (40%)              │
│ ┌──────────────────────┐ │ Kategori · SKU          │
│ │ Foto utama 4:5       │ │ Nama produk (H1)        │
│ │ [Tersedia]           │ │ Rp 125.000              │
│ └──────────────────────┘ │ Ukuran · Kategori       │
│ [thumb][thumb][thumb]    │                         │
│                          │ ┌─ KONDISI & DEFECT ──┐ │
│                          │ │ "Mulus, tanpa..."   │ │
│                          │ └─────────────────────┘ │
│                          │ [Tambah ke keranjang]   │
│                          │ ♡ / WhatsApp tanya      │
│                          │ ▸ Deskripsi             │
│                          │ ▸ Cara kirim            │
├──────────────────────────┴─────────────────────────┤
│ "Kamu mungkin suka" · 4 product card               │
├────────────────────────────────────────────────────┤
│ FOOTER                                             │
└────────────────────────────────────────────────────┘
   MOBILE: CTA sticky bar di bawah (harga + tombol)
```

### Components Used
| Component | Position | Description |
|---|---|---|
| Site Header | Top | Nav + cart |
| Breadcrumb | Atas | Beranda / Katalog / Produk |
| Gallery | Kiri | Foto utama + thumbnail, swipe mobile, lightbox |
| Status Badge | Foto / info | Tersedia / Terjual |
| Button | Info | Primary add to cart, secondary WhatsApp |
| Condition Callout | Info | Blok kondisi & defect |
| Accordion | Info | Deskripsi, cara kirim, perawatan |
| Product Card | Related | 4 rekomendasi |
| Toast | Global | Add to cart |

### States
| State | Visual | Trigger |
|---|---|---|
| **Default (Available)** | Semua info tampil, CTA aktif | `status = true` |
| **Sold Out** | Badge "Terjual" di foto, CTA disabled, secondary "Tanya stok serupa" | `status = false` |
| **Loading** | Skeleton galeri + info + related | Fetch produk |
| **Error / Not Found** | 404 editorial + CTA kembali ke katalog | Slug tidak ada |
| **Success** | CTA berubah "Ditambahkan ✓", badge cart +1, toast | Add to cart |

### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|---|---|---|---|
| Breadcrumb | Line | 240×12 | Shimmer |
| Foto utama | Rect | 600×750 (4:5) | Shimmer |
| Thumbnail ×4 | Rect | 72×90 | Shimmer |
| Judul | Line ×2 | 320×32, 220×32 | Shimmer |
| Harga | Line | 140×28 | Shimmer |
| Meta | Line ×2 | 200×16 | Shimmer |
| CTA | Rect | Full × 52 | Shimmer |
| Related card ×4 | Rect + line | 280×350 | Shimmer |

### Empty State Spec
| Elemen | Deskripsi |
|---|---|
| Ilustrasi | N/A — produk tidak ditemukan memakai halaman 404, bukan empty state |
| Title | — |
| Description | — |
| CTA | — |
| Link | — |

### Error State Detail
| Error Type | Visual | Interaction |
|---|---|---|
| **API Failure** | Inline error di kolom info + retry | Retry tanpa reload halaman |
| **Network Offline** | Banner offline + data cache | Auto-retry |
| **404 Not Found** | "Piece ini sudah tidak ada" + line-art hanger + CTA "Lihat koleksi" | Kembali ke `/shop` |
| **500 Server Error** | Error page + CTA WhatsApp | Retry / hubungi admin |
| **Image Failure** | Placeholder netral + inisial produk | Lazy retry |
| **Validation Error** | N/A (tidak ada form) | — |

### Data Format Per Screen
| Elemen | Type | Source | Format |
|---|---|---|---|
| Nama | Text | `products.name` | H1, maks. 3 baris |
| Harga | Currency | `products.price` | `Rp 125.000` |
| Ukuran | Text | `products.size` | `Ukuran: M` |
| Kategori | Text | `products.category` | Eyebrow uppercase |
| Deskripsi | Text | `products.description` | Paragraf, maks. 2000 char |
| Kondisi / defect | Text | `products.defect_notes` | Jika null → "Mulus, tanpa defect berarti." |
| Foto | Image array | `products.images[]` | 4:5, maks. 8, `f_auto,q_auto,w_1200` |
| Status | Boolean | `products.status` | CTA & badge mengikuti |
| SKU | Text | `products.id` / generated | Mono 12px, format `PSW-YYMM-XXX`; generated di app, bukan kolom DB |
| Tanggal | Date | `products.created_at` | "Ditambahkan 12 Jan 2026" |
| WhatsApp share | URL | slug + nama | `wa.me/?text=...` |

### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| Thumbnail | Click | Border primary + crossfade foto | 200ms | ease-out |
| Foto utama | Hover (desktop) | Zoom 1.02, cursor zoom-in | 400ms | ease-out |
| Lightbox | Open | Fade + scale 0.98 → 1 | 250ms | ease-out |
| Add to cart | Click | Label → spinner → check, badge pop | 300ms | spring |
| Sticky bar | Scroll > 480px | Slide up | 250ms | ease-out |
| Accordion | Open | Height auto + chevron rotate | 280ms | ease-in-out |
| Sold out CTA | Hover | Tooltip "Barang ini sudah terjual" | 160ms | ease-out |

### Interactions
| Element | Interaction | Feedback |
|---|---|---|
| Thumbnail | Click / tap | Ganti foto utama |
| Foto | Click | Buka lightbox |
| Add to cart | Click | Simpan ke Zustand + localStorage, toast |
| WhatsApp tanya | Click | Buka wa.me dengan template produk |
| Accordion | Click | Expand/collapse |
| Related card | Click | Navigate ke produk lain |
| Breadcrumb | Click | Kembali ke katalog |

### Accessibility
- **Keyboard:** Thumbnail adalah button; panah kiri/kanan di lightbox; Esc menutup; focus kembali ke thumbnail.
- **ARIA:** `aria-label="Foto [nama], 1 dari 4"`; thumbnail aktif `aria-current="true"`; lightbox `role="dialog"` + `aria-modal="true"`.
- **Contrast:** Harga dan CTA AA; badge sold out memakai teks + ikon.
- **Touch target:** Thumbnail 72×90, tombol 52px tinggi.
- **Screen reader:** Kondisi/defect dibacakan sebagai section dengan heading; status sold out diumumkan.
- **Motion:** Zoom & lightbox dimatikan saat reduced motion.

### Responsive Behavior
- **Mobile (<768px):** Galeri swipe dengan dot indicator; info di bawah; CTA sticky bottom (harga + tombol); accordion full width.
- **Tablet (768–1024px):** Galeri 55% / info 45%; thumbnail 4 kolom; CTA normal.
- **Desktop (>1024px):** Galeri sticky 60% / info 40%; lightbox dengan panah; related 4 kolom.

---

## Screen 04 — Keranjang

**Purpose:** Review item unik yang dipilih, memastikan stok masih tersedia, lalu checkout ke WhatsApp dalam satu sheet.
**UVP Highlight:** Transparansi status & total sebelum chat; tidak ada form checkout panjang, tidak ada akun wajib.
**Route:** `/keranjang` · **Access:** Public

### Layout Structure
```
┌────────────────────────────────────────────────────┐
│ HEADER                                             │
├────────────────────────────────────────────────────┤
│ "Keranjang"  ·  3 item                             │
│ "Setiap piece cuma satu. Qty selalu 1."            │
├──────────────────────────────┬─────────────────────┤
│ DAFTAR ITEM (65%)            │ RINGKASAN (35%)     │
│ ┌────┬────────────────────┐  │ Subtotal  Rp 350.000│
│ │foto│ Nama · SKU         │  │ Ongkir    dihitung  │
│ │96  │ Ukuran · Rp 125.000│  │           admin     │
│ │×120│ [Tersedia]   [Hapus]│ │ ─────────────────── │
│ └────┴────────────────────┘  │ Total     Rp 350.000│
│ ┌────┬────────────────────┐  │                     │
│ │foto│ Nama · SKU         │  │ [Checkout WhatsApp] │
│ │    │ ⚠ Sudah terjual    │  │ "Nama & alamat      │
│ │    │ [Hapus]            │  │  dilengkapi di chat"│
│ └────┴────────────────────┘  │                     │
│                              │ ▸ Cara pengiriman   │
├──────────────────────────────┴─────────────────────┤
│ FOOTER                                             │
└────────────────────────────────────────────────────┘
   MOBILE: summary jadi bottom bar sticky
```

### Components Used
| Component | Position | Description |
|---|---|---|
| Site Header | Top | Nav + cart count |
| Cart Line Item | List | Foto, nama, SKU, ukuran, harga, status, hapus |
| Status Badge | Item | Tersedia / Terjual |
| Button | Summary | CTA WhatsApp, ghost "Lanjut belanja" |
| Modal / Sheet | Checkout | Preview pesan + tombol buka WhatsApp |
| Toast | Global | Undo hapus, error stok |
| Empty State | Halaman | Keranjang kosong |

### States
| State | Visual | Trigger |
|---|---|---|
| **Default** | Daftar item + ringkasan + CTA aktif | Ada item valid |
| **Empty** | Empty state ilustrasi + CTA katalog | Cart kosong |
| **Loading** | Skeleton item + overlay "Mengecek stok..." | Revalidasi saat mount |
| **Error** | Item sold out ditandai; CTA disabled sampai item dihapus | Stok berubah |
| **Success** | Sheet preview terbuka, tombol "Buka WhatsApp" aktif | Klik checkout |

### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|---|---|---|---|
| Judul & subcopy | Line | 200×32, 280×14 | Shimmer |
| Item ×3 | Rect foto + 3 line | 96×120, 240×18 | Shimmer |
| Ringkasan | Rect | 360×260 | Shimmer |
| CTA | Rect | Full × 52 | Shimmer |

### Empty State Spec
| Elemen | Deskripsi |
|---|---|
| Ilustrasi | Line-art tote bag kosong, 140×140px, stroke `--color-primary` |
| Title | "Keranjangmu masih kosong" |
| Description | "Saatnya cari piece yang cocok. Koleksi baru masuk tiap minggu." |
| CTA | "Jelajahi koleksi" → `/shop` (primary) |
| Link | "Lihat yang baru masuk" → `/#baru-masuk` |

### Error State Detail
| Error Type | Visual | Interaction |
|---|---|---|
| **API Failure** | Banner "Status stok belum bisa dicek" + retry; CTA disabled | Retry revalidasi |
| **Network Offline** | Banner offline + item dari localStorage; CTA disabled | Auto-retry saat online |
| **404 Item Hilang** | Item ditandai "Produk sudah tidak tersedia" + tombol hapus | Hapus → refetch total |
| **500 Server Error** | Banner + retry; cart tetap terlihat | Retry / WhatsApp admin |
| **Validation — Sold Out** | Item merah muted + badge "Terjual"; checkout disabled | Hapus item untuk lanjut |
| **Validation — WA Number** | CTA disabled + helper "Nomor WhatsApp admin belum diatur" | Hubungi developer/admin |
| **localStorage Corrupt** | Cart di-reset + toast "Keranjang dimuat ulang" | Mulai dari kosong |

### Data Format Per Screen
| Elemen | Type | Source | Format |
|---|---|---|---|
| Cart item | Object | Zustand + localStorage | `{ productId, slug, name, sku, price, size, image, status, addedAt }` |
| Harga | Currency | `price` | `Rp 125.000` |
| Subtotal | Currency | Sum `price` | `Rp 350.000` |
| Total | Currency | Subtotal (ongkir menyusul) | `Rp 350.000` |
| Jumlah item | Number | `items.length` | `3 item` |
| Qty | Number | Fixed | Selalu `1` — barang unik |
| WhatsApp URL | URL | `NEXT_PUBLIC_WHATSAPP_NUMBER` + encoded text | `https://wa.me/62...?text=...` |
| Pesan | Text | Generated | Lihat template di bawah |

**Template pesan WhatsApp:**
```
Halo Admin @prelovedsaerawatt,
Saya mau order:

1. [Nama Produk] — [SKU] — Rp 125.000
2. [Nama Produk] — [SKU] — Rp 90.000

Total: Rp 215.000

Nama:
Alamat:
Catatan:
```
Nomor HP & alamat sengaja diisi di chat agar tidak ada form panjang di web. Teks di-`encodeURIComponent`; baris baru `%0A`.

### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| Hapus item | Click | Row collapse + fade; toast undo 5s | 200ms | ease-in-out |
| Undo | Click toast | Item kembali + total update | 200ms | ease-out |
| CTA checkout | Click | Sheet slide up + backdrop fade | 320ms | ease-in-out |
| Sheet | Close | Slide down + focus kembali | 240ms | ease-in |
| Total | Item berubah | Angka crossfade | 160ms | ease-out |
| Badge cart | Item dihapus | Pop turun | 200ms | ease-out |
| Revalidasi | Mount | Overlay tipis + spinner kecil | 300ms | linear |

### Interactions
| Element | Interaction | Feedback |
|---|---|---|
| Hapus | Click | Remove item + toast undo |
| Checkout | Click | Validasi stok → buka sheet preview |
| Buka WhatsApp | Click | `window.open(waUrl, "_blank")` + toast "Membuka WhatsApp..." |
| Lanjut belanja | Click | Kembali ke `/shop` |
| Item | Click | Navigate ke detail produk |
| Ongkir accordion | Click | Info pengiriman |

### Accessibility
- **Keyboard:** Daftar item memakai `ul/li`; tombol hapus fokusabel; sheet focus trap + Esc.
- **ARIA:** `aria-live="polite"` untuk total; tombol hapus `aria-label="Hapus [nama] dari keranjang"`; sheet `aria-labelledby`.
- **Contrast:** Error sold out memakai teks + ikon; total AA.
- **Touch target:** Tombol hapus minimal 44×44px; CTA 52px.
- **Screen reader:** Status sold out diumumkan; perubahan total dibacakan.
- **Motion:** Collapse & sheet dimatikan saat reduced motion.

### Responsive Behavior
- **Mobile (<768px):** 1 kolom; item foto 80×100; summary jadi bottom bar sticky (total + CTA); sheet full-width.
- **Tablet (768–1024px):** 1 kolom; summary di bawah daftar; CTA full width.
- **Desktop (>1024px):** 2 kolom 65/35; summary sticky top 96px; sheet max-width 520px.

---

## Screen 05 — Tentang & Cara Belanja

**Purpose:** Membangun kepercayaan: siapa di balik @prelovedsaerawatt, bagaimana barang dikurasi, dan bagaimana cara order.
**UVP Highlight:** "Satu piece, satu cerita" — menjelaskan proses kurasi & pengecekan kondisi, bukan sekadar halaman About generik.
**Route:** `/tentang` · **Access:** Public

### Layout Structure
```
┌────────────────────────────────────────────────────┐
│ HEADER                                             │
├────────────────────────────────────────────────────┤
│ HERO EDITORIAL                                     │
│ "Bukan sekadar preloved."                          │
│ Subcopy 2 baris                                    │
├──────────────────────────┬─────────────────────────┤
│ FOTO STORY 5/12          │ TEKS 7/12               │
│ (portrait 4:5)           │ 2–3 paragraf            │
├──────────────────────────┴─────────────────────────┤
│ "JANJI KAMI"                                       │
│ [Dikurasi manual] [Kondisi jujur] [Satu piece]     │
├────────────────────────────────────────────────────┤
│ "CARA BELANJA"                                     │
│ 01 Pilih → 02 Chat → 03 Transfer → 04 Dikirim      │
├────────────────────────────────────────────────────┤
│ FAQ (accordion 5 item)                             │
├────────────────────────────────────────────────────┤
│ CTA "Masih ada pertanyaan?" [Chat admin]           │
├────────────────────────────────────────────────────┤
│ FOOTER                                             │
└────────────────────────────────────────────────────┘
```

### Components Used
| Component | Position | Description |
|---|---|---|
| Site Header | Top | Nav + cart |
| Button | CTA | WhatsApp, katalog |
| Promise Card | Janji kami | 3 kartu tanpa ikon besar |
| Step Timeline | Cara belanja | 4 langkah bernomor |
| Accordion | FAQ | 5 pertanyaan |
| Empty State | FAQ | Jika FAQ kosong, section disembunyikan |

### States
| State | Visual | Trigger |
|---|---|---|
| **Default** | Semua section tampil | Konten statis termuat |
| **Empty** | Section FAQ disembunyikan; tidak ada accordion kosong | FAQ belum ada |
| **Loading** | Skeleton hero + paragraf + FAQ rows | Font/gambar belum siap |
| **Error** | CTA WhatsApp disabled + helper jika nomor belum diset | Env `NEXT_PUBLIC_WHATSAPP_NUMBER` kosong |
| **Success** | Accordion terbuka; CTA membuka WhatsApp | User berinteraksi |

### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|---|---|---|---|
| Hero headline | Line ×2 | 380×48, 300×48 | Shimmer |
| Hero subcopy | Line | 420×16 | Shimmer |
| Story image | Rect | 520×650 | Shimmer |
| Story paragraf | Line ×5 | 600×16 | Shimmer |
| Promise card ×3 | Rect | 360×160 | Shimmer |
| FAQ row ×5 | Line | Full × 56 | Shimmer |

### Empty State Spec
| Elemen | Deskripsi |
|---|---|
| Ilustrasi | N/A — section FAQ dihilangkan seluruhnya, bukan menampilkan empty state |
| Title | — |
| Description | — |
| CTA | — |
| Link | — |

### Error State Detail
| Error Type | Visual | Interaction |
|---|---|---|
| **API Failure** | N/A — konten statis; hanya CTA WhatsApp bergantung env | — |
| **Network Offline** | Halaman tetap tampil dari cache; CTA WhatsApp tetap bisa dibuka jika app terpasang | — |
| **404 Not Found** | N/A | — |
| **500 Server Error** | N/A — static rendering | — |
| **Validation Error** | N/A | — |
| **Missing WA Number** | CTA "Chat admin" disabled + helper "Nomor WhatsApp belum tersedia" | Hubungi admin via DM Instagram |

### Data Format Per Screen
| Elemen | Type | Source | Format |
|---|---|---|---|
| Headline | Text | Static content | Sentence case, serif |
| Story | Text | Static content | 2–3 paragraf, maks. 68 char/baris |
| Promise | Text | Static content | 3 item, judul + 1 kalimat |
| Langkah | Text | Static content | 4 langkah, angka 01–04 |
| FAQ | Array | Static content | `{ question, answer }` |
| WhatsApp | URL | Env | `https://wa.me/62...` |

### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| Story image | Scroll into view | Fade + translateY 12px | 420ms | ease-out |
| Promise card | Hover | Border primary + lift 2px | 200ms | ease-out |
| Accordion | Open | Height + chevron rotate | 280ms | ease-in-out |
| CTA | Hover | Background darken + arrow shift | 200ms | ease-out |
| Step number | Scroll | Fade in stagger 60ms | 320ms | ease-out |

### Interactions
| Element | Interaction | Feedback |
|---|---|---|
| FAQ | Click | Expand/collapse |
| Chat admin | Click | Buka WhatsApp |
| Jelajahi koleksi | Click | `/shop` |
| Step | Click | Scroll ke detail langkah (opsional) |

### Accessibility
- **Keyboard:** Accordion button fokusabel; Enter/Space; `aria-expanded`.
- **ARIA:** `aria-controls` menghubungkan button & panel; heading hierarchy h1 → h2 → h3.
- **Contrast:** Semua teks AA; CTA WhatsApp 6.1:1.
- **Touch target:** Accordion row minimal 56px.
- **Screen reader:** FAQ dibacakan sebagai list; konten story linear.
- **Motion:** Reveal dimatikan saat reduced motion.

### Responsive Behavior
- **Mobile (<768px):** Hero 1 kolom; story image di atas teks; promise card stack; timeline vertikal.
- **Tablet (768–1024px):** Story 2 kolom 50/50; promise 3 kolom; timeline horizontal.
- **Desktop (>1024px):** Story 5/7; max-width 1120px; timeline 4 kolom dengan garis horizontal.

## Screen 06 — Login Admin

**Purpose:** Gerbang aman ke dashboard, tetap terasa seperti bagian dari brand — bukan halaman login boilerplate.
**UVP Highlight:** Akses khusus admin, tanpa mengganggu pengalaman storefront; brand tetap hadir lewat panel editorial.
**Route:** `/admin/login` · **Access:** Public (redirect ke `/admin` jika sesi valid)

### Layout Structure
```
┌────────────────────────────────────────────────────┐
│ [← Kembali ke toko]                                │
├──────────────────────────┬─────────────────────────┤
│ BRAND PANEL (55%)        │ FORM (45%)              │
│ ┌──────────────────────┐ │ "Masuk ke inventaris"   │
│ │ Foto editorial 4:5   │ │ Subcopy satu baris      │
│ │ overlay gelap 20%    │ │                         │
│ │                      │ │ Email                   │
│ │ "Barang bagus,       │ │ [___________________]   │
│ │  cerita baru."       │ │ Password          [👁]  │
│ │                      │ │ [___________________]   │
│ └──────────────────────┘ │                         │
│                          │ [ Masuk ]               │
│                          │                         │
│                          │ Lupa password? → admin  │
├──────────────────────────┴─────────────────────────┤
│ Footer mini · © prelovedsaerawatt                  │
└────────────────────────────────────────────────────┘
   MOBILE: brand panel jadi header image 200px
```

### Components Used
| Component | Position | Description |
|---|---|---|
| Brand Panel | Kiri | Foto + quote, dekoratif |
| Form Field | Kanan | Email, password |
| Button | Kanan | Primary "Masuk" |
| Toast | Global | Error / sesi berakhir |
| Link | Bawah form | Kembali ke toko, bantuan akses |

### States
| State | Visual | Trigger |
|---|---|---|
| **Default** | Form kosong, email autofocus | Belum login |
| **Empty** | Form kosong tanpa error; helper "Gunakan email admin" | Initial / setelah logout |
| **Loading** | Skeleton form saat cek sesi; spinner di tombol saat submit | Submit / auth check |
| **Error** | Inline error "Email atau password salah" + focus ke email | Kredensial gagal |
| **Success** | Tombol check → redirect `/admin` | Login valid |

### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|---|---|---|---|
| Brand image | Rect | 560×700 | Shimmer |
| Form title | Line | 240×32 | Shimmer |
| Input email | Rect | Full × 48 | Shimmer |
| Input password | Rect | Full × 48 | Shimmer |
| Button | Rect | Full × 48 | Shimmer |

### Empty State Spec
| Elemen | Deskripsi |
|---|---|
| Ilustrasi | N/A — form kosong adalah state awal, bukan empty state konten |
| Title | — |
| Description | — |
| CTA | — |
| Link | — |

### Error State Detail
| Error Type | Visual | Interaction |
|---|---|---|
| **API Failure** | Banner "Gagal terhubung ke server" + retry | Retry submit |
| **Network Offline** | Banner offline + tombol disabled | Auto-retry saat online |
| **404 Not Found** | N/A — route valid | — |
| **500 Server Error** | Banner "Lagi ada gangguan" + retry | Retry |
| **Validation — Empty** | Inline "Email wajib diisi" / "Password wajib diisi" | Focus field pertama |
| **Validation — Invalid** | "Email atau password salah" (tanpa membocorkan mana yang salah) | Fokus email |
| **Rate Limit** | "Terlalu banyak percobaan. Coba lagi dalam 1 menit." | Countdown |

### Data Format Per Screen
| Elemen | Type | Source | Format |
|---|---|---|---|
| Email | Email | Input | Lowercase, trim, validasi format |
| Password | Password | Input | Min. 8 char; tidak pernah ditampilkan di UI |
| Redirect | URL | Query `?next=` | Hanya path internal `/admin...` |
| Error | Text | Supabase Auth | Pesan generik, tidak teknis |
| Session | Cookie | Supabase SSR | HTTP-only, redirect otomatis |

### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| Password reveal | Click eye | Ikon berubah + teks terlihat | 120ms | ease-out |
| Submit | Click | Spinner + tombol disabled | 200ms | linear |
| Error | Muncul | Shake halus 4px + border error | 240ms | ease-in-out |
| Success | Login valid | Check + fade out | 300ms | ease-out |
| Brand image | Load | Fade in | 420ms | ease-out |

### Interactions
| Element | Interaction | Feedback |
|---|---|---|
| Masuk | Submit | Validasi → loading → redirect |
| Show password | Click | Toggle visibility |
| Kembali ke toko | Click | `/` |
| Lupa password | Click | Buka WhatsApp admin / instruksi manual |

### Accessibility
- **Keyboard:** Enter submit; urutan email → password → tombol; focus ring jelas.
- **ARIA:** `autocomplete="username"` & `current-password`; error `aria-live="assertive"`; `aria-invalid`.
- **Contrast:** Error 5.9:1; placeholder minimal 4.5:1.
- **Touch target:** Tombol 48px; ikon reveal 44×44.
- **Screen reader:** Label eksplisit; jangan hanya placeholder.
- **Motion:** Shake dimatikan saat reduced motion.

### Responsive Behavior
- **Mobile (<768px):** Brand panel jadi header 200px; form full width padding 20px; tombol full width.
- **Tablet (768–1024px):** Split 45/55; brand panel image cover.
- **Desktop (>1024px):** Split 55/45; form max-width 420px di tengah kolom.

---

## Screen 07 — Dashboard Inventaris

**Purpose:** Melihat kondisi stok sekilas, menandai barang terjual dengan cepat, dan masuk ke form tambah/edit.
**UVP Highlight:** Admin dibuat sesederhana mungkin — satu orang bisa mengelola katalog dari HP sambil tetap terasa rapi.
**Route:** `/admin` · **Access:** Auth required

### Layout Structure
```
┌──────────────┬─────────────────────────────────────┐
│ SIDEBAR 248  │ TOPBAR · Inventaris · [Lihat toko]  │
│ wordmark     │                        [Logout]     │
│ ▸ Inventaris │─────────────────────────────────────│
│ ▸ Tambah     │ "Inventaris"        [+ Tambah produk]│
│              │ 4 stat card                         │
│              │ [Total 48] [Tersedia 31]            │
│              │ [Terjual 17] [Nilai Rp 6.2jt]       │
│              │─────────────────────────────────────│
│              │ [🔍 Cari] [Status ▾] [Urutkan ▾]    │
│              │ ┌─────────────────────────────────┐ │
│              │ │foto│ Produk/SKU │ Harga │ Status│ │
│              │ │    │ Kategori   │ Ukuran│ Aksi  │ │
│              │ └─────────────────────────────────┘ │
│              │ 48 produk · [1][2][3]               │
└──────────────┴─────────────────────────────────────┘
```

### Components Used
| Component | Position | Description |
|---|---|---|
| Admin Shell | Layout | Sidebar + topbar + content |
| Stat Card | Atas | 4 metrik inventaris |
| Search Field | Toolbar | Cari nama/SKU |
| Select | Toolbar | Filter status, urutan |
| Data Table | Desktop | Daftar produk + aksi |
| Product Row Card | Mobile | Versi card dari tabel |
| Status Badge | Tabel | Tersedia / Terjual |
| Toggle | Tabel | Ubah status cepat |
| Button | Toolbar / aksi | Tambah, edit, hapus |
| Modal | Aksi | Konfirmasi hapus |
| Toast | Global | Sukses/gagal |
| Empty State | Tabel | Belum ada produk |

### States
| State | Visual | Trigger |
|---|---|---|
| **Default** | Tabel 20 baris + stat + toolbar | Ada produk |
| **Empty** | Empty state onboarding + CTA tambah | 0 produk |
| **Loading** | Skeleton stat + 8 row | Fetch pertama |
| **Error** | Banner + retry; data terakhir tetap | API gagal |
| **Success** | Toggle berubah + toast "Status diperbarui" | Aksi berhasil |

### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|---|---|---|---|
| Stat card ×4 | Rect | 240×96 | Shimmer |
| Toolbar | Rect | Full × 44 | Shimmer |
| Row ×8 | Rect foto + 3 line | 56×70, 220×16 | Shimmer |
| Pagination | Line | 180×16 | Shimmer |

### Empty State Spec
| Elemen | Deskripsi |
|---|---|
| Ilustrasi | Line-art rak kosong + kotak, 160×120px |
| Title | "Inventaris masih kosong" |
| Description | "Mulai dengan menambahkan piece pertama. Foto, harga, dan kondisi bisa diisi sekaligus." |
| CTA | "+ Tambah produk" → `/admin/produk/baru` |
| Link | "Lihat toko" → `/` |

### Error State Detail
| Error Type | Visual | Interaction |
|---|---|---|
| **API Failure** | Banner "Data inventaris gagal dimuat" + retry | Retry |
| **Network Offline** | Banner offline + data cache | Auto-retry |
| **404 Not Found** | Redirect ke `/admin` + toast | — |
| **500 Server Error** | Banner + retry | Retry |
| **Validation — Delete** | Modal konfirmasi; tombol hapus danger | Batal / Hapus |
| **Session Expired (401)** | Redirect `/admin/login?next=/admin` + toast "Sesi berakhir" | Login ulang |
| **Image Failure** | Placeholder inisial | — |

### Data Format Per Screen
| Elemen | Type | Source | Format |
|---|---|---|---|
| Total produk | Number | Count | `48` |
| Tersedia | Number | Count `status=true` | `31` |
| Terjual | Number | Count `status=false` | `17` |
| Nilai inventaris | Currency | Sum harga tersedia | `Rp 6.240.000` |
| Nama produk | Text | `name` | 1 baris, ellipsis |
| SKU | Text | generated | Mono `PSW-2610-001` |
| Kategori | Text | `category` | Sentence case |
| Ukuran | Text | `size` | Uppercase |
| Harga | Currency | `price` | `Rp 125.000` |
| Status | Boolean | `status` | Toggle + label |
| Tanggal | Date | `created_at` | "2 hari lalu" (relative) |
| Aksi | Menu | — | Edit, Hapus |

### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| Toggle status | Click | Knob slide + row tint | 160ms | ease-out |
| Toggle optimistic | Sukses | Toast + angka stat update | 200ms | ease-out |
| Toggle gagal | Error | Knob kembali + toast error | 200ms | ease-out |
| Row hover | Hover | Background surface-muted | 120ms | ease-out |
| Delete modal | Open | Fade + scale 0.98 → 1 | 220ms | ease-out |
| Sidebar mobile | Open | Slide from left + backdrop | 280ms | ease-in-out |
| Stat number | Load | Count-up singkat | 400ms | ease-out |

### Interactions
| Element | Interaction | Feedback |
|---|---|---|
| Tambah produk | Click | `/admin/produk/baru` |
| Baris | Click | `/admin/produk/[id]/edit` |
| Toggle | Click | Optimistic update + toast |
| Hapus | Click | Modal konfirmasi → hapus |
| Search | Type | Debounce 300ms |
| Filter status | Change | Query `status` |
| Pagination | Click | Query `page` |

### Accessibility
- **Keyboard:** Tabel dapat dinavigasi; toggle focusabel (Space/Enter); modal focus trap; Esc menutup.
- **ARIA:** Tabel `role="table"` dengan header; toggle `role="switch"` + `aria-checked`; toast `aria-live="polite"`.
- **Contrast:** Status memakai teks + warna; tombol danger AA.
- **Touch target:** Toggle 44×24 dengan area klik 44×44; aksi 44px.
- **Screen reader:** Setiap toggle diberi label "Status [nama produk]"; perubahan diumumkan.
- **Motion:** Count-up & modal dimatikan saat reduced motion.

### Responsive Behavior
- **Mobile (<768px):** Sidebar drawer; stat 2×2; tabel jadi card list; aksi di bottom sheet; search full width.
- **Tablet (768–1024px):** Sidebar icon-only 72px; tabel tetap; kolom kategori disembunyikan.
- **Desktop (>1024px):** Sidebar 248px; tabel penuh; toolbar satu baris.

---

## Screen 08 — Form Produk (Create / Edit)

**Purpose:** Menambah atau mengubah produk dengan cepat, termasuk upload banyak foto dan penulisan kondisi/defect yang jujur.
**UVP Highlight:** Form memaksa (dengan halus) admin mengisi kondisi & defect — kualitas data adalah sumber trust di storefront.
**Route:** `/admin/produk/baru` (create) · `/admin/produk/[id]/edit` (edit) · **Access:** Auth required

### Layout Structure
```
┌──────────────┬─────────────────────────────────────┐
│ SIDEBAR      │ TOPBAR · Inventaris / Tambah Produk │
│              │─────────────────────────────────────│
│              │ ┌───────────────────┬─────────────┐ │
│              │ │ MAIN (70%)        │ SIDE (30%)  │ │
│              │ │ FOTO              │ Status      │ │
│              │ │ [cover][+][+][+]  │ [Tersedia▾] │ │
│              │ │ seret untuk urut  │             │ │
│              │ │                   │ Harga       │ │
│              │ │ INFO DASAR        │ [Rp ______] │ │
│              │ │ Nama              │             │ │
│              │ │ Kategori          │ Ukuran      │ │
│              │ │ Deskripsi         │ [M ▾]       │ │
│              │ │                   │             │ │
│              │ │ KONDISI & DEFECT  │ [Simpan]    │ │
│              │ │ Catatan kondisi   │ [Batal]     │ │
│              │ └───────────────────┴─────────────┘ │
└──────────────┴─────────────────────────────────────┘
   MOBILE: 1 kolom, save bar sticky bawah
```

### Components Used
| Component | Position | Description |
|---|---|---|
| Admin Shell | Layout | Sidebar + topbar |
| Image Uploader | Main | Drag & drop, maks. 8 foto, cover pertama |
| Form Field | Main & side | Input, textarea, select |
| Select | Side | Kategori, ukuran, status |
| Toggle | Side | Tersedia / Terjual |
| Button | Side / sticky | Simpan, batal |
| Modal | Global | Konfirmasi discard perubahan |
| Toast | Global | Sukses / gagal upload |

### States
| State | Visual | Trigger |
|---|---|---|
| **Default (Create)** | Form kosong, upload dropzone, status default "Tersedia" | Buka `/baru` |
| **Loading (Edit)** | Skeleton field + foto, form disabled | Fetch produk |
| **Saving** | Tombol spinner, field disabled, progress upload | Submit |
| **Success** | Toast + redirect `/admin` | Simpan berhasil |
| **Validation** | Inline error + error summary di atas | Submit tidak valid / upload gagal |
| **Upload Error** | Thumbnail error + tombol "Coba lagi" | Cloudinary gagal |

### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|---|---|---|---|
| Foto grid ×4 | Rect | 160×200 | Shimmer |
| Nama | Rect | Full × 48 | Shimmer |
| Kategori | Rect | Full × 48 | Shimmer |
| Deskripsi | Rect | Full × 160 | Shimmer |
| Side panel | Rect | 320×320 | Shimmer |

### Empty State Spec
| Elemen | Deskripsi |
|---|---|
| Ilustrasi | Dropzone bergaris putus-putus + ikon `ImagePlus` 32px |
| Title | "Belum ada foto" |
| Description | "Tambahkan minimal 1 foto. Foto pertama jadi cover. Maks. 8 foto, rasio 4:5." |
| CTA | "Pilih foto" / drag & drop |
| Link | Tips foto: cahaya alami, latar polos, tampilkan defect |

### Error State Detail
| Error Type | Visual | Interaction |
|---|---|---|
| **API Failure** | Error summary "Produk gagal disimpan" + retry | Retry submit |
| **Network Offline** | Banner offline; tombol simpan disabled | Auto-retry |
| **404 Not Found** | Edit ID tidak ada → redirect `/admin` + toast | — |
| **500 Server Error** | Banner + retry | Retry |
| **Validation — Required** | Inline: nama, kategori, ukuran, harga, min. 1 foto | Focus field pertama |
| **Validation — Price** | "Harga harus lebih dari 0" | Focus harga |
| **Upload Failure** | Thumbnail error + "Coba lagi"; foto lain tetap | Retry per foto |
| **Unsaved Changes** | Modal "Perubahan belum disimpan" saat keluar | Tetap di sini / Buang |
| **Session Expired (401)** | Redirect login + toast | Login ulang |

### Data Format Per Screen
| Elemen | Type | Source | Format |
|---|---|---|---|
| Nama | Text | Input | 3–80 char, required |
| Harga | Currency | Input | Angka saja; tampil `Rp 125.000` saat blur |
| Kategori | Select | Input | Atasan, Bawahan, Dress, Outerwear, Aksesori |
| Ukuran | Select | Input | XS, S, M, L, XL, XXL, atau numerik 36–44 |
| Deskripsi | Textarea | Input | Maks. 2000 char, counter |
| Kondisi / defect | Textarea | Input | Maks. 500 char; helper "Jujur, sebutkan semua defect" |
| Foto | Image array | Cloudinary | 1–8 URL; urutan = urutan tampil; index 0 cover |
| Status | Boolean | Toggle | Tersedia (true) / Terjual (false) |
| SKU | Text | Generated | `PSW-YYMM-XXX`, readonly |
| Slug | Text | Generated | Dari nama + suffix, readonly |

### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| Dropzone | Drag over | Border primary + background soft | 160ms | ease-out |
| Upload | Progress | Progress ring di thumbnail | 300ms | linear |
| Thumbnail | Upload sukses | Fade + scale 0.96 → 1 | 240ms | ease-out |
| Reorder | Drag | Item lift + placeholder | 160ms | ease-out |
| Cover badge | Hover | Tooltip "Jadikan cover" | 120ms | ease-out |
| Save | Click | Spinner → check → redirect | 300ms | ease-out |
| Validation | Error | Scroll ke field + border error | 200ms | ease-in-out |
| Discard modal | Open | Fade | 200ms | ease-out |

### Interactions
| Element | Interaction | Feedback |
|---|---|---|
| Pilih foto | Click | File picker (jpg/png/webp, maks. 5MB/foto) |
| Drag reorder | Drag | Ubah urutan; pertama = cover |
| Hapus foto | Click × | Konfirmasi ringan + hapus |
| Simpan | Click | Validasi → upload → save → redirect |
| Batal | Click | Jika ada perubahan → modal discard |
| Simpan sebagai terjual | Toggle | Status ikut tersimpan |

### Accessibility
- **Keyboard:** Dropzone focusabel + Enter membuka file picker; reorder punya tombol "Pindah kiri/kanan" sebagai alternatif drag.
- **ARIA:** `aria-describedby` untuk helper & error; `aria-invalid`; error summary `role="alert"`; upload progress `aria-live`.
- **Contrast:** Border input strong 3.7:1; error 5.9:1.
- **Touch target:** Tombol 44px; thumbnail action 32px dengan area 44px.
- **Screen reader:** Setiap foto punya label "Foto 1, cover"; status upload diumumkan.
- **Motion:** Progress ring tetap, animasi dekoratif dimatikan saat reduced motion.

### Responsive Behavior
- **Mobile (<768px):** 1 kolom; foto grid 2 kolom; save bar sticky bawah (Simpan + Batal); sidebar drawer.
- **Tablet (768–1024px):** Main + side panel di bawah; foto grid 3 kolom.
- **Desktop (>1024px):** Main 70% / side 30% sticky; foto grid 4 kolom; max-width 1200px.

---

## Screen 09 — 404 Not Found

**Purpose:** Menjaga pengalaman tetap hangat saat produk/halaman hilang, lalu mengarahkan kembali ke koleksi.
**UVP Highlight:** Bahkan saat barang sudah terjual/dihapus, nada bicaranya tetap manusiawi — bukan error teknis.
**Route:** `/404` (catch-all) · **Access:** Public

### Layout Structure
```
┌────────────────────────────────────────────────────┐
│ HEADER                                             │
├────────────────────────────────────────────────────┤
│                                                    │
│   404  (Fraunces 160px, clay, opacity 0.9)         │
│   "Piece ini sudah tidak ada."                     │
│   "Mungkin sudah terjual, atau tautannya berubah." │
│                                                    │
│   [Jelajahi koleksi]   [Kembali ke beranda]        │
│                                                    │
├────────────────────────────────────────────────────┤
│ "Mungkin kamu suka" · 4 product card (opsional)    │
├────────────────────────────────────────────────────┤
│ FOOTER                                             │
└────────────────────────────────────────────────────┘
```

### Components Used
| Component | Position | Description |
|---|---|---|
| Site Header | Top | Nav + cart |
| Button | Tengah | Primary & ghost |
| Product Card | Related | Rekomendasi jika tersedia |

### States
| State | Visual | Trigger |
|---|---|---|
| **Default** | 404 besar + copy + CTA | Route tidak ditemukan |
| **Empty** | Section rekomendasi disembunyikan | Tidak ada produk related |
| **Loading** | Skeleton 4 card rekomendasi | Fetch rekomendasi |
| **Error** | CTA tetap tampil; rekomendasi diganti pesan kecil | API rekomendasi gagal |
| **Success** | User klik CTA → navigasi ke katalog/beranda | Aksi |

### Loading Skeleton Spec
| Region | Skeleton Type | Size | Animation |
|---|---|---|---|
| Angka 404 | Line | 320×160 | Shimmer |
| Copy | Line ×2 | 360×20 | Shimmer |
| CTA | Rect ×2 | 180×48 | Shimmer |
| Related card ×4 | Rect | 280×350 | Shimmer |

### Empty State Spec
| Elemen | Deskripsi |
|---|---|
| Ilustrasi | N/A — halaman 404 itu sendiri adalah state; rekomendasi kosong disembunyikan |
| Title | — |
| Description | — |
| CTA | — |
| Link | — |

### Error State Detail
| Error Type | Visual | Interaction |
|---|---|---|
| **404 Not Found** | Halaman ini | CTA ke katalog/beranda |
| **API Failure (related)** | Section rekomendasi diganti line "Rekomendasi belum tersedia" | — |
| **Network Offline** | Halaman statis tetap tampil | CTA tetap berfungsi jika halaman ter-cache |
| **500 Server Error** | Tidak memakai 404; tampilkan error 500 terpisah | Retry |
| **Validation Error** | N/A | — |

### Data Format Per Screen
| Elemen | Type | Source | Format |
|---|---|---|---|
| Kode | Text | Static | `404` |
| Path | Text | `window.location.pathname` | Ditampilkan kecil di bawah copy (opsional) |
| Related | Array | API | Maks. 4 produk tersedia |

### Micro-interactions & Animations
| Element | Trigger | Animation | Duration | Easing |
|---|---|---|---|---|
| 404 | Load | Fade + translateY 12px | 420ms | ease-out |
| CTA | Hover | Arrow shift + underline | 200ms | ease-out |
| Related card | Hover | Image scale 1.03 | 400ms | ease-out |

### Interactions
| Element | Interaction | Feedback |
|---|---|---|
| Jelajahi koleksi | Click | `/shop` |
| Kembali ke beranda | Click | `/` |
| Related card | Click | `/produk/[slug]` |

### Accessibility
- **Keyboard:** Fokus awal ke heading; CTA fokusabel.
- **ARIA:** `main` + heading h1; page title "Halaman tidak ditemukan — prelovedsaerawatt".
- **Contrast:** Clay 404 di ivory 6.0:1.
- **Touch target:** CTA 48px.
- **Screen reader:** Copy dibacakan setelah heading.
- **Motion:** Fade dimatikan saat reduced motion.

### Responsive Behavior
- **Mobile (<768px):** 404 96px; CTA stack full width; related 2 kolom.
- **Tablet (768–1024px):** 404 128px; CTA inline; related 3 kolom.
- **Desktop (>1024px):** 404 160px; CTA inline; related 4 kolom.

---

# BAGIAN 4 — COMPONENT SPECS

> Semua component memakai token Bagian 1. Component di bawah dipakai minimal di 2 screen; komponen yang hanya dipakai 1 screen sudah dimasukkan ke Bagian 3 (Gallery, Condition Callout, Image Uploader, Stat Card, Data Table admin, Step Timeline).

## 4.0 Component Usage Matrix

| Component | Beranda | Katalog | Detail | Keranjang | Tentang | Login | Dashboard | Form | 404 |
|---|---|---|---|---|---|---|---|---|---|
| Button | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Product Card | ✅ | ✅ | ✅ | — | — | — | — | — | ✅ |
| Form Field | — | — | — | — | — | ✅ | — | ✅ | — |
| Status Badge | ✅ | ✅ | ✅ | ✅ | — | — | ✅ | — | — |
| Modal / Sheet | — | ✅ | — | ✅ | — | — | ✅ | ✅ | — |
| Toast | ✅ | ✅ | ✅ | ✅ | — | ✅ | ✅ | ✅ | — |
| Site Header | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | — | ✅ |
| Search Field | ✅ | ✅ | — | — | — | — | ✅ | — | — |
| Empty State | ✅ | ✅ | — | ✅ | ✅ | — | ✅ | — | — |

---

## 4.1 Button

**Usage:** CTA di seluruh storefront & admin.
**Category:** Atom

### Variants
| Variant | Visual | When to use |
|---|---|---|
| Primary | Background `--color-primary`, teks inverse, radius 4px | Aksi utama: "Tambah ke keranjang", "Simpan" |
| Secondary | Border `--color-border-strong`, teks primary, background transparan | Aksi pendukung: "Lihat semua", "Reset filter" |
| Ghost | Tanpa border, teks primary, underline saat hover | Aksi ringan: "Batal", "Kembali" |
| Danger | Background `--color-error`, teks putih | Hapus produk, discard perubahan |
| WhatsApp | Background `--color-whatsapp`, ikon WhatsApp, teks putih | Satu-satunya CTA checkout |

### States
| State | Visual Change |
|---|---|
| Default | Sesuai variant |
| Hover | Primary/WhatsApp darken 8%; secondary background `--color-primary-soft`; ghost underline |
| Active/Pressed | Scale 0.97, shadow hilang |
| Disabled | Opacity 0.45, cursor not-allowed, tanpa hover |
| Loading | Spinner 16px menggantikan label; lebar tetap; disabled |
| Focus-visible | Ring 2px `--color-focus` + offset 2px |

### Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"primary" \| "secondary" \| "ghost" \| "danger" \| "whatsapp"` | `"primary"` | Gaya visual |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 36px / 44px / 52px tinggi |
| `loading` | `boolean` | `false` | Tampilkan spinner, disable interaksi |
| `disabled` | `boolean` | `false` | Nonaktifkan tombol |
| `fullWidth` | `boolean` | `false` | Lebar 100% |
| `iconLeft` / `iconRight` | `ReactNode` | `—` | Ikon Lucide 16–18px |
| `asChild` | `boolean` | `false` | Render sebagai link/elemen lain |
| `onClick` | `function` | `—` | Handler klik |

### Accessibility
- Keyboard: Enter/Space mengaktifkan; focus ring selalu terlihat.
- ARIA: `aria-busy="true"` saat loading; `aria-disabled` jika disabled; ikon dekoratif `aria-hidden`.
- Kontras: semua variant ≥ 4.5:1 untuk teks.
- Touch target: minimal 44×44px; `sm` hanya untuk desktop atau area dengan padding tambahan.

---

## 4.2 Product Card

**Usage:** Grid Beranda, Katalog, related di PDP, rekomendasi 404.
**Category:** Molecule

### Variants
| Variant | Visual | When to use |
|---|---|---|
| Default | Foto 4:5, nama 2 baris, harga, status badge | Grid utama |
| Sold Out | Foto dengan overlay muted 20%, badge "Terjual", harga tetap | Produk `status=false` |
| Compact | Foto 1:1 kecil + nama 1 baris + harga | Related mobile / list sempit |
| Editorial | Foto lebih tinggi, nama + kategori, tanpa border | Beranda "Baru masuk" / feature |

### States
| State | Visual Change |
|---|---|
| Default | Border `--color-border`, tanpa shadow |
| Hover | Image scale 1.03, border `--color-border-strong`, shadow-sm |
| Active/Pressed | Scale 0.99 |
| Sold Out | Overlay + badge; card tetap bisa diklik ke detail |
| Loading | Skeleton foto + 2 line, tanpa interaksi |
| Focus-visible | Ring di seluruh card, bukan hanya gambar |

### Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| `product` | `Product` | required | `{ id, slug, name, price, images, size, category, status, createdAt }` |
| `variant` | `"default" \| "soldout" \| "compact" \| "editorial"` | `"default"` | Layout card |
| `priority` | `boolean` | `false` | `next/image` priority untuk 4 card pertama |
| `showNewBadge` | `boolean` | `true` | Tampilkan "Baru" jika < 7 hari |
| `onClick` | `function` | `—` | Navigate ke detail |

### Accessibility
- Seluruh card adalah satu link; tidak ada nested link.
- Alt: "Foto depan [nama produk]" — bukan "product image".
- Status dibacakan sebagai teks, bukan hanya warna.
- Hover scale dimatikan saat `prefers-reduced-motion`.

---

## 4.3 Form Field

**Usage:** Login admin, form produk, filter pencarian.
**Category:** Atom

### Variants
| Variant | Visual | When to use |
|---|---|---|
| Text | Input 48px, border strong, radius 4px | Nama, email, harga, ukuran |
| Textarea | Area 120–160px, resize vertical | Deskripsi, kondisi/defect |
| Select | Trigger 48px + chevron, menu surface | Kategori, ukuran, status, sort |

### States
| State | Visual Change |
|---|---|
| Default | Border `--color-border-strong`, background surface |
| Focus | Border primary 2px + ring 2px offset |
| Filled | Teks primary; helper tetap terlihat |
| Error | Border error + ikon + pesan error di bawah |
| Disabled | Background surface-muted, opacity 0.6 |
| Success | Border success + ikon check (opsional, untuk validasi live) |

### Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | required | Label eksplisit, bukan placeholder |
| `name` | `string` | required | Nama field |
| `type` | `"text" \| "email" \| "password" \| "number" \| "textarea" \| "select"` | `"text"` | Tipe field |
| `value` / `defaultValue` | `string` | `""` | Nilai terkontrol / tidak |
| `placeholder` | `string` | `—` | Contoh, bukan pengganti label |
| `helper` | `string` | `—` | Petunjuk singkat |
| `error` | `string` | `—` | Pesan validasi |
| `required` | `boolean` | `false` | Tandai wajib |
| `disabled` | `boolean` | `false` | Nonaktif |
| `maxLength` | `number` | `—` | Batas karakter + counter |
| `options` | `{value,label}[]` | `[]` | Untuk select |
| `rows` | `number` | `4` | Untuk textarea |

### Accessibility
- `<label for>` selalu ada; placeholder tidak menggantikan label.
- Error: `aria-invalid="true"` + `aria-describedby` ke pesan.
- Required: `required` + teks "wajib" (jangan hanya asterisk).
- Keyboard: Tab order natural; select dapat dioperasikan dengan panah.
- Kontras border 3.7:1; error 5.9:1.

---

## 4.4 Status Badge

**Usage:** Card produk, detail, keranjang, tabel admin.
**Category:** Atom

### Variants
| Variant | Visual | When to use |
|---|---|---|
| Available | Background `--color-secondary-soft`, teks `--color-secondary`, dot sage | `status=true` |
| Sold Out | Background `--color-surface-muted`, teks `--color-soldout`, dot muted | `status=false` |
| New | Background `--color-primary-soft`, teks primary | Produk < 7 hari |
| Category | Border tipis, teks secondary | Label kategori di card |
| Warning | Background warning 10%, teks warning | Stok/status belum dicek |

### States
| State | Visual Change |
|---|---|
| Available | Dot + label "Tersedia" |
| Sold Out | Dot + label "Terjual", tidak ada animasi |
| New | Label "Baru" tanpa dot |
| Category | Label kategori, uppercase 11px |
| Muted | Opacity 0.6 untuk item nonaktif |

### Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"available" \| "soldout" \| "new" \| "category" \| "warning"` | `"available"` | Gaya badge |
| `label` | `string` | auto | Override teks |
| `dot` | `boolean` | `true` | Tampilkan dot status |
| `size` | `"sm" \| "md"` | `"sm"` | 20px / 24px tinggi |

### Accessibility
- Status selalu punya teks; dot hanya dekoratif (`aria-hidden`).
- Jangan mengandalkan warna saja.
- Kontras teks ≥ 4.5:1.
- Untuk perubahan status real-time, gunakan `aria-live="polite"` di container.

---

## 4.5 Modal / Sheet

**Usage:** Filter mobile, preview checkout WhatsApp, konfirmasi hapus, discard form.
**Category:** Organism

### Variants
| Variant | Visual | When to use |
|---|---|---|
| Bottom Sheet | Muncul dari bawah, radius lg atas, max-height 90vh | Mobile filter, checkout preview |
| Dialog | Centered, max-width 480px, radius lg | Desktop preview, form discard |
| Confirm | Dialog kecil 400px, ikon + 2 tombol | Hapus produk, discard |

### States
| State | Visual Change |
|---|---|
| Closed | Tidak dirender / hidden, focus kembali ke trigger |
| Opening | Backdrop fade + panel slide/scale |
| Open | Focus trap aktif, body scroll lock |
| Loading | Tombol footer spinner, konten disabled |
| Error | Pesan error di atas footer, tombol retry |
| Success | Panel menutup otomatis + toast |

### Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | `false` | Kontrol visibility |
| `onOpenChange` | `function` | `—` | Callback tutup/buka |
| `variant` | `"sheet" \| "dialog" \| "confirm"` | `"dialog"` | Gaya panel |
| `title` | `string` | required | Judul, dihubungkan `aria-labelledby` |
| `description` | `string` | `—` | Subjudul |
| `dismissible` | `boolean` | `true` | Bisa ditutup backdrop/Esc |
| `loading` | `boolean` | `false` | Footer loading |
| `footer` | `ReactNode` | `—` | Tombol aksi |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 400 / 520 / 680px |

### Accessibility
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby`/`aria-describedby`.
- Focus trap; Esc menutup (kecuali `dismissible=false`); focus kembali ke trigger.
- Klik backdrop hanya menutup jika tidak ada perubahan belum tersimpan.
- Scroll body dikunci; konten di belakang `aria-hidden`.
- Mobile sheet: drag handle opsional, tetap ada tombol close 44×44.

---

## 4.6 Toast

**Usage:** Add to cart, undo hapus, simpan admin, error login, upload gagal.
**Category:** Molecule

### Variants
| Variant | Visual | When to use |
|---|---|---|
| Success | Ikon check sage, border kiri sage | Aksi berhasil |
| Error | Ikon alert error, border kiri error | Aksi gagal |
| Info | Ikon info secondary | Informasi netral |
| Undo | Teks + tombol "Undo" | Hapus item dari cart |

### States
| State | Visual Change |
|---|---|
| Entering | Slide up 12px + fade in |
| Visible | Diam 3–5 detik (progress bar tipis) |
| Action Hover | Tombol undo/CTA underline |
| Paused | Timer berhenti saat hover/focus |
| Leaving | Fade out + slide 8px |

### Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"success" \| "error" \| "info" \| "undo"` | `"info"` | Gaya toast |
| `title` | `string` | required | Pesan utama |
| `description` | `string` | `—` | Detail opsional |
| `duration` | `number` | `4000` | ms; 0 = persist |
| `action` | `{ label, onClick }` | `—` | Aksi opsional (Undo) |
| `position` | `"bottom" \| "top"` | `"bottom"` | Mobile bottom, desktop bottom-right |

### Accessibility
- Container `aria-live="polite"`; error memakai `role="alert"`.
- Toast tidak boleh menjadi satu-satunya cara menyampaikan error form.
- Tombol aksi fokusabel; timer berhenti saat focus.
- Maksimal 1 toast terlihat; antrean berikutnya menunggu.

---

## 4.7 Site Header

**Usage:** Semua halaman publik.
**Category:** Organism

### Variants
| Variant | Visual | When to use |
|---|---|---|
| Default | Background surface, border bottom tipis | Halaman dalam |
| Transparent | Transparan di atas hero, teks mengikuti gambar | Beranda saat scroll = 0 |
| Condensed | Tinggi 64px, border bottom, background solid | Setelah scroll > 8px |

### States
| State | Visual Change |
|---|---|
| Default | Logo + nav + search + cart |
| Scrolled | Condensed + border + shadow-sm |
| Menu Open | Sheet mobile terbuka, backdrop |
| Cart Active | Badge angka primary, `aria-label` update |
| Offline | Banner tipis di bawah header |

### Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"default" \| "transparent"` | `"default"` | Gaya awal |
| `cartCount` | `number` | `0` | Jumlah item |
| `onOpenMenu` | `function` | `—` | Buka menu mobile |
| `showSearch` | `boolean` | `true` | Tampilkan search desktop |

### Accessibility
- `<header>` + `<nav aria-label="Navigasi utama">`.
- Logo adalah link ke `/` dengan `aria-label="prelovedsaerawatt — Beranda"`.
- Cart: `aria-label="Keranjang, [n] item"`; badge `aria-live="polite"`.
- Menu mobile: focus trap, Esc, tombol close 44×44.
- Skip link ke `#main-content` muncul saat focus.

---

## 4.8 Search Field

**Usage:** Header, halaman katalog, toolbar admin.
**Category:** Molecule

### Variants
| Variant | Visual | When to use |
|---|---|---|
| Header Compact | Ikon + input 220px, border tipis | Desktop header |
| Page Large | Input 48px full width, ikon kiri, clear kanan | Katalog |
| Admin Toolbar | Input 40px + border strong | Dashboard inventaris |

### States
| State | Visual Change |
|---|---|
| Default | Placeholder secondary |
| Focus | Border primary + ring |
| Typing | Clear button muncul, debounce indicator |
| Results | Jumlah hasil diumumkan (`aria-live`) |
| No Results | Border netral + empty state |
| Error | Border error + retry kecil |

### Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | `""` | Query terkontrol |
| `onChange` | `function` | `—` | Debounce 300ms di parent |
| `onSubmit` | `function` | `—` | Enter / tombol search |
| `variant` | `"header" \| "page" \| "admin"` | `"page"` | Gaya |
| `placeholder` | `string` | `"Cari nama produk..."` | Placeholder |
| `loading` | `boolean` | `false` | Spinner di kanan |
| `autoFocus` | `boolean` | `false` | Fokus saat mount (katalog mobile) |

### Accessibility
- `role="search"` + `aria-label="Cari produk"`.
- Input type `search`; tombol clear `aria-label="Hapus pencarian"`.
- Hasil pencarian diumumkan lewat `aria-live="polite"`.
- Jangan auto-submit saat mengetik; debounce lalu update hasil.

---

## 4.9 Empty State

**Usage:** Beranda, katalog, keranjang, dashboard admin, FAQ.
**Category:** Molecule

### Variants
| Variant | Visual | When to use |
|---|---|---|
| Editorial | Ilustrasi line-art 160px + title serif + description + 2 CTA | Beranda, katalog, keranjang |
| Compact | Ikon 32px + title + 1 CTA, tanpa ilustrasi besar | Section kecil / related |
| Admin | Ilustrasi rak + CTA primary + link toko | Dashboard kosong |

### States
| State | Visual Change |
|---|---|
| Default | Ilustrasi + title + description + CTA |
| With CTA | 1–2 tombol |
| Without CTA | Hanya teks (untuk section FAQ) |
| Compact | Ikon kecil, padding 24px |
| Loading Handoff | Fade out saat data mulai termuat |

### Props / API
| Prop | Type | Default | Description |
|---|---|---|---|
| `illustration` | `ReactNode` | `—` | Line-art / ikon |
| `title` | `string` | required | Judul singkat |
| `description` | `string` | `—` | Maks. 2 baris |
| `primaryAction` | `{ label, href, onClick }` | `—` | CTA utama |
| `secondaryAction` | `{ label, href, onClick }` | `—` | CTA sekunder |
| `variant` | `"editorial" \| "compact" \| "admin"` | `"editorial"` | Gaya |

### Accessibility
- Judul empty state adalah heading yang sesuai hierarki halaman.
- Ilustrasi dekoratif `aria-hidden="true"`.
- CTA fokusabel dengan label jelas ("Jelajahi koleksi", bukan "Klik di sini").
- Jangan mengumumkan empty state berulang kali; cukup `role="status"` sekali.

---

## 4.10 Handoff Checklist (Design → Engineering)

- [ ] Token warna, font, spacing, radius, shadow sudah masuk `globals.css` (`@theme`).
- [ ] Shadcn di-override: radius, ring, primary, border, font; tidak ada default slate/zinc.
- [ ] Fraunces + Manrope + IBM Plex Mono dimuat via `next/font` dengan `display: swap`.
- [ ] Product card memakai rasio 4:5 dan `next/image` dengan `sizes` yang benar.
- [ ] Semua state (default, empty, loading, error, success) punya implementasi nyata, bukan hanya komentar.
- [ ] Cart store Zustand + `persist` localStorage; revalidasi status saat mount.
- [ ] Checkout WhatsApp memakai `encodeURIComponent` dan template pesan yang disepakati.
- [ ] Admin form memvalidasi minimal 1 foto, harga > 0, nama 3–80 char.
- [ ] Toggle status admin optimistic + rollback saat gagal.
- [ ] Focus ring, skip link, aria-label, dan focus trap modal diuji dengan keyboard.
- [ ] Kontras teks & boundary komponen dicek (AA).
- [ ] `prefers-reduced-motion` menonaktifkan animasi dekoratif.
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95.

---

> **Catatan:** Bagian 5 (Google Stitch Prompt) tidak dibuat sesuai pilihan kamu. Kalau nanti mau generate prompt Stitch atau menambahkan `design-references/`, tinggal bilang — spec Bagian 1–4 ini sudah cukup jadi sumbernya.
