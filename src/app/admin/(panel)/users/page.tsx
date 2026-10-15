import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { userToRecord } from "@/lib/users";
import { UsersManager } from "@/components/admin/users/UsersManager";

export const metadata: Metadata = {
  title: "مدیریت کاربران | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  return (
    <UsersManager initialUsers={users.map(userToRecord)} />
  );
}
