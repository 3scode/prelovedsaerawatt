export const siteConfig = {
  name: "prelovedsaerawatt",
  shortName: "PSW",
  tagline: "Barang bagus, cerita baru.",
  description:
    "Butik preloved terkurasi untuk perempuan. Kondisi jujur, foto apa adanya, checkout cepat lewat WhatsApp.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  instagram: "https://instagram.com/prelovedsaerawatt",
  city: "Indramayu, Indonesia",
  ogImage:
    "https://res.cloudinary.com/x9oswhcb/image/upload/c_fill,w_1200,h_1500,q_auto,f_auto/prelovedsaerawatt/products/blouse-lace-putih.webp",
  whatsappDisplay: "+62 8591-2149-4481",
  email: "halo@prelovedsaerawatt.local",
} as const;
