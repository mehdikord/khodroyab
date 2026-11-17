/**
 * Customer-panel pages that anyone may open without signing in: the
 * dashboard, the sale-ad search and each sale ad, the price list and each
 * car's price page, the sellers directory and each seller's profile, and
 * the about / contact pages. Everything else in the
 * panel (buy ads, profile, my ads, my price table, verification) needs an
 * account.
 *
 * Shared by the proxy (`src/proxy.ts`) and the server, so it must stay free of
 * server-only imports.
 */
const PUBLIC_PANEL_PATTERNS: RegExp[] = [
  /^\/panel\/dashboard$/,
  /^\/panel\/search$/,
  /^\/panel\/ads\/\d+$/,
  /^\/panel\/price-list$/,
  /^\/panel\/price-list\/[^/]+$/,
  /^\/panel\/about$/,
  /^\/panel\/contact$/,
  /^\/panel\/sellers$/,
  /^\/panel\/sellers\/\d{8}$/,
  /^\/panel\/sellers\/\d{8}\/price-list$/,
];

export function isPublicPanelPath(pathname: string): boolean {
  return PUBLIC_PANEL_PATTERNS.some((pattern) => pattern.test(pathname));
}

/** Where a signed-in visitor lands when no (valid) return path was given. */
export const PANEL_HOME = "/panel/sellers";

/**
 * The dashboard is switched off for now: `/panel/dashboard` redirects to
 * `PANEL_HOME` (the sellers page), which also replaces it as the home page.
 * Set to true to bring it back (and point `PANEL_HOME` at it again).
 */
export const DASHBOARD_ENABLED = false;

/**
 * Validate the `next` return path of the sign-in screen. Only same-site panel
 * pages are accepted, so the parameter cannot be used as an open redirect.
 */
export function safePanelNext(raw: unknown): string | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string" || value.length > 512) return null;
  if (!value.startsWith("/panel/") || value.includes("\\") || value.includes("//")) return null;
  return value;
}

/** Sign-in URL that brings the visitor back to `target` afterwards. */
export function panelLoginHref(target?: string | null): string {
  const next = safePanelNext(target);
  return next ? `/panel?next=${encodeURIComponent(next)}` : "/panel";
}
