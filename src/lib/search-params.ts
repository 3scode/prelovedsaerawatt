import type { AdminProductFilters, ShopParams } from "@/types/product";
import { PRODUCT_CATEGORIES } from "@/types/product";
import { shopSortSchema } from "@/schemas/product";

type SearchParamValue = string | string[] | undefined;

function first(value: SearchParamValue): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function all(value: SearchParamValue): string[] {
  if (Array.isArray(value)) return value.flatMap((entry) => entry.split(","));
  if (!value) return [];
  return value.split(",");
}

export function parseShopParams(
  raw: Record<string, SearchParamValue> = {},
): ShopParams {
  const q = first(raw.q).trim().slice(0, 80);
  const rawCategory = first(raw.category);
  const category = PRODUCT_CATEGORIES.includes(
    rawCategory as (typeof PRODUCT_CATEGORIES)[number],
  )
    ? rawCategory
    : "";
  const sizes = Array.from(new Set(all(raw.size).map((size) => size.trim()).filter(Boolean)));
  const hideSold = ["1", "true", "on", "yes"].includes(first(raw.hideSold).toLowerCase());
  const sortResult = shopSortSchema.safeParse(first(raw.sort));
  const rawPage = Number.parseInt(first(raw.page), 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.min(rawPage, 999) : 1;

  return {
    q,
    category,
    size: sizes,
    hideSold,
    sort: sortResult.success ? sortResult.data : "newest",
    page,
  };
}

export function parseAdminFilters(
  raw: Record<string, SearchParamValue> = {},
): AdminProductFilters {
  const q = first(raw.q).trim().slice(0, 80);
  const statusValue = first(raw.status);
  const status =
    statusValue === "available" || statusValue === "sold" ? statusValue : "all";
  const rawPage = Number.parseInt(first(raw.page), 10);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.min(rawPage, 999) : 1;
  return { q, status, page };
}

export function hasActiveFilters(params: ShopParams): boolean {
  return Boolean(params.q || params.category || params.size.length || params.hideSold);
}
