// POST /api/ferramentas/capi
// Server-side proxy for browser funnel events (PageView, ViewContent…) from the
// tools. Lead events are sent by the lead pipeline, not here.

import { NextRequest, NextResponse } from "next/server";
import { sendCapiEvents, type CapiEvent } from "@/lib/backbone/capi";
import { arr, obj, str } from "@/lib/backbone/types";
import { clientIp, hit, LIMITS, tooManyRequests } from "@/lib/ratelimit";

const ALLOWED = new Set(["PageView", "ViewContent", "InitiateCheckout", "Contact", "Schedule"]);

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const limited = await hit(LIMITS.capiIp, ip);
  if (!limited.ok) return tooManyRequests(limited.retryAfter);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }

  const events = arr(obj(body).data)
    .map((e) => obj(e) as unknown as CapiEvent)
    .filter((e) => ALLOWED.has(str(e.event_name)))
    .slice(0, 10);

  if (events.length === 0) return NextResponse.json({ ok: false, skipped: true });

  const ok = await sendCapiEvents(
    events,
    ip || null,
    req.headers.get("user-agent")
  );
  return NextResponse.json({ ok });
}
