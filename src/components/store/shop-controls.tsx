"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { ProductCategory, ShopParams } from "@/types/product";
import { PRODUCT_CATEGORIES, PRODUCT_SIZES } from "@/types/product";
import { buildShopQuery } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

function shopUrl(params: ShopParams) {
  const query = buildShopQuery(params);
  return query ? `/shop?${query}` : "/shop";
}

export function ShopSearch({ params }: { params: ShopParams }) {
  const router = useRouter();
  const [value, setValue] = useState(params.q);
  const [pending, startTransition] = useTransition();

  const submit = (nextValue: string) => {
    startTransition(() => {
      router.push(shopUrl({ ...params, q: nextValue.trim(), page: 1 }), { scroll: false });
    });
  };

  return (
    <form
      role="search"
      aria-label="Cari di katalog"
      className="relative"
      onSubmit={(event) => {
        event.preventDefault();
        submit(value);
      }}
    >
      <Search
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-text-secondary"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Cari nama produk, kategori, atau SKU..."
        aria-label="Cari produk"
        className="field-base h-12 pl-11 pr-24 text-sm"
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            setValue("");
            submit("");
          }}
          aria-label="Hapus pencarian"
          className="absolute right-[72px] top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 flex h-9 min-w-[60px] -translate-y-1/2 items-center justify-center gap-1.5 rounded-sm bg-primary px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-text-inverse transition-colors hover:bg-primary-hover"
        aria-label="Cari"
      >
        {pending ? <Spinner className="size-3.5" /> : "Cari"}
      </button>
    </form>
  );
}

export function SortSelect({ params }: { params: ShopParams }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className="relative flex items-center gap-2 text-xs text-text-secondary">
      <span className="hidden sm:inline">Urutkan</span>
      <span className="relative">
        <select
          value={params.sort}
          aria-label="Urutkan produk"
          onChange={(event) => {
            const sort = event.target.value as ShopParams["sort"];
            startTransition(() => {
              router.push(shopUrl({ ...params, sort, page: 1 }), { scroll: false });
            });
          }}
          className="h-10 appearance-none rounded-sm border border-border bg-surface pl-3 pr-8 text-xs font-semibold text-text-primary outline-none transition-colors hover:border-border-strong focus:border-primary"
        >
          <option value="newest">Terbaru</option>
          <option value="price_asc">Harga terendah</option>
          <option value="price_desc">Harga tertinggi</option>
        </select>
        <span
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary"
          aria-hidden="true"
        >
          {pending ? <Spinner className="size-3" /> : "▾"}
        </span>
      </span>
    </label>
  );
}

interface MobileFilterProps {
  params: ShopParams;
  counts: Record<string, number>;
}

export function MobileFilter({ params, counts }: MobileFilterProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(params.category);
  const [sizes, setSizes] = useState<string[]>(params.size);
  const [hideSold, setHideSold] = useState(params.hideSold);

  const openSheet = () => {
    // Sinkronkan draft dengan URL setiap kali sheet dibuka, tanpa effect.
    setCategory(params.category);
    setSizes(params.size);
    setHideSold(params.hideSold);
    setOpen(true);
  };

  const toggleSize = (size: string) => {
    setSizes((current) =>
      current.includes(size) ? current.filter((item) => item !== size) : [...current, size],
    );
  };

  const apply = () => {
    setOpen(false);
    router.push(
      shopUrl({
        ...params,
        category,
        size: sizes,
        hideSold,
        page: 1,
      }),
      { scroll: false },
    );
  };

  const reset = () => {
    setCategory("");
    setSizes([]);
    setHideSold(false);
  };

  const activeCount =
    (params.category ? 1 : 0) + params.size.length + (params.hideSold ? 1 : 0);

  return (
    <>
      <button
        type="button"
        onClick={openSheet}
        className="inline-flex h-10 items-center gap-2 rounded-sm border border-border-strong px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary-soft lg:hidden"
      >
        <SlidersHorizontal className="size-3.5" aria-hidden="true" />
        Filter
        {activeCount > 0 ? (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-text-inverse">
            {activeCount}
          </span>
        ) : null}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent variant="sheet" className="p-0">
          <div className="border-b border-border px-6 pb-4 pt-3">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" aria-hidden="true" />
            <DialogTitle className="type-h3">Filter koleksi</DialogTitle>
            <DialogDescription className="mt-1 text-xs text-text-secondary">
              Pilih kategori, ukuran, dan ketersediaan.
            </DialogDescription>
          </div>
          <div className="max-h-[55vh] overflow-y-auto px-6 py-5">
            <fieldset>
              <legend className="type-eyebrow text-text-secondary">Kategori</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCategory("")}
                  aria-pressed={category === ""}
                  className="chip"
                  data-active={category === ""}
                >
                  Semua
                </button>
                {PRODUCT_CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    aria-pressed={category === item}
                    className="chip"
                    data-active={category === item}
                  >
                    {item}
                    <span className="type-mono text-[10px] opacity-60">{counts[item] ?? 0}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-6">
              <legend className="type-eyebrow text-text-secondary">Ukuran</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {PRODUCT_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    aria-pressed={sizes.includes(size)}
                    className="chip min-w-10"
                    data-active={sizes.includes(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-6 flex items-center justify-between gap-4 rounded-sm border border-border bg-surface-muted/50 p-4">
              <div>
                <p className="text-sm font-semibold text-text-primary">Sembunyikan terjual</p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  Hanya tampilkan piece yang masih tersedia.
                </p>
              </div>
              <Switch
                checked={hideSold}
                onCheckedChange={setHideSold}
                aria-label="Sembunyikan produk terjual"
              />
            </div>
          </div>
          <div className="flex gap-3 border-t border-border px-6 py-4 safe-bottom">
            <Button type="button" variant="secondary" onClick={reset} className="flex-1">
              Reset
            </Button>
            <Button type="button" onClick={apply} className="flex-1">
              Terapkan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function CategoryChips({
  params,
  counts,
}: {
  params: ShopParams;
  counts: Record<string, number>;
}) {
  const router = useRouter();
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" role="group" aria-label="Kategori">
      <button
        type="button"
        onClick={() =>
          router.push(shopUrl({ ...params, category: "", page: 1 }), { scroll: false })
        }
        aria-pressed={!params.category}
        className={cn("chip shrink-0", !params.category && "chip-active")}
        data-active={!params.category}
      >
        Semua
      </button>
      {(PRODUCT_CATEGORIES as readonly ProductCategory[]).map((category) => (
        <button
          key={category}
          type="button"
          onClick={() =>
            router.push(
              shopUrl({
                ...params,
                category: params.category === category ? "" : category,
                page: 1,
              }),
              { scroll: false },
            )
          }
          aria-pressed={params.category === category}
          className="chip shrink-0"
          data-active={params.category === category}
        >
          {category}
          <span className="type-mono text-[10px] opacity-60">{counts[category] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}
