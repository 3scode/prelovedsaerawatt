"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";
import {
  deleteProductAction,
  toggleProductStatusAction,
} from "@/app/actions/products";
import { formatIDR } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MediaImage } from "@/components/ui/media-image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

export function ProductTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [items, setItems] = useState(products);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const toggleStatus = async (product: Product, nextStatus: boolean) => {
    setPendingIds((current) => new Set(current).add(product.id));
    setItems((current) =>
      current.map((item) => (item.id === product.id ? { ...item, status: nextStatus } : item)),
    );

    const result = await toggleProductStatusAction(product.id, nextStatus);
    setPendingIds((current) => {
      const next = new Set(current);
      next.delete(product.id);
      return next;
    });

    if (!result.ok) {
      setItems((current) =>
        current.map((item) =>
          item.id === product.id ? { ...item, status: product.status } : item,
        ),
      );
      toast({
        variant: "error",
        title: "Status gagal diubah",
        description: result.message ?? "Coba lagi sebentar.",
      });
      return;
    }

    toast({
      variant: "success",
      title: nextStatus ? "Ditandai tersedia" : "Ditandai terjual",
      description: product.name,
    });
    router.refresh();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteProductAction(deleteTarget.id);
    if (!result.ok) {
      setDeleting(false);
      toast({
        variant: "error",
        title: "Produk gagal dihapus",
        description: result.message ?? "Coba lagi sebentar.",
      });
      return;
    }
    setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
    setDeleting(false);
    toast({ variant: "success", title: "Produk dihapus", description: "Katalog sudah diperbarui." });
    router.refresh();
  };

  return (
    <>
      <div className="mt-4 hidden overflow-hidden rounded-md border border-border bg-surface md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50">
                <th scope="col" className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-text-secondary">
                  Produk
                </th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-text-secondary">
                  Kategori / Ukuran
                </th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-text-secondary">
                  Harga
                </th>
                <th scope="col" className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-text-secondary">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-[0.1em] text-text-secondary">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((product) => {
                const pending = pendingIds.has(product.id);
                return (
                  <tr key={product.id} className="group transition-colors hover:bg-surface-muted/25">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/produk/${product.id}/edit`}
                          className="relative aspect-[4/5] w-11 shrink-0 overflow-hidden rounded-xs border border-border bg-surface-muted"
                          aria-label={`Edit ${product.name}`}
                        >
                          <MediaImage
                            src={product.images[0] ?? "/images/placeholder.svg"}
                            alt=""
                            sizes="44px"
                          />
                        </Link>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/produk/${product.id}/edit`}
                            className="block max-w-[240px] truncate text-[13px] font-semibold text-text-primary hover:text-primary"
                          >
                            {product.name}
                          </Link>
                          <p className="type-mono mt-0.5 text-[9px] text-text-secondary">
                            {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs text-text-primary">{product.category}</p>
                      <p className="mt-0.5 text-[11px] text-text-secondary">Ukuran {product.size}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-semibold tabular-nums">{formatIDR(product.price)}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Switch
                          checked={product.status}
                          onCheckedChange={(checked) => void toggleStatus(product, checked)}
                          disabled={pending}
                          aria-label={
                            product.status
                              ? `Tandai ${product.name} terjual`
                              : `Tandai ${product.name} tersedia`
                          }
                        />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-text-secondary">
                          {product.status ? "Tersedia" : "Terjual"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/produk/${product.id}/edit`}
                          className="flex size-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-primary-soft hover:text-primary"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil className="size-3.5" aria-hidden="true" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(product)}
                          className="flex size-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-error/10 hover:text-error"
                          aria-label={`Hapus ${product.name}`}
                        >
                          <Trash2 className="size-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 space-y-3 md:hidden">
        {items.map((product) => {
          const pending = pendingIds.has(product.id);
          return (
            <article key={product.id} className="rounded-md border border-border bg-surface p-3">
              <div className="flex gap-3">
                <Link
                  href={`/admin/produk/${product.id}/edit`}
                  className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-sm border border-border bg-surface-muted"
                  aria-label={`Edit ${product.name}`}
                >
                  <MediaImage
                    src={product.images[0] ?? "/images/placeholder.svg"}
                    alt=""
                    sizes="64px"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/admin/produk/${product.id}/edit`}
                        className="block truncate text-[13px] font-semibold text-text-primary"
                      >
                        {product.name}
                      </Link>
                      <p className="type-mono mt-0.5 text-[9px] text-text-secondary">{product.sku}</p>
                    </div>
                    <p className="shrink-0 text-xs font-semibold tabular-nums">{formatIDR(product.price)}</p>
                  </div>
                  <p className="mt-1.5 text-[11px] text-text-secondary">
                    {product.category} · Ukuran {product.size}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        size="sm"
                        checked={product.status}
                        onCheckedChange={(checked) => void toggleStatus(product, checked)}
                        disabled={pending}
                        aria-label={
                          product.status
                            ? `Tandai ${product.name} terjual`
                            : `Tandai ${product.name} tersedia`
                        }
                      />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-text-secondary">
                        {product.status ? "Tersedia" : "Terjual"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/produk/${product.id}/edit`}
                        className="flex size-8 items-center justify-center rounded-full text-text-secondary hover:bg-primary-soft hover:text-primary"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Pencil className="size-3.5" aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(product)}
                        className="flex size-8 items-center justify-center rounded-full text-text-secondary hover:bg-error/10 hover:text-error"
                        aria-label={`Hapus ${product.name}`}
                      >
                        <Trash2 className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null);
        }}
      >
        <DialogContent variant="confirm">
          <DialogTitle className="type-h3">Hapus produk?</DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed text-text-secondary">
            {deleteTarget ? (
              <>
                <strong className="text-text-primary">{deleteTarget.name}</strong> akan dihapus
                permanen dari katalog. Tindakan ini tidak bisa dibatalkan.
              </>
            ) : (
              "Produk akan dihapus permanen dari katalog."
            )}
          </DialogDescription>
          <div className="mt-4 rounded-sm border border-error/20 bg-error/5 p-3 text-xs text-error">
            Data produk, foto, dan SKU akan hilang. Riwayat penjualan tidak disimpan di aplikasi
            ini.
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={deleting}>
                Batal
              </Button>
            </DialogClose>
            <Button type="button" variant="danger" loading={deleting} onClick={() => void confirmDelete()}>
              <Trash2 className="size-4" aria-hidden="true" />
              Hapus permanen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
