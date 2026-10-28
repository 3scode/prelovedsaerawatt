"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, Info, Undo2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "info" | "undo";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ToastAction;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
  dismiss: (id?: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  undo: Undo2,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [queue, setQueue] = React.useState<ToastItem[]>([]);
  const [paused, setPaused] = React.useState(false);
  const current = queue[0];

  const dismiss = React.useCallback((id?: string) => {
    setQueue((items) => (id ? items.filter((item) => item.id !== id) : items.slice(1)));
  }, []);

  const toast = React.useCallback((options: ToastOptions) => {
    setQueue((items) => [
      ...items.slice(-2),
      {
        ...options,
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : String(Date.now()),
      },
    ]);
  }, []);

  React.useEffect(() => {
    if (!current || paused) return;
    const duration = current.duration ?? (current.variant === "error" ? 6000 : 4200);
    if (duration === 0) return;
    const timer = window.setTimeout(() => dismiss(current.id), duration);
    return () => window.clearTimeout(timer);
  }, [current, dismiss, paused]);

  const Icon = current ? icons[current.variant ?? "info"] : Info;

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-5 z-[90] flex justify-center sm:inset-x-auto sm:right-6 sm:justify-end"
        aria-live="polite"
        aria-atomic="true"
      >
        {current ? (
          <div
            key={current.id}
            role={current.variant === "error" ? "alert" : "status"}
            className={cn(
              "pointer-events-auto relative w-full max-w-[400px] overflow-hidden border bg-surface shadow-lg animate-toast-in",
              "rounded-md border-border",
            )}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <span
              className={cn(
                "absolute inset-y-0 left-0 w-1",
                current.variant === "success" && "bg-success",
                current.variant === "error" && "bg-error",
                current.variant === "info" && "bg-secondary",
                current.variant === "undo" && "bg-primary",
              )}
              aria-hidden="true"
            />
            <div className="flex items-start gap-3 py-3.5 pl-5 pr-3">
              <Icon
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  current.variant === "success" && "text-success",
                  current.variant === "error" && "text-error",
                  current.variant === "info" && "text-secondary",
                  current.variant === "undo" && "text-primary",
                )}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug text-text-primary">
                  {current.title}
                </p>
                {current.description ? (
                  <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                    {current.description}
                  </p>
                ) : null}
                {current.action ? (
                  <button
                    type="button"
                    onClick={() => {
                      current.action?.onClick();
                      dismiss(current.id);
                    }}
                    className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-primary underline underline-offset-4"
                  >
                    {current.action.label}
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(current.id)}
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                aria-label="Tutup notifikasi"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast harus dipakai di dalam ToastProvider");
  }
  return context;
}
