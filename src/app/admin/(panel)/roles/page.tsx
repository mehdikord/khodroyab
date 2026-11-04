import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdminAccess } from "@/lib/auth/guards";
import { adminRoleInclude, adminRoleToRecord } from "@/lib/admins";
import { RolesManager } from "@/components/admin/roles/RolesManager";

export const metadata: Metadata = {
  title: "نقش‌ها و دسترسی‌ها | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default async function AdminRolesPage() {
  await requireAdminAccess("root");

  const [roles, rootCount] = await Promise.all([
    prisma.adminRole.findMany({ include: adminRoleInclude, orderBy: [{ createdAt: "asc" }, { id: "asc" }] }),
    prisma.admin.count({ where: { isRoot: true } }),
  ]);

  return <RolesManager initialRoles={roles.map(adminRoleToRecord)} rootCount={rootCount} />;
}
