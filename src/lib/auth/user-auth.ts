import "server-only";

import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { readUserSessionFromCookies, type SessionUser } from "@/lib/auth/user-session";

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
