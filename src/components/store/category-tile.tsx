import Link from "next/link";
import type { CategoryCount } from "@/types/catalog";
import { MediaImage } from "@/components/ui/media-image";

export function CategoryTile({
  category,
  count,
  image,
  index,
}: CategoryCount & { index: number }) {
  return (
    <Link
      href={`/shop?category=${encodeURIComponent(category)}`}
      className="group relative flex min-h-[220px] overflow-hidden rounded-md border border-border bg-surface-muted sm:min-h-[260px]"
    >
      {image ? (
        <MediaImage
          src={image}
          alt={`Koleksi ${category}`}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="image-zoom opacity-90"
        />
      ) : (
        <div className="absolute inset-0 bg-primary-soft" aria-hidden="true" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-text-primary/65 via-text-primary/10 to-transparent" />
      <div className="relative z-10 mt-auto flex w-full items-end justify-between p-5 text-text-inverse">
        <div>
          <p className="type-mono text-[10px] opacity-75">0{index + 1} / Koleksi</p>
          <h3 className="mt-1 font-serif text-2xl">{category}</h3>
          <p className="mt-1 text-xs opacity-80">{count} piece</p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-full border border-white/40 text-lg transition-transform duration-300 group-hover:rotate-45 group-hover:bg-surface group-hover:text-primary">
          +
        </span>
      </div>
    </Link>
  );
}

export function CategoryGrid({ categories }: { categories: CategoryCount[] }) {
  const order = ["Outerwear", "Dress", "Atasan", "Bawahan", "Aksesori"];
  const sorted = [...categories].sort(
    (a, b) => order.indexOf(a.category) - order.indexOf(b.category),
  );
  return (
    <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
      {sorted.slice(0, 3).map((category, index) => (
        <CategoryTile key={category.category} {...category} index={index} />
      ))}
    </div>
  );
}
