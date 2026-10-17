import React from "react";
import type { Viewport } from "next";

import { readPanelTheme } from "@/lib/panel-theme-server";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#07090C",
};

/**
 * Root wrapper for every `/panel/*` route (customer panel).
 *
 * The `.panel-root` class establishes the panel's design tokens and scopes its
 * styling away from the public website. `data-theme` (dark | light) comes from
 * a cookie so the chosen theme is server-rendered without a flash. The public Navbar, Footer and mobile
 * dock are suppressed for `/panel/*` routes.
 */
export default function PanelSectionLayout({ children }: { children: React.ReactNode }) {
  const theme = readPanelTheme();
  return (
    <div className="panel-root panel-scrollbar" data-theme={theme}>
      {children}
    </div>
  );
}
