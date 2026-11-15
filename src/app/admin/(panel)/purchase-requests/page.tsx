import { redirect } from "next/navigation";

import { requireAdminAccess } from "@/lib/auth/guards";

/** `/admin/purchase-requests` opens the public list. */
export default async function AdminPurchaseRequestsIndex() {
  await requireAdminAccess("root");
  redirect("/admin/purchase-requests/public");
}
