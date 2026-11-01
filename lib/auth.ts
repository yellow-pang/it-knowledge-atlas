import "server-only";
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { parsePasswordHash } from "@/lib/password-hash";

const scrypt = promisify(scryptCallback);
const cookieName = "atlas_session";
const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");
export function sameOrigin(request: Request) {
  const origin = process.env.APP_ORIGIN;
  try { return !!origin && new URL(origin).origin === origin && (process.env.NODE_ENV !== "production" || new URL(origin).protocol === "https:") && request.headers.get("origin") === origin; } catch { return false; }
}
export async function authenticated() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
  try { const result = await getDb().query("SELECT 1 FROM auth_session WHERE token_hash = $1 AND expires_at > now()", [hashToken(token)]); return !!result.rowCount; } catch { return false; }
}
export async function requireAuth() { if (!await authenticated()) redirect("/login"); }
export async function login(username: string, password: string) {
  const configuredUser = process.env.AUTH_USERNAME;
  const encoded = process.env.AUTH_PASSWORD_HASH || "";
  const match = parsePasswordHash(encoded);
  const days = Number(process.env.AUTH_SESSION_DAYS || 30);
  if (!configuredUser || !match || !Number.isInteger(days) || days < 1 || days > 30) throw new Error("인증 설정 오류");
  const db = getDb();
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query("SELECT failures, blocked_until > now() AS blocked FROM auth_attempt WHERE id = 1 FOR UPDATE");
    if (!result.rowCount) throw new Error("인증 설정 오류");
    if (result.rows[0].blocked) { await client.query("COMMIT"); return { status: "limited" as const }; }
    const derived = await scrypt(password, match.salt, 64) as Buffer;
    const valid = timingSafeEqual(derived, match.hash) && username === configuredUser;
    if (!valid) {
      await client.query("UPDATE auth_attempt SET failures = CASE WHEN failures >= 4 THEN 0 ELSE failures + 1 END, blocked_until = CASE WHEN failures >= 4 THEN now() + interval '15 minutes' ELSE NULL END WHERE id = 1");
      await client.query("COMMIT"); return { status: "invalid" as const };
    }
    const token = randomBytes(32).toString("hex");
    await client.query("DELETE FROM auth_session WHERE expires_at <= now()");
    await client.query("INSERT INTO auth_session VALUES ($1, now() + $2 * interval '1 day')", [hashToken(token), days]);
    await client.query("UPDATE auth_attempt SET failures = 0, blocked_until = NULL WHERE id = 1");
    await client.query("COMMIT");
    (await cookies()).set(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: days * 86400 });
    return { status: "ok" as const };
  } catch (error) { await client.query("ROLLBACK").catch(() => {}); throw error; } finally { client.release(); }
}
export async function logout() {
  const store = await cookies();
  const token = store.get(cookieName)?.value;
  if (token && /^[a-f0-9]{64}$/.test(token)) await getDb().query("DELETE FROM auth_session WHERE token_hash = $1", [hashToken(token)]);
  store.set(cookieName, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}
