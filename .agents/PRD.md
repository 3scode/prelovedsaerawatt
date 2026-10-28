# PRD — prelovedsaerawatt

> **Project Name:** prelovedsaerawatt
> **Platform:** Web Application
> **Target Audience:** Pembeli pakaian wanita *preloved* (B2C)
> **Status:** Source of truth dari user (disimpan 26 Oktober 2026)

## 1. Project Overview

`prelovedsaerawatt` adalah website katalog e-commerce untuk produk pakaian wanita *preloved*. Website ini berfokus pada performa tinggi, tampilan visual yang menarik, dan kemudahan manajemen inventaris. Untuk fase awal, transaksi *checkout* tidak diselesaikan di dalam website, melainkan menggunakan sistem Keranjang (Cart) yang akan men-generate format pesanan otomatis ke WhatsApp admin.

## 2. Tech Stack

- **Framework:** Next.js (Latest Stable - App Router)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI (Dikustomisasi, lihat *Design Guidelines*)
- **State Management:** Zustand (dipadukan dengan `localStorage` untuk persistensi Cart)
- **Database & Authentication:** Supabase (PostgreSQL, Supabase Auth untuk Admin)
- **Media Storage:** Cloudinary (via `next-cloudinary` untuk optimasi gambar otomatis)
- **Deployment:** Vercel

## 3. Core Features

### 3.1 User-Facing (Pembeli)

- **Katalog Produk:**
  - Halaman utama menampilkan *grid* produk terbaru.
  - Label status produk yang jelas ("Available" atau "Sold Out").
  - Filter/Pencarian sederhana (berdasarkan kategori atau kata kunci).
- **Detail Produk:**
  - Galeri foto produk (*swipeable/clickable* untuk melihat detail).
  - Deskripsi lengkap: Nama, Harga, Ukuran, dan bagian khusus "Kondisi/Defect".
- **Sistem Keranjang (Cart):**
  - Menambahkan produk ke keranjang belanja (disimpan di `localStorage` agar tidak hilang saat di-*refresh*).
  - Melihat ringkasan keranjang (daftar barang, total harga).
  - Validasi: Mencegah penambahan barang yang berstatus "Sold Out".
- **WhatsApp Checkout:**
  - Tombol "Checkout via WhatsApp" di halaman keranjang.
  - Sistem men-generate teks otomatis: daftar pesanan (Nama Barang + SKU), total harga, dan menyalinnya ke URL API WhatsApp untuk langsung dikirim ke nomor Admin.

### 3.2 Admin-Facing (Dashboard)

- **Autentikasi:** Halaman *login* aman (Supabase Auth) khusus untuk akses rute `/admin`.
- **Manajemen Produk (CRUD):**
  - **Create:** Form untuk *upload* banyak foto (terintegrasi Cloudinary API), input nama, harga, kategori, ukuran, deskripsi, dan detail *defect*.
  - **Read:** Tabel/Daftar inventaris untuk memantau semua barang.
  - **Update:** Mengubah detail barang, termasuk tombol cepat (Toggle) untuk mengubah status dari "Available" menjadi "Sold Out".
  - **Delete:** Menghapus data produk.

## 4. Database Schema (Supabase) — Draft

**Table: `products`**

- `id` (uuid, primary key)
- `created_at` (timestamp)
- `name` (text)
- `price` (numeric)
- `size` (text)
- `description` (text)
- `defect_notes` (text, nullable)
- `images` (text array - URL dari Cloudinary)
- `status` (boolean - `true` untuk Available, `false` untuk Sold Out)
- `category` (text)

## 5. Design & UI/UX Guidelines

- **Anti "AI Slop" Directive:** Tampilan **TIDAK BOLEH** terlihat seperti *template* AI atau *dashboard boilerplate* yang generik.
- **Kustomisasi Shadcn:** Komponen bawaan Shadcn UI (seperti tombol, kartu, input) harus di-kustomisasi pada file `tailwind.config.ts` dan `globals.css` (misalnya mengubah `border-radius`, *spacing*, dan *color palette*) agar mencerminkan identitas *brand fashion* (misalnya gaya *minimalist*, *earth tone*, atau pastel, tergantung *branding* @prelovedsaerawatt).
- **Tipografi:** Gunakan kombinasi *font* yang elegan (bukan sekadar Inter bawaan), misal Serif untuk *heading/brand* dan Sans-Serif yang *clean* untuk deskripsi.
- **Visual-First:** Ruang untuk foto produk harus maksimal. Penggunaan *whitespace* yang baik sangat diutamakan agar pengguna fokus pada kondisi barang *preloved*.

## 6. Environment Variables Requirements

Project ini membutuhkan variabel berikut pada *local* dan Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_WHATSAPP_NUMBER` (Nomor tujuan checkout)
