"use client";

import React, { useId, useState } from "react";
import { AlertTriangle, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/** Words shown while the notice is collapsed. */
const PREVIEW_WORDS = 8;

/**
 * Warning text from the system settings, shown at the top of every panel page.
 * Long texts start collapsed to their first few words ("…"); tapping the
 * notice reveals the whole text.
 */
export function PanelNotice({ text }: { text: string }) {
  const bodyId = useId();
  const [expanded, setExpanded] = useState(false);

  const words = text.trim().split(/\s+/);
  const collapsible = words.length > PREVIEW_WORDS;
  const preview = collapsible ? `${words.slice(0, PREVIEW_WORDS).join(" ")} …` : text;

  const content = (
    <>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/[0.12] text-panel-danger-2">
        <AlertTriangle className="h-3.5 w-3.5" />
      </span>
      <span
        id={bodyId}
        className={cn(
          "min-w-0 flex-1 break-words pt-1 text-start text-[11px] font-semibold leading-6 text-panel-danger",
          expanded && "whitespace-pre-line"
        )}
      >
        {expanded || !collapsible ? text : preview}
      </span>
      {collapsible && (
        <span className="flex shrink-0 items-center gap-0.5 pt-1 text-[10px] font-extrabold text-panel-danger-2/80">
          {expanded ? "بستن" : "ادامه"}
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
        </span>
      )}
    </>
  );

  const boxClass =
    "admin-animate-in mb-4 flex w-full items-start gap-2.5 rounded-xl border border-red-500/35 bg-red-500/[0.08] px-3 py-2";

  if (!collapsible) {
    return (
      <div role="note" className={boxClass}>
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setExpanded((value) => !value)}
      aria-expanded={expanded}
      aria-controls={bodyId}
      className={cn(
        boxClass,
        "transition-colors hover:bg-red-500/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
      )}
    >
      {content}
    </button>
  );
}
