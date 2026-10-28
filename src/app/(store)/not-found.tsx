import type { Metadata } from "next";
import { NotFoundContent } from "@/components/store/not-found-content";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  robots: { index: false, follow: false },
};

export default function StoreNotFound() {
  return <NotFoundContent />;
}
