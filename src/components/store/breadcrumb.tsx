import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbProps {
  items: Array<{ label: string; href?: string }>;
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-2 text-xs", className)}>
      <Link href="/" className="text-text-secondary transition-colors hover:text-primary">
        Beranda
      </Link>
      {items.map((item) => (
        <span key={item.label} className="flex min-w-0 items-center gap-2">
          <ChevronRight className="size-3 shrink-0 text-border-strong" aria-hidden="true" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-text-secondary transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ) : (
            <span className="truncate text-text-primary" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
