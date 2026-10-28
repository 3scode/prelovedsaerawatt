import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseConfig } from "@/lib/env";

let cachedClient: SupabaseClient<Database> | null | undefined;

export function getSupabasePublic(): SupabaseClient<Database> | null {
  if (cachedClient !== undefined) return cachedClient;
  const config = getSupabaseConfig();
  if (!config) {
    cachedClient = null;
    return null;
  }
  cachedClient = createClient<Database>(config.url, config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        "x-application-name": "prelovedsaerawatt-storefront",
      },
    },
  });
  return cachedClient;
}
