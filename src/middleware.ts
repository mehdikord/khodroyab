import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_SESSION_COOKIE, USER_SESSION_COOKIE } from "@/lib/auth/constants";

/**
 * Lightweight, non-authoritative navigation guard for `/admin/*` and `/panel/*`.
 *
 * Responsibilities are deliberately narrow: block access to protected routes
 * when no session cookie is present at all. Cryptographic verification and
 * database validation happen server-side on every request via the protected
 * layouts (`requireAdmin()` / `requireUser()`) and the login pages.
 *
 * This split matters: middleware cannot be the authority on whether a session
 * is *valid*, only on whether one was *offered*. Redirecting authenticated
 * visitors away from a login screen is therefore handled by the login page
 * itself, which can actually verify the token — this avoids redirect loops
 * caused by a stale or tampered cookie.
 *
 * Middleware is defense-in-depth and UX sugar only; it is never the sole
 * authorization mechanism.
 */

interface ProtectedArea {
  /** Path prefix of the area, e.g. `/admin`. */
  prefix: string;
  /** Login screen (lives at exactly the prefix) – must stay reachable. */
  loginPath: string;
  cookieName: string;
}

const AREAS: ProtectedArea[] = [
  { prefix: "/admin", loginPath: "/admin", cookieName: ADMIN_SESSION_COOKIE },
  { prefix: "/panel", loginPath: "/panel", cookieName: USER_SESSION_COOKIE },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  for (const area of AREAS) {
    const inArea = pathname === area.prefix || pathname.startsWith(`${area.prefix}/`);
    if (!inArea) continue;

    // The login screen must stay reachable so the server can render it (or
    // redirect an already-verified account onward).
    if (pathname === area.loginPath) {
      return NextResponse.next();
    }

    // Every other route in the area requires at least a session cookie before
    // it is handed to the server for verification.
    if (!request.cookies.has(area.cookieName)) {
      const url = request.nextUrl.clone();
      url.pathname = area.loginPath;
      url.search = "";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/panel/:path*"],
};
