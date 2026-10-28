"use client";

import { ErrorState } from "@/components/store/error-state";

export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error;
  return (
    <div className="container-page py-10">
      <ErrorState reset={reset} />
    </div>
  );
}
