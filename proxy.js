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

export default function proxy(req) {
  const url = req.nextUrl;
  const { pathname } = url;

  // Support direct host or Nginx reverse proxy forwarded host
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
    // Handles "tenant1.localhost" (2 parts)
    if (parts.length > 1 && !RESERVED_SUBDOMAINS.has(parts[0])) {
      tenantSlug = parts[0];
      isSubdomain = true;
    }
  } else if (hostWithoutPort.endsWith(rootDomain)) {
    // Handles "tenant1.texora.com" (production/staging)
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

  // Clone request headers to inject tenant metadata for downstream Server Components
  const requestHeaders = new Headers(req.headers);
  if (tenantSlug) {
    requestHeaders.set("x-tenant-slug", tenantSlug);
  }

  // --- Subdomain Routing Rules ---
  if (isSubdomain && tenantSlug) {
    // 1. Block access to platform administration from a tenant subdomain
    if (pathname.startsWith("/platform-admin")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 2. Prevent infinite rewriting loops if URL already contains the target path
    if (
      pathname.startsWith(`/dashboard/${tenantSlug}`) ||
      pathname.startsWith(`/public/${tenantSlug}`)
    ) {
      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }

    // 3. Subdomain root ("tenant1.texora.com/") -> Rewrite to tenant's public landing/blog feed
    if (pathname === "/") {
      return NextResponse.rewrite(new URL(`/${tenantSlug}`, req.url), {
        request: { headers: requestHeaders },
      });
    }

    // 4. Subdomain dashboard ("tenant1.texora.com/dashboard/...") -> Rewrite to /dashboard/[tenantSlug]/...
    if (pathname.startsWith("/dashboard")) {
      const dashboardPath = pathname.replace(/^\/dashboard/, "");
      return NextResponse.rewrite(
        new URL(`/dashboard/${tenantSlug}${dashboardPath}`, req.url),
        {
          request: { headers: requestHeaders },
        }
      );
    }

    // 5. General sub-path rewrites under tenant scope
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
