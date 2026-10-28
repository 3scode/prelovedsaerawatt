import { getProductsByIds } from "@/lib/products";
import { cartValidateSchema } from "@/schemas/product";
import { fail, handleApiError, ok } from "@/lib/api-response";
import { getClientIp, rateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { newRequestId } from "@/lib/logger";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const startedAt = Date.now();
  const requestId = newRequestId();
  const route = "POST /api/cart/validate";

  try {
    const limit = await rateLimit(`cart-validate:${getClientIp(request)}`, 30, 60_000);
    if (!limit.success) {
      const response = fail(
        "RATE_LIMITED",
        "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi.",
        429,
        undefined,
        requestId,
      );
      Object.entries(rateLimitHeaders(limit)).forEach(([key, value]) =>
        response.headers.set(key, value),
      );
      response.headers.set("Retry-After", String(Math.ceil((limit.resetAt - Date.now()) / 1000)));
      return response;
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return fail("VALIDATION_ERROR", "Format permintaan tidak valid.", 422, undefined, requestId);
    }

    const parsed = cartValidateSchema.safeParse(body);
    if (!parsed.success) {
      return fail(
        "VALIDATION_ERROR",
        "Daftar produk tidak valid.",
        422,
        z.flattenError(parsed.error).fieldErrors,
        requestId,
      );
    }

    const uniqueIds = [...new Set(parsed.data.ids)];
    const products = await getProductsByIds(uniqueIds);
    const productMap = new Map(products.map((product) => [product.id, product]));
    const missingIds = uniqueIds.filter((id) => !productMap.has(id));

    const items = uniqueIds.flatMap((id) => {
      const product = productMap.get(id);
      if (!product) return [];
      return [
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          sku: product.sku,
          price: product.price,
          size: product.size,
          image: product.images[0] ?? "/images/placeholder.svg",
          status: product.status,
        },
      ];
    });

    const response = ok(
      {
        items,
        missingIds,
        validatedAt: new Date().toISOString(),
      },
      { requestId },
      {
        headers: {
          ...rateLimitHeaders(limit),
          "Cache-Control": "no-store",
          "x-request-id": requestId,
        },
      },
    );
    return response;
  } catch (error) {
    return handleApiError(error, requestId, route, startedAt);
  }
}
