import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryCounts, getLatestProducts } from "@/lib/products";
import { Hero } from "@/components/store/hero";
import { TrustStrip } from "@/components/store/trust-strip";
import { CategoryGrid } from "@/components/store/category-tile";
import { BrandPromiseCta, HowToShop } from "@/components/store/how-to-shop";
import { ProductCard } from "@/components/store/product-card";
import { SectionHeading } from "@/components/store/section-heading";
import { EmptyState } from "@/components/ui/empty-state";
import { HangerIllustration } from "@/components/ui/illustrations";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Preloved terkurasi, jujur soal kondisi",
  description:
    "Butik preloved terkurasi untuk perempuan. Kondisi jujur, foto apa adanya, checkout cepat lewat WhatsApp. Dikurasi manual di Indramayu.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "prelovedsaerawatt — Barang bagus, cerita baru.",
    description:
      "Butik preloved terkurasi untuk perempuan. Kondisi jujur, foto apa adanya, checkout cepat lewat WhatsApp.",
    url: "/",
  },
};

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getLatestProducts(8),
    getCategoryCounts(),
  ]);
  const whatsapp = buildWhatsAppUrl(
    "Halo Admin @prelovedsaerawatt, saya ingin lihat koleksi terbaru.",
  );
  const heroSlides = products
    .filter((product) => product.images.length > 0)
    .slice(0, 5)
    .map((product) => ({
      src: product.images[0],
      alt: `Foto ${product.name}`,
      href: `/produk/${product.slug}`,
      name: product.name,
      sku: product.sku,
      price: product.price,
    }));

  return (
    <>
      <Hero
        productCount={categories.reduce((sum, item) => sum + item.count, 0)}
        slides={heroSlides}
      />
      <TrustStrip />

      <section className="container-page py-16 sm:py-20" aria-labelledby="baru-masuk">
        <SectionHeading
          eyebrow="Baru masuk"
          title="Pilihan minggu ini."
          description="Koleksi kecil yang berganti tiap minggu. Setiap piece hanya satu — begitu terjual, ia tidak kembali."
          link={{ href: "/shop", label: "Lihat semua" }}
          id="baru-masuk"
        />

        {products.length ? (
          <div className="mt-9 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-11 lg:grid-cols-4 lg:gap-x-6">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 2}
                showNewBadge
              />
            ))}
          </div>
        ) : (
          <EmptyState
            illustration={<HangerIllustration />}
            title="Koleksi pertama sedang disiapkan"
            description="Barang pilihan sedang difoto dan dicek kondisinya. Chat admin untuk lihat preview lebih dulu."
            primaryAction={
              whatsapp
                ? { label: "Chat admin", href: whatsapp }
                : { label: "Lihat katalog", href: "/shop" }
            }
            className="mt-8 rounded-md border border-dashed border-border"
          />
        )}
      </section>

      <section className="container-page pb-16 sm:pb-20" aria-labelledby="kategori">
        <SectionHeading
          eyebrow="Kategori"
          title="Pilih berdasarkan rasa."
          description="Dari outerwear netral sampai dress yang lebih berani. Semua sudah melewati pengecekan yang sama."
          link={{ href: "/shop", label: "Semua kategori" }}
          id="kategori"
        />
        <div className="mt-9">
          <CategoryGrid categories={categories} />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.category}
              href={`/shop?category=${encodeURIComponent(category.category)}`}
              className="chip"
            >
              {category.category}
              <span className="type-mono text-[10px] opacity-60">{category.count}</span>
            </Link>
          ))}
        </div>
      </section>

      <HowToShop />
      <BrandPromiseCta
        whatsappUrl={whatsapp}
        image={products[5]?.images[0] ?? products[0]?.images[0] ?? null}
      />
    </>
  );
}
