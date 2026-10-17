"use client";

import React, { useEffect, useState } from "react";
import { CalendarDays, Clock3 } from "lucide-react";

import { cn } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("fa-IR", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

interface LiveClockProps {
  className?: string;
}

/**
 * Live Jalali date + time, ticking every second. Rendered only after mount so
 * the server-rendered HTML never disagrees with the client's clock.
 */
export function LiveClock({ className }: LiveClockProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      role="timer"
      aria-live="off"
      aria-label="تاریخ و ساعت فعلی"
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl border border-panel-line/[0.08] bg-panel-surface/80 px-3.5 py-2 backdrop-blur-sm",
        className
      )}
    >
      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-panel-muted">
        <CalendarDays className="h-3.5 w-3.5 text-panel-accent" />
        {now ? (
          <span className="whitespace-nowrap">{dateFormatter.format(now)}</span>
        ) : (
          <span className="inline-block h-3 w-28 animate-pulse rounded bg-panel-line/[0.06]" />
        )}
      </span>
      <span aria-hidden="true" className="h-4 w-px bg-panel-line/[0.1]" />
      <span className="flex items-center gap-1.5 text-[13px] font-extrabold tabular-nums text-panel-text">
        <Clock3 className="h-3.5 w-3.5 text-panel-accent" />
        {now ? (
          <span dir="ltr" className="font-mono tracking-wider">
            {timeFormatter.format(now)}
          </span>
        ) : (
          <span className="inline-block h-3.5 w-16 animate-pulse rounded bg-panel-line/[0.06]" />
        )}
      </span>
    </div>
  );
}
