"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Check,
  Copy,
  Info,
  Loader2,
  MessageCircle,
  RefreshCw,
  Trash2,
  Truck,
} from "lucide-react";
import type { CartItem } from "@/types/product";
import {
  selectCartTotal,
  useCartStore,
} from "@/stores/cart";
import { validateCart } from "@/lib/cart-validation";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { formatIDR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ToteIllustration } from "@/components/ui/illustrations";
import { MediaImage } from "@/components/ui/media-image";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export function CartView() {
  const hydrated = useCartStore((state) => state.hydrated);
  const items = useCartStore((state) => state.items);
  const validation = useCartStore((state) => state.validation);
  const total = useCartStore(selectCartTotal);
  const removeItem = useCartStore((state) => state.removeItem);
  const restoreItem = useCartStore((state) => state.restoreItem);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const { toast } = useToast();

  useEffect(() => {
    if (!hydrated) return;
    void validateCart();
  }, [hydrated]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const soldOutCount = items.filter((item) => !item.status).length;
  const stale = validation.validatedAt
    ? now - validation.validatedAt > 5 * 60 * 1000
    : true;
  const ready =
    Boolean(items.length) &&
    !validation.validating &&
    !validation.error &&
    !stale &&
    soldOutCount === 0;

  const message = useMemo(() => buildWhatsAppMessage(items), [items]);
  const whatsappUrl = useMemo(() => buildWhatsAppUrl(message), [message]);

  const handleRemove = (item: CartItem) => {
    const removed = removeItem(item.productId);
    if (!removed) return;
    toast({
      variant: "undo",
      title: `${item.name} dihapus`,
      description: "Bisa dikembalikan kalau berubah pikiran.",
      action: {
        label: "Batalkan",
        onClick: () => {
          restoreItem(removed);
          window.setTimeout(() => void validateCart(true), 0);
        },
      },
    });
    window.setTimeout(() => void validateCart(true), 0);
  };

  if (!hydrated) {
    return <CartSkeleton />;
  }

  if (!items.length) {
    return (
      <div className="container-page py-10 sm:py-14">
        <div className="rounded-md border border-dashed border-border bg-surface/60">
          <EmptyState
            illustration={<ToteIllustration />}
            title="Keranjang masih lapang."
            description="Belum ada piece yang kamu simpan. Koleksi berganti tiap minggu — mulai dari yang paling baru."
            primaryAction={{ label: "Jelajahi koleksi", href: "/shop" }}
            secondaryAction={{ label: "Cara belanja", href: "/tentang#cara-belanja" }}
            headingLevel="h1"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container-page py-8 pb-32 sm:py-12 lg:pb-20">
        <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-primary" aria-hidden="true" />
              <p className="type-eyebrow text-primary">Keranjang</p>
            </div>
            <h1 className="type-h1 mt-3">Keranjang</h1>
            <p className="mt-2 text-sm text-text-secondary">
              {items.length} piece · Setiap piece cuma satu. Qty selalu 1.
            </p>
          </div>
          <Link href="/shop" className="link-editorial text-primary">
            Lanjut belanja
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </header>

        <div className="mt-7 grid items-start gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
          <div>
            <ValidationNotice
              validation={validation}
              stale={stale}
              soldOutCount={soldOutCount}
              onRetry={() => void validateCart(true)}
            />

            <div className="divide-y divide-border border-y border-border">
              {items.map((item) => (
                <CartLine key={item.productId} item={item} onRemove={() => handleRemove(item)} />
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Check className="size-3.5 text-secondary" aria-hidden="true" />
                Harga sudah termasuk kondisi apa adanya.
              </span>
              <Link href="/tentang#faq" className="underline underline-offset-4 hover:text-primary">
                Baca kebijakan retur
              </Link>
            </div>
          </div>

          <aside aria-label="Ringkasan keranjang" className="lg:sticky lg:top-[calc(var(--header-height)+24px)]">
            <div className="rounded-md border border-border bg-surface p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl">Ringkasan</h2>
                <span className="type-mono text-[10px] text-text-secondary">
                  {items.length} item
                </span>
              </div>

              <dl className="mt-5 space-y-3 border-b border-border pb-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-text-secondary">Subtotal</dt>
                  <dd className="font-semibold tabular-nums">{formatIDR(total)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="flex items-center gap-1.5 text-text-secondary">
                    <Truck className="size-3.5" aria-hidden="true" />
                    Ongkir
                  </dt>
                  <dd className="text-xs text-text-secondary">Dihitung admin</dd>
                </div>
              </dl>

              <div className="flex items-baseline justify-between gap-4 pt-4">
                <p className="text-[13px] font-bold uppercase tracking-[0.08em]">Total</p>
                <p className="type-price text-[26px]">{formatIDR(total)}</p>
              </div>

              {validation.error ? (
                <div className="mt-4 flex items-start gap-2 rounded-sm border border-error/20 bg-error/5 p-3 text-xs text-error">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <p>Status stok belum bisa dipastikan. Cek ulang sebelum checkout.</p>
                </div>
              ) : null}

              {soldOutCount > 0 ? (
                <div className="mt-4 flex items-start gap-2 rounded-sm border border-warning/25 bg-warning/5 p-3 text-xs text-warning">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <p>Ada {soldOutCount} piece yang sudah terjual. Hapus dulu untuk lanjut.</p>
                </div>
              ) : null}

              {stale && !validation.validating && !validation.error ? (
                <div className="mt-4 flex items-start gap-2 rounded-sm border border-border bg-surface-muted/60 p-3 text-xs text-text-secondary">
                  <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <p>Stok perlu dicek ulang sebelum checkout.</p>
                </div>
              ) : null}

              <div className="mt-5">
                {validation.validating ? (
                  <Button size="lg" fullWidth loading>
                    Mengecek stok
                  </Button>
                ) : ready ? (
                  <Button size="lg" fullWidth onClick={() => setSheetOpen(true)}>
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Checkout via WhatsApp
                  </Button>
                ) : (
                  <Button size="lg" fullWidth variant="secondary" onClick={() => void validateCart(true)}>
                    <RefreshCw className="size-4" aria-hidden="true" />
                    Cek ulang stok
                  </Button>
                )}
              </div>

              <p className="mt-3 text-center text-[11px] leading-relaxed text-text-secondary">
                Tidak perlu akun. Nama dan alamat dilengkapi di WhatsApp.
              </p>

              <div className="mt-5 border-t border-border pt-4">
                <p className="type-mono text-[9px] uppercase tracking-[0.12em] text-text-secondary">
                  Cara checkout
                </p>
                <ol className="mt-3 space-y-2.5">
                  {["Periksa piece & total", "Buka preview WhatsApp", "Konfirmasi stok & ongkir"].map(
                    (step, index) => (
                      <li key={step} className="flex items-center gap-2.5 text-xs text-text-secondary">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-background type-mono text-[9px]">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ),
                  )}
                </ol>
              </div>
            </div>

            <div className="mt-3 flex items-start gap-2 px-1 text-[11px] leading-relaxed text-text-secondary">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              Satu piece bisa diambil orang lain sebelum admin mengonfirmasi. Checkout lebih awal
              membantu.
            </div>
          </aside>
        </div>
      </div>

      <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-4 pt-3 shadow-[0_-8px_24px_rgba(43,38,34,0.08)] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="type-mono text-[9px] uppercase tracking-[0.1em] text-text-secondary">
              Total · {items.length} piece
            </p>
            <p className="type-price text-xl">{formatIDR(total)}</p>
          </div>
          {ready ? (
            <Button onClick={() => setSheetOpen(true)} className="max-w-[58%]">
              <MessageCircle className="size-4" aria-hidden="true" />
              Checkout
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={() => void validateCart(true)}
              className="max-w-[58%]"
              loading={validation.validating}
            >
              Cek stok
            </Button>
          )}
        </div>
      </div>

      <Dialog open={sheetOpen} onOpenChange={setSheetOpen}>
        <DialogContent variant="sheet" className="p-0">
          <div className="border-b border-border px-6 pb-4 pt-3">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" aria-hidden="true" />
            <DialogTitle className="type-h3">Review pesanan</DialogTitle>
            <DialogDescription className="mt-1 text-xs leading-relaxed text-text-secondary">
              Periksa sekali lagi. Pesan ini akan terbuka di WhatsApp admin.
            </DialogDescription>
          </div>
          <div className="max-h-[48vh] overflow-y-auto px-6 py-4">
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.productId} className="flex items-start justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text-primary">{item.name}</p>
                    <p className="type-mono mt-0.5 text-[10px] text-text-secondary">
                      {item.sku} · {item.size}
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold tabular-nums">{formatIDR(item.price)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
              <span className="text-[12px] font-bold uppercase tracking-[0.08em]">Total</span>
              <span className="type-price text-xl">{formatIDR(total)}</span>
            </div>
            <div className="mt-3 rounded-sm bg-surface-muted/70 p-3">
              <p className="type-mono text-[9px] uppercase tracking-[0.12em] text-text-secondary">
                Pesan yang akan dikirim
              </p>
              <pre className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap font-sans text-[11px] leading-relaxed text-text-secondary">
                {message}
              </pre>
            </div>
          </div>
          <div className="border-t border-border px-6 py-4 safe-bottom">
            <p className="mb-3 text-center text-[11px] leading-relaxed text-text-secondary">
              Lengkapi nama dan alamat di chat. Admin akan mengonfirmasi ongkir.
            </p>
            <div className="space-y-2">
              {whatsappUrl ? (
                <Button asChild variant="whatsapp" size="lg" fullWidth>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Buka WhatsApp
                  </a>
                </Button>
              ) : (
                <div className="rounded-sm border border-error/20 bg-error/5 p-3 text-xs text-error">
                  Nomor WhatsApp admin belum dikonfigurasi. Hubungi kami lewat Instagram.
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(message);
                      toast({ variant: "success", title: "Pesan disalin" });
                    } catch {
                      toast({ variant: "error", title: "Gagal menyalin pesan" });
                    }
                  }}
                >
                  <Copy className="size-3.5" aria-hidden="true" />
                  Salin pesan
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Tutup</Button>
                </DialogClose>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ValidationNotice({
  validation,
  stale,
  soldOutCount,
  onRetry,
}: {
  validation: ReturnType<typeof useCartStore.getState>["validation"];
  stale: boolean;
  soldOutCount: number;
  onRetry: () => void;
}) {
  if (validation.validating) {
    return (
      <div
        role="status"
        className="mb-5 flex items-center gap-2.5 rounded-sm border border-border bg-surface px-4 py-3 text-xs text-text-secondary"
      >
        <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
        Mengecek ketersediaan dan harga terbaru...
      </div>
    );
  }

  if (validation.error) {
    return (
      <div
        role="alert"
        className="mb-5 flex flex-col gap-3 rounded-sm border border-error/20 bg-error/5 px-4 py-3 text-xs text-error sm:flex-row sm:items-center sm:justify-between"
      >
        <span className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Status stok belum bisa dicek. Data di keranjang mungkin sudah berubah.
        </span>
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 text-left font-bold underline underline-offset-4 sm:text-right"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="mb-5 space-y-2">
      {validation.missingIds.length ? (
        <div className="flex items-start gap-2 rounded-sm border border-warning/25 bg-warning/5 px-4 py-3 text-xs text-warning">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {validation.missingIds.length} piece sudah tidak ada di katalog dan telah dihapus dari
          keranjang.
        </div>
      ) : null}
      {validation.changedPriceIds.length ? (
        <div className="flex items-start gap-2 rounded-sm border border-border bg-surface px-4 py-3 text-xs text-text-secondary">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Harga {validation.changedPriceIds.length} piece diperbarui mengikuti katalog terbaru.
        </div>
      ) : null}
      {soldOutCount > 0 ? (
        <div className="flex items-start gap-2 rounded-sm border border-warning/25 bg-warning/5 px-4 py-3 text-xs text-warning">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {soldOutCount} piece sudah terjual. Hapus dari keranjang untuk melanjutkan checkout.
        </div>
      ) : null}
      {stale && validation.validatedAt ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-border bg-surface px-4 py-3 text-xs text-text-secondary">
          <span className="flex items-center gap-2">
            <Info className="size-4 shrink-0" aria-hidden="true" />
            Stok terakhir dicek lebih dari 5 menit lalu.
          </span>
          <button
            type="button"
            onClick={onRetry}
            className="font-bold text-primary underline underline-offset-4"
          >
            Cek ulang
          </button>
        </div>
      ) : null}
    </div>
  );
}

function CartLine({ item, onRemove }: { item: CartItem; onRemove: () => void }) {
  return (
    <article className="flex gap-4 py-5 sm:gap-5">
      <Link
        href={`/produk/${item.slug}`}
        className="relative aspect-[4/5] w-[84px] shrink-0 overflow-hidden rounded-sm border border-border bg-surface-muted sm:w-[104px]"
        aria-label={`Lihat ${item.name}`}
      >
        <MediaImage
          src={item.image}
          alt={`Foto ${item.name}`}
          sizes="104px"
          className={!item.status ? "saturate-[0.5] opacity-80" : undefined}
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="type-mono text-[10px] uppercase tracking-[0.08em] text-text-secondary">
              {item.sku}
            </p>
            <Link
              href={`/produk/${item.slug}`}
              className="mt-1 block font-serif text-[19px] leading-snug text-text-primary transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          </div>
          <StatusBadge status={item.status} />
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
          <span>Ukuran {item.size}</span>
          <span className="size-0.5 rounded-full bg-border-strong" aria-hidden="true" />
          <span>Qty 1</span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <p className="type-price text-[20px] sm:text-[22px]">{formatIDR(item.price)}</p>
          <button
            type="button"
            onClick={onRemove}
            className="flex h-9 items-center gap-1.5 text-[11px] font-semibold text-text-secondary underline decoration-border-strong underline-offset-4 transition-colors hover:text-error"
            aria-label={`Hapus ${item.name} dari keranjang`}
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            Hapus
          </button>
        </div>

        {!item.status ? (
          <p className="mt-2 text-[11px] text-warning">
            Sudah terjual. Hapus untuk melanjutkan checkout piece lain.
          </p>
        ) : null}
      </div>
    </article>
  );
}

function CartSkeleton() {
  return (
    <div className="container-page py-8 sm:py-12" aria-busy="true" aria-label="Memuat keranjang">
      <div className="border-b border-border pb-6">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-4 h-12 w-52" />
        <Skeleton className="mt-3 h-4 w-64" />
      </div>
      <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="divide-y divide-border border-y border-border">
          {[0, 1].map((item) => (
            <div key={item} className="flex gap-4 py-5">
              <Skeleton className="aspect-[4/5] w-[84px] rounded-sm" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-80 rounded-md" />
      </div>
    </div>
  );
}
