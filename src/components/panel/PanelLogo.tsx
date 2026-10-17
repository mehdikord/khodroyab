import React from "react";

import { cn } from "@/lib/utils";

interface PanelLogoProps {
  className?: string;
  /** Hide the textual wordmark, keeping only the emblem. */
  markOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { box: "h-9 w-9 rounded-lg", icon: "h-5 w-5", title: "text-sm", subtitle: "text-[10px]" },
  md: { box: "h-11 w-11 rounded-xl", icon: "h-6 w-6", title: "text-base", subtitle: "text-[11px]" },
  lg: { box: "h-16 w-16 rounded-2xl", icon: "h-9 w-9", title: "text-xl", subtitle: "text-xs" },
};

/** Khodroyab emblem + wordmark for the customer panel. */
export const PanelLogo: React.FC<PanelLogoProps> = ({ className, markOnly = false, size = "md" }) => {
  const s = SIZES[size];
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center border border-[#FF6A00]/45 bg-panel-surface shadow-[0_0_24px_rgba(255,106,0,0.22)]",
          s.box
        )}
      >
        <svg viewBox="0 0 36 36" fill="none" className={cn("text-[#FF6A00]", s.icon)} aria-hidden="true">
          <path d="M6 23L11.5 12H24.5L30 23H25.5L23 17.5H13L10.5 23H6Z" fill="currentColor" />
          <path d="M4 25.5H32" stroke="#FF8A2A" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="18" cy="10" r="2" fill="#F5F5F5" />
        </svg>
      </div>

      {!markOnly && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-2">
            <span className={cn("font-black tracking-tight text-panel-text", s.title)}>خودرو یاب</span>
            <span className="rounded-md border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-widest text-panel-accent">
              PANEL
            </span>
          </div>
          <span className={cn("text-panel-muted", s.subtitle)}>پنل کاربری خودرو یاب</span>
        </div>
      )}
    </div>
  );
};

export default PanelLogo;
