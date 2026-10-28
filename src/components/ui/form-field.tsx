import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  id: string;
  label: string;
  children: ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  counter?: string;
}

export function FormField({
  id,
  label,
  children,
  hint,
  error,
  required,
  className,
  counter,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <Label htmlFor={id}>
          {label}
          {required ? <span className="ml-1 text-primary">*</span> : null}
        </Label>
        {counter ? <span className="type-mono text-text-secondary">{counter}</span> : null}
      </div>
      {children}
      {error ? (
        <p className="flex items-start gap-1.5 text-xs font-medium text-error" id={`${id}-error`}>
          <span aria-hidden="true">—</span>
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs leading-relaxed text-text-secondary" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
