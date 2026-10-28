import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="container-admin py-16">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-full border border-border bg-surface text-primary">
          <SearchX className="size-6" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <p className="type-eyebrow mt-5 text-primary">Inventaris / 404</p>
        <h1 className="type-h2 mt-2">Produk tidak ditemukan.</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">
          Produk ini mungkin sudah dihapus, atau tautannya salah. Kembali ke inventaris untuk
          melihat daftar terbaru.
        </p>
        <Link
          href="/admin"
          className="mt-7 inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-text-inverse transition-colors hover:bg-primary-hover"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke inventaris
        </Link>
      </div>
    </div>
  );
}
