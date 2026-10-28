import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import slugify from "slugify";
import { DEMO_PRODUCTS } from "@/lib/demo-products";
import type { Product, ProductCategory } from "@/types/product";
import type { ProductInput } from "@/schemas/product";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "products.json");

async function readProducts(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Product[];
    if (!Array.isArray(parsed)) return structuredClone(DEMO_PRODUCTS);
    return parsed;
  } catch {
    return structuredClone(DEMO_PRODUCTS);
  }
}

async function writeProducts(products: Product[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), "utf8");
}

function nextSku(products: Product[]): string {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const prefix = `PSW-${year}${month}-`;
  const highest = products
    .filter((product) => product.sku.startsWith(prefix))
    .reduce((max, product) => {
      const value = Number.parseInt(product.sku.slice(prefix.length), 10);
      return Number.isFinite(value) ? Math.max(max, value) : max;
    }, 0);
  let candidate = highest + 1;
  let sku = `${prefix}${String(candidate).padStart(3, "0")}`;
  while (products.some((product) => product.sku === sku)) {
    candidate += 1;
    sku = `${prefix}${String(candidate).padStart(3, "0")}`;
  }
  return sku;
}

function nextSlug(name: string, products: Product[]): string {
  const base = slugify(name, { lower: true, strict: true, trim: true }) || "produk";
  if (!products.some((product) => product.slug === base)) return base;
  let suffix = randomUUID().slice(0, 4);
  let slug = `${base}-${suffix}`;
  while (products.some((product) => product.slug === slug)) {
    suffix = randomUUID().slice(0, 4);
    slug = `${base}-${suffix}`;
  }
  return slug;
}

export async function listDemoProducts(): Promise<Product[]> {
  return readProducts();
}

export async function findDemoProductBySlug(slug: string): Promise<Product | null> {
  const products = await readProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function findDemoProductById(id: string): Promise<Product | null> {
  const products = await readProducts();
  return products.find((product) => product.id === id) ?? null;
}

export async function createDemoProduct(
  input: ProductInput,
  requestId: string,
  createdBy: string | null,
): Promise<{ product: Product; created: boolean }> {
  const products = await readProducts();
  const existing = products.find((product) => product.requestId === requestId);
  if (existing) return { product: existing, created: false };

  const now = new Date().toISOString();
  const product: Product = {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    name: input.name,
    slug: nextSlug(input.name, products),
    sku: nextSku(products),
    price: input.price,
    size: input.size,
    category: input.category as ProductCategory,
    description: input.description,
    defectNotes: input.defectNotes?.trim() || null,
    images: input.images,
    status: input.status,
    createdBy,
    requestId,
  };
  products.unshift(product);
  await writeProducts(products);
  return { product, created: true };
}

export async function updateDemoProduct(
  id: string,
  input: ProductInput,
): Promise<Product | null> {
  const products = await readProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) return null;
  const current = products[index];
  const updated: Product = {
    ...current,
    name: input.name,
    slug: input.name === current.name ? current.slug : nextSlug(input.name, products),
    price: input.price,
    size: input.size,
    category: input.category as ProductCategory,
    description: input.description,
    defectNotes: input.defectNotes?.trim() || null,
    images: input.images,
    status: input.status,
    updatedAt: new Date().toISOString(),
  };
  products[index] = updated;
  await writeProducts(products);
  return updated;
}

export async function deleteDemoProduct(id: string): Promise<boolean> {
  const products = await readProducts();
  const next = products.filter((product) => product.id !== id);
  if (next.length === products.length) return false;
  await writeProducts(next);
  return true;
}

export async function toggleDemoProductStatus(
  id: string,
  status: boolean,
): Promise<Product | null> {
  const products = await readProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index === -1) return null;
  products[index] = {
    ...products[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  await writeProducts(products);
  return products[index];
}
