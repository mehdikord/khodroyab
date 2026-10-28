import React from "react";
import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth/guards";
import { listSponsors } from "@/lib/sponsors";
import { SponsorsManager } from "@/components/admin/sponsors/SponsorsManager";

export const metadata: Metadata = {
  title: "مدیریت حامیان | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** Sponsors module: full CRUD + ordering for the logo strip on the customer login page. */
export default async function AdminSponsorsPage() {
  await requireAdmin();
  const sponsors = await listSponsors();
  return <SponsorsManager initialSponsors={sponsors} />;
}
