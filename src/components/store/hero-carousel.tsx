"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MediaImage } from "@/components/ui/media-image";
import { cn, formatIDR } from "@/lib/utils";

export interface HeroSlide {
  src: string;
  alt: string;
  href: string;
  name: string;
  sku: string;
  price: number;
}

const AUTOPLAY_MS = 5500;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || slides.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, slides.length]);

  const current = slides[active];

  return (
    <div
      className="relative aspect-[4/5] overflow-hidden rounded-md border border-border bg-surface-muted"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      {slides.map((slide, index) => (
        <Link
          key={slide.href}
          href={slide.href}
          tabIndex={index === active ? 0 : -1}
          aria-hidden={index !== active}
          className={cn(
            "absolute inset-0 block transition-opacity duration-700 ease-out motion-reduce:transition-none",
            index === active ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <MediaImage
            src={slide.src}
            alt={slide.alt}
            sizes="(max-width: 1024px) 100vw, 55vw"
            priority={index === 0}
            className="object-cover object-center"
          />
        </Link>
      ))}

      {slides.length > 1 ? (
        <div className="absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-full bg-text-primary/30 p-1.5 backdrop-blur-sm sm:right-4 sm:top-4">
          {slides.map((slide, index) => (
            <button
              key={slide.href}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Tampilkan ${slide.name}`}
              aria-current={index === active ? "true" : undefined}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none",
                index === active
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/55 hover:bg-white/80 focus-visible:bg-white",
              )}
            />
          ))}
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-text-primary/60 via-text-primary/5 to-transparent p-5 pt-24 sm:p-7">
        <div className="flex items-end justify-between gap-4 text-text-inverse">
          <div className="min-w-0">
            <p className="type-mono text-[10px] uppercase tracking-[0.14em] opacity-75">
              Dari katalog / {String(active + 1).padStart(2, "0")}
            </p>
            <p className="mt-1 truncate font-serif text-xl sm:text-2xl">{current.name}</p>
            <p className="type-mono mt-1 text-[10px] uppercase tracking-[0.14em] opacity-80">
              {formatIDR(current.price)}
            </p>
          </div>
          <span className="hidden shrink-0 border border-white/35 px-2 py-1 type-mono text-[9px] uppercase tracking-[0.14em] sm:block">
            {current.sku}
          </span>
        </div>
      </div>
    </div>
  );
}
