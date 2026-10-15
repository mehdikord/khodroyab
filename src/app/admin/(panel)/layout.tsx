import React from "react";

import { requireAdmin } from "@/lib/auth/guards";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Protected layout for all authenticated admin modules.
 *
 * Authorization is enforced server-side on every request via `requireAdmin()`
 * before any panel markup is rendered. Future modules simply add route folders
 * inside this group and inherit the protection and shell automatically.
 */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <AdminShell user={{ name: admin.name, phone: admin.phone }}>
      {children}
    </AdminShell>
  );
}
