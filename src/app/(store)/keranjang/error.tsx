"use client";

import { ErrorState } from "@/components/store/error-state";

export default function CartError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-page py-10">
      <ErrorState
        title="Keranjang belum bisa dibuka."
        description="Data keranjangmu tetap aman di perangkat ini. Coba muat ulang halaman."
        reset={reset}
      />
    </div>
  );
}
