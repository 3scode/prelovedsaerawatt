"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  ShieldCheck,
  Store,
} from "lucide-react";
import type { AdminSession } from "@/lib/auth";
import { signOutAction } from "@/app/actions/auth";
import { BrandMark } from "@/components/store/brand-mark";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Inventaris", icon: LayoutDashboard, exact: true },
  { href: "/admin/produk/baru", label: "Tambah produk", icon: Plus, exact: false },
  { href: "/", label: "Lihat toko", icon: Store, exact: true, external: true },
];

export function AdminShell({
  session,
  children,
}: {
  session: AdminSession;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-dvh">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-border bg-surface lg:flex">
        <div className="flex h-20 items-center border-b border-border px-6">
          <Link href="/admin" aria-label="Inventaris prelovedsaerawatt">
            <BrandMark className="text-[21px]" />
          </Link>
        </div>

        <div className="px-4 py-6">
          <p className="px-3 type-mono text-[9px] uppercase tracking-[0.16em] text-text-secondary">
            Back office
          </p>
          <nav aria-label="Navigasi admin" className="mt-3 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center justify-between gap-3 rounded-sm px-3 text-[13px] font-semibold transition-colors",
                    active
                      ? "bg-primary-soft text-primary"
                      : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
                    {item.label}
                  </span>
                  {item.external ? (
                    <ExternalLink className="size-3 opacity-60" aria-hidden="true" />
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-border p-4">
          <div className="rounded-sm bg-surface-muted/60 p-3">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-text-inverse">
                {session.email.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-semibold text-text-primary">
                  {session.email}
                </p>
                <p className="type-mono text-[9px] uppercase tracking-[0.1em] text-text-secondary">
                  {session.isDemo ? "Demo admin" : "Admin"}
                </p>
              </div>
            </div>
            <form action={signOutAction} className="mt-3">
              <button
                type="submit"
                className="flex h-9 w-full items-center justify-center gap-2 rounded-sm border border-border bg-surface text-[10px] font-bold uppercase tracking-[0.08em] text-text-secondary transition-colors hover:border-error/30 hover:text-error"
              >
                <LogOut className="size-3.5" aria-hidden="true" />
                Keluar
              </button>
            </form>
          </div>
          <p className="mt-3 flex items-center gap-1.5 px-1 text-[10px] text-text-secondary">
            <ShieldCheck className="size-3" aria-hidden="true" />
            Akses terbatas · jangan bagikan
          </p>
        </div>
      </aside>

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur-md lg:hidden">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu admin"
              className="flex size-10 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-surface-muted"
            >
              <Menu className="size-5" strokeWidth={1.5} aria-hidden="true" />
            </button>
            <Link href="/admin" aria-label="Inventaris prelovedsaerawatt">
              <BrandMark className="text-[18px]" />
            </Link>
          </div>
          <Link
            href="/admin/produk/baru"
            className="flex h-9 items-center gap-1.5 rounded-sm bg-primary px-3 text-[10px] font-bold uppercase tracking-[0.06em] text-text-inverse"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Produk
          </Link>
        </header>

        {session.isDemo ? (
          <div className="border-b border-warning/20 bg-warning/5 px-4 py-2 text-center text-[10px] leading-relaxed text-warning lg:px-8">
            Mode demo lokal — perubahan disimpan di <code className="font-mono">.data/products.json</code>.
            Jangan aktifkan di produksi.
          </div>
        ) : null}

        {children}
      </div>

      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent variant="sheet" className="p-0" hideClose>
          <DialogTitle className="sr-only">Navigasi admin</DialogTitle>
          <div className="px-6 pb-6 pt-3">
            <div className="mb-4 flex items-center justify-between">
              <BrandMark className="text-xl" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex size-10 items-center justify-center rounded-full text-text-secondary hover:bg-surface-muted"
                aria-label="Tutup menu"
              >
                ×
              </button>
            </div>
            <div className="h-px bg-border" />
            <nav aria-label="Navigasi admin mobile" className="mt-3 flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-14 items-center gap-3 border-b border-border text-[15px] font-semibold text-text-primary"
                >
                  <item.icon className="size-4 text-primary" strokeWidth={1.5} aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <form action={signOutAction} className="mt-6">
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-sm border border-border text-[11px] font-bold uppercase tracking-[0.08em] text-text-secondary"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Keluar dari admin
              </button>
            </form>
            <p className="mt-4 truncate text-center text-[10px] text-text-secondary">
              {session.email}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
