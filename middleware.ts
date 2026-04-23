import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["pt", "en", "fr"];
const defaultLocale = "pt";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Determine locale from URL path
  let locale = defaultLocale;
  for (const l of locales) {
    if (pathname.startsWith(`/${l}/`) || pathname === `/${l}`) {
      locale = l;
      break;
    }
  }

  const response = NextResponse.next();
  response.headers.set("x-locale", locale);
  response.headers.set("x-current-locale", locale);
  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files, api routes, _next, and common bot probes
    "/((?!_next|favicon.ico|icon.svg|apple-icon|apple-touch-icon|images|robots.txt|sitemap.xml|manifest|site.webmanifest|ads.txt|app-ads.txt|\\.well-known|wp-|xmlrpc|feed|rss|atom).*)",
  ],
};
