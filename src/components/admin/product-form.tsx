"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import {
  Check,
  ChevronLeft,
  ImageIcon,
  Loader2,
  Save,
  Sparkles,
} from "lucide-react";
import {
  createProductAction,
  updateProductAction,
} from "@/app/actions/products";
import type { Product } from "@/types/product";
import { PRODUCT_CATEGORIES, PRODUCT_SIZES } from "@/types/product";
import { IDLE_ACTION_STATE } from "@/types/action-state";
import { productInputSchema } from "@/schemas/product";
import { describedBy, FormField } from "@/components/ui/form-field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { MediaImage } from "@/components/ui/media-image";
import { ImageUploader } from "@/components/admin/image-uploader";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatIDR } from "@/lib/utils";
import { cn } from "@/lib/utils";

type ProductFormMode = "create" | "edit";

export function ProductForm({
  mode,
  product,
  demo,
  initialRequestId,
}: {
  mode: ProductFormMode;
  product?: Product;
  demo: boolean;
  initialRequestId?: string;
}) {
  const router = useRouter();
  const action = mode === "create" ? createProductAction : updateProductAction;
  const [state, formAction, pending] = useActionState(action, IDLE_ACTION_STATE);
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [size, setSize] = useState(product?.size ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [defectNotes, setDefectNotes] = useState(product?.defectNotes ?? "");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [status, setStatus] = useState(product?.status ?? true);
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [clientErrors, setClientErrors] = useState<Record<string, string[]>>({});
  const requestId = initialRequestId ?? "";

  useEffect(() => {
    if (!dirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  const priceNumber = Number(price) || 0;
  const error = state.status === "error" ? state : null;
  const hasClientErrors = Object.keys(clientErrors).length > 0;
  const fieldError = (field: string) => clientErrors[field]?.[0] ?? error?.fields?.[field]?.[0];
  const saveDisabled = pending || uploading;

  const touch = (field: string) => {
    setDirty(true);
    setClientErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const validateBeforeSubmit = (event: FormEvent<HTMLFormElement>) => {
    const result = productInputSchema.safeParse({
      name,
      price,
      category,
      size,
      description,
      defectNotes,
      status,
      images,
    });
    if (result.success) {
      setClientErrors({});
      return;
    }
    event.preventDefault();
    const fields = z.flattenError(result.error).fieldErrors as Record<string, string[]>;
    setClientErrors(fields);
    const firstField = Object.keys(fields)[0];
    const focusId = firstField === "images" ? "product-images" : firstField;
    window.setTimeout(() => document.getElementById(focusId)?.focus(), 0);
  };

  const cancel = () => {
    if (dirty) {
      setCancelOpen(true);
    } else {
      router.push("/admin");
    }
  };

  const checklist = [
    { label: "Foto cover", done: images.length > 0 },
    { label: "Nama produk", done: name.trim().length >= 3 },
    { label: "Harga", done: priceNumber > 0 },
    { label: "Deskripsi", done: description.trim().length > 0 },
    { label: "Kondisi / defect", done: true },
  ];

  return (
    <>
      <form
        action={formAction}
        onSubmit={validateBeforeSubmit}
        className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-8"
      >
        {mode === "edit" && product ? <input type="hidden" name="id" value={product.id} /> : null}
        {mode === "create" ? <input type="hidden" name="requestId" value={requestId} /> : null}
        <input type="hidden" name="images" value={JSON.stringify(images)} />
        <input type="hidden" name="status" value={status ? "true" : "false"} />

        <div className="space-y-5">
          {error || hasClientErrors ? (
            <div
              role="alert"
              className="rounded-sm border border-error/25 bg-error/5 px-4 py-3 text-sm leading-relaxed text-error"
            >
              {hasClientErrors
                ? "Ada isian yang belum valid. Periksa kolom yang ditandai."
                : error?.message ?? "Ada isian yang belum valid. Periksa kembali."}
            </div>
          ) : null}

          <section className="paper-card p-5 sm:p-6">
            <div className="flex items-start gap-3 border-b border-border pb-4">
              <span className="type-mono text-[10px] text-primary">01</span>
              <div>
                <h2 className="type-h3 text-[21px]">Informasi dasar</h2>
                <p className="mt-1 text-xs text-text-secondary">
                  Nama yang jelas dan harga yang jujur membantu pembeli memutuskan.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-5">
              <FormField
                id="name"
                label="Nama produk"
                required
                error={fieldError("name")}
                hint="Contoh: Kemeja linen sage — vintage 90s"
                counter={`${name.length}/80`}
              >
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    touch("name");
                  }}
                  maxLength={80}
                  placeholder="Kemeja linen sage"
                  autoComplete="off"
                  aria-invalid={Boolean(fieldError("name"))}
                  aria-describedby={describedBy(
                    "name",
                    fieldError("name"),
                    "Contoh: Kemeja linen sage — vintage 90s",
                  )}
                  required
                />
              </FormField>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  id="price"
                  label="Harga"
                  required
                  error={fieldError("price")}
                  hint={priceNumber > 0 ? formatIDR(priceNumber) : "Masukkan angka tanpa titik."}
                >
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-secondary">
                      Rp
                    </span>
                    <Input
                      id="price"
                      name="price"
                      type="text"
                      inputMode="numeric"
                      value={price}
                      onChange={(event) => {
                        setPrice(event.target.value.replace(/\D/g, "").slice(0, 9));
                        touch("price");
                      }}
                      placeholder="185000"
                      className="pl-11 font-mono"
                      aria-invalid={Boolean(fieldError("price"))}
                      aria-describedby={describedBy(
                        "price",
                        fieldError("price"),
                        "Masukkan angka tanpa titik.",
                      )}
                      required
                    />
                  </div>
                </FormField>

                <FormField
                  id="category"
                  label="Kategori"
                  required
                  error={fieldError("category")}
                >
                  <Select
                    id="category"
                    name="category"
                    value={category}
                    onChange={(event) => {
                      setCategory(event.target.value);
                      touch("category");
                    }}
                    aria-invalid={Boolean(fieldError("category"))}
                    aria-describedby={describedBy("category", fieldError("category"))}
                    required
                  >
                    <option value="" disabled>
                      Pilih kategori
                    </option>
                    {PRODUCT_CATEGORIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  id="size"
                  label="Ukuran label"
                  required
                  error={fieldError("size")}
                  hint="Gunakan ukuran yang tertulis di label, bukan estimasi."
                >
                  <Select
                    id="size"
                    name="size"
                    value={size}
                    onChange={(event) => {
                      setSize(event.target.value);
                      touch("size");
                    }}
                    aria-invalid={Boolean(fieldError("size"))}
                    aria-describedby={describedBy(
                      "size",
                      fieldError("size"),
                      "Gunakan ukuran yang tertulis di label, bukan estimasi.",
                    )}
                    required
                  >
                    <option value="" disabled>
                      Pilih ukuran
                    </option>
                    {PRODUCT_SIZES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <div className="rounded-sm border border-border bg-surface-muted/45 p-4">
                  <p className="type-mono text-[9px] uppercase tracking-[0.12em] text-text-secondary">
                    SKU
                  </p>
                  <p className="mt-2 font-mono text-sm text-text-primary">
                    {product?.sku ?? "Dibuat otomatis"}
                  </p>
                  <p className="mt-1 text-[10px] leading-relaxed text-text-secondary">
                    {product?.sku
                      ? "SKU tidak berubah saat produk diedit."
                      : "Format PSW-YYMM-XXX mengikuti bulan produk dibuat."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="paper-card p-5 sm:p-6">
            <div className="flex items-start gap-3 border-b border-border pb-4">
              <span className="type-mono text-[10px] text-primary">02</span>
              <div>
                <h2 className="type-h3 text-[21px]">Cerita & kondisi</h2>
                <p className="mt-1 text-xs text-text-secondary">
                  Tulis apa adanya. Pembeli yang tahu kondisi cenderung tidak kecewa.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-5">
              <FormField
                id="description"
                label="Deskripsi"
                required
                error={fieldError("description")}
                hint="Bahan, potongan, ukuran aktual, dan detail yang perlu diketahui."
                counter={`${description.length}/2000`}
              >
                <Textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    touch("description");
                  }}
                  rows={7}
                  maxLength={2000}
                  placeholder="Kemeja linen warna sage, potongan relaxed. Bahan tebal dan adem, cocok untuk daily. Ukuran di label M; lingkar dada sekitar 104 cm."
                  aria-invalid={Boolean(fieldError("description"))}
                  aria-describedby={describedBy(
                    "description",
                    fieldError("description"),
                    "Bahan, potongan, ukuran aktual, dan detail yang perlu diketahui.",
                  )}
                  required
                />
              </FormField>

              <FormField
                id="defectNotes"
                label="Catatan kondisi & defect"
                error={fieldError("defectNotes")}
                hint="Sebutkan semua defect, sekecil apa pun. Kosongkan jika tidak ada defect signifikan."
                counter={`${defectNotes.length}/500`}
              >
                <Textarea
                  id="defectNotes"
                  name="defectNotes"
                  value={defectNotes}
                  onChange={(event) => {
                    setDefectNotes(event.target.value);
                    touch("defectNotes");
                  }}
                  rows={4}
                  maxLength={500}
                  placeholder="Ada bercak samar 1 cm di bagian dalam kerah, tidak terlihat saat dipakai. Kancing lengkap."
                  className="min-h-24"
                  aria-invalid={Boolean(fieldError("defectNotes"))}
                  aria-describedby={describedBy(
                    "defectNotes",
                    fieldError("defectNotes"),
                    "Sebutkan semua defect, sekecil apa pun. Kosongkan jika tidak ada defect signifikan.",
                  )}
                />
              </FormField>

              <div className="flex items-start gap-2.5 rounded-sm border border-primary/20 bg-primary-soft/55 p-3 text-xs leading-relaxed text-text-secondary">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                Kejujuran adalah bagian dari kurasi. Defect kecil yang ditulis membuat pembeli
                percaya dan mengurangi risiko retur.
              </div>
            </div>
          </section>

          <section className="paper-card p-5 sm:p-6">
            <div className="flex items-start gap-3 border-b border-border pb-4">
              <span className="type-mono text-[10px] text-primary">03</span>
              <div>
                <h2 className="type-h3 text-[21px]">Foto</h2>
                <p className="mt-1 text-xs text-text-secondary">
                  Foto pertama adalah cover di katalog. Gunakan cahaya alami, tanpa filter warna.
                </p>
              </div>
            </div>
            <div className="mt-5">
              <ImageUploader
                images={images}
                onChange={(next) => {
                  setImages(next);
                  touch("images");
                }}
                demo={demo}
                error={fieldError("images")}
                onUploadingChange={setUploading}
              />
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-[calc(var(--header-height)+20px)]">
          <section className="paper-card overflow-hidden">
            <div className="border-b border-border bg-surface-muted/40 px-4 py-3">
              <p className="type-mono text-[9px] uppercase tracking-[0.14em] text-text-secondary">
                Pratinjau
              </p>
            </div>
            <div className="p-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-border bg-surface-muted">
                {images[0] ? (
                  <MediaImage src={images[0]} alt="Cover pratinjau produk" sizes="280px" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-text-secondary">
                    <ImageIcon className="size-6" strokeWidth={1.2} aria-hidden="true" />
                    <span className="text-[10px]">Belum ada foto</span>
                  </div>
                )}
                <span
                  className={cn(
                    "absolute left-2 top-2 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em]",
                    status
                      ? "bg-secondary text-text-inverse"
                      : "bg-text-primary/80 text-text-inverse",
                  )}
                >
                  {status ? "Tersedia" : "Terjual"}
                </span>
              </div>
              <p className="mt-3 truncate font-serif text-lg">
                {name.trim() || "Nama produk"}
              </p>
              <p className="mt-1 text-xs text-text-secondary">
                {category || "Kategori"} {size ? `· ${size}` : ""}
              </p>
              <p className="type-price mt-2 text-xl">
                {priceNumber > 0 ? formatIDR(priceNumber) : "Rp —"}
              </p>
            </div>
          </section>

          <section className="paper-card p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[13px] font-semibold">Tersedia untuk dijual</p>
                <p className="mt-1 text-[11px] leading-relaxed text-text-secondary">
                  Matikan jika piece sudah terjual. Produk tetap tampil dengan label Terjual.
                </p>
              </div>
              <Switch
                checked={status}
                onCheckedChange={(checked) => {
                  setStatus(checked);
                  touch("status");
                }}
                aria-label={status ? "Tandai produk terjual" : "Tandai produk tersedia"}
              />
            </div>
          </section>

          <section className="paper-card p-4">
            <p className="type-mono text-[9px] uppercase tracking-[0.14em] text-text-secondary">
              Kelengkapan
            </p>
            <ul className="mt-3 space-y-2">
              {checklist.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-xs">
                  <span
                    className={cn(
                      "flex size-4 items-center justify-center rounded-full border",
                      item.done
                        ? "border-secondary bg-secondary text-text-inverse"
                        : "border-border-strong text-transparent",
                    )}
                  >
                    <Check className="size-2.5" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <span className={item.done ? "text-text-primary" : "text-text-secondary"}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <div className="space-y-2">
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={pending}
              disabled={saveDisabled}
              iconLeft={pending || uploading ? undefined : <Save className="size-4" />}
            >
              {uploading ? "Menunggu foto..." : pending ? "Menyimpan..." : "Simpan produk"}
            </Button>
            <Button type="button" variant="outline" fullWidth onClick={cancel}>
              Batal
            </Button>
            {uploading ? (
              <p
                role="status"
                className="flex items-center justify-center gap-1.5 text-[10px] text-text-secondary"
              >
                <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                Tunggu upload foto selesai.
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={cancel}
            className="flex w-full items-center justify-center gap-1.5 py-1 text-[11px] font-semibold text-text-secondary transition-colors hover:text-primary"
          >
            <ChevronLeft className="size-3.5" aria-hidden="true" />
            Kembali ke inventaris
          </button>
        </aside>
      </form>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent variant="confirm">
          <DialogTitle className="type-h3">Buang perubahan?</DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed text-text-secondary">
            Isian yang belum disimpan akan hilang. Kalau hanya ingin melihat katalog, buka di tab
            lain.
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Lanjut mengedit
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                setCancelOpen(false);
                router.push("/admin");
              }}
            >
              Buang & kembali
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
