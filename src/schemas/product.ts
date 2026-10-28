import { z } from "zod";
import { PRODUCT_CATEGORIES } from "@/types/product";

export const imageArraySchema = z
  .array(z.string().trim().min(1, "Foto tidak valid"))
  .min(1, "Tambahkan minimal satu foto")
  .max(8, "Maksimal 8 foto");

export const productInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Nama produk minimal 3 karakter")
    .max(80, "Nama produk maksimal 80 karakter"),
  price: z.coerce
    .number({ error: "Harga wajib berupa angka" })
    .int("Harga harus bilangan bulat")
    .positive("Harga harus lebih dari 0")
    .max(999_999_999, "Harga terlalu besar"),
  category: z.enum(PRODUCT_CATEGORIES, { error: "Kategori tidak valid" }),
  size: z.string().trim().min(1, "Ukuran wajib dipilih").max(16, "Ukuran tidak valid"),
  description: z
    .string()
    .trim()
    .min(1, "Deskripsi wajib diisi")
    .max(2000, "Deskripsi maksimal 2000 karakter"),
  defectNotes: z
    .string()
    .trim()
    .max(500, "Catatan kondisi maksimal 500 karakter")
    .optional()
    .default(""),
  status: z.boolean().default(true),
  images: imageArraySchema,
});

export type ProductInput = z.infer<typeof productInputSchema>;

export const productCreateSchema = productInputSchema.extend({
  requestId: z.uuid("Request ID tidak valid"),
});

export const productUpdateSchema = productInputSchema.extend({
  id: z.uuid("ID produk tidak valid"),
});

export const shopSortSchema = z.enum(["newest", "price_asc", "price_desc"]);

export const shopParamsSchema = z.object({
  q: z.string().trim().max(80).catch(""),
  category: z.string().catch(""),
  size: z.array(z.string()).catch([]),
  hideSold: z.boolean().catch(false),
  sort: shopSortSchema.catch("newest"),
  page: z.coerce.number().int().min(1).max(999).catch(1),
});

export const cartValidateSchema = z.object({
  ids: z
    .array(z.uuid("ID produk tidak valid"))
    .min(1, "Keranjang kosong")
    .max(20, "Maksimal 20 produk per validasi"),
});

export const adminFilterSchema = z.object({
  q: z.string().trim().max(80).catch(""),
  status: z.enum(["all", "available", "sold"]).catch("all"),
  page: z.coerce.number().int().min(1).max(999).catch(1),
});

export const loginSchema = z.object({
  email: z.email("Masukkan email yang valid").trim().toLowerCase(),
  password: z.string().min(8, "Password minimal 8 karakter"),
  next: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
