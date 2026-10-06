// lib/ratelimit.ts
// Fixed-window rate limiting shared by every serverless instance, stored in
// the `rate_limits` table. Keys are hashed (no raw IPs or phone numbers are
// stored). Fails open: if the database is down, requests go through — losing
// a real lead is worse than letting a few extra requests in.

import { createHash } from "crypto";
import { isDbConfigured, query } from "@/lib/db";

export interface Limit {
  name: string;
  max: number;
  windowSec: number;
}

const m = 60;
const h = 60 * m;

export const LIMITS = {
  /** Free-tool lead submissions per visitor IP. */
  leadIpBurst: { name: "lead-ip-10m", max: 5, windowSec: 10 * m },
  leadIpDaily: { name: "lead-ip-1d", max: 20, windowSec: 24 * h },
  /** WhatsApp reports + AI plans per destination number (stops using us to spam someone). */
  leadPhoneDaily: { name: "lead-phone-1d", max: 4, windowSec: 24 * h },
  /** Site scanner fetches arbitrary URLs — keep it tight. */
  scanIp: { name: "scan-ip-10m", max: 10, windowSec: 10 * m },
  /** Browser funnel events proxied to Meta. */
  capiIp: { name: "capi-ip-10m", max: 60, windowSec: 10 * m },
  /** RAIO-X / Unicórnio / scorecard forms. */
  formIp: { name: "form-ip-10m", max: 5, windowSec: 10 * m },
} satisfies Record<string, Limit>;

export interface LimitResult {
  ok: boolean;
  /** Seconds until the current window resets (only meaningful when !ok). */
  retryAfter: number;
}

function keyFor(limit: Limit, id: string): string {
  const digest = createHash("sha256").update(id).digest("hex").slice(0, 24);
  return `${limit.name}:${digest}`;
}

/** Count one hit against `limit` for `id` and say whether it is still allowed. */
export async function hit(limit: Limit, id: string): Promise<LimitResult> {
  if (!id || !isDbConfigured()) return { ok: true, retryAfter: 0 };
  try {
    const rows = await query<{ count: number; reset_in: number }>(
      `insert into rate_limits (key, window_start, count)
       values ($1, to_timestamp(floor(extract(epoch from now()) / $2::int) * $2::int), 1)
       on conflict (key, window_start) do update set count = rate_limits.count + 1
       returning count, ceil($2::int - (extract(epoch from now()) - extract(epoch from window_start)))::int as reset_in`,
      [keyFor(limit, id), limit.windowSec]
    );
    const { count, reset_in } = rows[0];
    // Opportunistic cleanup so the table stays small without a cron job.
    if (Math.random() < 0.01) {
      query(`delete from rate_limits where window_start < now() - interval '2 days'`).catch(() => {});
    }
    return { ok: Number(count) <= limit.max, retryAfter: Math.max(1, Number(reset_in)) };
  } catch (err) {
    console.error(`[ratelimit] ${limit.name} check failed — allowing:`, err);
    return { ok: true, retryAfter: 0 };
  }
}

/** Check several limits; returns the first that is exceeded, or ok. All are counted. */
export async function hitAll(checks: Array<[Limit, string | null | undefined]>): Promise<LimitResult> {
  const results = await Promise.all(checks.map(([l, id]) => hit(l, id ?? "")));
  return results.find((r) => !r.ok) ?? { ok: true, retryAfter: 0 };
}

/** Best client IP on Vercel (x-real-ip is set by the platform). */
export function clientIp(headers: Headers): string {
  return headers.get("x-real-ip") || headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
}

export function tooManyRequests(retryAfter: number): Response {
  return new Response(
    JSON.stringify({ error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." }),
    { status: 429, headers: { "Content-Type": "application/json", "Retry-After": String(retryAfter) } }
  );
}
