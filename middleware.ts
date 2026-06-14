import { NextResponse, type NextRequest } from "next/server";

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  return response;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const isCanonicalHost = host === "pngtostl.net";
  const isWwwHost = host === "www.pngtostl.net";
  const isHttpRequest = forwardedProto === "http" || request.nextUrl.protocol === "http:";

  if (isWwwHost || (isCanonicalHost && isHttpRequest)) {
    const url = request.nextUrl.clone();
    url.hostname = "pngtostl.net";
    url.protocol = "https:";
    return withSecurityHeaders(NextResponse.redirect(url, 308));
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};