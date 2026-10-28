"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart";
import { useToast } from "@/components/ui/toast";

export function CartHydrator() {
  const storageError = useCartStore((state) => state.storageError);
  const setStorageError = useCartStore((state) => state.setStorageError);
  const { toast } = useToast();

  useEffect(() => {
    void Promise.resolve(useCartStore.persist.rehydrate())
      .catch(() => {
        useCartStore
          .getState()
          .setStorageError("Keranjang dimuat ulang karena data lama tidak terbaca.");
      })
      .finally(() => {
        // onRehydrateStorage tidak dipanggil dengan state saat storage
        // melempar error. Pastikan UI tidak tertahan di skeleton.
        useCartStore.getState().setHydrated(true);
      });
  }, []);

  useEffect(() => {
    if (!storageError) return;
    toast({
      variant: "info",
      title: "Keranjang dimuat ulang",
      description: storageError,
    });
    setStorageError(null);
  }, [storageError, setStorageError, toast]);

  return null;
}
