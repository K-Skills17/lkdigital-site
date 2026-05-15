import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  void request;
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|icon.svg|apple-icon|apple-touch-icon|images|robots.txt|sitemap.xml|manifest|site.webmanifest|ads.txt|app-ads.txt|\\.well-known|wp-|xmlrpc|feed|rss|atom).*)",
  ],
};
