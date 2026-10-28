import { isDemoMode } from "@/lib/env";
import { getSupabasePublic } from "@/lib/supabase/public";
import { fail, ok } from "@/lib/api-response";
import { newRequestId } from "@/lib/logger";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();
  const requestId = newRequestId();
  const headers = {
    "Cache-Control": "no-store",
    "x-request-id": requestId,
  };

  if (isDemoMode()) {
    return ok(
      {
        status: "ok",
        mode: "demo",
        database: "demo-file",
        timestamp: new Date().toISOString(),
      },
      { requestId },
      { headers },
    );
  }

  try {
    const supabase = getSupabasePublic();
    if (!supabase) {
      return fail(
        "DEPENDENCY_ERROR",
        "Database belum dikonfigurasi.",
        503,
        undefined,
        requestId,
      );
    }
    const { error } = await supabase.from("products").select("id", { count: "exact", head: true }).limit(1);
    if (error) throw error;

    return ok(
      {
        status: "ok",
        mode: "production",
        database: "up",
        timestamp: new Date().toISOString(),
      },
      { requestId, durationMs: Date.now() - startedAt },
      { headers },
    );
  } catch (error) {
    logger.error("health_check_failed", {
      requestId,
      route: "GET /api/health",
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
    });
    return fail(
      "DEPENDENCY_ERROR",
      "Layanan sedang tidak tersedia.",
      503,
      undefined,
      requestId,
    );
  }
}
