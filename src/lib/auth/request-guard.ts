import "server-only";

import { headers } from "next/headers";

/**
 * Verify that a Server Action request originates from the same site.
 *
 * Next.js already performs an Origin/Host check for Server Action requests;
 * this helper adds an explicit defense-in-depth guard shared by every action
 * module in the admin panel.
 */
export function isTrustedOrigin(): boolean {
  const headerList = headers();
  const origin = headerList.get("origin");
  const host = headerList.get("host");
  if (!origin || !host) {
    return false;
  }
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}