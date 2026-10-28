import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import { HangerIllustration } from "@/components/ui/illustrations";

export function NotFoundContent() {
  return (
    <div className="container-page py-14 sm:py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="type-eyebrow text-primary">Error 404</p>
        <p
          className="mt-2 font-serif text-[120px] leading-[0.8] tracking-[-0.06em] text-primary opacity-90 sm:text-[180px]"
          aria-hidden="true"
        >
          404
        </p>
        <HangerIllustration className="mt-4 h-24 w-32 text-primary/60" />
        <h1 className="type-h1 mt-6">Piece ini sudah tidak ada.</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
          Mungkin sudah terjual, atau tautannya berubah. Barang preloved hanya ada satu — tapi
          koleksi baru selalu datang.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-sm bg-primary px-6 text-[11px] font-bold uppercase tracking-[0.08em] text-text-inverse transition-colors hover:bg-primary-hover"
          >
            Jelajahi koleksi
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-sm border border-border-strong px-6 text-[11px] font-bold uppercase tracking-[0.08em] text-primary transition-colors hover:bg-primary-soft"
          >
            <Home className="size-4" aria-hidden="true" />
            Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
