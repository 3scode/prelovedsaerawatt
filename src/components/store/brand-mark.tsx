import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-serif font-medium leading-none tracking-[-0.035em] text-text-primary",
        className,
      )}
    >
      preloved<span className="italic text-primary">saerawatt</span>
    </span>
  );
}

export function NewsletterMark({ className }: { className?: string }) {
  return <BrandMark className={className} />;
}
