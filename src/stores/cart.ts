"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem, CartSnapshot, Product } from "@/types/product";

export type AddToCartResult = "added" | "duplicate" | "soldout";

export interface CartValidationState {
  validatedAt: number | null;
  validating: boolean;
  error: string | null;
  changedPriceIds: string[];
  soldOutIds: string[];
  missingIds: string[];
}

const initialValidation: CartValidationState = {
  validatedAt: null,
  validating: false,
  error: null,
  changedPriceIds: [],
  soldOutIds: [],
  missingIds: [],
};

interface CartState {
  items: CartItem[];
  hydrated: boolean;
  storageError: string | null;
  validation: CartValidationState;
  addItem: (product: Product) => AddToCartResult;
  removeItem: (productId: string) => CartItem | undefined;
  restoreItem: (item: CartItem) => void;
  updateFromServer: (
    snapshots: CartSnapshot[],
    missingIds: string[],
    validatedAt: number,
  ) => void;
  setValidating: (validating: boolean) => void;
  setValidationError: (error: string | null) => void;
  setHydrated: (hydrated: boolean) => void;
  setStorageError: (error: string | null) => void;
  clear: () => void;
}

function toCartItem(product: Product): CartItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    sku: product.sku,
    price: product.price,
    size: product.size,
    image: product.images[0] ?? "/images/placeholder.svg",
    status: product.status,
    addedAt: Date.now(),
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrated: false,
      storageError: null,
      validation: initialValidation,

      addItem: (product) => {
        if (!product.status) return "soldout";
        if (get().items.some((item) => item.productId === product.id)) return "duplicate";
        set((state) => ({
          items: [...state.items, toCartItem(product)],
          validation: { ...initialValidation },
        }));
        return "added";
      },

      removeItem: (productId) => {
        const removed = get().items.find((item) => item.productId === productId);
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
          validation: { ...initialValidation },
        }));
        return removed;
      },

      restoreItem: (item) => {
        set((state) => {
          if (state.items.some((existing) => existing.productId === item.productId)) {
            return state;
          }
          return {
            items: [...state.items, item],
            validation: { ...initialValidation },
          };
        });
      },

      updateFromServer: (snapshots, missingIds, validatedAt) => {
        const snapshotMap = new Map(snapshots.map((snapshot) => [snapshot.productId, snapshot]));
        const missing = new Set(missingIds);
        const previous = get().items;
        const changedPriceIds = previous
          .filter((item) => {
            const snapshot = snapshotMap.get(item.productId);
            return snapshot && snapshot.price !== item.price;
          })
          .map((item) => item.productId);

        // Hanya ubah item yang memang ikut divalidasi. Item yang baru
        // ditambahkan saat request berjalan tetap dipertahankan, lalu
        // ditandai belum tervalidasi agar checkout menunggu cek berikutnya.
        const nextItems = previous.flatMap((item) => {
          if (missing.has(item.productId)) return [];
          const snapshot = snapshotMap.get(item.productId);
          if (!snapshot) return [item];
          return [
            {
              ...item,
              name: snapshot.name,
              sku: snapshot.sku,
              price: snapshot.price,
              size: snapshot.size,
              image: snapshot.image || item.image,
              status: snapshot.status,
            },
          ];
        });
        const hasUnvalidatedItem = nextItems.some(
          (item) => !snapshotMap.has(item.productId) && !missing.has(item.productId),
        );

        set({
          items: nextItems,
          validation: {
            validatedAt: hasUnvalidatedItem ? null : validatedAt,
            validating: false,
            error: null,
            changedPriceIds,
            soldOutIds: nextItems.filter((item) => !item.status).map((item) => item.productId),
            missingIds,
          },
        });
      },

      setValidating: (validating) =>
        set((state) => ({
          validation: { ...state.validation, validating, error: validating ? null : state.validation.error },
        })),

      setValidationError: (error) =>
        set((state) => ({
          validation: { ...state.validation, error, validating: false, validatedAt: null },
        })),

      setHydrated: (hydrated) => set({ hydrated }),
      setStorageError: (storageError) => set({ storageError }),

      clear: () =>
        set({
          items: [],
          validation: { ...initialValidation },
        }),
    }),
    {
      name: "psw-cart-v1",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
      migrate: (persisted) => {
        if (!persisted || typeof persisted !== "object") return { items: [] };
        const items = (persisted as { items?: unknown }).items;
        if (!Array.isArray(items)) return { items: [] };
        return { items: items as CartItem[] };
      },
      onRehydrateStorage: () => (state, error) => {
        state?.setHydrated(true);
        if (error) state?.setStorageError("Keranjang dimuat ulang karena data lama tidak terbaca.");
      },
    },
  ),
);

export const selectCartCount = (state: CartState) => state.items.length;
export const selectCartTotal = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.price, 0);
export const selectHasUnavailable = (state: CartState) =>
  state.items.some((item) => !item.status);

export function isCheckoutReady(state: CartState): boolean {
  const { items, validation } = state;
  if (!items.length || validation.validating || validation.error) return false;
  if (items.some((item) => !item.status)) return false;
  if (!validation.validatedAt) return false;
  return Date.now() - validation.validatedAt < 5 * 60 * 1000;
}
