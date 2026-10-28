import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { getDemoAdminEmail, getDemoAdminPassword, isDemoMode } from "@/lib/env";
import { getLatestProducts } from "@/lib/products";
import { LoginForm } from "@/components/admin/login-form";
import { BrandMark } from "@/components/store/brand-mark";
import { MediaImage } from "@/components/ui/media-image";

export const metadata: Metadata = {
  title: "Masuk inventaris",
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const session = await getAdminSession();
  if (session) redirect("/admin");
  const raw = await searchParams;
  const nextValue = typeof raw.next === "string" ? raw.next : "/admin";
  const demo = isDemoMode();
  const [featured] = await getLatestProducts(1);
  const loginImage = featured?.images[0] ?? null;

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden min-h-dvh overflow-hidden bg-text-primary lg:block">
        {loginImage ? (
          <MediaImage
            src={loginImage}
            alt={featured ? `Foto ${featured.name}` : "Koleksi prelovedsaerawatt"}
            sizes="55vw"
            priority
            className="object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-text-primary/80 via-text-primary/20 to-text-primary/15" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-8 text-text-inverse">
          <BrandMark className="text-[22px] text-text-inverse [&>span]:text-highlight" />
          <Link
            href="/"
            className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-text-inverse/85 transition-colors hover:text-text-inverse"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Kembali ke toko
          </Link>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-10 text-text-inverse">
          <p className="type-mono text-[10px] uppercase tracking-[0.16em] opacity-70">
            Back office / 026
          </p>
          <blockquote className="mt-4 max-w-md font-serif text-[38px] leading-[1.1] tracking-[-0.025em]">
            “Barang bagus, cerita baru.”
          </blockquote>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-inverse/75">
            Kelola koleksi dengan tenang. Setiap perubahan langsung terlihat di toko.
          </p>
        </div>
      </section>

      <section className="flex min-h-dvh flex-col">
        <div className="flex items-center justify-between border-b border-border px-5 py-4 lg:hidden">
          <BrandMark className="text-xl" />
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[11px] font-semibold text-text-secondary"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Toko
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-[420px]">
            <div className="flex size-11 items-center justify-center rounded-full border border-border bg-surface text-primary">
              <ShieldCheck className="size-5" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h1 className="type-h1 mt-6">Masuk ke inventaris.</h1>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              Halaman ini hanya untuk admin prelovedsaerawatt.
            </p>

            <LoginForm
              next={nextValue}
              demo={demo}
              demoEmail={demo ? getDemoAdminEmail() : undefined}
              demoPassword={demo ? getDemoAdminPassword() : undefined}
            />

            <div className="mt-8 border-t border-border pt-5">
              <p className="text-[11px] leading-relaxed text-text-secondary">
                Dengan masuk, kamu setuju untuk menjaga data pelanggan dan tidak membagikan akses
                admin ke orang lain.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border px-5 py-4 text-center text-[10px] uppercase tracking-[0.1em] text-text-secondary sm:px-10">
          prelovedsaerawatt · Indramayu · Akses terbatas
        </div>
      </section>
    </div>
  );
}
