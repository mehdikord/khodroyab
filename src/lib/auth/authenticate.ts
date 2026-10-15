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
    select: { id: true, name: true, phone: true, password: true },
  });

  if (!admin) {
    // Equalize timing so unknown accounts are not distinguishable.
    await consumeTiming(password);
    return null;
  }

  const valid = await verifyPassword(password, admin.password);
  if (!valid) {
    return null;
  }

  return { id: admin.id.toString(), name: admin.name, phone: admin.phone };
}
