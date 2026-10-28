"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { BoxIllustration } from "@/components/ui/illustrations";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-admin py-10">
      <div className="rounded-md border border-dashed border-border bg-surface/60">
        <EmptyState
          illustration={<BoxIllustration />}
          title="Inventaris belum bisa dimuat."
          description="Data produk tetap aman. Coba muat ulang halaman ini."
          primaryAction={{ label: "Coba lagi", onClick: reset }}
          secondaryAction={{ label: "Kembali ke beranda", href: "/" }}
          variant="compact"
        />
      </div>
    </div>
  );
}
