import Link from "next/link";
import type { Product, ProductCardData } from "@/types/product";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { MediaImage } from "@/components/ui/media-image";
import { cn, formatIDR, isNewProduct } from "@/lib/utils";

interface ProductCardProps {
  product: Product | ProductCardData;
  variant?: "default" | "editorial" | "compact";
  priority?: boolean;
  showNewBadge?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  variant = "default",
  priority = false,
  showNewBadge = true,
  className,
}: ProductCardProps) {
  const isNew = showNewBadge && isNewProduct(product.createdAt);
  const image = product.images[0] ?? "/images/placeholder.svg";
  const label = `${product.name}, ${formatIDR(product.price)}, ${product.status ? "tersedia" : "terjual"}, ukuran ${product.size}`;

  if (variant === "compact") {
    return (
      <Link
        href={`/produk/${product.slug}`}
        className={cn("group flex items-center gap-3", className)}
        aria-label={label}
      >
        <div className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
          <MediaImage
            src={image}
            alt={`Foto depan ${product.name}`}
            sizes="80px"
            className={cn("image-zoom", !product.status && "opacity-75 saturate-50")}
          />
        </div>
        <div className="min-w-0">
          <p className="truncate font-serif text-sm font-medium text-text-primary group-hover:text-primary">
            {product.name}
          </p>
          <p className="type-mono mt-0.5 text-text-secondary">{formatIDR(product.price)}</p>
        </div>
      </Link>
    );
  }

  return (
    <article className={cn("group min-w-0", className)}>
      <Link
        href={`/produk/${product.slug}`}
        className="block rounded-md focus-visible:outline-none"
        aria-label={label}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-md border border-border bg-surface-muted transition-[border-color,box-shadow] duration-300 group-hover:border-border-strong group-hover:shadow-sm",
            variant === "editorial" ? "aspect-[3/4]" : "aspect-[4/5]",
          )}
        >
          <MediaImage
            src={image}
            alt={`Foto depan ${product.name}`}
            sizes={
              variant === "editorial"
                ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            }
            priority={priority}
            className={cn("image-zoom", !product.status && "opacity-80 saturate-[0.55]")}
          />

          {!product.status ? (
            <div className="absolute inset-0 bg-text-primary/10" aria-hidden="true" />
          ) : null}

          <div className="absolute left-2.5 top-2.5 flex flex-wrap items-center gap-1.5">
            {isNew ? <Badge variant="new">Baru</Badge> : null}
            {!product.status ? <StatusBadge status={false} /> : null}
          </div>

          {product.status ? (
            <div className="absolute right-2.5 top-2.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Badge variant="inverse" dot>
                Tersedia
              </Badge>
            </div>
          ) : null}

          <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-text-primary/35 to-transparent px-3 pb-3 pt-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="type-caption text-[10px] uppercase tracking-[0.14em] text-text-inverse">
              Lihat detail
            </span>
          </div>
        </div>

        <div className="mt-3.5 space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.13em] text-text-secondary">
            <span>{product.category}</span>
            <span className="size-0.5 rounded-full bg-border-strong" aria-hidden="true" />
            <span>{product.size}</span>
          </div>
          <h3 className="line-clamp-2 min-h-[2.5em] font-serif text-[17px] font-medium leading-snug tracking-[-0.01em] text-text-primary transition-colors duration-200 group-hover:text-primary sm:text-[19px]">
            {product.name}
          </h3>
          <div className="flex items-baseline justify-between gap-2">
            <p className="type-price text-[19px] sm:text-[21px]">{formatIDR(product.price)}</p>
            {!product.status ? (
              <span className="type-caption text-[10px] uppercase tracking-[0.1em] text-soldout">
                Terjual
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
