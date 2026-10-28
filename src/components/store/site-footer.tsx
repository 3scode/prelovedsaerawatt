import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { BrandMark } from "@/components/store/brand-mark";
import { siteConfig } from "@/lib/config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const footerLinks = [
  { href: "/shop", label: "Katalog" },
  { href: "/tentang", label: "Tentang" },
  { href: "/tentang#cara-belanja", label: "Cara belanja" },
  { href: "/tentang#faq", label: "FAQ" },
];

export function SiteFooter() {
  const whatsapp = buildWhatsAppUrl(
    "Halo Admin @prelovedsaerawatt, saya ingin tanya tentang koleksi.",
  );

  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-page py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div className="max-w-sm">
            <BrandMark className="text-[26px]" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-text-secondary">
              Butik preloved terkurasi untuk perempuan. Satu piece, satu cerita — dicek dan
              dirawat sebelum pindah tangan.
            </p>
            <p className="mt-5 flex items-center gap-2 text-xs text-text-secondary">
              <span className="dot-available" aria-hidden="true" />
              Dikurasi manual di {siteConfig.city}
            </p>
          </div>

          <div>
            <p className="type-eyebrow text-text-secondary">Jelajahi</p>
            <ul className="mt-5 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-text-primary transition-colors hover:text-primary"
                  >
                    {link.label}
                    <ArrowUpRight
                      className="size-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="type-eyebrow text-text-secondary">Terhubung</p>
            <div className="mt-5 space-y-3">
              {whatsapp ? (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-text-primary transition-colors hover:text-whatsapp"
                >
                  <MessageCircle className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  WhatsApp admin
                </a>
              ) : null}
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-text-primary transition-colors hover:text-primary"
              >
                <InstagramIcon className="size-4" />
                @prelovedsaerawatt
              </a>
              <p className="pt-2 text-xs leading-relaxed text-text-secondary">
                Senin–Sabtu, 09.00–18.00 WIB.
                <br />
                Balasan admin maksimal 1×24 jam.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-5 text-[11px] text-text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} prelovedsaerawatt. Semua foto milik butik.</p>
          <p className="flex items-center gap-2">
            <span>Transfer bank · WhatsApp checkout</span>
            <span className="h-3 w-px bg-border" aria-hidden="true" />
            <span>Indramayu, ID</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
