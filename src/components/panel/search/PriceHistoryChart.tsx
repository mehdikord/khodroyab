"use client";

import React, { useId, useMemo, useRef, useState } from "react";

import type { SearchPricePoint } from "@/lib/panel-search-shared";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";

interface PriceHistoryChartProps {
  points: SearchPricePoint[];
  className?: string;
}

const W = 640;
const H = 260;
const PAD = { top: 26, right: 22, bottom: 40, left: 22 };

function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `${toPersianDigits((value / 1_000_000_000).toFixed(abs % 1_000_000_000 === 0 ? 0 : 1))} میلیارد`;
  if (abs >= 1_000_000) return `${toPersianDigits((value / 1_000_000).toFixed(abs % 1_000_000 === 0 ? 0 : 1))} میلیون`;
  if (abs >= 1_000) return `${toPersianDigits(Math.round(value / 1_000))} هزار`;
  return toPersianDigits(value);
}

/**
 * Line chart of a sale term's price over time. Pure SVG: smooth monotone
 * path, glowing stroke, gradient area, min/max markers and a hover/touch
 * scrubber with a tooltip. Points are spaced evenly by change index so sparse
 * timelines stay readable.
 */
export function PriceHistoryChart({ points, className }: PriceHistoryChartProps) {
  const gradientId = useId();
  const glowId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<number>(points.length - 1);

  const geometry = useMemo(() => {
    const prices = points.map((p) => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const span = max - min || Math.max(max * 0.1, 1);
    const yMin = min - span * 0.18;
    const yMax = max + span * 0.18;
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const xs = points.map((_, i) => PAD.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW));
    const ys = points.map((p) => PAD.top + (1 - (p.price - yMin) / (yMax - yMin)) * innerH);

    // Monotone cubic interpolation keeps the curve from overshooting.
    let d = "";
    if (points.length === 1) {
      d = `M ${PAD.left} ${ys[0]} L ${W - PAD.right} ${ys[0]}`;
    } else {
      d = `M ${xs[0]} ${ys[0]}`;
      for (let i = 0; i < points.length - 1; i += 1) {
        const x0 = xs[i];
        const y0 = ys[i];
        const x1 = xs[i + 1];
        const y1 = ys[i + 1];
        const cx = (x1 - x0) * 0.5;
        d += ` C ${x0 + cx} ${y0}, ${x1 - cx} ${y1}, ${x1} ${y1}`;
      }
    }
    const area = `${d} L ${xs[xs.length - 1] ?? W - PAD.right} ${H - PAD.bottom} L ${xs[0] ?? PAD.left} ${H - PAD.bottom} Z`;
    const minIndex = prices.indexOf(min);
    const maxIndex = prices.indexOf(max);
    return { xs, ys, d, area, minIndex, maxIndex, min, max, innerW };
  }, [points]);

  function handlePointer(event: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * W;
    let nearest = 0;
    let best = Number.POSITIVE_INFINITY;
    geometry.xs.forEach((px, i) => {
      const dist = Math.abs(px - x);
      if (dist < best) {
        best = dist;
        nearest = i;
      }
    });
    setActive(nearest);
  }

  const activePoint = points[active] ?? points[points.length - 1];
  const previous = active > 0 ? points[active - 1] : null;
  const activeDelta = previous ? activePoint.price - previous.price : null;
  const ax = geometry.xs[active] ?? 0;
  const ay = geometry.ys[active] ?? 0;
  const tooltipLeft = ax > W * 0.6;
  const up = activeDelta !== null && activeDelta > 0;
  const down = activeDelta !== null && activeDelta < 0;

  return (
    <div className={cn("relative select-none", className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full touch-none"
        onPointerMove={handlePointer}
        onPointerDown={handlePointer}
        role="img"
        aria-label="نمودار تغییرات قیمت"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.38" />
            <stop offset="70%" stopColor="#FF6A00" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#FF6A00" stopOpacity="0" />
          </linearGradient>
          <filter id={glowId} x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Horizontal guides */}
        {[0.25, 0.5, 0.75].map((t) => {
          const y = PAD.top + t * (H - PAD.top - PAD.bottom);
          return <line key={t} x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} className="stroke-panel-line/[0.08]" strokeDasharray="3 6" />;
        })}

        {/* Area + line */}
        <path d={geometry.area} fill={`url(#${gradientId})`} className="panel-chart-area" />
        <path
          d={geometry.d}
          fill="none"
          stroke="#FF8A2A"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${glowId})`}
          className="panel-chart-line"
          pathLength={1}
        />

        {/* Min / max markers */}
        {points.length > 1 && geometry.minIndex !== geometry.maxIndex && (
          <>
            <text
              x={geometry.xs[geometry.maxIndex]}
              y={geometry.ys[geometry.maxIndex] - 12}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="currentColor"
              className="text-panel-success-2"
            >
              بیشترین · {formatCompact(geometry.max)}
            </text>
            <text
              x={geometry.xs[geometry.minIndex]}
              y={geometry.ys[geometry.minIndex] + 20}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="currentColor"
              className="text-panel-danger-2"
            >
              کمترین · {formatCompact(geometry.min)}
            </text>
          </>
        )}

        {/* Crosshair */}
        <line x1={ax} x2={ax} y1={PAD.top - 6} y2={H - PAD.bottom} stroke="rgba(255,138,42,0.35)" strokeWidth={1} strokeDasharray="2 4" />

        {/* Points */}
        {points.map((_, i) => {
          const isActive = i === active;
          const isLast = i === points.length - 1;
          return (
            <g key={i} className="cursor-pointer" onPointerEnter={() => setActive(i)}>
              {isLast && <circle cx={geometry.xs[i]} cy={geometry.ys[i]} r={10} fill="#FF6A00" opacity={0.25} className="panel-chart-pulse" />}
              <circle
                cx={geometry.xs[i]}
                cy={geometry.ys[i]}
                r={isActive ? 6 : 4}
                fill="currentColor"
                stroke="#FF8A2A"
                strokeWidth={2.5}
                className={cn("transition-all duration-200", isActive ? "text-white" : "text-panel-surface")}
              />
              <circle cx={geometry.xs[i]} cy={geometry.ys[i]} r={16} fill="transparent" />
            </g>
          );
        })}

        {/* X labels: first, last and the active one */}
        {points.map((p, i) => {
          const show = i === 0 || i === points.length - 1 || i === active;
          if (!show) return null;
          const anchor = i === 0 ? "start" : i === points.length - 1 ? "end" : "middle";
          return (
            <text
              key={`x-${i}`}
              x={geometry.xs[i]}
              y={H - 14}
              textAnchor={anchor}
              fontSize="11"
              fontWeight={i === active ? "800" : "600"}
              fill="currentColor"
              className={i === active ? "text-panel-accent-soft" : "text-panel-faint"}
            >
              {p.dateLabel}
            </text>
          );
        })}
      </svg>

      {/* Tooltip */}
      <div
        className={cn(
          "pointer-events-none absolute top-2 min-w-[150px] rounded-2xl border border-panel-line/[0.12] bg-panel-bg/90 px-3 py-2.5 shadow-2xl backdrop-blur-md transition-all duration-200",
          tooltipLeft ? "start-2" : "end-2"
        )}
      >
        <p className="text-[10px] font-semibold text-panel-muted-2">
          {activePoint.dateLabel} · {activePoint.timeLabel}
        </p>
        <p dir="rtl" className="mt-0.5 text-sm font-black tabular-nums text-panel-text">
          {formatPersianNumber(activePoint.price)} <span className="text-[10px] font-semibold text-panel-muted-2">تومان</span>
        </p>
        {activeDelta !== null && activeDelta !== 0 && (
          <p className={cn("mt-0.5 text-[11px] font-extrabold tabular-nums", up && "text-panel-success-2", down && "text-panel-danger-2")}>
            {up ? "+" : "−"}
            {formatPersianNumber(Math.abs(activeDelta))}
          </p>
        )}
        {active === 0 && <p className="mt-0.5 text-[10px] font-semibold text-panel-accent-soft">قیمت اولیه</p>}
      </div>
    </div>
  );
}
