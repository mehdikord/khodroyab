import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { userToRecord } from "@/lib/users";
import { PendingUsersManager } from "@/components/admin/users/pending/PendingUsersManager";

export const metadata: Metadata = {
  title: "کاربران در انتظار تایید | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** Self-registered accounts waiting for approval (`users.approved_at IS NULL`). */
export default async function AdminPendingUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    where: { approvedAt: null },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });

  return <PendingUsersManager initialUsers={users.map(userToRecord)} />;
}
