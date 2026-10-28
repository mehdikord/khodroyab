"use client";

import React, { useEffect, useRef, useState } from "react";
import { HeartHandshake } from "lucide-react";

import { SafeImage } from "@/components/panel/SafeImage";
import { cn } from "@/lib/utils";

export interface SponsorsMarqueeItem {
  id: string;
  name: string;
  logo: string;
}

interface SponsorsMarqueeProps {
  sponsors: SponsorsMarqueeItem[];
  title?: string;
  className?: string;
}

/** Scroll speed of the loop, in pixels per second. */
const SPEED_PX_PER_SECOND = 38;

function SponsorCard({ sponsor }: { sponsor: SponsorsMarqueeItem }) {
  const fallback = (
    <span className="flex h-full w-full items-center justify-center text-sm font-black text-panel-accent">
      {sponsor.name.trim().slice(0, 1) || "؟"}
    </span>
  );
  return (
    <div
      dir="rtl"
      title={sponsor.name}
      className={cn(
        "group/sponsor flex h-[68px] shrink-0 items-center gap-3 rounded-2xl border border-panel-line/[0.08] bg-panel-surface/70 py-2.5 pe-4 ps-2.5 backdrop-blur",
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF6A00]/40 hover:bg-panel-surface hover:shadow-[0_14px_34px_-18px_rgba(255,106,0,0.55)]"
      )}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-panel-line/[0.08] bg-white p-1.5 shadow-sm transition-transform duration-300 group-hover/sponsor:scale-105">
        <SafeImage src={sponsor.logo} alt={sponsor.name} loading="lazy" draggable={false} className="h-full w-full object-contain" fallback={fallback} />
      </span>
      <span className="max-w-[11rem] truncate text-[13px] font-extrabold text-panel-text-2 transition-colors group-hover/sponsor:text-panel-text">
        {sponsor.name}
      </span>
    </div>
  );
}

/**
 * Sponsor logos in one row. When they fit, they sit centred; when the row is
 * wider than the screen it becomes an endless, auto-scrolling loop (paused on
 * hover / focus, static and swipe-scrollable under reduced motion).
 */
export function SponsorsMarquee({ sponsors, title = "حامیان خودرو یاب", className }: SponsorsMarqueeProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [loop, setLoop] = useState<{ active: boolean; duration: number }>({ active: false, duration: 30 });

  useEffect(() => {
    const viewport = viewportRef.current;
    const list = listRef.current;
    if (!viewport || !list) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const measure = () => {
      const listWidth = list.scrollWidth;
      const overflow = listWidth > viewport.clientWidth + 1 && !reducedMotion.matches;
      setLoop({ active: overflow, duration: Math.max(18, listWidth / SPEED_PX_PER_SECOND) });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(list);
    reducedMotion.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", measure);
    };
  }, [sponsors]);

  if (sponsors.length === 0) return null;

  return (
    <section aria-label={title} className={cn("w-full", className)}>
      <div className="mx-auto mb-4 flex max-w-md items-center gap-3 px-5">
        <span className="h-px flex-1 bg-gradient-to-l from-panel-line/20 to-transparent" aria-hidden="true" />
        <h2 className="inline-flex items-center gap-2 text-xs font-extrabold text-panel-muted">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-panel-accent">
            <HeartHandshake className="h-3.5 w-3.5" />
          </span>
          {title}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-panel-line/20 to-transparent" aria-hidden="true" />
      </div>

      <div
        ref={viewportRef}
        dir="ltr"
        className={cn(
          "sponsor-marquee relative overflow-hidden py-2",
          loop.active ? "sponsor-marquee-fade" : "panel-no-scrollbar overflow-x-auto"
        )}
      >
        <div
          className={cn("flex w-max", loop.active ? "sponsor-marquee-track" : "mx-auto")}
          style={loop.active ? ({ "--sponsor-marquee-duration": `${loop.duration}s` } as React.CSSProperties) : undefined}
        >
          <div ref={listRef} className="flex shrink-0 items-center">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="px-1.5">
                <SponsorCard sponsor={sponsor} />
              </div>
            ))}
          </div>
          {loop.active && (
            <div className="flex shrink-0 items-center" aria-hidden="true">
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className="px-1.5">
                  <SponsorCard sponsor={sponsor} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
