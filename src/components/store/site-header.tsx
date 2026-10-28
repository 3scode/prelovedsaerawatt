"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, ArrowUpRight, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { NewsletterMark } from "@/components/store/brand-mark";
import { CartBadge } from "@/components/store/cart-badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/shop", label: "Katalog" },
  { href: "/tentang", label: "Tentang" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuState, setMenuState] = useState({ open: false, at: pathname });
  const [searchState, setSearchState] = useState({ open: false, at: pathname });
  const menuOpen = menuState.open && menuState.at === pathname;
  const searchOpen = searchState.open && searchState.at === pathname;
  const setMenuOpen = (open: boolean) => setMenuState({ open, at: pathname });
  const setSearchOpen = (open: boolean) => setSearchState({ open, at: pathname });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="bg-secondary text-text-inverse">
        <div className="container-page flex h-8 items-center justify-between gap-4">
          <p className="type-caption truncate text-[10px] tracking-[0.12em] uppercase opacity-90">
            Dikurasi manual · Kondisi jujur · Checkout via WhatsApp
          </p>
          <Link
            href="/shop?hideSold=1"
            className="hidden items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] opacity-90 transition-opacity hover:opacity-100 sm:flex"
          >
            Lihat yang tersedia
            <ArrowUpRight className="size-3" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-200",
          scrolled
            ? "border-border bg-surface/95 shadow-sm backdrop-blur-md"
            : "border-transparent bg-background/85 backdrop-blur-sm",
        )}
      >
        <div className="container-page flex h-[var(--header-height)] items-center justify-between gap-4">
          <div className="flex items-center gap-8 lg:gap-12">
            <Link href="/" aria-label="prelovedsaerawatt — Beranda" className="group shrink-0">
              <NewsletterMark className="text-[19px] sm:text-[22px]" />
            </Link>

            <nav aria-label="Navigasi utama" className="hidden items-center gap-7 md:flex">
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative py-2 text-[12px] font-semibold tracking-[0.04em] text-text-secondary transition-colors hover:text-text-primary",
                      active && "text-text-primary",
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        "absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-primary transition-transform duration-200",
                        active && "scale-x-100",
                      )}
                      aria-hidden="true"
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <form
              action="/shop"
              role="search"
              aria-label="Cari produk"
              className="hidden items-center gap-2 rounded-full border border-border bg-surface pl-3 pr-1 transition-colors focus-within:border-primary lg:flex"
            >
              <Search className="size-3.5 text-text-secondary" aria-hidden="true" />
              <input
                type="search"
                name="q"
                placeholder="Cari piece..."
                aria-label="Cari produk"
                className="h-9 w-32 bg-transparent text-xs outline-none placeholder:text-text-secondary xl:w-44"
              />
              <button
                type="submit"
                className="flex h-8 items-center rounded-full bg-primary-soft px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-primary transition-colors hover:bg-highlight"
              >
                Cari
              </button>
            </form>

            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-expanded={searchOpen}
              aria-controls="mobile-search"
              aria-label="Buka pencarian"
              className="flex size-11 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-primary-soft lg:hidden"
            >
              <Search className="size-5" strokeWidth={1.5} aria-hidden="true" />
            </button>

            <Link
              href="/keranjang"
              className="relative flex size-11 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-primary-soft"
              aria-label="Keranjang belanja"
            >
              <ShoppingBag className="size-5" strokeWidth={1.5} aria-hidden="true" />
              <CartBadge />
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Buka menu navigasi"
              className="flex size-11 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-primary-soft md:hidden"
            >
              <Menu className="size-5" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>

        {searchOpen ? (
          <div id="mobile-search" className="border-t border-border bg-surface px-5 py-3 lg:hidden">
            <form action="/shop" role="search" aria-label="Cari produk" className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text-secondary"
                aria-hidden="true"
              />
              <input
                type="search"
                name="q"
                autoFocus
                placeholder="Cari nama produk atau kategori..."
                aria-label="Cari produk"
                className="field-base h-11 pl-10 pr-24"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 flex h-8 -translate-y-1/2 items-center rounded-sm bg-primary px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-text-inverse"
              >
                Cari
              </button>
            </form>
          </div>
        ) : null}
      </header>

      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent variant="sheet" className="p-0" hideClose>
          <DialogTitle className="sr-only">Navigasi utama</DialogTitle>
          <div className="px-6 pb-6 pt-3">
            <div className="mb-4 flex items-center justify-between">
              <NewsletterMark className="text-xl" />
              <DialogCloseButton onClose={() => setMenuOpen(false)} />
            </div>
            <div className="mb-6 h-px bg-border" />
            <nav aria-label="Navigasi mobile" className="flex flex-col">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between border-b border-border py-4 font-serif text-2xl text-text-primary transition-colors hover:text-primary"
                >
                  <span>{item.label}</span>
                  <span className="type-mono text-text-secondary">0{index + 1}</span>
                </Link>
              ))}
              <Link
                href="/keranjang"
                className="group flex items-center justify-between border-b border-border py-4 font-serif text-2xl text-text-primary transition-colors hover:text-primary"
              >
                <span>Keranjang</span>
                <span className="type-mono text-text-secondary">04</span>
              </Link>
            </nav>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                href="/tentang#cara-belanja"
                className="flex items-center justify-center gap-2 rounded-sm border border-border-strong px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-primary"
              >
                Cara belanja
              </Link>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-sm bg-primary px-4 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-text-inverse"
              >
                <InstagramIcon className="size-3.5" />
                Instagram
              </a>
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-text-secondary">
              <MessageCircle className="size-3.5" aria-hidden="true" />
              Checkout & tanya stok via WhatsApp
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function DialogCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="flex size-11 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-muted"
      aria-label="Tutup menu"
    >
      <span className="text-lg" aria-hidden="true">
        ×
      </span>
    </button>
  );
}
