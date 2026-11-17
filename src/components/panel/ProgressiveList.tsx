"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { toPersianDigits } from "@/lib/utils";

/**
 * Render a long, already-filtered list a slice at a time so the browser never
 * lays out thousands of rows at once. `resetKey` (search text, filter…)
 * returns the list to its first slice; plain item updates (e.g. edits) don't.
 */
export function useProgressiveList<T>(items: T[], resetKey: string, step = 30) {
  const [limit, setLimit] = useState(step);

  useEffect(() => setLimit(step), [resetKey, step]);

  return {
    visible: items.length > limit ? items.slice(0, limit) : items,
    remaining: Math.max(0, items.length - limit),
    showMore: () => setLimit((current) => current + step),
  };
}

/** Auto-loads the next slice when scrolled into view; a button as fallback. */
export function ProgressiveListMore({ remaining, onMore }: { remaining: number; onMore: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || remaining <= 0) return;
    const observer = new IntersectionObserver((entries) => entries.some((entry) => entry.isIntersecting) && onMore(), {
      rootMargin: "600px",
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [remaining, onMore]);

  if (remaining <= 0) return null;
  return (
    <div ref={ref} className="flex justify-center py-3">
      <button
        type="button"
        onClick={onMore}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-panel-line/[0.12] px-5 text-xs font-bold text-panel-text-2 transition-colors hover:border-[#FF6A00]/40 hover:text-panel-text"
      >
        <ChevronDown className="h-3.5 w-3.5 text-panel-accent" />
        نمایش {toPersianDigits(remaining)} مورد دیگر
      </button>
    </div>
  );
}
