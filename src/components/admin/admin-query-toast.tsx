"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/toast";

export function AdminQueryToast({ notice }: { notice: "created" | "updated" | null }) {
  const { toast } = useToast();

  useEffect(() => {
    if (!notice) return;
    toast({
      variant: "success",
      title: notice === "created" ? "Produk ditambahkan" : "Perubahan disimpan",
      description:
        notice === "created"
          ? "Piece baru sudah muncul di katalog."
          : "Katalog dan halaman produk sudah diperbarui.",
    });
    const url = new URL(window.location.href);
    url.searchParams.delete("created");
    url.searchParams.delete("updated");
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
  }, [notice, toast]);

  return null;
}
