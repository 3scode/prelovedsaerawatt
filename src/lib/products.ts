import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type {
  AdminProductFilters,
  AdminStats,
  PaginatedProducts,
  Product,
  ProductCardData,
  ShopParams,
} from "@/types/product";
import type { CategoryCount } from "@/types/catalog";
import { isDemoMode } from "@/lib/env";
import { getSupabasePublic } from "@/lib/supabase/public";
import {
  createDemoProduct,
  deleteDemoProduct,
  findDemoProductById,
  findDemoProductBySlug,
  listDemoProducts,
  toggleDemoProductStatus,
  updateDemoProduct,
} from "@/lib/demo-store";
import { withRetry } from "@/lib/resilience";
import type { ProductInput } from "@/schemas/product";

const SHOP_PAGE_SIZE = 12;
const ADMIN_PAGE_SIZE = 20;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    price: Number(row.price),
    size: row.size,
    category: row.category as Product["category"],
    description: row.description,
    defectNotes: row.defect_notes,
    images: row.images ?? [],
    status: row.status,
    createdBy: row.created_by,
    requestId: row.request_id,
  };
}

function toCard(product: Product): ProductCardData {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    images: product.images,
    size: product.size,
    category: product.category,
    status: product.status,
    createdAt: product.createdAt,
  };
}

function sortProducts(products: Product[], sort: ShopParams["sort"]): Product[] {
  return [...products].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    return Date.parse(b.createdAt) - Date.parse(a.createdAt);
  });
}

function filterDemoProducts(products: Product[], params: ShopParams): Product[] {
  const query = params.q.toLowerCase();
  const filtered = products.filter((product) => {
    if (query) {
      const haystack = `${product.name} ${product.sku} ${product.category}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (params.category && product.category !== params.category) return false;
    if (params.size.length && !params.size.includes(product.size)) return false;
    if (params.hideSold && !product.status) return false;
    return true;
  });
  return sortProducts(filtered, params.sort);
}

function requireSupabase(): SupabaseClient<Database> {
  const supabase = getSupabasePublic();
  if (!supabase) {
    throw new Error("Supabase belum dikonfigurasi. Isi env atau aktifkan DEMO_MODE.");
  }
  return supabase;
}

function sanitizeQuery(value: string): string {
  // Nilai ini masuk ke PostgREST `or(...)`; buang karakter struktur agar
  // pencarian tidak bisa mengubah bentuk filter.
  return value.replace(/[%_\\,()]/g, "").trim();
}

function buildShopQuery(
  supabase: SupabaseClient<Database>,
  params: ShopParams,
) {
  let query = supabase.from("products").select("*", { count: "exact" });
  if (params.q) {
    const safe = sanitizeQuery(params.q);
    query = query.or(`name.ilike.%${safe}%,sku.ilike.%${safe}%`);
  }
  if (params.category) query = query.eq("category", params.category);
  if (params.size.length) query = query.in("size", params.size);
  if (params.hideSold) query = query.eq("status", true);
  if (params.sort === "price_asc") query = query.order("price", { ascending: true });
  else if (params.sort === "price_desc") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });
  return query;
}

async function fetchShopPage(
  supabase: SupabaseClient<Database>,
  params: ShopParams,
  page: number,
) {
  const from = (page - 1) * SHOP_PAGE_SIZE;
  const { data, error, count } = await buildShopQuery(supabase, params).range(
    from,
    from + SHOP_PAGE_SIZE - 1,
  );
  if (error) throw error;
  return { rows: data ?? [], total: count ?? 0 };
}

function buildAdminQuery(
  supabase: SupabaseClient<Database>,
  filters: AdminProductFilters,
) {
  let query = supabase.from("products").select("*", { count: "exact" });
  if (filters.q) {
    const safe = sanitizeQuery(filters.q);
    query = query.or(`name.ilike.%${safe}%,sku.ilike.%${safe}%`);
  }
  if (filters.status === "available") query = query.eq("status", true);
  if (filters.status === "sold") query = query.eq("status", false);
  return query.order("created_at", { ascending: false });
}

async function fetchAdminPage(
  supabase: SupabaseClient<Database>,
  filters: AdminProductFilters,
  page: number,
) {
  const from = (page - 1) * ADMIN_PAGE_SIZE;
  const { data, error, count } = await buildAdminQuery(supabase, filters).range(
    from,
    from + ADMIN_PAGE_SIZE - 1,
  );
  if (error) throw error;
  return { rows: data ?? [], total: count ?? 0 };
}

export async function getLatestProducts(limit = 8): Promise<Product[]> {
  if (isDemoMode()) {
    const products = await listDemoProducts();
    return sortProducts(products, "newest").slice(0, limit);
  }
  const supabase = requireSupabase();
  const rows = await withRetry(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  });
  return rows.map(mapRow);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isDemoMode()) return findDemoProductBySlug(slug);
  const supabase = requireSupabase();
  const row = await withRetry(async () => {
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data;
  });
  return row ? mapRow(row) : null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!UUID_PATTERN.test(id)) return null;
  if (isDemoMode()) return findDemoProductById(id);
  const supabase = requireSupabase();
  const row = await withRetry(async () => {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  });
  return row ? mapRow(row) : null;
}

export async function getProducts(params: ShopParams): Promise<PaginatedProducts> {
  if (isDemoMode()) {
    const all = filterDemoProducts(await listDemoProducts(), params);
    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / SHOP_PAGE_SIZE));
    const page = Math.min(Math.max(1, params.page), totalPages);
    const start = (page - 1) * SHOP_PAGE_SIZE;
    return {
      products: all.slice(start, start + SHOP_PAGE_SIZE),
      total,
      page,
      pageSize: SHOP_PAGE_SIZE,
      totalPages,
    };
  }

  const supabase = requireSupabase();
  const requestedPage = Math.max(1, params.page);
  const first = await withRetry(() => fetchShopPage(supabase, params, requestedPage));
  const totalPages = Math.max(1, Math.ceil(first.total / SHOP_PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const result =
    page === requestedPage
      ? first
      : await withRetry(() => fetchShopPage(supabase, params, page));

  return {
    products: result.rows.map(mapRow),
    total: result.total,
    page,
    pageSize: SHOP_PAGE_SIZE,
    totalPages,
  };
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return [];
  if (isDemoMode()) {
    const products = await listDemoProducts();
    return products.filter((product) => ids.includes(product.id));
  }
  const supabase = requireSupabase();
  const rows = await withRetry(async () => {
    const { data, error } = await supabase.from("products").select("*").in("id", ids);
    if (error) throw error;
    return data ?? [];
  });
  return rows.map(mapRow);
}

export async function getRelatedProducts(
  category: Product["category"],
  excludeId: string,
  limit = 4,
): Promise<Product[]> {
  if (isDemoMode()) {
    const products = await listDemoProducts();
    return products
      .filter(
        (product) =>
          product.category === category && product.id !== excludeId && product.status,
      )
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
      .slice(0, limit);
  }
  const supabase = requireSupabase();
  const rows = await withRetry(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .eq("status", true)
      .neq("id", excludeId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  });
  return rows.map(mapRow);
}

export async function getAdminProducts(filters: AdminProductFilters): Promise<PaginatedProducts> {
  if (isDemoMode()) {
    const products = await listDemoProducts();
    const q = filters.q.toLowerCase();
    const filtered = products.filter((product) => {
      if (q && !`${product.name} ${product.sku}`.toLowerCase().includes(q)) return false;
      if (filters.status === "available" && !product.status) return false;
      if (filters.status === "sold" && product.status) return false;
      return true;
    });
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
    const page = Math.min(Math.max(1, filters.page), totalPages);
    const start = (page - 1) * ADMIN_PAGE_SIZE;
    return {
      products: filtered.slice(start, start + ADMIN_PAGE_SIZE),
      total,
      page,
      pageSize: ADMIN_PAGE_SIZE,
      totalPages,
    };
  }

  const supabase = requireSupabase();
  const requestedPage = Math.max(1, filters.page);
  const first = await withRetry(() => fetchAdminPage(supabase, filters, requestedPage));
  const totalPages = Math.max(1, Math.ceil(first.total / ADMIN_PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const result =
    page === requestedPage
      ? first
      : await withRetry(() => fetchAdminPage(supabase, filters, page));

  return {
    products: result.rows.map(mapRow),
    total: result.total,
    page,
    pageSize: ADMIN_PAGE_SIZE,
    totalPages,
  };
}

export async function getAdminStats(): Promise<AdminStats> {
  if (isDemoMode()) {
    const products = await listDemoProducts();
    return {
      total: products.length,
      available: products.filter((product) => product.status).length,
      sold: products.filter((product) => !product.status).length,
      inventoryValue: products
        .filter((product) => product.status)
        .reduce((sum, product) => sum + product.price, 0),
    };
  }
  const supabase = requireSupabase();
  const rows = await withRetry(async () => {
    const { data, error } = await supabase.from("products").select("status, price");
    if (error) throw error;
    return data ?? [];
  });
  return rows.reduce<AdminStats>(
    (stats, row) => {
      stats.total += 1;
      if (row.status) {
        stats.available += 1;
        stats.inventoryValue += Number(row.price);
      } else {
        stats.sold += 1;
      }
      return stats;
    },
    { total: 0, available: 0, sold: 0, inventoryValue: 0 },
  );
}

export async function getCategoryCounts(): Promise<CategoryCount[]> {
  const products = isDemoMode()
    ? (await listDemoProducts()).map((product) => ({
        category: product.category,
        image: product.images[0] ?? null,
        createdAt: product.createdAt,
      }))
    : await withRetry(async () => {
        const supabase = requireSupabase();
        const { data, error } = await supabase
          .from("products")
          .select("category, images, created_at")
          .order("created_at", { ascending: false });
        if (error) throw error;
        return (data ?? []).map((row) => ({
          category: row.category as Product["category"],
          image: row.images?.[0] ?? null,
          createdAt: row.created_at,
        }));
      });

  const categories = new Map<string, CategoryCount>();
  for (const product of products) {
    const existing = categories.get(product.category);
    if (existing) {
      existing.count += 1;
      if (!existing.image && product.image) existing.image = product.image;
      continue;
    }
    categories.set(product.category, {
      category: product.category,
      count: 1,
      image: product.image,
    });
  }

  return [...categories.values()].sort((a, b) => b.count - a.count);
}

export async function getAllProductSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  if (isDemoMode()) {
    const products = await listDemoProducts();
    return products.map((product) => ({ slug: product.slug, updatedAt: product.updatedAt }));
  }
  const supabase = requireSupabase();
  const rows = await withRetry(async () => {
    const { data, error } = await supabase.from("products").select("slug, updated_at");
    if (error) throw error;
    return data ?? [];
  });
  return rows.map((row) => ({ slug: row.slug, updatedAt: row.updated_at }));
}

export async function getProductByRequestId(requestId: string): Promise<Product | null> {
  if (!UUID_PATTERN.test(requestId)) return null;
  if (isDemoMode()) {
    const products = await listDemoProducts();
    return products.find((product) => product.requestId === requestId) ?? null;
  }
  const supabase = requireSupabase();
  const row = await withRetry(async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("request_id", requestId)
      .maybeSingle();
    if (error) throw error;
    return data;
  });
  return row ? mapRow(row) : null;
}

// SKU dibuat oleh database. Slug dihitung di server action agar unik.
export async function createProductRecordWithMeta(
  input: ProductInput,
  requestId: string,
  createdBy: string | null,
  slug: string,
  sku?: string,
) {
  if (isDemoMode()) return createDemoProduct(input, requestId, createdBy);
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name,
      slug,
      ...(sku ? { sku } : {}),
      price: input.price,
      size: input.size,
      category: input.category,
      description: input.description,
      defect_notes: input.defectNotes || null,
      images: input.images,
      status: input.status,
      created_by: createdBy,
      request_id: requestId,
    })
    .select("*")
    .single();
  if (error) throw error;
  return { product: mapRow(data), created: true };
}

export async function updateProductRecord(
  id: string,
  input: ProductInput,
  slug?: string,
): Promise<Product | null> {
  if (isDemoMode()) return updateDemoProduct(id, input);
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("products")
    .update({
      name: input.name,
      ...(slug ? { slug } : {}),
      price: input.price,
      size: input.size,
      category: input.category,
      description: input.description,
      defect_notes: input.defectNotes || null,
      images: input.images,
      status: input.status,
    })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : null;
}

export async function deleteProductRecord(id: string): Promise<boolean> {
  if (isDemoMode()) return deleteDemoProduct(id);
  const supabase = requireSupabase();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function toggleProductStatusRecord(id: string, status: boolean): Promise<Product | null> {
  if (isDemoMode()) return toggleDemoProductStatus(id, status);
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("products")
    .update({ status })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data) : null;
}

export { toCard };
