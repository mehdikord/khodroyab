"use client";

import React, { useId, useState } from "react";
import { ChevronDown, FileText } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * «مشخصات خودرو» bar at the bottom of the car header. Closed by default;
 * opening it reveals the admin's (sanitised) rich-text description.
 */
export function CarSpecsDisclosure({ html, carName }: { html: string; carName: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="relative border-t border-panel-line/[0.08]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="group flex w-full items-center gap-3 px-4 py-3 text-start transition-colors hover:bg-panel-line/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF6A00]/50 sm:px-5"
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
            open ? "border-[#FF6A00]/50 bg-[#FF6A00]/15 text-panel-accent" : "border-panel-line/[0.1] bg-panel-bg/60 text-panel-accent"
          )}
        >
          <FileText className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-extrabold text-panel-text">مشخصات خودرو</span>
          <span className="block truncate text-[11px] text-panel-muted">
            {open ? "برای بستن دوباره بزنید" : `معرفی، امکانات و مشخصات فنی ${carName}`}
          </span>
        </span>
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-panel-line/[0.06] text-panel-muted transition-all duration-300 group-hover:text-panel-text",
            open && "rotate-180 bg-[#FF6A00]/15 text-panel-accent"
          )}
          aria-hidden="true"
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>

      {/* grid-rows 0fr → 1fr animates to the content's natural height */}
      <div
        id={panelId}
        role="region"
        aria-label={`مشخصات ${carName}`}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
        // React 18 has no typed `inert`; the string form keeps closed content out of tab order.
        {...(open ? {} : ({ inert: "" } as Record<string, string>))}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn("rich-content px-4 pb-5 pt-1 transition-opacity duration-300 sm:px-5", open ? "opacity-100" : "opacity-0")}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}
