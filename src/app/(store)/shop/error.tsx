"use client";

import { ErrorState } from "@/components/store/error-state";

export default function ShopError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-page py-12">
      <ErrorState
        title="Katalog gagal dimuat."
        description="Filter dan koleksi belum bisa ditampilkan. Coba lagi tanpa kehilangan pilihanmu."
        reset={reset}
      />
    </div>
  );
}
