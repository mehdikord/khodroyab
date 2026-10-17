"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { PANEL_THEME_COOKIE, PANEL_THEME_MAX_AGE, PANEL_THEME_STORAGE_KEY, isPanelTheme, type PanelTheme } from "@/lib/panel-theme";
import { cn } from "@/lib/utils";

interface ThemeSwitchProps {
  /** Theme rendered by the server (from the cookie) so the switch hydrates in the right position. */
  initialTheme: PanelTheme;
  className?: string;
}

function applyTheme(theme: PanelTheme) {
  const root = document.querySelector<HTMLElement>(".panel-root");
  if (root) root.dataset.theme = theme;
  try {
    localStorage.setItem(PANEL_THEME_STORAGE_KEY, theme);
  } catch {
    /* storage unavailable */
  }
  document.cookie = `${PANEL_THEME_COOKIE}=${theme}; path=/; max-age=${PANEL_THEME_MAX_AGE}; samesite=lax`;
}

/**
 * Day/night toggle for the customer panel. Persists to a cookie (read by the
 * server layout so there is no flash) and to localStorage as a backup.
 */
export function ThemeSwitch({ initialTheme, className }: ThemeSwitchProps) {
  const [theme, setTheme] = useState<PanelTheme>(initialTheme);

  // If the cookie was lost but localStorage still remembers, restore it.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PANEL_THEME_STORAGE_KEY);
      if (isPanelTheme(stored) && stored !== initialTheme) {
        setTheme(stored);
        applyTheme(stored);
      }
    } catch {
      /* ignore */
    }
  }, [initialTheme]);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: PanelTheme = current === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  const isLight = theme === "light";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? "تغییر به حالت تاریک" : "تغییر به حالت روشن"}
      title={isLight ? "حالت تاریک" : "حالت روشن"}
      onClick={toggle}
      data-on={isLight ? "true" : "false"}
      className={cn("panel-theme-switch focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50", className)}
    >
      <span className="stars" aria-hidden="true" />
      <span className="clouds" aria-hidden="true" />
      <span className="knob" aria-hidden="true">
        {isLight ? <Sun className="h-3.5 w-3.5" strokeWidth={2.6} /> : <Moon className="h-3.5 w-3.5" strokeWidth={2.4} />}
      </span>
    </button>
  );
}
