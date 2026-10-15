import "server-only";

import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import {
  readSessionFromCookies,
  type CurrentAdmin,
} from "@/lib/auth/session";

/**
 * Resolve the currently authenticated administrator, validating that the
 * account still exists in the database (so deleted/disabled accounts lose
 * access immediately).
 */
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const session = await readSessionFromCookies();
  if (!session) {
    return null;
  }

  let adminId: bigint;
  try {
    adminId = BigInt(session.id);
  } catch {
    return null;
  }

  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { id: true, name: true, phone: true },
  });

  if (!admin) {
    return null;
  }

  return { id: admin.id.toString(), name: admin.name, phone: admin.phone };
}

/**
 * Server-side authorization guard for protected layouts and pages.
 * Redirects unauthenticated visitors to the login screen.
 */
export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin");
  }
  return admin;
}
