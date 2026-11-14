import React from "react";

import { getCurrentUser } from "@/lib/auth/user-auth";
import { PanelShell } from "@/components/panel/PanelShell";
import { readPanelTheme } from "@/lib/panel-theme-server";
import { getSystemSettings } from "@/lib/system-settings";

/**
 * Shared chrome of every customer-panel page, for members and guests alike.
 *
 * The public pages (dashboard, sale-ad search and details, price list, about,
 * contact; see `isPublicPanelPath`) render for guests too. Every other page
 * enforces sign-in itself, server-side on every request, via `requireUser()` /
 * `requireCollaborator()`; this layout never authorizes anything.
 */
export default async function PanelAppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const theme = readPanelTheme();
  const settings = await getSystemSettings();

  return (
    <PanelShell
      user={
        user
          ? { name: user.name, phone: user.phone, image: user.image, collabrate: user.collabrate, authenticaed: user.authenticaed }
          : null
      }
      theme={theme}
      consultationPhone={settings.consultationPhone}
      notice={settings.adPageNotice}
    >
      {children}
    </PanelShell>
  );
}
