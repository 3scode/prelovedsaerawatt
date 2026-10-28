import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: { href: string; label: string };
  align?: "left" | "center";
  className?: string;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
  align = "left",
  className,
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:flex-col sm:items-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? <p className="type-eyebrow mb-3 text-primary">{eyebrow}</p> : null}
        <h2 id={id} className="type-h2">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-secondary sm:text-[15px]">
            {description}
          </p>
        ) : null}
      </div>
      {link ? (
        <Link href={link.href} className="link-editorial shrink-0 text-primary">
          {link.label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}
