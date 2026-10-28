import type { Metadata } from "next";
import { getCategoryCounts, getProducts } from "@/lib/products";
import { parseShopParams } from "@/lib/search-params";
import { ProductCard } from "@/components/store/product-card";
import { ShopSearch, SortSelect, MobileFilter, CategoryChips } from "@/components/store/shop-controls";
import { FilterRail } from "@/components/store/filter-rail";
import { ActiveFilters } from "@/components/store/active-filters";
import { Pagination } from "@/components/store/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchIllustration } from "@/components/ui/illustrations";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Katalog",
  description:
    "Jelajahi koleksi preloved terkurasi: atasan, bawahan, dress, outerwear, dan aksesori. Filter berdasarkan kategori, ukuran, dan ketersediaan.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Katalog — prelovedsaerawatt",
    description:
      "Koleksi preloved terkurasi dengan kondisi jujur dan checkout WhatsApp.",
    url: "/shop",
  },
};

interface ShopPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const raw = await searchParams;
  const params = parseShopParams(raw);
  const [result, categories] = await Promise.all([
    getProducts(params),
    getCategoryCounts(),
  ]);
  const counts = Object.fromEntries(categories.map((item) => [item.category, item.count]));
  const whatsapp = buildWhatsAppUrl(
    "Halo Admin @prelovedsaerawatt, saya sedang mencari piece tertentu. Bisa dibantu?",
  );

  return (
    <div className="container-page py-8 sm:py-12">
      <header className="max-w-3xl">
        <div className="flex items-center gap-3">
          <span className="h-px w-9 bg-primary" aria-hidden="true" />
          <p className="type-eyebrow text-primary">Katalog</p>
        </div>
        <h1 className="type-h1 mt-4">Koleksi yang sedang singgah.</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-[15px]">
          Satu piece hanya ada satu. Baca kondisi dan ukurannya, lalu simpan yang cocok ke
          keranjang sebelum pindah tangan.
        </p>
      </header>

      <div className="mt-8 grid gap-6 border-y border-border py-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <ShopSearch key={params.q} params={params} />
        <div className="flex items-center justify-between gap-3">
          <MobileFilter params={params} counts={counts} />
          <SortSelect params={params} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="type-caption text-text-secondary" aria-live="polite" aria-atomic="true">
          <span className="font-bold text-text-primary">{result.total}</span> piece ditemukan
          {params.q ? ` untuk “${params.q}”` : ""}
        </p>
        <CategoryChips params={params} counts={counts} />
      </div>

      <ActiveFilters params={params} />

      <div className="mt-7 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <FilterRail params={params} counts={counts} />

        <div>
          {result.products.length ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-11 lg:grid-cols-3 xl:grid-cols-4">
              {result.products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 4}
                  className="reveal"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-border bg-surface/60">
              <EmptyState
                illustration={<SearchIllustration />}
                title="Belum ada yang cocok"
                description="Coba kata kunci lain atau longgarkan filter. Koleksi baru masuk tiap minggu."
                primaryAction={{ label: "Reset filter", href: "/shop" }}
                secondaryAction={
                  whatsapp ? { label: "Chat admin", href: whatsapp } : { label: "Lihat semua", href: "/shop" }
                }
              />
            </div>
          )}
          <Pagination params={params} page={result.page} totalPages={result.totalPages} />
        </div>
      </div>

      <div className="mt-16 flex flex-col items-start justify-between gap-4 rounded-md border border-border bg-surface p-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-serif text-xl">Belum menemukan ukuran yang pas?</p>
          <p className="mt-1 text-xs text-text-secondary">
            Kami bisa bantu ukur dan carikan piece serupa dari koleksi berikutnya.
          </p>
        </div>
        {whatsapp ? (
          <Link
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center rounded-sm bg-whatsapp px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-text-inverse transition-colors hover:bg-whatsapp-hover"
          >
            Tanya admin
          </Link>
        ) : null}
      </div>
    </div>
  );
}
