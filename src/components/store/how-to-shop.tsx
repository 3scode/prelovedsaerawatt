import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { MediaImage } from "@/components/ui/media-image";
import { shoppingSteps } from "@/content/about";

export function HowToShop() {
  return (
    <section id="cara-belanja" className="border-y border-border bg-surface-muted/55">
      <div className="container-page py-16 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="type-eyebrow text-primary">Cara belanja</p>
            <h2 className="type-h2 mt-3">Tiga langkah, tanpa ribet.</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-text-secondary">
            Semua barang unik. Kalau kamu menemukan yang cocok, jangan tunggu terlalu lama.
          </p>
        </div>

        <div className="mt-10 grid gap-0 border-t border-border sm:grid-cols-3 sm:border-t-0">
          {shoppingSteps.slice(0, 3).map((step) => (
            <div
              key={step.number}
              className="group border-b border-border py-7 sm:border-b-0 sm:border-r sm:px-7 sm:py-2 first:sm:pl-0 last:sm:border-r-0 last:sm:pr-0"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-4xl text-primary/35 transition-colors group-hover:text-primary/60">
                  {step.number}
                </span>
                <ArrowRight
                  className="size-4 text-text-secondary opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-5 font-serif text-xl">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-secondary">
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/shop"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-text-inverse transition-colors hover:bg-primary-hover"
          >
            Mulai dari katalog
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/tentang#cara-belanja"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-border-strong px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-primary transition-colors hover:bg-primary-soft"
          >
            Baca panduan lengkap
          </Link>
        </div>
      </div>
    </section>
  );
}

export function BrandPromiseCta({
  whatsappUrl,
  image,
}: {
  whatsappUrl: string | null;
  image: string | null;
}) {
  return (
    <section className="container-page py-16 sm:py-24">
      <div className="grid overflow-hidden rounded-md border border-border bg-primary-soft lg:grid-cols-[1.15fr_0.85fr]">
        <div className="p-7 sm:p-12 lg:p-16">
          <p className="type-eyebrow text-primary">Satu piece, satu cerita</p>
          <blockquote className="mt-6 max-w-xl font-serif text-[30px] leading-[1.15] tracking-[-0.025em] text-text-primary sm:text-[38px]">
            “Barang preloved tidak kehilangan nilai karena sudah dipakai. Ia justru punya cerita
            yang belum selesai.”
          </blockquote>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary">
            — Admin @prelovedsaerawatt
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-whatsapp px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-text-inverse transition-colors hover:bg-whatsapp-hover"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                Tanya admin
              </a>
            ) : null}
            <Link
              href="/tentang"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-border-strong px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-primary transition-colors hover:bg-surface"
            >
              Kenali kami
            </Link>
          </div>
        </div>
        <div className="relative hidden min-h-[360px] overflow-hidden border-l border-border bg-primary-soft lg:block">
          {image ? (
            <MediaImage
              src={image}
              alt="Koleksi preloved prelovedsaerawatt"
              sizes="(max-width: 1024px) 0vw, 40vw"
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-text-primary/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-text-inverse">
            <p className="type-mono text-[10px] uppercase tracking-[0.14em]">Di balik koleksi</p>
            <span className="border border-white/35 px-2 py-1 type-mono text-[9px]">PSW / 026</span>
          </div>
        </div>
      </div>
    </section>
  );
}
