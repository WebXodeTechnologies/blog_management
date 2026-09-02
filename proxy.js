import { NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (common files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

const RESERVED_SUBDOMAINS = new Set([
  "www",
  "app",
  "admin",
  "platform-admin",
  "api",
  "mail",
  "status",
  "staging",
]);

/**
 * Fast Edge JWT payload decoder without blocking heavy thread loops
 */
function decodeJwtPayload(token) {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    let base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    const decoded = JSON.parse(atob(base64));
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export default function proxy(req) {
  const url = req.nextUrl;
  const { pathname } = url;
  const token = req.cookies.get("token")?.value;
  const user = decodeJwtPayload(token);

  // --- Auth Route Guards ---
  if ((pathname === "/login" || pathname === "/register") && user) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/bookmarks") ||
    pathname.startsWith("/moderator");

  if (isProtected && !user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --- Subdomain Tenant Resolution ---
  const rawHost =
    req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const hostWithoutPort = rawHost.split(":")[0].toLowerCase();
  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost")
    .split(":")[0]
    .toLowerCase();

  let tenantSlug = null;
  if (
    hostWithoutPort.endsWith("localhost") ||
    hostWithoutPort.endsWith(rootDomain)
  ) {
    const parts = hostWithoutPort.split(".");
    if (
      parts.length > 2 ||
      (hostWithoutPort.endsWith("localhost") && parts.length > 1)
    ) {
      const subdomain = parts[0];
      if (
        subdomain &&
        !RESERVED_SUBDOMAINS.has(subdomain) &&
        subdomain !== rootDomain
      ) {
        tenantSlug = subdomain;
      }
    }
  }

  const requestHeaders = new Headers(req.headers);
  if (tenantSlug) {
    requestHeaders.set("x-tenant-slug", tenantSlug);

    // Prevent rewriting internal Next.js paths or API calls to avoid infinite loops
    if (
      !pathname.startsWith("/_next") &&
      !pathname.startsWith("/api") &&
      !pathname.startsWith(`/${tenantSlug}`)
    ) {
      return NextResponse.rewrite(
        new URL(`/${tenantSlug}${pathname === "/" ? "" : pathname}`, req.url),
        {
          request: { headers: requestHeaders },
        }
      );
    }
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}
