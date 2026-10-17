/**
 * Authentication constants shared across the admin auth stack.
 *
 * This module is intentionally free of `server-only` and Next.js-specific
 * imports so it can be used from Edge Middleware as well as server code.
 */

/** Name of the HttpOnly cookie holding the signed admin session token. */
export const ADMIN_SESSION_COOKIE = "khodroyab_admin_session";

/** Name of the HttpOnly cookie holding the signed *user* (customer panel) session token. */
export const USER_SESSION_COOKIE = "khodroyab_user_session";

/** Default session lifetime: 8 hours. Overridable via AUTH_SESSION_TTL_SECONDS. */
export const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 8;

/** Resolve the configured session TTL, falling back to the default. */
export function getSessionTtlSeconds(): number {
  const raw = process.env.AUTH_SESSION_TTL_SECONDS;
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_SESSION_TTL_SECONDS;
  }
  return parsed;
}

/** bcrypt cost factor used for hashing administrator passwords. */
export const PASSWORD_HASH_ROUNDS = 12;
