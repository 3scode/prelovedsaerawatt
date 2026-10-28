import type { Metadata } from "next";
import { CartView } from "@/components/store/cart-view";

export const metadata: Metadata = {
  title: "Keranjang",
  description: "Periksa piece pilihanmu, cek ketersediaan, lalu checkout via WhatsApp.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div>
      <CartView />
    </div>
  );
}
