import React from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";
import type { DashboardDelta } from "@/lib/dashboard";

type StatTone = "accent" | "warning" | "success" | "neutral";

const TONE: Record<StatTone, { icon: string; glow: string; spark: string }> = {
  accent: {
    icon: "border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]",
    glow: "from-[#FF6A00]/[0.14]",
    spark: "#FF8A2A",
  },
  warning: {
    icon: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    glow: "from-amber-500/[0.12]",
    spark: "#fbbf24",
  },
  success: {
    icon: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    glow: "from-emerald-500/[0.12]",
    spark: "#34d399",
  },
  neutral: {
    icon: "border-white/[0.1] bg-white/[0.04] text-[#C9CFD8]",
    glow: "from-white/[0.06]",
    spark: "#C9CFD8",
  },
};

interface SparklineProps {
  values: number[];
  accent: string;
  label: string;
}

/**
 * 14-point sparkline. The history is drawn in the de-emphasis gray, the
 * current period (last segment + end-marker) in the tile's accent.
 */
function Sparkline({ values, accent, label }: SparklineProps) {
  const width = 112;
  const height = 36;
  const padX = 4;
  const padY = 5;

  if (values.length < 2) return null;

  const max = Math.max(1, ...values);
  const stepX = (width - padX * 2) / (values.length - 1);
  const points = values.map((value, index) => ({
    x: padX + index * stepX,
    y: height - padY - (value / max) * (height - padY * 2),
  }));

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const last = points[points.length - 1];
  const beforeLast = points[points.length - 2];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={label}
      className="shrink-0 overflow-visible"
    >
      <path d={path} fill="none" stroke="#42505F" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <path
        d={`M${beforeLast.x.toFixed(1)},${beforeLast.y.toFixed(1)} L${last.x.toFixed(1)},${last.y.toFixed(1)}`}
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx={last.x} cy={last.y} r="4" fill={accent} stroke="#0D1117" strokeWidth="2" />
    </svg>
  );
}

function DeltaBadge({ delta, periodLabel }: { delta: DashboardDelta; periodLabel: string }) {
  if (delta.percent === null) {
    return (
      <p className="flex items-center gap-1 text-[11px] text-[#8B93A1]">
        <Minus className="h-3 w-3 text-[#5E6672]" />
        <span>{formatPersianNumber(delta.current)} مورد جدید {periodLabel}</span>
      </p>
    );
  }

  const up = delta.percent > 0;
  const flat = delta.percent === 0;
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;

  return (
    <p className="flex items-center gap-1.5 text-[11px] text-[#8B93A1]">
      <span
        className={cn(
          "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-bold",
          flat
            ? "bg-white/[0.05] text-[#9BA3AE]"
            : up
              ? "bg-emerald-500/10 text-emerald-300"
              : "bg-red-500/10 text-red-300"
        )}
      >
        <Icon className="h-3 w-3" />
        <span dir="ltr">{toPersianDigits(Math.abs(delta.percent))}٪</span>
      </span>
      <span>{periodLabel}</span>
    </p>
  );
}

interface StatTileProps {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: StatTone;
  href?: string;
  /** Short text under the value, used when there is no delta. */
  hint?: string;
  delta?: DashboardDelta;
  deltaPeriodLabel?: string;
  sparkline?: number[];
  sparklineLabel?: string;
  /** Entrance animation delay in ms. */
  delay?: number;
}

/** KPI stat tile: label, hero value, delta vs. previous period and a sparkline. */
export function StatTile({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  href,
  hint,
  delta,
  deltaPeriodLabel = "نسبت به ۳۰ روز قبل",
  sparkline,
  sparklineLabel,
  delay = 0,
}: StatTileProps) {
  const palette = TONE[tone];

  const body = (
    <>
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -top-16 -end-16 h-40 w-40 rounded-full bg-gradient-to-br to-transparent blur-2xl transition-opacity duration-500 group-hover:opacity-100",
          palette.glow,
          "opacity-70"
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#9BA3AE]">{label}</p>
          <p className="mt-2 text-3xl font-black leading-none text-[#F5F5F5]">{formatPersianNumber(value)}</p>
        </div>
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border", palette.icon)}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="relative mt-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          {delta ? (
            <DeltaBadge delta={delta} periodLabel={deltaPeriodLabel} />
          ) : (
            hint && <p className="text-[11px] text-[#8B93A1]">{hint}</p>
          )}
        </div>
        {sparkline && sparkline.length > 1 && (
          <Sparkline values={sparkline} accent={palette.spark} label={sparklineLabel ?? label} />
        )}
      </div>
    </>
  );

  const className =
    "group relative block overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1117] p-5 shadow-card-depth transition-colors admin-animate-in";

  if (href) {
    return (
      <Link href={href} className={cn(className, "hover:border-[#FF6A00]/30")} style={{ animationDelay: `${delay}ms` }}>
        {body}
      </Link>
    );
  }

  return (
    <div className={className} style={{ animationDelay: `${delay}ms` }}>
      {body}
    </div>
  );
}
