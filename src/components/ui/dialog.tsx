"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

const overlayClass =
  "fixed inset-0 z-[70] bg-[var(--color-overlay)] backdrop-blur-[2px] data-[state=open]:animate-[fade-in_200ms_ease-out]";

const baseContent =
  "fixed z-[71] flex flex-col border border-border bg-surface shadow-lg focus:outline-none";

interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  variant?: "dialog" | "sheet" | "confirm";
  size?: "sm" | "md" | "lg";
  hideClose?: boolean;
}

export function DialogContent({
  className,
  children,
  variant = "dialog",
  size = "md",
  hideClose = false,
  ...props
}: DialogContentProps) {
  const width =
    size === "sm" ? "sm:max-w-[400px]" : size === "lg" ? "sm:max-w-[680px]" : "sm:max-w-[520px]";

  if (variant === "sheet") {
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={overlayClass} />
        <DialogPrimitive.Content
          className={cn(
            baseContent,
            "inset-x-0 bottom-0 max-h-[90vh] rounded-t-lg data-[state=open]:animate-[sheet-in_320ms_cubic-bezier(.22,1,.36,1)]",
            "sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[85vh] sm:w-[calc(100vw-32px)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:data-[state=open]:animate-[dialog-in_240ms_cubic-bezier(.22,1,.36,1)]",
            width,
            className,
          )}
          {...props}
        >
          {children}
          {!hideClose ? <DialogCloseButton /> : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  }

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className={overlayClass} />
      <DialogPrimitive.Content
        className={cn(
          baseContent,
          "left-1/2 top-1/2 max-h-[90vh] w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 rounded-lg data-[state=open]:animate-[dialog-in_240ms_cubic-bezier(.22,1,.36,1)]",
          variant === "confirm" && "sm:max-w-[400px]",
          width,
          className,
        )}
        {...props}
      >
        {children}
        {!hideClose ? <DialogCloseButton /> : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function DialogCloseButton() {
  return (
    <DialogPrimitive.Close
      className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none"
      aria-label="Tutup dialog"
    >
      <X className="size-5" aria-hidden="true" />
    </DialogPrimitive.Close>
  );
}

export function DialogHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("space-y-2 pr-10", className)}>{children}</div>;
}

export function DialogFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mt-6 flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end",
        className,
      )}
    >
      {children}
    </div>
  );
}
