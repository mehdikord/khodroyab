import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdminAccess } from "@/lib/auth/guards";
import { USER_DIRECTORY_ACCESS, hasPermission } from "@/lib/auth/permissions";
import { userRecordInclude, userToRecord } from "@/lib/users";
import { UsersManager } from "@/components/admin/users/UsersManager";
import { isUserFilter } from "@/lib/users-shared";

export const metadata: Metadata = {
  title: "مدیریت کاربران | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({ searchParams }: { searchParams: { filter?: string } }) {
  // Ads / price-table admins may browse users (read-only) to act on their behalf.
  const admin = await requireAdminAccess(USER_DIRECTORY_ACCESS);

  const users = await prisma.user.findMany({
    include: userRecordInclude,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  return (
    <UsersManager
      initialUsers={users.map(userToRecord)}
      initialFilter={isUserFilter(searchParams.filter) ? searchParams.filter : "all"}
      canManage={hasPermission(admin, "users")}
    />
  );
}
