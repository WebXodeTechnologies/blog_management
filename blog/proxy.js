import { NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes (/api/*)
     * - static files (_next/static, _next/image, favicon.ico, etc.)
     * - public asset extensions (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default function middleware(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const { pathname } = url;

  // Root domains to treat as the main application host
  const rootDomains = [
    "localhost:3000",
    "127.0.0.1:3000",
    process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000",
  ];

  // Strip port for domain matching
  const hostWithoutPort = hostname.replace(/:\d+$/, "");
  const isRoot = rootDomains.some(
    (root) => hostWithoutPort === root.replace(/:\d+$/, ""),
  );

  let isSubdomain = false;
  let tenantSlug = null;

  if (!isRoot) {
    // Extract subdomain: "tenant1.localhost:3000" -> "tenant1"
    const parts = hostWithoutPort.split(".");
    if (parts.length > (hostWithoutPort.includes("localhost") ? 1 : 2)) {
      tenantSlug = parts[0];
      isSubdomain = true;
    }
  }

  // Clone headers to pass tenantSlug to downstream Server Components
  const requestHeaders = new Headers(req.headers);
  if (tenantSlug) {
    requestHeaders.set("x-tenant-slug", tenantSlug);
  }

  // 1. Subdomain Rewriting Logic
  if (isSubdomain && tenantSlug) {
    // Prevent platform admin access from a tenant subdomain
    if (pathname.startsWith("/platform-admin")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Subdomain root ("tenant1.localhost:3000/") -> rewrite to "/(public)/blog" or tenant dashboard
    if (pathname === "/") {
      return NextResponse.rewrite(
        new URL(`/dashboard/${tenantSlug}`, req.url),
        { request: { headers: requestHeaders } },
      );
    }

    // Rewrite internal paths under subdomain
    return NextResponse.rewrite(
      new URL(`/dashboard/${tenantSlug}${pathname}`, req.url),
      { request: { headers: requestHeaders } },
    );
  }

  // 2. Standard Root Domain Request
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
