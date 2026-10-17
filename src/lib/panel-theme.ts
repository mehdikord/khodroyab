/** Client-safe constants for the customer-panel theme. */
export type PanelTheme = "dark" | "light";

export const PANEL_THEME_COOKIE = "panel_theme";
export const PANEL_THEME_STORAGE_KEY = "panel-theme";
export const PANEL_THEME_MAX_AGE = 60 * 60 * 24 * 365;

export function isPanelTheme(value: unknown): value is PanelTheme {
  return value === "dark" || value === "light";
}
