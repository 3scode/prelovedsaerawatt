"use client";

import { ErrorState } from "@/components/store/error-state";

export default function ProductError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-page py-12">
      <ErrorState
        title="Detail piece ini tidak bisa dibuka."
        description="Mungkin koneksi sedang terganggu. Coba lagi atau kembali ke katalog untuk melihat koleksi lainnya."
        reset={reset}
      />
    </div>
  );
}
