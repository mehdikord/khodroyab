import "server-only";

import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { readSessionFromCookies } from "@/lib/auth/session";
import {
  canAccess,
  normalizePermissions,
  type AccessRequirement,
  type AdminAccess,
  type AdminPermission,
} from "@/lib/auth/permissions";

/** The signed-in administrator, with the RBAC facts resolved from the DB. */
export interface AuthorizedAdmin extends AdminAccess {
  id: string;
  name: string;
  phone: string;
  isRoot: boolean;
  roleName: string | null;
  permissions: AdminPermission[];
}

export const ADMIN_UNAUTHENTICATED_MESSAGE = "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";
export const ADMIN_FORBIDDEN_MESSAGE = "شما به این بخش دسترسی ندارید.";

/**
 * Resolve the currently authenticated administrator, validating that the
 * account still exists and is active in the database, and loading its
 * permissions on every request so role changes apply immediately.
 */
export async function getCurrentAdmin(): Promise<AuthorizedAdmin | null> {
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
    select: {
      id: true,
      name: true,
      phone: true,
      isRoot: true,
      isActive: true,
      role: { select: { name: true, permissions: { select: { permission: true } } } },
    },
  });

  if (!admin || !admin.isActive) {
    return null;
  }

  return {
    id: admin.id.toString(),
    name: admin.name,
    phone: admin.phone,
    isRoot: admin.isRoot,
    roleName: admin.isRoot ? null : admin.role?.name ?? null,
    // Root needs no list: every check short-circuits on `isRoot`.
    permissions: admin.isRoot ? [] : normalizePermissions(admin.role?.permissions.map((p) => p.permission) ?? []),
  };
}

/**
 * Server-side authorization guard for protected layouts and pages.
 * Redirects unauthenticated visitors to the login screen.
 */
export async function requireAdmin(): Promise<AuthorizedAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin");
  }
  return admin;
}

/**
 * Page guard: signed in *and* allowed into the section. Admins without the
 * permission land on the "no access" page instead of seeing the module.
 */
export async function requireAdminAccess(requirement: AccessRequirement): Promise<AuthorizedAdmin> {
  const admin = await requireAdmin();
  if (!canAccess(admin, requirement)) {
    redirect("/admin/forbidden");
  }
  return admin;
}

/**
 * Server-action guard. Returns the admin, or the Persian message to send back
 * to the client (session expired vs. not allowed).
 */
export async function authorizeAdminAction(
  requirement: AccessRequirement
): Promise<{ ok: true; admin: AuthorizedAdmin } | { ok: false; message: string }> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, message: ADMIN_UNAUTHENTICATED_MESSAGE };
  if (!canAccess(admin, requirement)) return { ok: false, message: ADMIN_FORBIDDEN_MESSAGE };
  return { ok: true, admin };
}

/** Convenience for actions: the denial message, or null when allowed. */
export async function adminActionDenied(requirement: AccessRequirement): Promise<string | null> {
  const result = await authorizeAdminAction(requirement);
  return result.ok ? null : result.message;
}
