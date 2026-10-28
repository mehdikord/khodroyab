"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

interface HorizontalScrollerProps {
  children: React.ReactNode;
  /**
   * - `bar`: scroll buttons in a slim bar above the content (for wide tables).
   * - `overlay`: small round buttons over the left/right edges (for card strips).
   */
  variant?: "bar" | "overlay";
  /** Text shown in the `bar` variant while the content overflows. */
  hint?: string;
  className?: string;
  /** Classes of the scrolling element itself. */
  viewportClassName?: string;
}

interface Edges {
  overflow: boolean;
  /** More content hidden on the physical left / right side. */
  left: boolean;
  right: boolean;
}

/**
 * Horizontally scrollable area that shows scroll buttons only when its content
 * is wider than the viewport. Works in RTL (where `scrollLeft` is ≤ 0) and LTR.
 */
export function HorizontalScroller({ children, variant = "bar", hint = "برای دیدن سال‌های بیشتر، به چپ و راست اسکرول کنید", className, viewportClassName }: HorizontalScrollerProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<Edges>({ overflow: false, left: false, right: false });

  const update = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 1) {
      setEdges((prev) => (prev.overflow ? { overflow: false, left: false, right: false } : prev));
      return;
    }
    const rtl = getComputedStyle(el).direction === "rtl";
    // RTL: 0 at the right edge, going negative towards the left (Chrome/Firefox/Safari today).
    const fromStart = Math.abs(el.scrollLeft);
    const atStart = fromStart <= 1;
    const atEnd = fromStart >= max - 1;
    const next = rtl ? { overflow: true, right: !atStart, left: !atEnd } : { overflow: true, left: !atStart, right: !atEnd };
    setEdges((prev) => (prev.left === next.left && prev.right === next.right && prev.overflow ? prev : next));
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [update]);

  function scrollTowards(side: "left" | "right") {
    const el = viewportRef.current;
    if (!el) return;
    const distance = Math.max(160, el.clientWidth * 0.6);
    el.scrollBy({ left: side === "left" ? -distance : distance, behavior: "smooth" });
  }

  const buttonBase =
    "inline-flex items-center justify-center rounded-full border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-default disabled:opacity-30";

  return (
    <div className={cn("relative", className)}>
      {variant === "bar" && edges.overflow && (
        <div className="mb-2 flex items-center justify-between gap-3 rounded-2xl border border-panel-line/[0.08] bg-panel-surface/80 px-3 py-2 backdrop-blur">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-panel-muted">
            <MoveHorizontal className="h-3.5 w-3.5 text-panel-accent" />
            {hint}
          </span>
          <span className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollTowards("right")}
              disabled={!edges.right}
              aria-label="اسکرول به راست"
              className={cn(buttonBase, "h-8 w-8 border-panel-line/[0.12] bg-panel-bg text-panel-text-2 hover:border-[#FF6A00]/50 hover:text-panel-accent")}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollTowards("left")}
              disabled={!edges.left}
              aria-label="اسکرول به چپ"
              className={cn(buttonBase, "h-8 w-8 border-panel-line/[0.12] bg-panel-bg text-panel-text-2 hover:border-[#FF6A00]/50 hover:text-panel-accent")}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </span>
        </div>
      )}

      <div className="relative">
        <div ref={viewportRef} className={cn("panel-scrollbar overflow-x-auto overscroll-x-contain", viewportClassName)}>
          {children}
        </div>

        {variant === "overlay" && edges.overflow && (
          <>
            {(["right", "left"] as const).map((side) =>
              edges[side] ? (
                <button
                  key={side}
                  type="button"
                  onClick={() => scrollTowards(side)}
                  aria-label={side === "left" ? "اسکرول به چپ" : "اسکرول به راست"}
                  className={cn(
                    buttonBase,
                    "absolute top-1/2 z-10 h-8 w-8 -translate-y-1/2 border-[#FF6A00]/40 bg-panel-surface/95 text-panel-accent shadow-[0_6px_18px_-6px_rgba(0,0,0,0.6)] backdrop-blur hover:bg-[#FF6A00]/15",
                    side === "left" ? "left-1" : "right-1"
                  )}
                >
                  {side === "left" ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>
              ) : null
            )}
          </>
        )}
      </div>
    </div>
  );
}
