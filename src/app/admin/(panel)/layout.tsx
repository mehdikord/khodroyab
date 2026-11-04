import React from "react";

import { requireAdmin } from "@/lib/auth/guards";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Protected layout for all authenticated admin modules.
 *
 * Authentication is enforced server-side on every request via `requireAdmin()`
 * before any panel markup is rendered; each page additionally checks its RBAC
 * section with `requireAdminAccess()` and each server action with
 * `adminActionDenied()`. Future modules simply add route folders
 * inside this group and inherit the protection and shell automatically.
 */
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();

  return (
    <AdminShell
      user={{
        name: admin.name,
        phone: admin.phone,
        access: { isRoot: admin.isRoot, permissions: admin.permissions },
        roleLabel: admin.isRoot ? "مدیر کل" : admin.roleName ?? "بدون نقش",
      }}
    >
      {children}
    </AdminShell>
  );
}
