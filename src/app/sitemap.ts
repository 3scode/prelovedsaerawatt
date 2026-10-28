import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/products";
import { getSiteUrl } from "@/lib/env";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/shop`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/tentang`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const products = await getAllProductSlugs();
    return [
      ...staticRoutes,
      ...products.map((product) => ({
        url: `${base}/produk/${product.slug}`,
        lastModified: new Date(product.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    // Sitemap tidak boleh membuat build/runtime gagal hanya karena DB down.
    return staticRoutes;
  }
}
