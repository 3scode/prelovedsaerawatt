import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-sans text-[11px] font-semibold leading-none",
  {
    variants: {
      variant: {
        available: "border-secondary/20 bg-secondary-soft text-secondary",
        soldout: "border-border bg-surface-muted text-soldout",
        new: "border-primary/15 bg-primary-soft text-primary",
        category: "border-border bg-transparent text-text-secondary uppercase tracking-[0.12em]",
        warning: "border-warning/25 bg-warning/10 text-warning",
        neutral: "border-border bg-surface text-text-secondary",
        inverse: "border-white/20 bg-black/25 text-white backdrop-blur-sm",
        error: "border-error/20 bg-error/10 text-error",
      },
      size: {
        sm: "h-6 px-2.5",
        md: "h-7 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "sm",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, size, dot = false, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot ? (
        <span
          className={cn(
            "size-1.5 rounded-full",
            variant === "available" ? "bg-secondary" : "bg-soldout",
          )}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </span>
  );
}

export function StatusBadge({
  status,
  size = "sm",
  className,
}: {
  status: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <Badge variant={status ? "available" : "soldout"} size={size} dot className={className}>
      {status ? "Tersedia" : "Terjual"}
    </Badge>
  );
}
