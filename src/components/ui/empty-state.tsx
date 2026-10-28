import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  illustration?: ReactNode;
  title: string;
  description?: string;
  primaryAction?: EmptyAction;
  secondaryAction?: EmptyAction;
  variant?: "editorial" | "compact" | "admin";
  className?: string;
  headingLevel?: "h1" | "h2" | "h3";
}

export function EmptyState({
  illustration,
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = "editorial",
  className,
  headingLevel: Heading = "h2",
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        variant === "compact" ? "px-6 py-10" : "px-6 py-16 sm:py-20",
        className,
      )}
    >
      {illustration ? (
        <div className="mb-6 text-primary" aria-hidden="true">
          {illustration}
        </div>
      ) : null}
      <Heading className={cn(variant === "editorial" ? "type-h2" : "type-h3", "max-w-xl")}>
        {title}
      </Heading>
      {description ? (
        <p className="mt-3 max-w-md text-sm leading-relaxed text-text-secondary">{description}</p>
      ) : null}
      {primaryAction || secondaryAction ? (
        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
          {primaryAction?.href ? (
            <Button asChild size="md">
              <Link href={primaryAction.href}>{primaryAction.label}</Link>
            </Button>
          ) : primaryAction?.onClick ? (
            <Button type="button" size="md" onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          ) : null}
          {secondaryAction?.href ? (
            <Button asChild variant="secondary" size="md">
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          ) : secondaryAction?.onClick ? (
            <Button type="button" variant="secondary" size="md" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
