import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Agentation } from "agentation";
import { CartHydrator } from "@/components/store/cart-hydrator";
import { ToastProvider } from "@/components/ui/toast";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const fraunces = localFont({
  src: "./fonts/fraunces.woff2",
  variable: "--font-fraunces",
  display: "swap",
  weight: "300 700",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const manrope = localFont({
  src: "./fonts/manrope.woff2",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
  fallback: ["system-ui", "sans-serif"],
});

const plexMono = localFont({
  src: [
    { path: "./fonts/plexmono.woff2", weight: "400", style: "normal" },
    { path: "./fonts/plexmono-medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  keywords: [
    "preloved",
    "thrift",
    "fashion preloved",
    "butik preloved",
    "preloved Indramayu",
    "prelovedsaerawatt",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 1500,
        alt: "Koleksi preloved prelovedsaerawatt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F3EC",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${fraunces.variable} ${manrope.variable} ${plexMono.variable}`}>
      <body>
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-text-inverse shadow-md transition-transform focus:translate-y-0"
        >
          Lewati ke konten
        </a>
        <ToastProvider>
          <Suspense fallback={null}>
            <CartHydrator />
          </Suspense>
          {children}
        </ToastProvider>
        <div className="grain-overlay" aria-hidden="true" />
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
