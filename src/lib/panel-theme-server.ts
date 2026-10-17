import "server-only";

import { cookies } from "next/headers";

import { PANEL_THEME_COOKIE, isPanelTheme, type PanelTheme } from "@/lib/panel-theme";

/** Theme chosen by the customer, from the cookie written by the header switch. */
export function readPanelTheme(): PanelTheme {
  const value = cookies().get(PANEL_THEME_COOKIE)?.value;
  return isPanelTheme(value) ? value : "dark";
}
