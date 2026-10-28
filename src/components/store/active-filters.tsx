import Link from "next/link";
import { X } from "lucide-react";
import type { ShopParams } from "@/types/product";
import { buildShopQuery } from "@/lib/whatsapp";

function href(params: ShopParams, overrides: Partial<ShopParams>) {
  const query = buildShopQuery({ ...params, ...overrides, page: 1 });
  return query ? `/shop?${query}` : "/shop";
}

export function ActiveFilters({ params }: { params: ShopParams }) {
  const chips: Array<{ label: string; next: Partial<ShopParams> }> = [];
  if (params.q) chips.push({ label: `“${params.q}”`, next: { q: "" } });
  if (params.category) chips.push({ label: params.category, next: { category: "" } });
  for (const size of params.size) {
    chips.push({
      label: `Ukuran ${size}`,
      next: { size: params.size.filter((item) => item !== size) },
    });
  }
  if (params.hideSold) chips.push({ label: "Tersedia saja", next: { hideSold: false } });
  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Filter aktif">
      <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-secondary">
        Filter aktif
      </span>
      {chips.map((chip) => (
        <Link
          key={chip.label}
          href={href(params, chip.next)}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-primary/20 bg-primary-soft px-3 text-[11px] font-semibold text-primary transition-colors hover:bg-highlight"
        >
          {chip.label}
          <X className="size-3" aria-hidden="true" />
          <span className="sr-only">Hapus filter {chip.label}</span>
        </Link>
      ))}
      <Link
        href="/shop"
        className="inline-flex h-8 items-center px-2 text-[11px] font-semibold text-text-secondary underline underline-offset-4 hover:text-primary"
      >
        Hapus semua
      </Link>
    </div>
  );
}
