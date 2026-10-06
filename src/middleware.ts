import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authenticate, PAINEL_USER_HEADER } from "@/lib/painel-auth";

// Guards /painel (operations dashboard + blog admin) and its API. Logins come
// from PAINEL_USERS / PAINEL_PASSWORD (see lib/painel-auth.ts); closed when unset.
export function middleware(request: NextRequest) {
  const user = authenticate(request.headers.get("authorization"), process.env);
  if (!user) {
    return new NextResponse("Autenticação necessária", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="LK Painel", charset="UTF-8"' },
    });
  }

  // Browsers resend Basic credentials automatically, so refuse writes that
  // come from another site (CSRF).
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    const origin = request.headers.get("origin");
    if (origin && new URL(origin).host !== request.headers.get("host")) {
      return new NextResponse("Origem não permitida", { status: 403 });
    }
  }

  // Tell the app who is signed in (overwrites anything the client sent).
  const headers = new Headers(request.headers);
  headers.set(PAINEL_USER_HEADER, user);
  return NextResponse.next({ request: { headers } });
}

// Lives in src/ because Next.js ignores a root middleware.ts when the app uses src/.
export const config = {
  matcher: ["/painel", "/painel/:path*", "/api/painel/:path*"],
};
