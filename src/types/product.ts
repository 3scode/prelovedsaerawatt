export const PRODUCT_CATEGORIES = [
  "Atasan",
  "Bawahan",
  "Dress",
  "Outerwear",
  "Aksesori",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "All size",
] as const;

export type ProductSize = (typeof PRODUCT_SIZES)[number];

export interface Product {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  size: string;
  category: ProductCategory;
  description: string;
  defectNotes: string | null;
  images: string[];
  status: boolean;
  createdBy: string | null;
  requestId: string | null;
}

export type ProductCardData = Pick<
  Product,
  "id" | "slug" | "name" | "price" | "images" | "size" | "category" | "status" | "createdAt"
>;

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  size: string;
  image: string;
  status: boolean;
  addedAt: number;
}

export interface CartSnapshot {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  size: string;
  image: string;
  status: boolean;
}

export interface ShopParams {
  q: string;
  category: string;
  size: string[];
  hideSold: boolean;
  sort: "newest" | "price_asc" | "price_desc";
  page: number;
}

export interface AdminProductFilters {
  q: string;
  status: "all" | "available" | "sold";
  page: number;
}

export interface PaginatedProducts {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AdminStats {
  total: number;
  available: number;
  sold: number;
  inventoryValue: number;
}

export type SortOption = ShopParams["sort"];
