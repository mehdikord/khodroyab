import React from "react";

import { requireUser } from "@/lib/auth/user-auth";
import { PanelShell } from "@/components/panel/PanelShell";
import { readPanelTheme } from "@/lib/panel-theme-server";
import { getSystemSettings } from "@/lib/system-settings";

/**
 * Protected layout for every authenticated customer-panel page.
 *
 * Authorization is enforced server-side on every request via `requireUser()`
 * before any panel markup is rendered.
 */
export default async function PanelAppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const theme = readPanelTheme();
  const settings = await getSystemSettings();

  return (
    <PanelShell
      user={{ name: user.name, phone: user.phone, image: user.image, collabrate: user.collabrate, authenticaed: user.authenticaed }}
      theme={theme}
      consultationPhone={settings.consultationPhone}
      notice={settings.adPageNotice}
    >
      {children}
    </PanelShell>
  );
}
