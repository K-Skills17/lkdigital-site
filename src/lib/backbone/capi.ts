// lib/backbone/capi.ts
// Meta Conversions API — one implementation for every tool.

import { createHash } from "crypto";

const GRAPH_VERSION = "v21.0";

// The old tool repos used two different env var pairs; accept both.
function credentials() {
  const pixelId = process.env.FB_PIXEL_ID || process.env.PIXEL_ID;
  const token = process.env.FB_ACCESS_TOKEN || process.env.CAPI_ACCESS_TOKEN;
  return pixelId && token ? { pixelId, token } : null;
}

export function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export interface CapiEvent {
  event_name: string;
  event_time?: number;
  event_id?: string;
  event_source_url?: string;
  action_source?: string;
  user_data?: Record<string, unknown>;
  custom_data?: Record<string, unknown>;
}

/** Send raw events. Returns true when Meta accepted them. */
export async function sendCapiEvents(events: CapiEvent[], clientIp?: string | null, userAgent?: string | null): Promise<boolean> {
  const creds = credentials();
  if (!creds) {
    console.warn("[backbone/capi] FB_PIXEL_ID / FB_ACCESS_TOKEN not set — skipping");
    return false;
  }

  const data = events.map((e) => ({
    action_source: "website",
    event_time: Math.floor(Date.now() / 1000),
    ...e,
    user_data: {
      ...(e.user_data || {}),
      ...(clientIp ? { client_ip_address: clientIp } : {}),
      ...(userAgent ? { client_user_agent: userAgent } : {}),
    },
  }));

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${creds.pixelId}/events?access_token=${creds.token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      }
    );
    if (!res.ok) {
      console.error("[backbone/capi] Meta rejected event:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[backbone/capi] error:", err);
    return false;
  }
}

/** Standard `Lead` event with hashed contact data. */
export function leadEvent(input: {
  phone: string;
  name: string;
  email?: string | null;
  contentName: string;
  value?: number | null;
  sourceUrl?: string | null;
  eventId?: string | null;
}): CapiEvent {
  const firstName = input.name.trim().split(/\s+/)[0] || input.name;
  return {
    event_name: "Lead",
    event_id: input.eventId || undefined,
    event_source_url: input.sourceUrl || undefined,
    user_data: {
      ...(input.phone ? { ph: [sha256(input.phone)] } : {}),
      fn: [sha256(firstName)],
      ...(input.email ? { em: [sha256(input.email)] } : {}),
    },
    custom_data: {
      content_name: input.contentName,
      value: input.value ?? 0,
      currency: "BRL",
    },
  };
}
