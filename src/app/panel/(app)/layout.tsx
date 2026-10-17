import React from "react";

import { requireUser } from "@/lib/auth/user-auth";
import { PanelShell } from "@/components/panel/PanelShell";
import { readPanelTheme } from "@/lib/panel-theme-server";

/**
 * Protected layout for every authenticated customer-panel page.
 *
 * Authorization is enforced server-side on every request via `requireUser()`
 * before any panel markup is rendered.
 */
export default async function PanelAppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const theme = readPanelTheme();

  return (
    <PanelShell user={{ name: user.name, phone: user.phone, image: user.image }} theme={theme}>
      {children}
    </PanelShell>
  );
}
