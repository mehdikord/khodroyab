import React from "react";
import { Crown } from "lucide-react";

import { SafeImage } from "@/components/panel/SafeImage";
import { ColorSwatch } from "@/components/admin/ui/ColorSwatch";
import { PRICE_TABLE_EMPTY } from "@/lib/price-table-shared";
import { cn, formatPersianNumber } from "@/lib/utils";

function initials(name: string, count: number): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  return parts
    .slice(0, count)
    .map((part) => part.slice(0, 1))
    .join("")
    .toUpperCase();
}

/** Brand logo on a light tile (logos are usually drawn for white); falls back to the initial. */
export function BrandLogo({ name, image, className }: { name: string; image: string | null; className?: string }) {
  const fallback = (
    <span className="flex h-full w-full items-center justify-center text-[11px] font-black text-panel-accent">
      {initials(name, 1)}
    </span>
  );
  return (
    <span
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-panel-line/[0.1] bg-white/95 p-1 shadow-sm",
        !image && "bg-[#FF6A00]/[0.1]",
        className
      )}
    >
      {image ? <SafeImage src={image} alt="" className="h-full w-full object-contain" fallback={fallback} /> : fallback}
    </span>
  );
}

/** Round user avatar with initials fallback. */
export function UserAvatar({ name, image, className }: { name: string; image: string | null; className?: string }) {
  const fallback = (
    <span className="flex h-full w-full items-center justify-center bg-[#FF6A00]/[0.12] text-[11px] font-black text-panel-accent">
      {initials(name, 2)}
    </span>
  );
  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#FF6A00]/35 bg-panel-surface-2",
        className
      )}
    >
      {image ? <SafeImage src={image} alt="" className="h-full w-full object-cover" fallback={fallback} /> : fallback}
    </span>
  );
}

/** Colour name with its swatch, or the empty placeholder. */
export function ColorLabel({ name, code, className }: { name: string | null; code: string | null; className?: string }) {
  if (!name || !code) return <span className={cn("text-panel-faint", className)}>{PRICE_TABLE_EMPTY}</span>;
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-panel-text-2", className)}>
      <ColorSwatch code={code} className="h-3.5 w-3.5" />
      {name}
    </span>
  );
}

/**
 * A USD price. `best` marks the lowest price of its column (emerald + crown),
 * the default style is the accent badge; blank prices show "---".
 */
export function PriceTag({
  price,
  best = false,
  size = "md",
  className,
}: {
  price: string | null | undefined;
  best?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  if (!price) return <span className={cn("font-semibold text-panel-faint", className)}>{PRICE_TABLE_EMPTY}</span>;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-lg border font-extrabold tabular-nums",
        size === "sm" ? "px-1.5 py-0.5 text-[12px]" : "px-2 py-1 text-[13px]",
        best
          ? "border-emerald-500/35 bg-emerald-500/[0.1] text-panel-success"
          : "border-[#FF6A00]/25 bg-[#FF6A00]/[0.08] text-panel-accent",
        className
      )}
    >
      {best && <Crown className="h-3 w-3" aria-label="کمترین قیمت" />}
      {formatPersianNumber(price)}
      <span className="text-[0.8em] font-black opacity-70">$</span>
    </span>
  );
}
