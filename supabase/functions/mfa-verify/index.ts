// Verifies a TOTP code. If the factor is pending, enables it on first success.
// Also accepts a backup code (single-use).
import { z } from "npm:zod@3.23.8";
import { Secret, TOTP } from "npm:otpauth@9.5.1";
import { adminClient, corsHeaders, getUserFromRequest, json } from "../_shared/auth-context.ts";

const Body = z.object({ code: z.string().min(6).max(12) });

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const user = await getUserFromRequest(req);
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten() }, 400);
    const raw = parsed.data.code.trim().replace(/\s/g, "");

    const admin = adminClient();
    const { data: factor } = await admin
      .from("mfa_factors")
      .select("totp_secret, enabled_at")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!factor) return json({ error: "No MFA factor enrolled" }, 400);

    // Backup code path (alphanumeric, length 10).
    if (raw.length >= 8 && /[A-Z]/i.test(raw)) {
      const hash = await sha256Hex(raw.toUpperCase());
      const { data: backup } = await admin
        .from("mfa_backup_codes")
        .select("id, used_at")
        .eq("user_id", user.id)
        .eq("code_hash", hash)
        .maybeSingle();
      if (!backup || backup.used_at) return json({ error: "Invalid code" }, 400);
      await admin
        .from("mfa_backup_codes")
        .update({ used_at: new Date().toISOString() })
        .eq("id", backup.id);
      if (!factor.enabled_at) {
        await admin
          .from("mfa_factors")
          .update({ enabled_at: new Date().toISOString() })
          .eq("user_id", user.id);
      }
      await admin
        .from("mfa_factors")
        .update({ last_used_at: new Date().toISOString() })
        .eq("user_id", user.id);
      return json({ verified: true, usedBackupCode: true });
    }

    // TOTP path.
    const totp = new TOTP({
      issuer: "Goldfin Desk",
      label: user.email ?? user.id,
      secret: Secret.fromBase32(factor.totp_secret),
    });
    const delta = totp.validate({ token: raw, window: 1 });
    if (delta === null) return json({ error: "Invalid code" }, 400);

    if (!factor.enabled_at) {
      await admin
        .from("mfa_factors")
        .update({ enabled_at: new Date().toISOString() })
        .eq("user_id", user.id);
    }
    await admin
      .from("mfa_factors")
      .update({ last_used_at: new Date().toISOString() })
      .eq("user_id", user.id);
    return json({ verified: true });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
