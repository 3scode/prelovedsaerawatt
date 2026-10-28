import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ShopParams } from "@/types/product";
import { buildShopQuery } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

function pageHref(params: ShopParams, page: number) {
  const query = buildShopQuery({ ...params, page });
  return query ? `/shop?${query}` : "/shop";
}

function getPages(current: number, total: number): Array<number | "…"> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const pages = new Set<number>([1, total, current]);
  if (current > 1) pages.add(current - 1);
  if (current < total) pages.add(current + 1);
  const sorted = [...pages].sort((a, b) => a - b);
  const result: Array<number | "…"> = [];
  for (const page of sorted) {
    const previous = result[result.length - 1];
    if (typeof previous === "number" && page - previous > 1) result.push("…");
    result.push(page);
  }
  return result;
}

export function Pagination({
  params,
  page,
  totalPages,
}: {
  params: ShopParams;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination katalog"
      className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row"
    >
      <p className="type-mono text-[11px] text-text-secondary">
        Halaman {page} / {totalPages}
      </p>
      <div className="flex items-center gap-1.5">
        {page > 1 ? (
          <Link
            href={pageHref(params, page - 1)}
            className="flex size-10 items-center justify-center rounded-sm border border-border bg-surface text-text-primary transition-colors hover:border-border-strong"
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
        {getPages(page, totalPages).map((item, index) =>
          item === "…" ? (
            <span key={`ellipsis-${index}`} className="px-1 text-xs text-text-secondary">
              …
            </span>
          ) : (
            <Link
              key={item}
              href={pageHref(params, item)}
              aria-current={item === page ? "page" : undefined}
              className={cn(
                "flex size-10 items-center justify-center rounded-sm border text-xs font-semibold transition-colors",
                item === page
                  ? "border-primary bg-primary text-text-inverse"
                  : "border-border bg-surface text-text-primary hover:border-border-strong",
              )}
            >
              {item}
            </Link>
          ),
        )}
        {page < totalPages ? (
          <Link
            href={pageHref(params, page + 1)}
            className="flex size-10 items-center justify-center rounded-sm border border-border bg-surface text-text-primary transition-colors hover:border-border-strong"
            aria-label="Halaman berikutnya"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
