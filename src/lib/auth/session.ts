import "server-only";

import { cookies } from "next/headers";

import {
  ADMIN_SESSION_COOKIE,
  getSessionTtlSeconds,
} from "@/lib/auth/constants";
import {
  createSessionToken,
  verifySessionToken,
  type AdminSessionPayload,
  type CurrentAdmin,
} from "@/lib/auth/jwt";

export type { AdminSessionPayload, CurrentAdmin } from "@/lib/auth/jwt";

/** Create a signed session token using the configured TTL. */
export function issueSessionToken(admin: CurrentAdmin): Promise<string> {
  return createSessionToken(admin, getSessionTtlSeconds());
}

/** Read and verify the current admin session from the request cookies. */
export async function readSessionFromCookies(): Promise<CurrentAdmin | null> {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }
  const payload = await verifySessionToken(token);
  if (!payload) {
    return null;
  }
  return { id: payload.sub, name: payload.name, phone: payload.phone };
}

/** Persist a session token in a hardened HttpOnly cookie. */
export function setSessionCookie(token: string): void {
  const ttl = getSessionTtlSeconds();
  cookies().set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ttl,
  });
}

/** Remove the session cookie, invalidating the client's access. */
export function clearSessionCookie(): void {
  cookies().set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
