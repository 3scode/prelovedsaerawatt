"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { MediaImage } from "@/components/ui/media-image";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
  status,
}: {
  images: string[];
  name: string;
  status: boolean;
}) {
  const safeImages = images.length ? images : ["/images/placeholder.svg"];
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const current = safeImages[Math.min(active, safeImages.length - 1)];

  const move = (direction: 1 | -1) => {
    setActive((index) => (index + direction + safeImages.length) % safeImages.length);
  };

  return (
    <div>
      <div className="group relative aspect-[4/5] overflow-hidden rounded-md border border-border bg-surface-muted">
        <MediaImage
          src={current}
          alt={`${name} — foto ${active + 1} dari ${safeImages.length}`}
          sizes="(max-width: 1024px) 100vw, 56vw"
          priority
          className={cn("image-zoom", !status && "saturate-[0.6] opacity-90")}
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="absolute right-3 top-3 flex h-10 items-center gap-2 rounded-full border border-white/30 bg-text-primary/35 px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-text-inverse backdrop-blur-sm transition-colors hover:bg-text-primary/55"
          aria-label="Perbesar foto produk"
        >
          <Maximize2 className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Perbesar</span>
        </button>
        <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2">
          <span className="rounded-full bg-surface/90 px-2.5 py-1 type-mono text-[9px] text-text-secondary backdrop-blur-sm">
            {active + 1} / {safeImages.length}
          </span>
          {!status ? (
            <span className="rounded-full bg-text-primary/80 px-2.5 py-1 type-mono text-[9px] uppercase tracking-[0.1em] text-text-inverse">
              Terjual
            </span>
          ) : null}
        </div>
        {safeImages.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Foto sebelumnya"
              className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-text-primary/35 text-text-inverse opacity-0 backdrop-blur-sm transition-opacity hover:bg-text-primary/55 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Foto berikutnya"
              className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-text-primary/35 text-text-inverse opacity-0 backdrop-blur-sm transition-opacity hover:bg-text-primary/55 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      {safeImages.length > 1 ? (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {safeImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "relative aspect-[4/5] overflow-hidden rounded-xs border bg-surface-muted transition-opacity",
                index === active
                  ? "border-primary opacity-100"
                  : "border-border opacity-65 hover:opacity-100",
              )}
              aria-label={`Lihat foto ${index + 1}`}
              aria-current={index === active}
            >
              <MediaImage
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                sizes="100px"
              />
            </button>
          ))}
        </div>
      ) : null}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          variant="dialog"
          size="lg"
          className="w-[calc(100vw-24px)] bg-background p-2 sm:p-3"
        >
          <DialogTitle className="sr-only">Foto {name}</DialogTitle>
          <div className="relative aspect-[4/5] max-h-[82vh] w-full overflow-hidden rounded-sm bg-surface-muted">
            <MediaImage
              src={current}
              alt={`${name} — foto besar`}
              sizes="90vw"
              className="object-contain"
            />
          </div>
          {safeImages.length > 1 ? (
            <div className="mt-2 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => move(-1)}
                className="flex size-9 items-center justify-center rounded-full border border-border bg-surface text-text-primary"
                aria-label="Foto sebelumnya"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <span className="type-mono text-xs text-text-secondary">
                {active + 1} / {safeImages.length}
              </span>
              <button
                type="button"
                onClick={() => move(1)}
                className="flex size-9 items-center justify-center rounded-full border border-border bg-surface text-text-primary"
                aria-label="Foto berikutnya"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
