import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-sm", className)} aria-hidden="true" />;
}

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)} aria-hidden="true">
      <Skeleton className="aspect-[4/5] w-full rounded-md" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}
