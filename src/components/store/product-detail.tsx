import Link from "next/link";
import {
  ArrowRight,
  Check,
  MessageCircle,
  PackageCheck,
  Ruler,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { Product } from "@/types/product";
import { Breadcrumb } from "@/components/store/breadcrumb";
import { ProductGallery } from "@/components/store/product-gallery";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { ProductCard } from "@/components/store/product-card";
import { Badge, StatusBadge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { formatDate, formatIDR, isNewProduct } from "@/lib/utils";
import { buildProductQuestionUrl } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/config";

export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const whatsapp = buildProductQuestionUrl(product.name);
  const isNew = isNewProduct(product.createdAt);

  return (
    <>
      <div className="container-page py-6 sm:py-8">
        <Breadcrumb
          items={[
            { label: "Katalog", href: "/shop" },
            { label: product.category, href: `/shop?category=${encodeURIComponent(product.category)}` },
            { label: product.name },
          ]}
        />
      </div>

      <article className="container-page pb-28 lg:pb-0">
        <div className="grid items-start gap-8 border-t border-border pt-6 sm:pt-9 lg:grid-cols-[1.06fr_0.94fr] lg:gap-14">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+24px)]">
            <ProductGallery images={product.images} name={product.name} status={product.status} />
            <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-text-secondary">
              <p>Foto diambil tanpa filter warna yang menipu.</p>
              <p className="type-mono text-[10px]">PSW / {product.sku.slice(-3)}</p>
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="type-eyebrow text-primary">{product.category}</p>
              <span className="size-0.5 rounded-full bg-border-strong" aria-hidden="true" />
              <p className="type-mono text-[10px] uppercase tracking-[0.1em] text-text-secondary">
                {product.sku}
              </p>
            </div>

            <h1 className="type-h1 mt-4">{product.name}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="type-price text-[28px] sm:text-[32px]">{formatIDR(product.price)}</p>
              <StatusBadge status={product.status} size="md" />
              {isNew ? <Badge variant="new">Baru masuk</Badge> : null}
            </div>

            <p className="mt-5 text-[15px] leading-relaxed text-text-secondary">
              {product.description}
            </p>

            <div className="mt-6 rounded-md border border-primary/20 bg-primary-soft/65 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface text-primary">
                  <ShieldCheck className="size-4" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-text-primary">
                    Kondisi & defect
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                    {product.defectNotes?.trim() ||
                      "Tidak ada defect signifikan yang kami temukan. Tetap preloved, jadi mungkin ada tanda pemakaian halus."}
                  </p>
                </div>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-3 gap-3 border-y border-border py-4">
              <div>
                <dt className="type-mono text-[9px] uppercase tracking-[0.1em] text-text-secondary">
                  Ukuran
                </dt>
                <dd className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                  <Ruler className="size-3.5 text-text-secondary" aria-hidden="true" />
                  {product.size}
                </dd>
              </div>
              <div>
                <dt className="type-mono text-[9px] uppercase tracking-[0.1em] text-text-secondary">
                  Kondisi
                </dt>
                <dd className="mt-1 text-sm font-semibold">
                  {product.status ? "Siap pakai" : "Sudah terjual"}
                </dd>
              </div>
              <div>
                <dt className="type-mono text-[9px] uppercase tracking-[0.1em] text-text-secondary">
                  Masuk katalog
                </dt>
                <dd className="mt-1 text-sm font-semibold">{formatDate(product.createdAt)}</dd>
              </div>
            </dl>

            <div className="mt-6 space-y-3">
              <AddToCartButton product={product} className="w-full" />
              {whatsapp ? (
                <Link
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-[52px] w-full items-center justify-center gap-2 rounded-sm border border-border-strong bg-surface px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-primary transition-colors hover:bg-primary-soft"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Tanya ukuran atau kondisi
                </Link>
              ) : null}
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-text-secondary">
                <Check className="size-3 text-secondary" aria-hidden="true" />
                Satu piece hanya untuk satu pembeli. Checkout via WhatsApp.
              </p>
            </div>

            <div className="mt-6 grid gap-3 rounded-md border border-border bg-surface p-4 sm:grid-cols-3">
              <div className="flex items-start gap-2.5">
                <Truck className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold">Dikirim dari Indramayu</p>
                  <p className="mt-0.5 text-[11px] text-text-secondary">Ongkir dikonfirmasi admin.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <PackageCheck className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold">Dicek & dirawat</p>
                  <p className="mt-0.5 text-[11px] text-text-secondary">Dicuci sebelum dikirim.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <p className="text-xs font-semibold">Defect ditulis</p>
                  <p className="mt-0.5 text-[11px] text-text-secondary">Tidak ada kejutan.</p>
                </div>
              </div>
            </div>

            <Accordion type="single" collapsible className="mt-7 border-t border-border">
              <AccordionItem value="detail">
                <AccordionTrigger>Detail & bahan</AccordionTrigger>
                <AccordionContent>
                  <p>
                    {product.description} Kami mencantumkan ukuran label; ukuran aktual bisa
                    berbeda. Untuk lingkar dada, pinggang, atau panjang, minta admin mengukur
                    sebelum membeli.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="pengiriman">
                <AccordionTrigger>Pengiriman & pembayaran</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Barang dikirim dari Indramayu melalui kurir pilihanmu. Pembayaran via transfer
                    bank setelah admin mengonfirmasi stok dan ongkir di WhatsApp. Belum tersedia
                    COD.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="perawatan">
                <AccordionTrigger>Cara merawat</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Cuci dengan air dingin atau dry clean sesuai label. Hindari pemutih dan
                    pengeringan suhu tinggi. Setrika di suhu rendah, terutama untuk bahan wool dan
                    satin.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="retur">
                <AccordionTrigger>Kebijakan retur</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Karena setiap piece hanya satu, kami tidak menerima retur untuk alasan berubah
                    pikiran. Kalau ada defect yang tidak kami tulis dan berbeda jauh dari deskripsi,
                    hubungi kami dalam 1×24 jam setelah paket diterima.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </article>

      {related.length ? (
        <section className="container-page mt-16 border-t border-border pt-10 sm:mt-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="type-eyebrow text-primary">Masih satu rasa</p>
              <h2 className="type-h2 mt-2">Mungkin kamu juga suka.</h2>
            </div>
            <Link href="/shop" className="link-editorial hidden text-primary sm:inline-flex">
              Lihat katalog
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
            {related.map((item, index) => (
              <ProductCard key={item.id} product={item} priority={index < 2} />
            ))}
          </div>
        </section>
      ) : null}

      <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-4 pt-3 shadow-[0_-8px_24px_rgba(43,38,34,0.08)] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-sm">{product.name}</p>
            <p className="type-price text-lg">{formatIDR(product.price)}</p>
          </div>
          <AddToCartButton product={product} sticky className="max-w-[54%]" />
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            sku: product.sku,
            category: product.category,
            image: product.images.map((image) =>
              image.startsWith("http") ? image : `${siteConfig.url}${image}`,
            ),
            offers: {
              "@type": "Offer",
              priceCurrency: "IDR",
              price: product.price,
              availability: product.status
                ? "https://schema.org/InStock"
                : "https://schema.org/SoldOut",
              url: `${siteConfig.url}/produk/${product.slug}`,
            },
            brand: { "@type": "Brand", name: siteConfig.name },
          }).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
