import { BadgeCheck, MessageCircle, ScanSearch } from "lucide-react";

const items = [
  {
    number: "01",
    icon: BadgeCheck,
    title: "Dikurasi manual",
    body: "Bukan tumpukan thrift. Setiap piece dipilih karena potongan dan kualitasnya masih layak.",
  },
  {
    number: "02",
    icon: ScanSearch,
    title: "Kondisi jujur",
    body: "Defect sekecil apa pun kami tulis. Foto diambil di cahaya alami, tanpa filter yang menipu.",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Checkout cepat",
    body: "Tidak perlu akun atau form panjang. Review keranjang, lalu lanjut ke WhatsApp admin.",
  },
];

export function TrustStrip() {
  return (
    <section aria-label="Janji prelovedsaerawatt" className="border-b border-border bg-surface">
      <div className="container-page grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {items.map((item) => (
          <div key={item.number} className="flex gap-4 py-7 sm:px-6 sm:py-9 first:sm:pl-0 last:sm:pr-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-primary">
              <item.icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="type-mono text-[10px] text-text-secondary">{item.number}</span>
                <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-text-primary">
                  {item.title}
                </h2>
              </div>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-text-secondary">
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
