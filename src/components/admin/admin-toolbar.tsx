"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";
import type { AdminProductFilters } from "@/types/product";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

function adminUrl(filters: AdminProductFilters, overrides: Partial<AdminProductFilters>) {
  const next = { ...filters, ...overrides };
  const search = new URLSearchParams();
  if (next.q) search.set("q", next.q);
  if (next.status !== "all") search.set("status", next.status);
  if (next.page > 1) search.set("page", String(next.page));
  const query = search.toString();
  return query ? `/admin?${query}` : "/admin";
}

export function AdminToolbar({ filters }: { filters: AdminProductFilters }) {
  const router = useRouter();
  const [query, setQuery] = useState(filters.q);
  const [pending, startTransition] = useTransition();

  const submit = (q: string) => {
    startTransition(() => {
      router.push(adminUrl(filters, { q: q.trim(), page: 1 }), { scroll: false });
    });
  };

  const hasFilter = Boolean(filters.q || filters.status !== "all");

  return (
    <div className="mt-5 flex flex-col gap-3 rounded-md border border-border bg-surface p-3 sm:flex-row sm:items-center">
      <form
        role="search"
        aria-label="Cari produk di inventaris"
        className="relative min-w-0 flex-1"
        onSubmit={(event) => {
          event.preventDefault();
          submit(query);
        }}
      >
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-secondary"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari nama atau SKU..."
          aria-label="Cari nama atau SKU"
          className="field-base h-10 pl-9 pr-20 text-sm"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              submit("");
            }}
            aria-label="Hapus pencarian"
            className="absolute right-16 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-text-secondary hover:bg-surface-muted"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        ) : null}
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 flex h-7 -translate-y-1/2 items-center rounded-sm bg-surface-muted px-2.5 text-[10px] font-bold uppercase tracking-[0.06em] text-primary transition-colors hover:bg-primary-soft"
        >
          {pending ? <Spinner className="size-3" /> : "Cari"}
        </button>
      </form>

      <div className="flex items-center gap-2">
        <label className="relative">
          <span className="sr-only">Filter status</span>
          <select
            value={filters.status}
            onChange={(event) =>
              startTransition(() => {
                router.push(
                  adminUrl(filters, {
                    status: event.target.value as AdminProductFilters["status"],
                    page: 1,
                  }),
                  { scroll: false },
                );
              })
            }
            className="h-10 appearance-none rounded-sm border border-border bg-surface pl-3 pr-8 text-xs font-semibold text-text-primary outline-none transition-colors hover:border-border-strong focus:border-primary"
          >
            <option value="all">Semua status</option>
            <option value="available">Tersedia</option>
            <option value="sold">Terjual</option>
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary">
            {pending ? <Spinner className="size-3" /> : "▾"}
          </span>
        </label>
        {hasFilter ? (
          <Link
            href="/admin"
            className={cn(
              "flex h-10 items-center rounded-sm px-3 text-[11px] font-semibold text-text-secondary transition-colors hover:bg-surface-muted hover:text-primary",
            )}
          >
            Reset
          </Link>
        ) : null}
      </div>
    </div>
  );
}
