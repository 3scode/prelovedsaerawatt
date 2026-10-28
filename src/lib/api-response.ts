import "server-only";

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logger } from "@/lib/logger";

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "DEPENDENCY_ERROR"
  | "INTERNAL_ERROR";

export interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: { code: ApiErrorCode; message: string; fields?: Record<string, string[]> } | null;
  meta?: Record<string, unknown>;
}

export function ok<T>(data: T, meta?: Record<string, unknown>, init?: ResponseInit) {
  const body: ApiEnvelope<T> = { success: true, data, error: null, meta };
  return NextResponse.json(body, init);
}

export function fail(
  code: ApiErrorCode,
  message: string,
  status: number,
  fields?: Record<string, string[]>,
  requestId?: string,
) {
  const body: ApiEnvelope<never> = {
    success: false,
    data: null,
    error: fields ? { code, message, fields } : { code, message },
    meta: requestId ? { requestId } : undefined,
  };
  return NextResponse.json(body, {
    status,
    headers: requestId ? { "x-request-id": requestId } : undefined,
  });
}

export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public status: number,
    public fields?: Record<string, string[]>,
  ) {
    super(message);
  }
}

export function mapError(error: unknown): {
  code: ApiErrorCode;
  message: string;
  status: number;
  fields?: Record<string, string[]>;
} {
  if (error instanceof ZodError) {
    return {
      code: "VALIDATION_ERROR",
      message: "Data yang dikirim belum lengkap atau tidak valid.",
      status: 422,
      fields: error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  if (error instanceof ApiError) {
    return {
      code: error.code,
      message: error.message,
      status: error.status,
      fields: error.fields,
    };
  }
  if (typeof error === "object" && error && "code" in error) {
    const code = String((error as { code: unknown }).code);
    if (code === "23505") {
      return { code: "CONFLICT", message: "Data serupa sudah ada.", status: 409 };
    }
    if (code === "PGRST116") {
      return { code: "NOT_FOUND", message: "Data tidak ditemukan.", status: 404 };
    }
  }
  return {
    code: "INTERNAL_ERROR",
    message: "Terjadi kesalahan di server. Coba lagi sebentar.",
    status: 500,
  };
}

export async function handleApiError(
  error: unknown,
  requestId: string,
  route: string,
  startedAt: number,
) {
  const mapped = mapError(error);
  const level = mapped.status >= 500 ? "error" : "warn";
  logger[level]("api_error", {
    requestId,
    route,
    code: mapped.code,
    durationMs: Date.now() - startedAt,
    error: error instanceof Error ? error.message : String(error),
  });
  const response = fail(
    mapped.code,
    mapped.message,
    mapped.status,
    mapped.fields,
    requestId,
  );
  response.headers.set("x-request-id", requestId);
  return response;
}
