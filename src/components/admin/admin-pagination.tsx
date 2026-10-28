import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AdminProductFilters } from "@/types/product";

function href(filters: AdminProductFilters, page: number) {
  const search = new URLSearchParams();
  if (filters.q) search.set("q", filters.q);
  if (filters.status !== "all") search.set("status", filters.status);
  if (page > 1) search.set("page", String(page));
  const query = search.toString();
  return query ? `/admin?${query}` : "/admin";
}

export function AdminPagination({
  filters,
  totalPages,
}: {
  filters: AdminProductFilters;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination inventaris"
      className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-border pt-4 sm:flex-row"
    >
      <p className="type-mono text-[10px] text-text-secondary">
        Halaman {filters.page} dari {totalPages}
      </p>
      <div className="flex items-center gap-2">
        {filters.page > 1 ? (
          <Link
            href={href(filters, filters.page - 1)}
            className="flex h-9 items-center gap-1 rounded-sm border border-border bg-surface px-3 text-[11px] font-semibold text-text-primary transition-colors hover:border-border-strong"
          >
            <ChevronLeft className="size-3.5" aria-hidden="true" />
            Sebelumnya
          </Link>
        ) : null}
        {filters.page < totalPages ? (
          <Link
            href={href(filters, filters.page + 1)}
            className="flex h-9 items-center gap-1 rounded-sm border border-border bg-surface px-3 text-[11px] font-semibold text-text-primary transition-colors hover:border-border-strong"
          >
            Berikutnya
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
