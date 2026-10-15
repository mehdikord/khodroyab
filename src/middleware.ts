import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";

/**
 * Lightweight, non-authoritative navigation guard for `/admin/*`.
 *
 * Responsibilities are deliberately narrow: block access to protected admin
 * routes when no session cookie is present at all. Cryptographic verification
 * and database validation happen server-side on every request via
 * `requireAdmin()` (protected layout) and `getCurrentAdmin()` (login page).
 *
 * This split matters: middleware cannot be the authority on whether a session
 * is *valid*, only on whether one was *offered*. Redirecting authenticated
 * users away from the login screen is therefore handled by the login page
 * itself, which can actually verify the token — this avoids redirect loops
 * caused by a stale or tampered cookie.
 *
 * Middleware is defense-in-depth and UX sugar only; it is never the sole
 * authorization mechanism.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login screen lives at exactly `/admin` and must stay reachable so the
  // server can render it (or redirect an already-verified admin onward).
  if (pathname === "/admin") {
    return NextResponse.next();
  }

  // Every other `/admin/*` route requires at least a session cookie to be
  // present before it is handed to the server for verification.
  if (!request.cookies.has(ADMIN_SESSION_COOKIE)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
