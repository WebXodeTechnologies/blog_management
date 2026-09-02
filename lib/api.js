/**
 * Centralized API Helper & Tenant Header Interceptor
 */

/**
 * Extracts active tenant slug from subdomain, localStorage, or fallback
 */
export function getActiveTenantSlug() {
  if (typeof window === "undefined") return "general";

  try {
    const stored = localStorage.getItem("activeTenantSlug");
    if (stored) return stored;

    const hostname = window.location.hostname;
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost";
    if (hostname.endsWith(rootDomain) && hostname !== rootDomain) {
      const subdomain = hostname.replace(`.${rootDomain}`, "").split(":")[0];
      if (subdomain && subdomain !== "www" && subdomain !== "app") {
        return subdomain;
      }
    }
  } catch {}

  return "general";
}

/**
 * Centralized fetch wrapper that automatically injects x-tenant-slug header
 */
export async function apiFetch(url, options = {}) {
  const tenantSlug = getActiveTenantSlug();

  const headers = {
    "Content-Type": "application/json",
    ...(tenantSlug ? { "x-tenant-slug": tenantSlug } : {}),
    ...(options.headers || {}),
  };

  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
