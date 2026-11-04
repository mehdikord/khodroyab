import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdminAccess } from "@/lib/auth/guards";
import { ADMIN_ORDER_BY, adminRecordSelect, adminRoleInclude, adminRoleToRecord, adminToRecord } from "@/lib/admins";
import { AdminsManager } from "@/components/admin/admins/AdminsManager";

export const metadata: Metadata = {
  title: "مدیران | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default async function AdminAdminsPage() {
  const admin = await requireAdminAccess("root");

  const [admins, roles] = await Promise.all([
    prisma.admin.findMany({ select: adminRecordSelect, orderBy: ADMIN_ORDER_BY }),
    prisma.adminRole.findMany({ include: adminRoleInclude, orderBy: [{ name: "asc" }] }),
  ]);

  return (
    <AdminsManager
      initialAdmins={admins.map(adminToRecord)}
      roles={roles.map(adminRoleToRecord)}
      currentAdminId={admin.id}
    />
  );
}
