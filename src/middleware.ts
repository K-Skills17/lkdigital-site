import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// /painel is the internal operations dashboard. It is closed unless
// PAINEL_PASSWORD is set, and then requires HTTP Basic auth
// (user PAINEL_USER, default "lk").
function painelAuthorized(request: NextRequest): boolean {
  const password = process.env.PAINEL_PASSWORD;
  if (!password) return false;
  const user = process.env.PAINEL_USER || "lk";

  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Basic ")) return false;
  try {
    const [u, ...rest] = atob(header.slice(6)).split(":");
    return u === user && rest.join(":") === password;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  if (!painelAuthorized(request)) {
    return new NextResponse("Autenticação necessária", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="LK Painel", charset="UTF-8"' },
    });
  }
  return NextResponse.next();
}

// Lives in src/ because Next.js ignores a root middleware.ts when the app uses src/.
export const config = {
  matcher: ["/painel", "/painel/:path*"],
};
