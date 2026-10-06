// lib/painel-auth.ts
// Who may use /painel (dashboard + blog admin). HTTP Basic auth against:
//   PAINEL_USERS="ana:senha-forte,bruno:outra-senha"   (one login per admin)
// or, for a single shared login, PAINEL_USER (default "lk") + PAINEL_PASSWORD.
// Closed when neither is set. Runs in middleware (edge), so no Node APIs.

export function parseUsers(env: Record<string, string | undefined>): Map<string, string> {
  const users = new Map<string, string>();
  for (const entry of (env.PAINEL_USERS ?? "").split(",")) {
    const i = entry.indexOf(":");
    if (i > 0) {
      const name = entry.slice(0, i).trim();
      const pass = entry.slice(i + 1).trim();
      if (name && pass) users.set(name, pass);
    }
  }
  if (env.PAINEL_PASSWORD) users.set(env.PAINEL_USER?.trim() || "lk", env.PAINEL_PASSWORD);
  return users;
}

/** Constant-time-ish comparison so response timing doesn't leak the password. */
function safeEqual(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

/** Returns the admin's username, or null if the Authorization header is missing/wrong. */
export function authenticate(authorization: string | null, env: Record<string, string | undefined>): string | null {
  if (!authorization?.startsWith("Basic ")) return null;
  let decoded: string;
  try {
    decoded = new TextDecoder().decode(Uint8Array.from(atob(authorization.slice(6)), (c) => c.charCodeAt(0)));
  } catch {
    return null;
  }
  const i = decoded.indexOf(":");
  if (i < 0) return null;
  const user = decoded.slice(0, i);
  const pass = decoded.slice(i + 1);
  const expected = parseUsers(env).get(user);
  return expected !== undefined && safeEqual(pass, expected) ? user : null;
}

/** Header the middleware sets with the signed-in admin's name (never trusted from the client). */
export const PAINEL_USER_HEADER = "x-painel-user";
