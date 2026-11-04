import "server-only";

import type { Prisma } from "@prisma/client";

import { normalizePermissions, type AdminPermission } from "@/lib/auth/permissions";

/** Serializable administrator for the admin-management screens. Never carries the password hash. */
export interface AdminRecord {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  isRoot: boolean;
  isActive: boolean;
  roleId: string | null;
  roleName: string | null;
  createdAt: string;
}

/** Serializable RBAC role. */
export interface AdminRoleRecord {
  id: string;
  name: string;
  description: string | null;
  permissions: AdminPermission[];
  /** Administrators currently assigned to the role. */
  adminCount: number;
  createdAt: string;
}

export const adminRecordSelect = {
  id: true,
  name: true,
  phone: true,
  email: true,
  isRoot: true,
  isActive: true,
  roleId: true,
  createdAt: true,
  role: { select: { name: true } },
} satisfies Prisma.AdminSelect;

type AdminRow = Prisma.AdminGetPayload<{ select: typeof adminRecordSelect }>;

export function adminToRecord(admin: AdminRow): AdminRecord {
  return {
    id: admin.id.toString(),
    name: admin.name,
    phone: admin.phone,
    email: admin.email,
    isRoot: admin.isRoot,
    isActive: admin.isActive,
    roleId: admin.roleId?.toString() ?? null,
    roleName: admin.role?.name ?? null,
    createdAt: admin.createdAt.toISOString(),
  };
}

export const adminRoleInclude = {
  permissions: { select: { permission: true } },
  _count: { select: { admins: true } },
} satisfies Prisma.AdminRoleInclude;

type AdminRoleRow = Prisma.AdminRoleGetPayload<{ include: typeof adminRoleInclude }>;

export function adminRoleToRecord(role: AdminRoleRow): AdminRoleRecord {
  return {
    id: role.id.toString(),
    name: role.name,
    description: role.description,
    permissions: normalizePermissions(role.permissions.map((p) => p.permission)),
    adminCount: role._count.admins,
    createdAt: role.createdAt.toISOString(),
  };
}

/** List order: root admins first, then newest. */
export const ADMIN_ORDER_BY: Prisma.AdminOrderByWithRelationInput[] = [{ isRoot: "desc" }, { createdAt: "desc" }, { id: "desc" }];
