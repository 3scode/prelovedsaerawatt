import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { aboutStory, faqItems, promises, shoppingSteps } from "@/content/about";
import { Breadcrumb } from "@/components/store/breadcrumb";
import { MediaImage } from "@/components/ui/media-image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getLatestProducts } from "@/lib/products";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tentang & cara belanja",
  description:
    "Kenali cara prelovedsaerawatt mengurasi, mengecek kondisi, dan mengirim preloved. Panduan ukuran, pembayaran, ongkir, dan kebijakan retur.",
  alternates: { canonical: "/tentang" },
  openGraph: {
    title: "Tentang & cara belanja — prelovedsaerawatt",
    description:
      "Kurasi manual, kondisi jujur, dan checkout WhatsApp. Baca proses dan kebijakan kami.",
    url: "/tentang",
  },
};

export default async function AboutPage() {
  const [featured] = await getLatestProducts(1);
  const aboutImage = featured?.images[0] ?? null;
  const whatsapp = buildWhatsAppUrl(
    "Halo Admin @prelovedsaerawatt, saya sudah baca halaman Tentang. Saya ingin tanya sesuatu.",
  );

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <div className="container-page py-6 sm:py-8">
        <Breadcrumb items={[{ label: "Tentang" }]} />
      </div>

      <header className="container-page border-t border-border pb-12 pt-8 sm:pb-16 sm:pt-12">
        <div className="grid items-center gap-9 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-9 bg-primary" aria-hidden="true" />
              <p className="type-eyebrow text-primary">Tentang kami</p>
            </div>
            <h1 className="type-display mt-5 max-w-lg">
              Bukan toko barang bekas. <span className="italic text-primary">Rumah singgah.</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-text-secondary">
              Kami percaya barang yang sudah dipakai masih bisa punya babak baru — asal kondisinya
              jujur, fotonya apa adanya, dan orangnya tepat.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-xs text-text-secondary">
              <span className="flex items-center gap-2">
                <span className="dot-available" aria-hidden="true" /> Dikurasi manual
              </span>
              <span className="flex items-center gap-2">
                <span className="dot-available" aria-hidden="true" /> Satu piece, satu cerita
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -bottom-3 -right-3 left-3 top-3 rounded-md border border-border" aria-hidden="true" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-border bg-surface-muted">
              {aboutImage ? (
                <MediaImage
                  src={aboutImage}
                  alt={featured ? `Foto ${featured.name}` : "Koleksi prelovedsaerawatt"}
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  priority
                />
              ) : (
                <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-text-secondary">
                  Foto katalog segera hadir.
                </p>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-text-secondary">
              <p>Rumah kurasi kami di Indramayu.</p>
              <span className="type-mono text-[10px]">EST. 2024</span>
            </div>
          </div>
        </div>
      </header>

      <section className="border-y border-border bg-surface">
        <div className="container-page grid gap-8 py-12 sm:grid-cols-3 sm:gap-10 sm:py-16">
          {promises.map((promise, index) => (
            <div key={promise.title} className="flex gap-4">
              <span className="font-serif text-3xl text-primary/40">0{index + 1}</span>
              <div>
                <h2 className="text-[13px] font-bold uppercase tracking-[0.08em]">
                  {promise.title}
                </h2>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-secondary">
                  {promise.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-editorial py-14 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.38fr_1fr] lg:gap-16">
          <div>
            <p className="type-eyebrow text-primary">Cerita kami</p>
            <p className="mt-3 font-serif text-2xl leading-tight">Dari lemari sendiri.</p>
          </div>
          <div className="prose-editorial">
            {aboutStory.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
            <div className="mt-8 border-l-2 border-primary pl-5 font-serif text-xl italic leading-relaxed text-text-primary">
              “Kalau kami tidak mau memakainya sendiri, kami tidak akan menjualnya ke kamu.”
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary">
              — Admin @prelovedsaerawatt
            </p>
          </div>
        </div>
      </section>

      <section id="cara-belanja" className="scroll-mt-24 border-y border-border bg-surface-muted/55">
        <div className="container-page py-14 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="type-eyebrow text-primary">Cara belanja</p>
              <h2 className="type-h2 mt-3">Empat langkah, tanpa akun.</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-text-secondary">
              Dari memilih sampai paket tiba. Semua dikonfirmasi manual supaya tidak ada salah
              paham.
            </p>
          </div>

          <div className="mt-10 grid gap-0 border-t border-border sm:grid-cols-2 lg:grid-cols-4">
            {shoppingSteps.map((step) => (
              <div
                key={step.number}
                className="border-b border-border py-6 sm:border-r sm:px-6 first:sm:pl-0 last:sm:border-r-0 last:sm:pr-0"
              >
                <span className="type-mono text-[11px] text-primary">{step.number}</span>
                <h3 className="mt-4 font-serif text-xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-md border border-border bg-surface p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <p className="text-sm font-semibold">Butuh bantuan ukuran atau kondisi?</p>
              <p className="mt-1 text-xs text-text-secondary">
                Chat admin sebelum checkout. Kami bisa kirim foto dan ukuran tambahan.
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:mt-0 sm:flex-row">
              {whatsapp ? (
                <Link
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-whatsapp px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-text-inverse transition-colors hover:bg-whatsapp-hover"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Chat admin
                </Link>
              ) : null}
              <Link
                href="/shop"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-sm border border-border-strong px-5 text-[11px] font-bold uppercase tracking-[0.08em] text-primary transition-colors hover:bg-primary-soft"
              >
                Jelajahi katalog
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 container-editorial py-14 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.36fr_1fr] lg:gap-16">
          <div>
            <p className="type-eyebrow text-primary">FAQ</p>
            <h2 className="type-h2 mt-3">Hal yang sering ditanyakan.</h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary">
              Belum terjawab? Chat admin — kami lebih suka menjawab daripada kamu menebak.
            </p>
            {whatsapp ? (
              <Link href={whatsapp} target="_blank" rel="noopener noreferrer" className="link-editorial mt-5 text-primary">
                Tanya langsung
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
          <Accordion type="single" collapsible className="border-t border-border">
            {faqItems.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
