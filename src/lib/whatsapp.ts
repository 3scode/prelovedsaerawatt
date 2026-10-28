import type { CartItem, ShopParams } from "@/types/product";
import { formatIDR, normalizeWhatsAppNumber } from "@/lib/utils";

export function buildWhatsAppMessage(items: CartItem[]): string {
  const lines = items.map(
    (item, index) => `${index + 1}. ${item.name} — ${item.sku} — ${formatIDR(item.price)}`,
  );
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return [
    "Halo Admin @prelovedsaerawatt,",
    "Saya mau order:",
    "",
    ...lines,
    "",
    `Total: ${formatIDR(total)}`,
    "",
    "Nama:",
    "Alamat:",
    "Catatan:",
  ].join("\n");
}

export function buildWhatsAppUrl(message: string, rawNumber?: string | null): string | null {
  const number = normalizeWhatsAppNumber(
    rawNumber ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  );
  if (!/^62\d{8,15}$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildProductQuestionUrl(productName: string, rawNumber?: string | null): string | null {
  return buildWhatsAppUrl(
    `Halo Admin @prelovedsaerawatt, saya ingin tanya soal "${productName}". Apakah masih tersedia?`,
    rawNumber,
  );
}

export function buildShopQuery(params: Partial<ShopParams>): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", String(params.q));
  if (params.category) search.set("category", String(params.category));
  if (params.size?.length) search.set("size", params.size.join(","));
  if (params.hideSold) search.set("hideSold", "1");
  if (params.sort && params.sort !== "newest") search.set("sort", String(params.sort));
  if (params.page && params.page > 1) search.set("page", String(params.page));
  return search.toString();
}
