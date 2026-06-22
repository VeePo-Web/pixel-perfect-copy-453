// Generates a new TOTP secret + 8 backup codes for the user.
// The factor is NOT enabled until mfa-verify confirms the first code.
import { Secret, TOTP } from "npm:otpauth@9.5.1";
import { adminClient, corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomBackupCode(): string {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 10)
    .toUpperCase();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const user = await getUserFromRequest(req);
    const secret = new Secret({ size: 20 });
    const totp = new TOTP({
      issuer: "Goldfin Desk",
      label: user.email ?? user.id,
      secret,
    });

    const admin = adminClient();
    // Reset any prior pending factor for this user.
    await admin.from("mfa_factors").delete().eq("user_id", user.id);
    await admin.from("mfa_backup_codes").delete().eq("user_id", user.id);

    await admin.from("mfa_factors").insert({
      user_id: user.id,
      totp_secret: secret.base32,
      enabled_at: null,
    });

    const codes = Array.from({ length: 8 }, randomBackupCode);
    const hashed = await Promise.all(
      codes.map(async (c) => ({ user_id: user.id, code_hash: await sha256Hex(c) })),
    );
    await admin.from("mfa_backup_codes").insert(hashed);

    return json({
      otpauthUrl: totp.toString(),
      secret: secret.base32,
      backupCodes: codes,
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
