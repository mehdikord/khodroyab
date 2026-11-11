import React from "react";
import type { Metadata } from "next";

import { requireUser } from "@/lib/auth/user-auth";
import { getSystemSettings } from "@/lib/system-settings";
import { AboutView } from "@/components/panel/about/AboutView";

export const metadata: Metadata = {
  title: "درباره خودرو یاب | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

/** "About Khodroyab": the text the administrator writes in the system settings. */
export default async function PanelAboutPage() {
  await requireUser();
  const { aboutText } = await getSystemSettings();

  return <AboutView text={aboutText} />;
}
