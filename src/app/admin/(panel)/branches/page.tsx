import React from "react";
import type { Metadata } from "next";

import { requireAdminAccess } from "@/lib/auth/guards";
import { listBranches, listProvinceOptions } from "@/lib/branches";
import { BranchesManager } from "@/components/admin/branches/BranchesManager";

export const metadata: Metadata = {
  title: "مدیریت شعبه‌ها | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** Branches module: CRUD + ordering for the branches listed on the customer Contact page. */
export default async function AdminBranchesPage() {
  await requireAdminAccess("branches");
  const [branches, provinces] = await Promise.all([listBranches(), listProvinceOptions()]);
  return <BranchesManager initialBranches={branches} provinces={provinces} />;
}
