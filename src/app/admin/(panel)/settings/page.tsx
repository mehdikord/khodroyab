import React from "react";
import type { Metadata } from "next";

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
  const settings = await getSystemSettings();
  return <SystemSettingsForm initialSettings={settings} />;
}
