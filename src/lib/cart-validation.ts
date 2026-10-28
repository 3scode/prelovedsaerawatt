"use client";

import { useCartStore } from "@/stores/cart";

let inFlight: Promise<void> | null = null;

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function requestValidation(ids: string[]) {
  return fetch("/api/cart/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
}

export async function validateCart(force = false): Promise<void> {
  const store = useCartStore.getState();
  if (!store.hydrated) return;
  if (!store.items.length) return;
  if (store.validation.validating) return;
  if (!force && store.validation.validatedAt && Date.now() - store.validation.validatedAt < 60_000) {
    return;
  }
  if (inFlight) return inFlight;

  const ids = store.items.map((item) => item.productId);
  store.setValidating(true);

  inFlight = (async () => {
    let lastError: unknown = null;
    for (let attempt = 0; attempt <= 2; attempt += 1) {
      try {
        const response = await requestValidation(ids);
        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as
            | { error?: { message?: string } }
            | null;
          throw new Error(payload?.error?.message || "Gagal mengecek stok");
        }
        const payload = (await response.json()) as {
          success: boolean;
          data: {
            items: Array<{
              productId: string;
              slug: string;
              name: string;
              sku: string;
              price: number;
              size: string;
              image: string;
              status: boolean;
            }>;
            missingIds: string[];
            validatedAt: string;
          };
        };
        if (!payload.success || !payload.data) throw new Error("Respons validasi tidak valid");
        useCartStore
          .getState()
          .updateFromServer(
            payload.data.items,
            payload.data.missingIds,
            Date.parse(payload.data.validatedAt),
          );
        lastError = null;
        return;
      } catch (error) {
        lastError = error;
        if (attempt < 2) await sleep(300 * Math.pow(3, attempt));
      }
    }
    useCartStore
      .getState()
      .setValidationError(
        lastError instanceof Error
          ? "Status stok belum bisa dicek. Periksa koneksi lalu coba lagi."
          : "Status stok belum bisa dicek.",
      );
  })().finally(() => {
    inFlight = null;
    useCartStore.getState().setValidating(false);
  });

  return inFlight;
}
