import { SignJWT, jwtVerify, type JWTPayload } from "jose";

/**
 * Edge-compatible JWT helpers for administrator sessions.
 *
 * This module intentionally has no `server-only` marker and no dependency on
 * `next/headers`, so it can be imported from both Node.js server code and
 * Edge Middleware.
 */

const JWT_ALGORITHM = "HS256";

/** Admin identity embedded inside the session token. */
export interface AdminSessionPayload extends JWTPayload {
  sub: string; // admin id (as string; ids are BigInt)
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

/** Create a signed, expiring session token for an administrator. */
export async function createSessionToken(
  admin: CurrentAdmin,
  ttlSeconds: number
): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000);

  return new SignJWT({ name: admin.name, phone: admin.phone })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setSubject(admin.id)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + ttlSeconds)
    .sign(getAuthSecret());
}

/** Verify a session token; returns the payload or null when invalid/expired. */
export async function verifySessionToken(
  token: string
): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret(), {
      algorithms: [JWT_ALGORITHM],
    });
    if (
      typeof payload.sub !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.phone !== "string"
    ) {
      return null;
    }
    return payload as AdminSessionPayload;
  } catch {
    return null;
  }
}
