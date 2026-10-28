"use client";

import { useEffect, useRef, useState } from "react";
import { selectCartCount, useCartStore } from "@/stores/cart";
import { cn } from "@/lib/utils";

export function CartBadge() {
  const count = useCartStore(selectCartCount);
  const hydrated = useCartStore((state) => state.hydrated);
  const previousCount = useRef(count);
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    if (count > previousCount.current) {
      setPopping(true);
      const timer = window.setTimeout(() => setPopping(false), 320);
      previousCount.current = count;
      return () => window.clearTimeout(timer);
    }
    previousCount.current = count;
  }, [count]);

  const display = hydrated ? count : 0;

  return (
    <span
      aria-live="polite"
      className={cn(
        "absolute -right-0.5 -top-0.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none",
        display > 0 ? "bg-primary text-text-inverse" : "bg-transparent text-transparent",
        popping && "animate-cart-pop",
      )}
    >
      {display > 0 ? display : <span className="sr-only">Keranjang kosong</span>}
      <span className="sr-only">{display} item di keranjang</span>
    </span>
  );
}
