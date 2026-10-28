"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { HangerIllustration } from "@/components/ui/illustrations";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function ErrorState({
  title = "Lagi ada gangguan di dapur kami.",
  description = "Koleksi belum bisa dimuat. Coba lagi, atau tanya admin lewat WhatsApp.",
  reset,
}: {
  title?: string;
  description?: string;
  reset?: () => void;
}) {
  const whatsapp = buildWhatsAppUrl(
    "Halo Admin @prelovedsaerawatt, saya sedang mengalami kendala saat membuka website. Bisa dibantu?",
  );

  return (
    <EmptyState
      illustration={<HangerIllustration />}
      title={title}
      description={description}
      primaryAction={
        reset
          ? { label: "Coba lagi", onClick: reset }
          : { label: "Kembali ke katalog", href: "/shop" }
      }
      secondaryAction={whatsapp ? { label: "Chat admin", href: whatsapp } : undefined}
      className="min-h-[48vh]"
    />
  );
}
