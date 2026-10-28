"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/product";
import { useCartStore } from "@/stores/cart";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  product,
  className,
  sticky = false,
}: {
  product: Product;
  className?: string;
  sticky?: boolean;
}) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    const result = addItem(product);
    if (result === "soldout") {
      toast({
        variant: "error",
        title: "Piece ini sudah terjual",
        description: "Coba lihat koleksi lain yang masih tersedia.",
      });
      return;
    }
    if (result === "duplicate") {
      toast({
        variant: "info",
        title: "Sudah ada di keranjang",
        description: "Setiap piece hanya bisa ditambahkan satu kali.",
        action: { label: "Buka keranjang", onClick: () => router.push("/keranjang") },
      });
      return;
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2400);
    toast({
      variant: "success",
      title: "Ditambahkan ke keranjang",
      description: product.name,
      action: { label: "Lihat keranjang", onClick: () => router.push("/keranjang") },
    });
  };

  return (
    <Button
      type="button"
      size="lg"
      fullWidth={!sticky}
      onClick={handleAdd}
      disabled={!product.status}
      className={cn(sticky && "w-full", className)}
    >
      {added ? (
        <>
          <Check className="size-4" aria-hidden="true" />
          Ditambahkan
        </>
      ) : (
        <>
          <ShoppingBag className="size-4" aria-hidden="true" />
          {product.status ? "Tambah ke keranjang" : "Sudah terjual"}
        </>
      )}
    </Button>
  );
}
