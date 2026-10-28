import type { Metadata } from "next";
import { SiteFooter } from "@/components/store/site-footer";
import { SiteHeader } from "@/components/store/site-header";
import { NotFoundContent } from "@/components/store/not-found-content";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  robots: { index: false, follow: false },
};

export default function RootNotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </>
  );
}
