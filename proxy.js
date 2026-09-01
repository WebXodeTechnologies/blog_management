import { NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes (/api/*)
     * - Next.js internal static assets (_next/static, _next/image)
     * - favicon, robots, sitemap, public asset extensions
     */
    "/((?!api/|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

// Subdomains that must never be resolved as tenant slugs
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
 * Helper to safely decode JWT payload in Edge runtime without external crypto dependencies
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
    const jsonPayload = atob(base64);
    const decoded = JSON.parse(jsonPayload);

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

export default function proxy(req) {
  const url = req.nextUrl;
  const { pathname } = url;
  const token = req.cookies.get("token")?.value;
  const user = decodeJwtPayload(token);

  // --- Auth & Protected Route Access Control ---

  // 1. Auth Page Redirection (If user is already logged in, redirect away to /explore)
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/explore", req.url));
  }

  // 2. Redirect Legacy /moderator paths to /dashboard/articles (Unified Architecture)
  if (pathname.startsWith("/moderator")) {
    return NextResponse.redirect(new URL("/dashboard/articles", req.url));
  }

  // 3. Protected Dashboard & User Routes Check (/dashboard and /bookmarks)
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isBookmarksRoute = pathname.startsWith("/bookmarks");

  if (isDashboardRoute || isBookmarksRoute) {
    if (!user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // --- Domain & Subdomain Tenant Resolution ---
  const rawHost =
    req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const hostWithoutPort = rawHost.split(":")[0].toLowerCase();

  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost")
    .split(":")[0]
    .toLowerCase();

  let tenantSlug = null;
  let isSubdomain = false;

  // Tenant subdomain detection
  if (hostWithoutPort.endsWith("localhost")) {
    const parts = hostWithoutPort.split(".");
    if (parts.length > 1 && !RESERVED_SUBDOMAINS.has(parts[0])) {
      tenantSlug = parts[0];
      isSubdomain = true;
    }
  } else if (hostWithoutPort.endsWith(rootDomain)) {
    const subdomain = hostWithoutPort.replace(`.${rootDomain}`, "");
    if (
      subdomain &&
      subdomain !== rootDomain &&
      !RESERVED_SUBDOMAINS.has(subdomain)
    ) {
      tenantSlug = subdomain;
      isSubdomain = true;
    }
  }

  const requestHeaders = new Headers(req.headers);
  if (tenantSlug) {
    requestHeaders.set("x-tenant-slug", tenantSlug);
  }

  // --- Subdomain Routing Rules ---
  if (isSubdomain && tenantSlug) {
    if (pathname.startsWith("/platform-admin")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      pathname.startsWith(`/dashboard/${tenantSlug}`) ||
      pathname.startsWith(`/public/${tenantSlug}`)
    ) {
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }

    if (pathname === "/") {
      return NextResponse.rewrite(new URL(`/${tenantSlug}`, req.url), {
        request: { headers: requestHeaders },
      });
    }

    if (pathname.startsWith("/dashboard")) {
      const dashboardPath = pathname.replace(/^\/dashboard/, "");
      return NextResponse.rewrite(
        new URL(`/dashboard/${tenantSlug}${dashboardPath}`, req.url),
        {
          request: { headers: requestHeaders },
        }
      );
    }

    return NextResponse.rewrite(new URL(`/${tenantSlug}${pathname}`, req.url), {
      request: { headers: requestHeaders },
    });
  }

  // --- Standard Root Domain Request ---
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
