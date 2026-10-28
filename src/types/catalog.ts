import type { ProductCategory } from "@/types/product";

export interface CategoryCount {
  category: ProductCategory;
  count: number;
  image: string | null;
}
