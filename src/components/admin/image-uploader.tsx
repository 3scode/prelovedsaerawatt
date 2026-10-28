"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Star, Trash2, UploadCloud } from "lucide-react";
import { MediaImage } from "@/components/ui/media-image";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  demo: boolean;
  error?: string;
  onUploadingChange?: (uploading: boolean) => void;
}

async function compressImage(file: File): Promise<File> {
  if (typeof createImageBitmap === "undefined") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const maxDimension = 1500;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 1.2 * 1024 * 1024) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return file;
    }
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82),
    );
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
      type: "image/jpeg",
    });
  } catch {
    return file;
  }
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({
  images,
  onChange,
  demo,
  error,
  onUploadingChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [dragging, setDragging] = useState(false);
  const { toast } = useToast();

  const setBusy = (count: number) => {
    setUploading(count);
    onUploadingChange?.(count > 0);
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const signResponse = await fetch("/api/cloudinary/sign", { method: "POST" });
    const signPayload = (await signResponse.json().catch(() => null)) as
      | {
          success: boolean;
          data?: {
            cloudName: string;
            apiKey: string;
            timestamp: number;
            folder: string;
            allowedFormats: string;
            signature: string;
          };
          error?: { message?: string };
        }
      | null;
    if (!signResponse.ok || !signPayload?.success || !signPayload.data) {
      throw new Error(signPayload?.error?.message || "Gagal menyiapkan upload.");
    }
    const signed = signPayload.data;
    const body = new FormData();
    body.append("file", file);
    body.append("api_key", signed.apiKey);
    body.append("timestamp", String(signed.timestamp));
    body.append("folder", signed.folder);
    body.append("allowed_formats", signed.allowedFormats);
    body.append("signature", signed.signature);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`,
      { method: "POST", body },
    );
    const uploadPayload = (await uploadResponse.json().catch(() => null)) as
      | { secure_url?: string; error?: { message?: string } }
      | null;
    if (!uploadResponse.ok || !uploadPayload?.secure_url) {
      throw new Error(uploadPayload?.error?.message || "Upload foto gagal.");
    }
    return uploadPayload.secure_url;
  };

  const handleFiles = async (files: FileList | File[]) => {
    const incoming = [...files];
    const slots = Math.max(0, 8 - images.length);
    if (slots === 0) {
      toast({ variant: "error", title: "Maksimal 8 foto" });
      return;
    }
    const selected = incoming.slice(0, slots);
    const skippedCount = incoming.length - selected.length;
    if (skippedCount > 0) {
      toast({ variant: "info", title: `Hanya ${slots} foto pertama yang ditambahkan` });
    }

    setBusy(selected.length);
    const uploaded: string[] = [];
    for (const file of selected) {
      if (!ACCEPTED.includes(file.type)) {
        toast({
          variant: "error",
          title: "Format tidak didukung",
          description: "Gunakan JPG, PNG, atau WebP.",
        });
        continue;
      }
      if (file.size > MAX_BYTES) {
        toast({
          variant: "error",
          title: "Foto terlalu besar",
          description: "Maksimal 5 MB per foto.",
        });
        continue;
      }
      try {
        if (demo) {
          const compressed = await compressImage(file);
          const dataUrl = await fileToDataUrl(compressed);
          await new Promise((resolve) => setTimeout(resolve, 180));
          uploaded.push(dataUrl);
        } else {
          uploaded.push(await uploadToCloudinary(file));
        }
      } catch (uploadError) {
        toast({
          variant: "error",
          title: "Foto gagal diunggah",
          description:
            uploadError instanceof Error ? uploadError.message : "Coba lagi sebentar.",
        });
      }
    }

    if (uploaded.length) {
      onChange([...images, ...uploaded].slice(0, 8));
      toast({
        variant: "success",
        title: `${uploaded.length} foto ditambahkan`,
        description: "Foto pertama akan menjadi cover.",
      });
    }
    setBusy(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(images.filter((_, itemIndex) => itemIndex !== index));
  };

  const makeCover = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const [selected] = next.splice(index, 1);
    next.unshift(selected);
    onChange(next);
  };

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "rounded-sm border border-dashed p-4 transition-colors",
          dragging ? "border-primary bg-primary-soft/45" : "border-border-strong bg-surface-muted/30",
          error && "border-error/50",
        )}
      >
        <input
          ref={inputRef}
          id="product-images"
          type="file"
          accept={ACCEPTED.join(",")}
          multiple
          className="sr-only"
          onChange={(event) => {
            if (event.target.files) void handleFiles(event.target.files);
          }}
          aria-describedby={error ? "product-images-error" : "product-images-hint"}
        />
        <div className="flex flex-col items-center justify-center py-5 text-center">
          <span className="flex size-11 items-center justify-center rounded-full border border-border bg-surface text-primary">
            {uploading ? (
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            ) : (
              <UploadCloud className="size-5" strokeWidth={1.5} aria-hidden="true" />
            )}
          </span>
          <p className="mt-3 text-sm font-semibold">
            {uploading ? `Mengunggah ${uploading} foto...` : "Tarik foto ke sini"}
          </p>
          <p className="mt-1 max-w-sm text-[11px] leading-relaxed text-text-secondary">
            JPG, PNG, atau WebP · maks 5 MB · foto pertama menjadi cover.{" "}
            {demo ? "Mode demo menyimpan foto di file lokal." : "Foto diunggah ke Cloudinary."}
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading > 0 || images.length >= 8}
            className="mt-3 inline-flex h-9 items-center gap-2 rounded-sm border border-border-strong bg-surface px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-primary transition-colors hover:bg-primary-soft disabled:opacity-45"
          >
            <ImagePlus className="size-3.5" aria-hidden="true" />
            Pilih foto
          </button>
        </div>
      </div>
      <p id="product-images-hint" className="mt-2 text-[11px] text-text-secondary">
        {images.length}/8 foto. Foto pertama jadi cover di katalog.
      </p>
      {error ? (
        <p id="product-images-error" className="mt-1 text-xs font-medium text-error" role="alert">
          {error}
        </p>
      ) : null}

      {images.length ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={`${image.slice(-24)}-${index}`}
              className="group relative overflow-hidden rounded-sm border border-border bg-surface"
            >
              <div className="relative aspect-[4/5] bg-surface-muted">
                <MediaImage src={image} alt={`Foto produk ${index + 1}`} sizes="180px" />
                {index === 0 ? (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-text-inverse">
                    Cover
                  </span>
                ) : null}
              </div>
              <div className="flex items-center justify-between gap-1 p-1.5">
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="flex size-7 items-center justify-center rounded-full text-text-secondary hover:bg-surface-muted hover:text-text-primary disabled:opacity-30"
                    aria-label={`Geser foto ${index + 1} ke kiri`}
                  >
                    <ArrowLeft className="size-3" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === images.length - 1}
                    className="flex size-7 items-center justify-center rounded-full text-text-secondary hover:bg-surface-muted hover:text-text-primary disabled:opacity-30"
                    aria-label={`Geser foto ${index + 1} ke kanan`}
                  >
                    <ArrowRight className="size-3" aria-hidden="true" />
                  </button>
                  {index !== 0 ? (
                    <button
                      type="button"
                      onClick={() => makeCover(index)}
                      className="flex size-7 items-center justify-center rounded-full text-text-secondary hover:bg-primary-soft hover:text-primary"
                      aria-label={`Jadikan foto ${index + 1} cover`}
                    >
                      <Star className="size-3" aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="flex size-7 items-center justify-center rounded-full text-text-secondary hover:bg-error/10 hover:text-error"
                  aria-label={`Hapus foto ${index + 1}`}
                >
                  <Trash2 className="size-3" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
