import React from "react";
import { CalendarRange, Car, Gauge, Palette } from "lucide-react";

import { ColorSwatch } from "@/components/admin/ui/ColorSwatch";
import { cn, formatMileage, toPersianDigits } from "@/lib/utils";

/** "Wanted" marker of buy ads, with a live pulse while the request is open. */
export function BuyRequestBadge({ active = true, className }: { active?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-extrabold backdrop-blur-md",
        active
          ? "border-emerald-500/35 bg-emerald-500/[0.12] text-panel-success"
          : "border-panel-line/[0.12] bg-panel-bg/80 text-panel-muted",
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        {active && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60 motion-reduce:animate-none" />}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", active ? "bg-emerald-500" : "bg-panel-faint")} />
      </span>
      {active ? "در جستجوی خرید" : "متوقف‌شده"}
    </span>
  );
}

interface BuySpecTilesProps {
  year: string;
  mileage: number;
  colorName: string;
  colorCode: string;
  size?: "sm" | "lg";
  className?: string;
}

/** The three requested specs, side by side: they are the heart of a buy ad. */
export function BuySpecTiles({ year, mileage, colorName, colorCode, size = "sm", className }: BuySpecTilesProps) {
  const tiles = [
    { key: "year", label: "سال ساخت", icon: CalendarRange, value: year ? toPersianDigits(year) : "—" },
    { key: "mileage", label: "کارکرد", icon: Gauge, value: formatMileage(mileage) },
    {
      key: "color",
      label: "رنگ",
      icon: Palette,
      value: colorName ? (
        <span className="inline-flex min-w-0 items-center gap-1.5">
          {colorCode && <ColorSwatch code={colorCode} className={size === "lg" ? "h-4 w-4" : "h-3 w-3"} />}
          <span className="truncate">{colorName}</span>
        </span>
      ) : (
        "—"
      ),
    },
  ];

  return (
    <dl className={cn("grid grid-cols-3 gap-1.5", size === "lg" && "gap-2", className)}>
      {tiles.map((tile) => (
        <div
          key={tile.key}
          className={cn(
            "min-w-0 rounded-2xl border border-panel-line/[0.07] bg-panel-line/[0.025]",
            size === "lg" ? "px-3 py-3" : "px-2.5 py-2"
          )}
        >
          <dt className={cn("flex items-center gap-1 font-bold text-panel-faint", size === "lg" ? "text-[11px]" : "text-[10px]")}>
            <tile.icon className={size === "lg" ? "h-3.5 w-3.5" : "h-3 w-3"} />
            {tile.label}
          </dt>
          <dd className={cn("mt-1 truncate font-extrabold text-panel-text", size === "lg" ? "text-sm sm:text-base" : "text-xs")}>{tile.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Placeholder art for cars without a catalogue photo. */
export function BuyAdNoImage({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-orange-flare opacity-50" aria-hidden="true" />
      <Car className={cn("relative text-panel-faint", compact ? "h-7 w-7" : "h-10 w-10")} strokeWidth={1.5} />
    </div>
  );
}
