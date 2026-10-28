import Link from "next/link";
import type { ShopParams } from "@/types/product";
import { PRODUCT_CATEGORIES, PRODUCT_SIZES } from "@/types/product";
import { buildShopQuery } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

function href(params: ShopParams, overrides: Partial<ShopParams>) {
  const query = buildShopQuery({ ...params, ...overrides, page: 1 });
  return query ? `/shop?${query}` : "/shop";
}

export function FilterRail({
  params,
  counts,
}: {
  params: ShopParams;
  counts: Record<string, number>;
}) {
  return (
    <aside className="hidden lg:block" aria-label="Filter katalog">
      <div className="sticky top-[calc(var(--header-height)+24px)] space-y-7">
        <div className="flex items-center justify-between">
          <p className="type-eyebrow text-text-secondary">Filter</p>
          <Link href="/shop" className="text-[11px] font-semibold text-primary hover:underline">
            Reset
          </Link>
        </div>

        <fieldset>
          <legend className="text-[12px] font-bold uppercase tracking-[0.08em] text-text-primary">
            Kategori
          </legend>
          <div className="mt-3 space-y-1">
            <Link
              href={href(params, { category: "" })}
              aria-pressed={!params.category}
              className={cn(
                "flex min-h-9 items-center justify-between rounded-sm px-2 text-sm transition-colors hover:bg-primary-soft",
                !params.category ? "bg-primary-soft font-semibold text-primary" : "text-text-secondary",
              )}
            >
              <span>Semua</span>
            </Link>
            {PRODUCT_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={href(params, { category })}
                aria-pressed={params.category === category}
                className={cn(
                  "flex min-h-9 items-center justify-between rounded-sm px-2 text-sm transition-colors hover:bg-primary-soft",
                  params.category === category
                    ? "bg-primary-soft font-semibold text-primary"
                    : "text-text-secondary",
                )}
              >
                <span>{category}</span>
                <span className="type-mono text-[10px] opacity-60">{counts[category] ?? 0}</span>
              </Link>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-[12px] font-bold uppercase tracking-[0.08em] text-text-primary">
            Ukuran
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRODUCT_SIZES.map((size) => {
              const selected = params.size.includes(size);
              const nextSizes = selected
                ? params.size.filter((item) => item !== size)
                : [...params.size, size];
              return (
                <Link
                  key={size}
                  href={href(params, { size: nextSizes })}
                  aria-pressed={selected}
                  className="flex min-h-9 min-w-9 items-center justify-center rounded-sm border border-border bg-surface px-2 text-xs font-semibold text-text-secondary transition-colors hover:border-border-strong aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-text-inverse"
                >
                  {size}
                </Link>
              );
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-[12px] font-bold uppercase tracking-[0.08em] text-text-primary">
            Ketersediaan
          </legend>
          <Link
            href={href(params, { hideSold: !params.hideSold })}
            aria-pressed={params.hideSold}
            className="mt-3 flex items-center gap-2.5 text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded-xs border",
                params.hideSold
                  ? "border-primary bg-primary text-text-inverse"
                  : "border-border-strong bg-surface",
              )}
              aria-hidden="true"
            >
              {params.hideSold ? "✓" : ""}
            </span>
            Sembunyikan yang terjual
          </Link>
        </fieldset>

        <div className="rounded-sm border border-border bg-surface p-4">
          <p className="text-xs font-semibold text-text-primary">Butuh ukuran tertentu?</p>
          <p className="mt-1 text-xs leading-relaxed text-text-secondary">
            Chat admin — kami bisa mengukur lingkar dada, pinggang, dan panjang barang.
          </p>
        </div>
      </div>
    </aside>
  );
}
