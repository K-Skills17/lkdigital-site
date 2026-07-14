import { submitToIndexNow, getAllSiteUrls } from "@/lib/indexnow";

/**
 * POST /api/indexnow
 *
 * Submit URLs to IndexNow. Protected by Bearer token (INDEXNOW_SECRET).
 *
 * Body options:
 *   { "all": true }                     — submit every known site URL
 *   { "urls": ["https://..."] }         — submit specific URLs
 *
 * Example Railway deploy hook:
 *   curl -X POST https://lkdigital.odo.br/api/indexnow \
 *     -H "Authorization: Bearer $INDEXNOW_SECRET" \
 *     -H "Content-Type: application/json" \
 *     -d '{"all": true}'
 */
export async function POST(req: Request) {
  // Auth check
  const auth = req.headers.get("authorization") ?? "";
  const secret = process.env.INDEXNOW_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { all?: boolean; urls?: string[] } = {};
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const urls = body.all ? getAllSiteUrls() : (body.urls ?? []);

  if (urls.length === 0) {
    return Response.json({ error: "No URLs provided. Send { all: true } or { urls: [...] }" }, { status: 400 });
  }

  try {
    const result = await submitToIndexNow(urls);
    return Response.json(result, { status: result.ok ? 200 : 502 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
