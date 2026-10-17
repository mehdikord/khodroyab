import { SignJWT, jwtVerify, type JWTPayload } from "jose";

/**
 * Edge-compatible JWT helpers for administrator and user sessions.
 *
 * This module intentionally has no `server-only` marker and no dependency on
 * `next/headers`, so it can be imported from both Node.js server code and
 * Edge Middleware.
 *
 * Tokens carry an `aud` (audience) claim that separates the two session kinds.
 * A user token can therefore never be replayed as an admin session and vice
 * versa, even though both are signed with the same secret.
 */

const JWT_ALGORITHM = "HS256";

/** Session audiences. Admin tokens issued before this claim existed have none. */
export type SessionAudience = "admin" | "user";

/** Identity embedded inside a session token. */
export interface AdminSessionPayload extends JWTPayload {
  sub: string; // account id (as string; ids are BigInt)
  name: string;
  phone: string;
}

export interface CurrentAdmin {
  id: string;
  name: string;
  phone: string;
}

export function getAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Configure it in .env before starting the server."
    );
  }
  return new TextEncoder().encode(secret);
}

/** Create a signed, expiring session token for an account of the given audience. */
export async function createSessionToken(
  account: CurrentAdmin,
  ttlSeconds: number,
  audience: SessionAudience = "admin"
): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000);

  return new SignJWT({ name: account.name, phone: account.phone })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setSubject(account.id)
    .setAudience(audience)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + ttlSeconds)
    .sign(getAuthSecret());
}

function audienceMatches(aud: JWTPayload["aud"], expected: SessionAudience): boolean {
  if (aud === undefined) {
    // Legacy admin tokens were issued without an audience; keep them valid
    // until they expire. User tokens always carry one.
    return expected === "admin";
  }
  const list = Array.isArray(aud) ? aud : [aud];
  return list.length === 1 && list[0] === expected;
}

/**
 * Verify a session token for the given audience; returns the payload or null
 * when invalid, expired or issued for a different audience.
 */
export async function verifySessionToken(
  token: string,
  audience: SessionAudience = "admin"
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret(), {
      algorithms: [JWT_ALGORITHM],
    });
    if (
      typeof payload.sub !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.phone !== "string" ||
      !audienceMatches(payload.aud, audience)
    ) {
      return null;
    }
    return payload as AdminSessionPayload;
  } catch {
    return null;
  }
}
