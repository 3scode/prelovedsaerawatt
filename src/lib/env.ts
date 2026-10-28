const rawPublicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === "true",
};

export type PublicEnv = typeof rawPublicEnv;

export function getPublicEnv(): PublicEnv {
  return rawPublicEnv;
}

export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === "true" || rawPublicEnv.demoMode;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(rawPublicEnv.supabaseUrl && rawPublicEnv.supabaseAnonKey);
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    rawPublicEnv.cloudinaryCloudName &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export function getSupabaseConfig() {
  if (!isSupabaseConfigured()) return null;
  return {
    url: rawPublicEnv.supabaseUrl,
    anonKey: rawPublicEnv.supabaseAnonKey,
  };
}

export function getCloudinaryConfig() {
  if (!isCloudinaryConfigured()) return null;
  return {
    cloudName: rawPublicEnv.cloudinaryCloudName,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
  };
}

export function getSiteUrl(): string {
  return rawPublicEnv.siteUrl.replace(/\/$/, "");
}

export function getDemoAdminEmail(): string {
  return process.env.DEMO_ADMIN_EMAIL || "admin@prelovedsaerawatt.local";
}

export function getDemoAdminPassword(): string {
  return process.env.DEMO_ADMIN_PASSWORD || "saerawatt123";
}

export function getAuthSecret(): string {
  return (
    process.env.AUTH_SECRET ||
    process.env.DEMO_ADMIN_PASSWORD ||
    "prelovedsaerawatt-local-demo-secret"
  );
}

export function getWhatsAppNumber(): string {
  return rawPublicEnv.whatsappNumber;
}
