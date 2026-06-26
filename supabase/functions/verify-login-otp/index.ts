// Verifies a 6-digit login OTP. On success, mints a Supabase magic-link
// token_hash via admin.generateLink and returns it to the client so the
// browser can complete the session with supabase.auth.verifyOtp().
import { z } from "npm:zod@3.23.8";
import { adminClient, corsHeaders, json } from "../_shared/auth-context.ts";

const Body = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/),
});

const MAX_ATTEMPTS = 5;

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Invalid request" }, 400);
    const email = parsed.data.email.toLowerCase();
    const { code } = parsed.data;

    const admin = adminClient();
    const { data: rows, error } = await admin
      .from("login_otps")
      .select("id, user_id, code_hash, expires_at, attempts, consumed_at")
      .eq("email", email)
      .is("consumed_at", null)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) return json({ error: "Verification failed" }, 500);
    const row = rows?.[0];
    if (!row) return json({ error: "No active code. Request a new one." }, 400);

    if (new Date(row.expires_at).getTime() < Date.now()) {
      await admin.from("login_otps").update({ consumed_at: new Date().toISOString() }).eq("id", row.id);
      return json({ error: "Code expired. Request a new one." }, 400);
    }
    if (row.attempts >= MAX_ATTEMPTS) {
      await admin.from("login_otps").update({ consumed_at: new Date().toISOString() }).eq("id", row.id);
      return json({ error: "Too many attempts. Request a new code." }, 400);
    }

    const matches = timingSafeEqual(await sha256Hex(code), row.code_hash);
    if (!matches) {
      const newAttempts = row.attempts + 1;
      await admin.from("login_otps").update({ attempts: newAttempts }).eq("id", row.id);
      const remainingAttempts = Math.max(0, MAX_ATTEMPTS - newAttempts);
      return json(
        {
          error: remainingAttempts === 0 ? "Too many attempts. Request a new code." : "Incorrect code.",
          remainingAttempts,
        },
        400,
      );
    }

    await admin.from("login_otps").update({ consumed_at: new Date().toISOString() }).eq("id", row.id);

    // Mint a one-time magic-link token the browser will redeem for a session.
    const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkErr || !link?.properties?.hashed_token) {
      console.error("generateLink failed", linkErr);
      return json({ error: "Could not create session" }, 500);
    }

    return json({ ok: true, token_hash: link.properties.hashed_token });
  } catch (e) {
    console.error("verify-login-otp exception", e);
    return json({ error: "Unexpected error" }, 500);
  }
});
