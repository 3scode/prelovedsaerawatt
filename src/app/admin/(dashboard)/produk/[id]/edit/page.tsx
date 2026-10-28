import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ChevronLeft } from "lucide-react";
import { getProductById } from "@/lib/products";
import { isCloudinaryConfigured, isDemoMode } from "@/lib/env";
import { ProductForm } from "@/components/admin/product-form";
import { StatusBadge } from "@/components/ui/badge";

const getProduct = cache(getProductById);

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  return {
    title: `Edit ${product.name}`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminEditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

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
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="type-eyebrow text-primary">Edit produk</p>
          <StatusBadge status={product.status} />
          <span className="type-mono text-[10px] text-text-secondary">{product.sku}</span>
        </div>
        <h1 className="type-h1 mt-2 max-w-3xl text-[30px] [overflow-wrap:anywhere] sm:text-[38px]">
          {product.name}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">
          Perubahan langsung tampil di katalog setelah disimpan. Kalau produk sudah terjual, matikan
          status ketersediaan.
        </p>
      </header>

      <ProductForm mode="edit" product={product} demo={isDemoMode() && !isCloudinaryConfigured()} />
    </div>
  );
}
