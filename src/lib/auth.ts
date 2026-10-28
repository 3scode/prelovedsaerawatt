import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthSecret, getDemoAdminEmail, isDemoMode } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const DEMO_ADMIN_COOKIE = "psw_demo_admin";

export interface AdminSession {
  email: string;
  userId: string | null;
  isDemo: boolean;
}

function sign(value: string): string {
  return createHmac("sha256", getAuthSecret()).update(value).digest("base64url");
}

export function createDemoAdminToken(email: string): string {
  const payload = Buffer.from(email.toLowerCase()).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyDemoAdminToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  try {
    const valid = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    if (!valid) return null;
    return Buffer.from(payload, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  if (isDemoMode()) {
    const cookieStore = await cookies();
    const email = verifyDemoAdminToken(cookieStore.get(DEMO_ADMIN_COOKIE)?.value);
    if (!email || email !== getDemoAdminEmail().toLowerCase()) return null;
    return { email, userId: null, isDemo: true };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  if (user.app_metadata?.role !== "admin") return null;
  return {
    email: user.email ?? getDemoAdminEmail(),
    userId: user.id,
    isDemo: false,
  };
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function clearDemoAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_ADMIN_COOKIE);
}
