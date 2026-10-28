import type { Metadata } from "next";
import Link from "next/link";
import { randomUUID } from "node:crypto";
import { ChevronLeft } from "lucide-react";
import { isCloudinaryConfigured, isDemoMode } from "@/lib/env";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = {
  title: "Tambah produk",
  robots: { index: false, follow: false },
};

export default function AdminNewProductPage() {
  return (
    <div className="container-admin py-6 sm:py-8 lg:py-10">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-text-secondary transition-colors hover:text-primary"
      >
        <ChevronLeft className="size-3.5" aria-hidden="true" />
        Inventaris
      </Link>

      <header className="mt-5 border-b border-border pb-6">
        <p className="type-eyebrow text-primary">Produk baru</p>
        <h1 className="type-h1 mt-2 text-[34px] sm:text-[42px]">Tambah piece baru.</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">
          Satu produk, satu piece. Isi kondisi apa adanya dan unggah foto yang jelas. SKU dibuat
          otomatis saat disimpan.
        </p>
      </header>

      <ProductForm
        mode="create"
        demo={isDemoMode() && !isCloudinaryConfigured()}
        initialRequestId={randomUUID()}
      />
    </div>
  );
}
