import "server-only";

import crypto from "node:crypto";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { consumeTiming, hashPassword, verifyPassword } from "@/lib/auth/password";
import { readUserSessionFromCookies, type SessionUser } from "@/lib/auth/user-session";

/** Shape of a bcrypt hash as produced by bcryptjs. */
const BCRYPT_HASH_REGEX = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

export function isBcryptHash(value: string): boolean {
  return BCRYPT_HASH_REGEX.test(value);
}

/** Constant-time equality for two strings of arbitrary length. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    // Still burn comparable time before answering.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Full profile of the signed-in customer, re-validated against the database. */
export interface CurrentUser extends SessionUser {
  image: string | null;
  /** The admin turned on collaborator mode (کاربر همکار). */
  collabrate: boolean;
  /** The admin approved the user's identity documents. */
  authenticaed: boolean;
  /**
   * Collaborator *and* verified: may publish ads and a price table, and sees
   * collaborator prices. Everyone else only sees public prices.
   */
  isPartner: boolean;
}

/** Collaborator with approved identity documents (see `CurrentUser.isPartner`). */
export function isPartnerUser(user: { collabrate: boolean; authenticaed: boolean }): boolean {
  return user.collabrate && user.authenticaed;
}

export type AuthenticateUserResult =
  | { ok: true; user: SessionUser }
  | { ok: false; reason: "invalid" | "inactive" };

/**
 * Verify customer credentials against MySQL.
 *
 * Passwords are stored as bcrypt hashes. Rows that still hold a legacy
 * plaintext value (created before hashing was enforced) are accepted once and
 * transparently upgraded to a hash on successful login.
 */
export async function authenticateUser(phone: string, password: string): Promise<AuthenticateUserResult> {
  const user = await prisma.user.findFirst({
    where: { phone },
    orderBy: { id: "asc" },
    select: { id: true, name: true, phone: true, password: true, isActive: true },
  });

  if (!user) {
    await consumeTiming(password);
    return { ok: false, reason: "invalid" };
  }

  let valid: boolean;
  if (isBcryptHash(user.password)) {
    valid = await verifyPassword(password, user.password);
  } else {
    // Legacy plaintext row: compare in constant time, then upgrade.
    await consumeTiming(password);
    valid = safeEqual(password, user.password);
    if (valid) {
      const hashed = await hashPassword(password);
      await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
    }
  }

  if (!valid) return { ok: false, reason: "invalid" };
  if (!user.isActive) return { ok: false, reason: "inactive" };

  return { ok: true, user: { id: user.id.toString(), name: user.name, phone: user.phone } };
}

/**
 * Resolve the currently signed-in customer, validating that the account still
 * exists and is active (so disabled accounts lose access immediately). The
 * collaborator flags are read fresh on every request as well.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await readUserSessionFromCookies();
  if (!session) return null;

  let userId: bigint;
  try {
    userId = BigInt(session.id);
  } catch {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, phone: true, image: true, isActive: true, collabrate: true, authenticaed: true },
  });
  if (!user || !user.isActive) return null;

  return {
    id: user.id.toString(),
    name: user.name,
    phone: user.phone,
    image: user.image,
    collabrate: user.collabrate,
    authenticaed: user.authenticaed,
    isPartner: isPartnerUser(user),
  };
}

/** Server-side guard for the user panel; redirects guests to the login screen. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/panel");
  }
  return user;
}

/**
 * Guard for the collaborators' publishing pages (my ads, my price table).
 * Non-collaborators do not have these sections at all and are sent to the
 * dashboard. Callers still check `isPartner` before allowing any write.
 */
export async function requireCollaborator(): Promise<CurrentUser> {
  const user = await requireUser();
  if (!user.collabrate) {
    redirect("/panel/dashboard");
  }
  return user;
}
