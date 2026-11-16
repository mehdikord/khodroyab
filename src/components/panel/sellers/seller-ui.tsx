import React from "react";

import { cn } from "@/lib/utils";

/** Up to two initials of a (Persian or Latin) name. */
export function sellerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  if (parts.length === 1) return parts[0].slice(0, 1);
  return parts[0].slice(0, 1) + parts[1].slice(0, 1);
}

/** Stable hue (0–359) per name, so each seller keeps their colour. */
function hueOf(name: string): number {
  let hash = 0;
  for (const char of Array.from(name)) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) >>> 0;
  // Stay around warm/brand-friendly hues: 0–60 and 180–260.
  const ranges = [
    [10, 45],
    [190, 250],
  ];
  const [from, to] = ranges[hash % ranges.length];
  return from + (hash % (to - from));
}

/** "1234 5678" */
export function groupSellerCode(code: string): string {
  return code.length === 8 ? `${code.slice(0, 4)} ${code.slice(4)}` : code;
}

/** Monogram avatar with a glowing gradient ring (sellers have no public photo). */
export function SellerMonogram({ name, className }: { name: string; className?: string }) {
  const hue = hueOf(name);
  return (
    <span
      aria-hidden="true"
      className={cn("relative flex shrink-0 items-center justify-center rounded-2xl p-[2px]", className)}
      style={{ background: `conic-gradient(from 140deg, #FF6A00, hsl(${hue} 85% 60%), #FF8A2A, #FF6A00)` }}
    >
      <span
        className="flex h-full w-full items-center justify-center rounded-[14px] font-black text-white"
        style={{ background: `linear-gradient(145deg, hsl(${hue} 45% 22%), #0B0E13 75%)` }}
      >
        {sellerInitials(name)}
      </span>
    </span>
  );
}
