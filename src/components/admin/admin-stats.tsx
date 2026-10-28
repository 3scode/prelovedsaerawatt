import {
  Banknote,
  CheckCircle2,
  CircleSlash2,
  Package,
} from "lucide-react";
import type { AdminStats } from "@/types/product";
import { formatIDR } from "@/lib/utils";

const cards = [
  {
    key: "total" as const,
    label: "Total produk",
    icon: Package,
    caption: "Semua piece di katalog",
    format: (value: number) => String(value),
  },
  {
    key: "available" as const,
    label: "Tersedia",
    icon: CheckCircle2,
    caption: "Siap dijual",
    format: (value: number) => String(value),
  },
  {
    key: "sold" as const,
    label: "Terjual",
    icon: CircleSlash2,
    caption: "Arsip koleksi",
    format: (value: number) => String(value),
  },
  {
    key: "inventoryValue" as const,
    label: "Nilai tersedia",
    icon: Banknote,
    caption: "Total harga piece aktif",
    format: (value: number) => formatIDR(value),
  },
];

export function AdminStatsGrid({ stats }: { stats: AdminStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="rounded-md border border-border bg-surface p-4 sm:p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-secondary">
                {card.label}
              </p>
              <Icon className="size-4 text-primary/70" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <p className="mt-3 font-serif text-[30px] leading-none tracking-[-0.03em] text-text-primary sm:text-[36px]">
              {card.format(stats[card.key])}
            </p>
            <p className="mt-2 text-[10px] text-text-secondary">{card.caption}</p>
          </div>
        );
      })}
    </div>
  );
}
