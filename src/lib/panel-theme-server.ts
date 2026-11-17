import "server-only";

import { cookies } from "next/headers";

import { PANEL_THEME_COOKIE, isPanelTheme, type PanelTheme } from "@/lib/panel-theme";

/** Theme chosen by the customer, from the cookie written by the header switch. */
export async function readPanelTheme(): Promise<PanelTheme> {
  const value = (await cookies()).get(PANEL_THEME_COOKIE)?.value;
  return isPanelTheme(value) ? value : "dark";
}
