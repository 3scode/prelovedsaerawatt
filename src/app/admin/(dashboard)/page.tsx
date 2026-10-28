import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { getAdminProducts, getAdminStats } from "@/lib/products";
import { parseAdminFilters } from "@/lib/search-params";
import { formatIDR } from "@/lib/utils";
import { AdminStatsGrid } from "@/components/admin/admin-stats";
import { AdminToolbar } from "@/components/admin/admin-toolbar";
import { ProductTable } from "@/components/admin/product-table";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminQueryToast } from "@/components/admin/admin-query-toast";
import { EmptyState } from "@/components/ui/empty-state";
import { BoxIllustration } from "@/components/ui/illustrations";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Inventaris",
  robots: { index: false, follow: false },
};

interface AdminPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminDashboardPage({ searchParams }: AdminPageProps) {
  const raw = await searchParams;
  const filters = parseAdminFilters(raw);
  const notice =
    raw.created === "1" ? ("created" as const) : raw.updated === "1" ? ("updated" as const) : null;

  const [stats, result] = await Promise.all([
    getAdminStats(),
    getAdminProducts(filters),
  ]);

  return (
    <div className="container-admin py-6 sm:py-8 lg:py-10">
      <AdminQueryToast notice={notice} />

      <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            <p className="type-eyebrow text-primary">Inventaris</p>
          </div>
          <h1 className="type-h1 mt-3 text-[34px] sm:text-[42px]">Barang yang sedang singgah.</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-secondary">
            Kelola koleksi, perbarui status, dan pastikan setiap piece punya cerita yang jujur.
          </p>
        </div>
        <Button asChild size="md" className="self-start sm:self-auto">
          <Link href="/admin/produk/baru">
            <Plus className="size-4" aria-hidden="true" />
            Tambah produk
          </Link>
        </Button>
      </header>

      <div className="mt-6">
        <AdminStatsGrid stats={stats} />
      </div>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="type-h3">Daftar produk</h2>
          <p className="mt-1 text-xs text-text-secondary">
            {result.total} produk
            {filters.q ? ` untuk “${filters.q}”` : ""}
            {filters.status !== "all"
              ? ` · ${filters.status === "available" ? "tersedia" : "terjual"}`
              : ""}
          </p>
        </div>
        <Link href="/" className="link-editorial self-start text-primary sm:self-auto">
          Buka storefront
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <AdminToolbar filters={filters} />

      {result.products.length ? (
        <>
          <ProductTable
            key={result.products.map((product) => `${product.id}:${product.status}`).join(",")}
            products={result.products}
          />
          <AdminPagination filters={{ ...filters, page: result.page }} totalPages={result.totalPages} />
          <p className="mt-5 text-[10px] text-text-secondary">
            Total nilai persediaan aktif: {formatIDR(stats.inventoryValue)}. Nilai dihitung dari
            harga piece yang berstatus tersedia.
          </p>
        </>
      ) : (
        <div className="mt-4 rounded-md border border-dashed border-border bg-surface/60">
          <EmptyState
            illustration={<BoxIllustration />}
            title={filters.q || filters.status !== "all" ? "Tidak ada hasil" : "Inventaris masih kosong"}
            description={
              filters.q || filters.status !== "all"
                ? "Coba kata kunci atau status lain. Filter bisa direset dari toolbar."
                : "Tambahkan piece pertama. Setelah disimpan, produk langsung tampil di katalog."
            }
            primaryAction={{ label: "Tambah produk", href: "/admin/produk/baru" }}
            secondaryAction={{ label: "Reset filter", href: "/admin" }}
            variant="compact"
          />
        </div>
      )}
    </div>
  );
}
