/**
 * Provision admin Supabase.
 *
 * Pemakaian:
 *   ADMIN_EMAIL=admin@domain.com ADMIN_PASSWORD='...' bun run scripts/seed-admin.ts
 *
 * Script memakai SUPABASE_SERVICE_ROLE_KEY dari .env.local / environment.
 * Jangan pernah menjalankan file ini di browser atau mengirim service key ke client.
 * Public signup Supabase harus dimatikan; ini satu-satunya jalur provisioning admin.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.ADMIN_EMAIL ?? process.env.DEMO_ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD ?? process.env.DEMO_ADMIN_PASSWORD;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing env: NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diisi.",
  );
  process.exit(1);
}
if (!email || !password || password.length < 8) {
  console.error("Missing env: ADMIN_EMAIL dan ADMIN_PASSWORD (minimal 8 karakter) wajib diisi.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

async function findUserByEmail(targetEmail: string) {
  let page = 1;
  while (page <= 10) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const found = data.users.find((user) => user.email?.toLowerCase() === targetEmail.toLowerCase());
    if (found) return found;
    if (data.users.length < 200) return null;
    page += 1;
  }
  return null;
}

async function main() {
  const normalizedEmail = email!.toLowerCase();
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password: password!,
    email_confirm: true,
    app_metadata: { role: "admin" },
    user_metadata: { name: "Admin prelovedsaerawatt" },
  });

  if (!createError && created.user) {
    console.log(`Admin dibuat: ${created.user.email} (${created.user.id})`);
    return;
  }

  if (createError && !/already|registered|exists/i.test(createError.message)) {
    throw createError;
  }

  const existing = await findUserByEmail(normalizedEmail);
  if (!existing) {
    throw new Error(
      `User ${normalizedEmail} sudah terdaftar tetapi tidak ditemukan. Periksa Supabase Auth.`,
    );
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
    password: password!,
    email_confirm: true,
    app_metadata: { ...existing.app_metadata, role: "admin" },
  });
  if (updateError) throw updateError;
  console.log(`Admin diperbarui dan role=admin: ${existing.email} (${existing.id})`);
}

main().catch((error) => {
  console.error("Gagal provisioning admin:", error instanceof Error ? error.message : error);
  process.exit(1);
});
