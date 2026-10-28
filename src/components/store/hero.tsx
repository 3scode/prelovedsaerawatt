import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { HeroCarousel, type HeroSlide } from "@/components/store/hero-carousel";

interface HeroProps {
  productCount: number;
  slides: HeroSlide[];
}

export function Hero({ productCount, slides }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="container-page">
        <div className="grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:py-20">
          <div className="relative z-10 max-w-xl reveal">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-primary" aria-hidden="true" />
              <p className="type-eyebrow text-primary">Koleksi 2026 · Indramayu</p>
            </div>

            <h1 className="type-display mt-6 text-text-primary">
              Barang bagus,
              <br />
              <span className="relative inline-block italic text-primary">
                cerita baru.
                <svg
                  className="absolute -bottom-2 left-0 w-full text-highlight"
                  viewBox="0 0 300 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 9c70-7 180-8 294-2"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-text-secondary sm:text-base">
              Preloved yang dipilih satu per satu, dicek kondisinya, dan difoto apa adanya.
              Untuk kamu yang suka barang bagus tanpa harus selalu baru.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/shop"
                className="group inline-flex h-[52px] items-center justify-center gap-3 rounded-sm bg-primary px-6 text-[12px] font-bold uppercase tracking-[0.08em] text-text-inverse shadow-sm transition-all hover:bg-primary-hover hover:shadow-md"
              >
                Jelajahi koleksi
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/tentang#cara-belanja"
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-sm border border-border-strong px-6 text-[12px] font-bold uppercase tracking-[0.08em] text-primary transition-colors hover:bg-primary-soft"
              >
                Cara belanja
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-text-secondary">
              <span className="flex items-center gap-2">
                <span className="dot-available" aria-hidden="true" />
                {productCount} piece terkurasi
              </span>
              <span className="hidden h-3 w-px bg-border sm:block" aria-hidden="true" />
              <span className="flex items-center gap-2">
                <MessageCircle className="size-3.5" aria-hidden="true" />
                Checkout via WhatsApp
              </span>
            </div>
          </div>

          <div className="relative reveal reveal-delay-1">
            <div
              className="absolute -bottom-3 -right-3 top-3 left-3 rounded-md border border-border sm:-bottom-4 sm:-right-4 sm:top-4 sm:left-4"
              aria-hidden="true"
            />
            {slides.length ? (
              <HeroCarousel slides={slides} />
            ) : (
              <div className="relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-md border border-border bg-primary-soft p-6 sm:p-8">
                <p className="type-eyebrow text-primary">Dari katalog</p>
                <p className="mt-2 font-serif text-2xl text-text-primary sm:text-3xl">
                  Foto katalog sedang disiapkan.
                </p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-secondary">
                  Piece pertama akan tampil di sini begitu masuk katalog.
                </p>
              </div>
            )}
            <div className="mt-4 flex items-center justify-between gap-4 text-[11px] text-text-secondary">
              <p>Dipilih, dicuci, dan difoto di rumah kami.</p>
              <span className="type-mono text-[10px]">INDRAMAYU · ID</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
