"use server";

import { timingSafeEqual, createHash } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema } from "@/schemas/product";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  DEMO_ADMIN_COOKIE,
  createDemoAdminToken,
} from "@/lib/auth";
import {
  getDemoAdminEmail,
  getDemoAdminPassword,
  isDemoMode,
} from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { safeNextPath } from "@/lib/utils";
import type { ActionState } from "@/types/action-state";

function safeEqual(left: string, right: string): boolean {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export async function loginAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") || undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa email dan password yang kamu masukkan.",
      fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  const limit = await rateLimit(`admin-login:${ip}`, 10, 60_000);
  if (!limit.success) {
    return {
      status: "error",
      message: "Terlalu banyak percobaan masuk. Tunggu satu menit lalu coba lagi.",
    };
  }

  const nextPath = safeNextPath(parsed.data.next);
  const email = parsed.data.email;

  if (isDemoMode()) {
    const validEmail = safeEqual(email, getDemoAdminEmail().toLowerCase());
    const validPassword = safeEqual(parsed.data.password, getDemoAdminPassword());
    if (!validEmail || !validPassword) {
      logger.warn("demo_login_failed", { route: "loginAction" });
      return {
        status: "error",
        message: "Email atau password tidak cocok. Coba lagi.",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set(DEMO_ADMIN_COOKIE, createDemoAdminToken(email), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    redirect(nextPath);
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      status: "error",
      message: "Login belum dikonfigurasi di server ini.",
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    logger.warn("login_failed", { route: "loginAction" });
    return {
      status: "error",
      message: "Email atau password tidak cocok. Coba lagi.",
    };
  }

  if (data.user.app_metadata?.role !== "admin") {
    await supabase.auth.signOut();
    logger.warn("login_non_admin", { route: "loginAction", userId: data.user.id });
    return {
      status: "error",
      message: "Akun ini tidak memiliki akses ke inventaris.",
    };
  }

  redirect(nextPath);
}

export async function signOutAction() {
  if (isDemoMode()) {
    const cookieStore = await cookies();
    cookieStore.delete(DEMO_ADMIN_COOKIE);
  } else {
    const supabase = await createSupabaseServerClient();
    await supabase?.auth.signOut();
  }
  redirect("/admin/login");
}
