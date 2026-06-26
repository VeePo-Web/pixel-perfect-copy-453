# Plaid `access_token` Encryption at Rest — Drop-in Implementation
## Security launch-gate (engine-fix Task 2). Ready to apply + verify in Sandbox.

> **Why this is a doc, not a pushed code change:** this gates *every* Plaid API call. A
> misconfigured key or decrypt path would break every customer's bank connection. It cannot
> be verified from the frontend lane (no Supabase/Deno runtime here), and the backend creed is
> "fail safe and loud." So this is a precise, dual-path-safe implementation to apply and verify
> in **Sandbox before Production** (Plaid's required path), owned by Lovable / `/cog-admin`.
> It reuses the project's existing Supabase **Vault** pattern (already used for `cron_secret`).

---

## The doctrine
- `plaid_items.access_token` is currently a plaintext column. A DB leak exposes every bank link.
- Encrypt with **pgsodium** (Supabase's bundled libsodium). Store ciphertext; decrypt **server-side only**, inside the edge function, immediately before the Plaid call. Never return it to the client.
- **Dual-path + lazy backfill** so no existing connection breaks during rollout: read prefers ciphertext, falls back to plaintext; every successful read backfills the ciphertext and nulls the plaintext.

---

## 1 — Migration (additive, reversible-in-business-terms)

```sql
-- 20260626_xxxxxx_plaid_token_encryption.sql
create extension if not exists pgsodium;

-- A dedicated key for Plaid tokens (id stored, key material stays in the keyring).
-- Idempotent: reuse if it already exists.
do $$
declare k uuid;
begin
  select id into k from pgsodium.key where name = 'plaid_access_token_key' limit 1;
  if k is null then perform pgsodium.create_key(name => 'plaid_access_token_key'); end if;
end $$;

alter table public.plaid_items
  add column if not exists access_token_cipher bytea,
  add column if not exists access_token_nonce  bytea;

-- RLS already denies client access to plaid_items; these columns inherit that.
-- service_role (edge functions) is the only reader/writer. Do NOT grant select on
-- the cipher/plaintext columns to authenticated.
```

Helper RPCs (so the edge function never handles the key directly — `SECURITY DEFINER`, service-role only):

```sql
create or replace function public.plaid_token_encrypt(p_item_id uuid, p_token text)
returns void language plpgsql security definer set search_path = public, pgsodium as $$
declare k uuid; n bytea;
begin
  select id into k from pgsodium.key where name = 'plaid_access_token_key' limit 1;
  n := pgsodium.crypto_aead_det_noncegen();
  update public.plaid_items
     set access_token_cipher = pgsodium.crypto_aead_det_encrypt(
           convert_to(p_token,'utf8'), convert_to(id::text,'utf8'), k, n),
         access_token_nonce  = n,
         access_token = null               -- drop plaintext once encrypted
   where id = p_item_id;
end $$;

create or replace function public.plaid_token_decrypt(p_item_id uuid)
returns text language plpgsql security definer set search_path = public, pgsodium as $$
declare k uuid; r record;
begin
  select access_token, access_token_cipher, access_token_nonce into r
    from public.plaid_items where id = p_item_id;
  if r.access_token_cipher is not null then
    select id into k from pgsodium.key where name = 'plaid_access_token_key' limit 1;
    return convert_from(
      pgsodium.crypto_aead_det_decrypt(
        r.access_token_cipher, convert_to(p_item_id::text,'utf8'), k, r.access_token_nonce),
      'utf8');
  end if;
  return r.access_token;                   -- dual-path fallback during rollout
end $$;

revoke all on function public.plaid_token_encrypt(uuid,text) from anon, authenticated;
revoke all on function public.plaid_token_decrypt(uuid)      from anon, authenticated;
```

---

## 2 — Write path (`supabase/functions/plaid-exchange-public-token`)

After `/item/public_token/exchange` returns `access_token` and you insert the `plaid_items` row:

```ts
// insert the item first (without plaintext token, or insert then immediately encrypt)
const { data: item } = await admin.from("plaid_items")
  .insert({ user_id, institution_name, /* ... */ access_token }) // temp plaintext
  .select("id").single();

// encrypt + null the plaintext in one guarded RPC
const { error: encErr } = await admin.rpc("plaid_token_encrypt", {
  p_item_id: item.id, p_token: access_token,
});
if (encErr) throw encErr; // fail loud — do not leave a half-encrypted row silently
```

---

## 3 — Read path (`supabase/functions/_shared/plaid.ts` callers)

Everywhere that currently does `.select("...access_token...")` then calls Plaid, replace the
direct column read with the decrypt RPC:

```ts
// BEFORE: const token = item.access_token;
const { data: token, error } = await admin.rpc("plaid_token_decrypt", { p_item_id: item.id });
if (error || !token) throw new Error("token_unavailable");
// lazy backfill: if this row was still plaintext, encrypt it now
if (item.access_token && !item.access_token_cipher) {
  await admin.rpc("plaid_token_encrypt", { p_item_id: item.id, p_token: token });
}
// ...use `token` for the Plaid call; never return it to the client
```

Update the item-select lists (`plaid-sync-transactions`, `plaid-sync-accounts`,
`plaid-remove-item`, webhook) to stop selecting `access_token` directly and instead select
`id, access_token_cipher` and call `plaid_token_decrypt`.

---

## 4 — Verification (Sandbox first — the launch gate)
1. Apply migration in **Sandbox**. Confirm `pgsodium` extension is enabled.
2. New connect → confirm `plaid_items` row has `access_token_cipher` set and `access_token` NULL.
3. Sync transactions on that item → succeeds (decrypt path works).
4. **Backfill check:** take a pre-existing plaintext row, run one sync → confirm it now has cipher + null plaintext, and still syncs (dual-path held).
5. **Failure path:** temporarily break the key name → decrypt RPC errors → edge fn returns 500 (fails loud), connection flagged, nothing silently corrupted.
6. Only after all green in Sandbox → apply to Production. Never the reverse.

---

## 5 — What NOT to do
- Don't return the decrypted token to the client, ever.
- Don't drop the plaintext column until backfill is 100% (`select count(*) from plaid_items where access_token is not null and access_token_cipher is null` = 0).
- Don't grant `select` on token columns to `authenticated` — RLS deny-by-default + service-role RPCs only.
- Don't deploy to Production before the Sandbox failure-path test passes.
