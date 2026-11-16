"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Info, PhoneCall } from "lucide-react";

import { cn } from "@/lib/utils";

export type InfoTab = "contact" | "about";

const TABS: { key: InfoTab; label: string; icon: typeof Info }[] = [
  { key: "contact", label: "تماس با ما", icon: PhoneCall },
  { key: "about", label: "درباره خودرویاب", icon: Info },
];

/**
 * «تماس با ما» and «درباره خودرویاب» on one page as two tabs (contact first).
 * Switching is instant (both panels are server-rendered); the URL follows
 * (`?tab=about`) so the tab can be shared and survives a reload.
 */
export function InfoTabs({ initialTab, contact, about }: { initialTab: InfoTab; contact: React.ReactNode; about: React.ReactNode }) {
  const [tab, setTab] = useState<InfoTab>(initialTab);
  const baseId = useId();
  const tabRefs = useRef<Record<InfoTab, HTMLButtonElement | null>>({ contact: null, about: null });

  // A link to the other tab (e.g. from the about text to contact) updates the selection.
  const searchParams = useSearchParams();
  const urlTab: InfoTab = searchParams.get("tab") === "about" ? "about" : "contact";
  useEffect(() => setTab(urlTab), [urlTab]);

  function select(next: InfoTab, focus = false) {
    setTab(next);
    if (focus) tabRefs.current[next]?.focus();
    const url = new URL(window.location.href);
    if (next === "contact") url.searchParams.delete("tab");
    else url.searchParams.set("tab", next);
    window.history.replaceState(window.history.state, "", url.toString());
  }

  function onKeyDown(event: React.KeyboardEvent) {
    // RTL: the next tab is to the left.
    if (event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const index = TABS.findIndex((item) => item.key === tab);
      const step = event.key === "ArrowLeft" ? 1 : event.key === "ArrowRight" ? -1 : 0;
      const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? TABS.length - 1 : (index + step + TABS.length) % TABS.length;
      select(TABS[nextIndex].key, true);
    }
  }

  return (
    <div className="space-y-5">
      <div className="admin-animate-in flex justify-center sm:justify-start">
        <div
          role="tablist"
          aria-label="تماس با ما و درباره خودرویاب"
          onKeyDown={onKeyDown}
          className="relative grid w-full max-w-md grid-cols-2 rounded-2xl border border-panel-line/[0.1] bg-panel-surface p-1 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.7)]"
        >
          {/* Sliding highlight */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] shadow-orange-subtle transition-[inset-inline-start] duration-300 ease-out motion-reduce:transition-none",
              tab === "contact" ? "start-1" : "start-[calc(50%+0rem)]"
            )}
          />
          {TABS.map((item) => {
            const active = tab === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                ref={(element) => {
                  tabRefs.current[item.key] = element;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${item.key}`}
                aria-selected={active}
                aria-controls={`${baseId}-panel-${item.key}`}
                tabIndex={active ? 0 : -1}
                onClick={() => select(item.key)}
                className={cn(
                  "relative z-[1] flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50",
                  active ? "text-[#07090C]" : "text-panel-muted hover:text-panel-text"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {TABS.map((item) => (
        <div
          key={item.key}
          role="tabpanel"
          id={`${baseId}-panel-${item.key}`}
          aria-labelledby={`${baseId}-tab-${item.key}`}
          hidden={tab !== item.key}
          className={tab === item.key ? "admin-animate-in" : undefined}
        >
          {item.key === "contact" ? contact : about}
        </div>
      ))}
    </div>
  );
}
