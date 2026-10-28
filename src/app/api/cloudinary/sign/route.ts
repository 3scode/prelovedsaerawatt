import { getAdminSession } from "@/lib/auth";
import { isCloudinaryConfigured } from "@/lib/env";
import { signCloudinaryUpload } from "@/lib/cloudinary";
import { fail, handleApiError, ok } from "@/lib/api-response";
import { newRequestId } from "@/lib/logger";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const startedAt = Date.now();
  const requestId = newRequestId();
  const route = "POST /api/cloudinary/sign";

  try {
    const session = await getAdminSession();
    if (!session) {
      return fail("UNAUTHORIZED", "Sesi admin tidak valid.", 401, undefined, requestId);
    }

    if (!isCloudinaryConfigured()) {
      return fail("DEPENDENCY_ERROR", "Cloudinary belum dikonfigurasi.", 503, undefined, requestId);
    }

    const limit = await rateLimit(`cloudinary-sign:${session.email}`, 10, 60_000);
    if (!limit.success) {
      const response = fail(
        "RATE_LIMITED",
        "Terlalu banyak upload. Tunggu sebentar.",
        429,
        undefined,
        requestId,
      );
      Object.entries(rateLimitHeaders(limit)).forEach(([key, value]) =>
        response.headers.set(key, value),
      );
      return response;
    }

    const signed = signCloudinaryUpload("prelovedsaerawatt/products");
    if (!signed) {
      return fail(
        "DEPENDENCY_ERROR",
        "Cloudinary belum siap. Periksa konfigurasi server.",
        503,
        undefined,
        requestId,
      );
    }

    return ok(
      { ...signed, maxBytes: 5 * 1024 * 1024 },
      { requestId },
      {
        headers: {
          "Cache-Control": "no-store",
          ...rateLimitHeaders(limit),
          "x-request-id": requestId,
        },
      },
    );
  } catch (error) {
    return handleApiError(error, requestId, route, startedAt);
  }
}
