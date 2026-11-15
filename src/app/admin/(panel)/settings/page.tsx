import React from "react";
import type { Metadata } from "next";

import prisma from "@/lib/prisma";
import { requireAdminAccess } from "@/lib/auth/guards";
import { getSystemSettings } from "@/lib/system-settings";
import { SystemSettingsForm } from "@/components/admin/settings/SystemSettingsForm";

export const metadata: Metadata = {
  title: "تنظیمات سیستم | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** System settings (root administrator only). */
export default async function AdminSettingsPage() {
  await requireAdminAccess("root");
  const [settings, provinceRows] = await Promise.all([
    getSystemSettings(),
    prisma.province.findMany({ select: { id: true, name: true, _count: { select: { cities: true } } } }),
  ]);
  const collator = new Intl.Collator("fa");
  const provinces = provinceRows
    .map((province) => ({ id: province.id, name: province.name, cityCount: province._count.cities }))
    .sort((a, b) => collator.compare(a.name, b.name));
  return <SystemSettingsForm initialSettings={settings} provinces={provinces} />;
}
