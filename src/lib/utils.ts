import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatIDR(value: number): string {
  return idrFormatter.format(value).replace(/\u00a0/g, " ");
}

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatRelativeDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (diffDays <= 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 30) return `${diffDays} hari lalu`;
  if (diffDays < 60) return "Bulan lalu";
  return formatDate(date);
}

export function normalizeWhatsAppNumber(raw: string | undefined | null): string {
  if (!raw) return "";
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("8")) return `62${digits}`;
  return digits;
}

export function isValidWhatsAppNumber(raw: string | undefined | null): boolean {
  return /^62\d{8,15}$/.test(normalizeWhatsAppNumber(raw));
}

export function isNewProduct(createdAt: string, days = 7): boolean {
  return Date.now() - Date.parse(createdAt) < days * 86_400_000;
}

export function pluralizePiece(count: number): string {
  return `${count} piece`;
}

export function truncate(value: string, length = 80): string {
  return value.length > length ? `${value.slice(0, length - 1)}…` : value;
}

export function safeNextPath(value: string | null | undefined, fallback = "/admin"): string {
  if (!value) return fallback;
  if (value !== "/admin" && !value.startsWith("/admin/") && !value.startsWith("/admin?")) {
    return fallback;
  }
  if (value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}

export function generateRequestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "00000000-0000-4000-8000-000000000000";
}
