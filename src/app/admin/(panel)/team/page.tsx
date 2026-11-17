import React from "react";
import type { Metadata } from "next";

import { requireAdminAccess } from "@/lib/auth/guards";
import { listTeamMembers } from "@/lib/team";
import { TeamManager } from "@/components/admin/team/TeamManager";

export const metadata: Metadata = {
  title: "تیم خودرویاب | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** Team module: full CRUD + ordering for the team section of the About page. */
export default async function AdminTeamPage() {
  await requireAdminAccess("team");
  const members = await listTeamMembers();
  return <TeamManager initialMembers={members} />;
}
