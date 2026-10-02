// POST /api/ferramentas/:tool/lead
// Single entry point for every free tool's lead form. The tool-specific bits
// live in the adapter; the routine (store → AI → CAPI → WhatsApp → alert) is shared.

import { NextRequest, NextResponse } from "next/server";
import { runLeadPipeline } from "@/lib/backbone/pipeline";
import { TOOL_ADAPTERS } from "@/lib/backbone/tools";
import { obj, str } from "@/lib/backbone/types";

export const dynamic = "force-dynamic";
// AI + WhatsApp delivery can take a few seconds.
export const maxDuration = 30;

export async function POST(req: NextRequest, { params }: { params: { tool: string } }) {
  const adapter = TOOL_ADAPTERS[params.tool];
  if (!adapter) return NextResponse.json({ error: "Ferramenta desconhecida" }, { status: 404 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido" }, { status: 400 });
  }

  const meta = obj(obj(body)._meta);
  const utmRaw = obj(meta.utm);
  const utm = Object.fromEntries(
    Object.entries(utmRaw)
      .filter(([k, v]) => k.startsWith("utm_") && typeof v === "string")
      .map(([k, v]) => [k, String(v).slice(0, 200)])
  );

  try {
    const result = await runLeadPipeline(adapter, body, {
      clientIp: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip"),
      userAgent: req.headers.get("user-agent"),
      sourceUrl: str(meta.pageUrl) || req.headers.get("referer"),
      eventId: str(meta.eventId) || null,
      utm: Object.keys(utm).length ? utm : null,
    });
    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error(`[api/ferramentas/${params.tool}] pipeline error:`, err);
    // Never block the visitor's results page on a backend failure.
    return NextResponse.json({ success: true, messageSent: false });
  }
}
