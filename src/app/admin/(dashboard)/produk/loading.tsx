import { Skeleton } from "@/components/ui/skeleton";

export default function ProductFormLoading() {
  return (
    <div className="container-admin py-6 sm:py-8 lg:py-10" aria-busy="true" aria-label="Memuat form produk">
      <Skeleton className="h-3 w-24" />
      <div className="mt-5 border-b border-border pb-6">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-3 h-10 w-80 max-w-full" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      </div>
      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-8">
        <div className="space-y-5">
          <Skeleton className="h-[420px] rounded-md" />
          <Skeleton className="h-[380px] rounded-md" />
          <Skeleton className="h-[300px] rounded-md" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[380px] rounded-md" />
          <Skeleton className="h-24 rounded-md" />
          <Skeleton className="h-40 rounded-md" />
          <Skeleton className="h-12 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
