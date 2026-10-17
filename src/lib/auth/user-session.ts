import "server-only";

import { cookies } from "next/headers";

import { USER_SESSION_COOKIE, getSessionTtlSeconds } from "@/lib/auth/constants";
import { createSessionToken, verifySessionToken } from "@/lib/auth/jwt";

/** Identity of the signed-in customer (user panel). */
export interface SessionUser {
  id: string;
  name: string;
  phone: string;
}

/** Create a signed user-session token using the configured TTL. */
export function issueUserSessionToken(user: SessionUser): Promise<string> {
  return createSessionToken(user, getSessionTtlSeconds(), "user");
}

/** Read and verify the current user session from the request cookies. */
export async function readUserSessionFromCookies(): Promise<SessionUser | null> {
  const token = cookies().get(USER_SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token, "user");
  if (!payload) return null;
  return { id: payload.sub, name: payload.name, phone: payload.phone };
}

/** Persist a user session token in a hardened HttpOnly cookie. */
export function setUserSessionCookie(token: string): void {
  cookies().set({
    name: USER_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getSessionTtlSeconds(),
  });
}

/** Remove the user session cookie. */
export function clearUserSessionCookie(): void {
  cookies().set({
    name: USER_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
