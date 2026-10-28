import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { ProductDetail } from "@/components/store/product-detail";
import { siteConfig } from "@/lib/config";

const getProduct = cache(getProductBySlug);

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

function absoluteImage(src: string | undefined): string {
  if (!src || src.startsWith("data:")) return siteConfig.ogImage;
  if (src.startsWith("http")) return src;
  return `${siteConfig.url}${src}`;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const description = `${product.name} — ${product.size}, ${product.status ? "tersedia" : "sudah terjual"}. Kondisi jujur dan checkout via WhatsApp.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/produk/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} — ${siteConfig.name}`,
      description,
      url: `/produk/${product.slug}`,
      images: [
        {
          url: absoluteImage(product.images[0]),
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [absoluteImage(product.images[0])],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product.category, product.id, 4);

  return <ProductDetail product={product} related={related} />;
}
