"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { isAllowedImageRef } from "@/lib/cloudinary";
import { isDemoMode } from "@/lib/env";
import { logger } from "@/lib/logger";
import {
  createProductRecordWithMeta,
  deleteProductRecord,
  getProductById,
  getProductByRequestId,
  getProductBySlug,
  toggleProductStatusRecord,
  updateProductRecord,
} from "@/lib/products";
import {
  productCreateSchema,
  productUpdateSchema,
  type ProductInput,
} from "@/schemas/product";
import type { ActionState, SimpleActionResult } from "@/types/action-state";

function parseImages(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string" || !value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function parseCommonForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    price: String(formData.get("price") ?? ""),
    category: String(formData.get("category") ?? ""),
    size: String(formData.get("size") ?? ""),
    description: String(formData.get("description") ?? ""),
    defectNotes: String(formData.get("defectNotes") ?? ""),
    status: String(formData.get("status") ?? "true") === "true",
    images: parseImages(formData.get("images")),
  };
}

function imageValidationMessage(images: string[]): string | null {
  if (!images.length) return "Tambahkan minimal satu foto produk.";
  if (images.length > 8) return "Maksimal 8 foto per produk.";
  if (!isDemoMode() && images.some((image) => image.startsWith("data:"))) {
    return "Foto harus diunggah ke Cloudinary sebelum produk disimpan.";
  }
  if (images.some((image) => !isAllowedImageRef(image))) {
    return "Ada foto dengan alamat yang tidak diizinkan.";
  }
  return null;
}

function revalidateProductPaths(slug: string, previousSlug?: string) {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath(`/produk/${slug}`);
  if (previousSlug && previousSlug !== slug) revalidatePath(`/produk/${previousSlug}`);
}

export async function createProductAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdmin();
  const parsed = productCreateSchema.safeParse({
    ...parseCommonForm(formData),
    requestId: String(formData.get("requestId") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Ada isian yang belum lengkap atau tidak valid.",
      fields: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    };
  }

  const imageError = imageValidationMessage(parsed.data.images);
  if (imageError) {
    return { status: "error", message: imageError, fields: { images: [imageError] } };
  }

  const input: ProductInput = {
    name: parsed.data.name,
    price: parsed.data.price,
    category: parsed.data.category,
    size: parsed.data.size,
    description: parsed.data.description,
    defectNotes: parsed.data.defectNotes,
    status: parsed.data.status,
    images: parsed.data.images,
  };

  const existing = await getProductByRequestId(parsed.data.requestId);
  if (existing) {
    revalidateProductPaths(existing.slug);
    redirect("/admin?created=1");
  }

  let createdSlug: string | null = null;
  try {
    if (isDemoMode()) {
      const result = await createProductRecordWithMeta(
        input,
        parsed.data.requestId,
        session.userId,
        "",
      );
      createdSlug = result.product.slug;
      logger.info("product_created", {
        route: "createProductAction",
        userId: session.userId ?? "demo",
        code: result.product.sku,
      });
    } else {
      let slug = slugify(input.name, { lower: true, strict: true, trim: true }) || "produk";
      if (await getProductBySlug(slug)) {
        slug = `${slug}-${parsed.data.requestId.slice(0, 6)}`;
      }
      const result = await createProductRecordWithMeta(
        input,
        parsed.data.requestId,
        session.userId,
        slug,
      );
      createdSlug = result.product.slug;
      logger.info("product_created", {
        route: "createProductAction",
        userId: session.userId ?? "unknown",
        code: result.product.sku,
      });
    }
  } catch (error) {
    logger.error("product_create_failed", {
      route: "createProductAction",
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      status: "error",
      message: "Produk belum bisa disimpan. Coba lagi atau periksa koneksi.",
    };
  }

  revalidateProductPaths(createdSlug ?? "");
  redirect("/admin?created=1");
}

export async function updateProductAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdmin();
  const parsed = productUpdateSchema.safeParse({
    ...parseCommonForm(formData),
    id: String(formData.get("id") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Ada isian yang belum lengkap atau tidak valid.",
      fields: z.flattenError(parsed.error).fieldErrors as Record<string, string[]>,
    };
  }

  const imageError = imageValidationMessage(parsed.data.images);
  if (imageError) {
    return { status: "error", message: imageError, fields: { images: [imageError] } };
  }

  const current = await getProductById(parsed.data.id);
  if (!current) {
    return { status: "error", message: "Produk tidak ditemukan. Mungkin sudah dihapus." };
  }

  const input: ProductInput = {
    name: parsed.data.name,
    price: parsed.data.price,
    category: parsed.data.category,
    size: parsed.data.size,
    description: parsed.data.description,
    defectNotes: parsed.data.defectNotes,
    status: parsed.data.status,
    images: parsed.data.images,
  };

  let updatedSlug: string | null = null;
  try {
    let nextSlug = current.slug;
    if (input.name !== current.name) {
      const base = slugify(input.name, { lower: true, strict: true, trim: true }) || "produk";
      const conflict = await getProductBySlug(base);
      nextSlug =
        conflict && conflict.id !== current.id
          ? `${base}-${crypto.randomUUID().slice(0, 6)}`
          : base;
    }

    const updated = await updateProductRecord(parsed.data.id, input, nextSlug);
    if (!updated) {
      return { status: "error", message: "Produk tidak ditemukan. Mungkin sudah dihapus." };
    }
    updatedSlug = updated.slug;
    logger.info("product_updated", {
      route: "updateProductAction",
      userId: session.userId ?? "demo",
      code: updated.sku,
    });
  } catch (error) {
    logger.error("product_update_failed", {
      route: "updateProductAction",
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      status: "error",
      message: "Perubahan belum bisa disimpan. Coba lagi.",
    };
  }

  revalidateProductPaths(updatedSlug ?? current.slug, current.slug);
  redirect("/admin?updated=1");
}

export async function deleteProductAction(id: string): Promise<SimpleActionResult> {
  await requireAdmin();
  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) return { ok: false, message: "ID produk tidak valid." };

  try {
    const current = await getProductById(parsed.data);
    // Delete kedua dianggap sukses: tujuannya memang menghilangkan produk.
    if (!current) return { ok: true };
    await deleteProductRecord(parsed.data);
    revalidateProductPaths(current.slug);
    logger.info("product_deleted", {
      route: "deleteProductAction",
      code: current.sku,
    });
    return { ok: true };
  } catch (error) {
    logger.error("product_delete_failed", {
      route: "deleteProductAction",
      error: error instanceof Error ? error.message : String(error),
    });
    return { ok: false, message: "Produk belum bisa dihapus." };
  }
}

export async function toggleProductStatusAction(
  id: string,
  status: boolean,
): Promise<SimpleActionResult> {
  await requireAdmin();
  const parsed = z.uuid().safeParse(id);
  if (!parsed.success) return { ok: false, message: "ID produk tidak valid." };
  if (typeof status !== "boolean") return { ok: false, message: "Status tidak valid." };

  try {
    const updated = await toggleProductStatusRecord(parsed.data, status);
    if (!updated) return { ok: false, message: "Produk tidak ditemukan." };
    revalidateProductPaths(updated.slug);
    logger.info("product_status_updated", {
      route: "toggleProductStatusAction",
      code: updated.sku,
      status,
    });
    return { ok: true };
  } catch (error) {
    logger.error("product_toggle_failed", {
      route: "toggleProductStatusAction",
      error: error instanceof Error ? error.message : String(error),
    });
    return { ok: false, message: "Status belum bisa diubah." };
  }
}
