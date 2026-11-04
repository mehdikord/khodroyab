import "server-only";

import prisma from "@/lib/prisma";
import { consumeTiming, verifyPassword } from "@/lib/auth/password";
import type { CurrentAdmin } from "@/lib/auth/jwt";

/**
 * Verify administrator credentials against MySQL.
 *
 * Returns the admin identity on success, or null for any failure. Callers must
 * not distinguish between "unknown phone" and "wrong password" in responses.
 */
export async function authenticateAdmin(
  phone: string,
  password: string
): Promise<CurrentAdmin | null> {
  const admin = await prisma.admin.findUnique({
    where: { phone },
    select: { id: true, name: true, phone: true, password: true, isActive: true },
  });

  if (!admin) {
    // Equalize timing so unknown accounts are not distinguishable.
    await consumeTiming(password);
    return null;
  }

  const valid = await verifyPassword(password, admin.password);
  // A deactivated account gets the same generic failure as a wrong password,
  // and only after the hash comparison so timing does not reveal its state.
  if (!valid || !admin.isActive) {
    return null;
  }

  return { id: admin.id.toString(), name: admin.name, phone: admin.phone };
}
