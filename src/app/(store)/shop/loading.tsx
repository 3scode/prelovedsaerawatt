import { ProductGridSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function ShopLoading() {
  return (
    <div className="container-page py-8 sm:py-12" aria-busy="true" aria-label="Memuat katalog">
      <div className="space-y-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-12 w-full max-w-lg" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="mt-8 border-y border-border py-5">
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="mt-6 flex gap-2">
        {[0, 1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-10 w-20 rounded-full" />
        ))}
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="hidden space-y-6 lg:block">
          <Skeleton className="h-4 w-16" />
          {[0, 1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-4 w-32" />
          ))}
          <Skeleton className="h-24 w-full" />
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
