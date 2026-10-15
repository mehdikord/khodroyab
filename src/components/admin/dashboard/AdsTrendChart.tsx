"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import type { TrendPoint } from "@/lib/dashboard";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";

const HEIGHT = 230;
const MARGIN = { top: 26, right: 40, bottom: 30, left: 12 };
const ACCENT = "#FF8A2A";
const GRID = "rgba(255,255,255,0.07)";

/** Round `value` up to a "nice" 1/2/5 × 10ⁿ step. */
function niceStep(value: number): number {
  if (value <= 0) return 1;
  const exponent = 10 ** Math.floor(Math.log10(value));
  const fraction = value / exponent;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return nice * exponent;
}

interface AdsTrendChartProps {
  points: TrendPoint[];
}

/**
 * Single-series daily line chart with area wash, hairline grid, crosshair
 * tooltip on hover and a collapsible table view of the same data.
 */
export function AdsTrendChart({ points }: AdsTrendChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver((entries) => {
      const next = Math.floor(entries[0]?.contentRect.width ?? 0);
      if (next > 0) setWidth(next);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const geometry = useMemo(() => {
    const innerWidth = Math.max(1, width - MARGIN.left - MARGIN.right);
    const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
    const maxValue = Math.max(0, ...points.map((p) => p.count));

    let step: number;
    let top: number;
    if (maxValue <= 4) {
      step = 1;
      top = 4;
    } else {
      step = niceStep(maxValue / 4);
      top = step * Math.ceil(maxValue / step);
    }

    const ticks: number[] = [];
    for (let v = 0; v <= top; v += step) ticks.push(v);

    const stepX = points.length > 1 ? innerWidth / (points.length - 1) : 0;
    const coords = points.map((point, index) => ({
      x: MARGIN.left + index * stepX,
      y: MARGIN.top + innerHeight - (point.count / top) * innerHeight,
    }));

    const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
    const baseline = MARGIN.top + innerHeight;
    const areaPath =
      coords.length > 0
        ? `${linePath} L${coords[coords.length - 1].x.toFixed(1)},${baseline} L${coords[0].x.toFixed(1)},${baseline} Z`
        : "";

    // Roughly one label per 80px, never more than six, so narrow screens stay legible.
    const targetLabels = Math.min(6, Math.max(3, Math.floor(innerWidth / 80)));
    const labelEvery = Math.max(1, Math.ceil(points.length / targetLabels));
    const maxIndex = maxValue > 0 ? points.findIndex((p) => p.count === maxValue) : -1;

    return { innerHeight, top, ticks, coords, linePath, areaPath, baseline, labelEvery, maxIndex, maxValue, stepX };
  }, [points, width]);

  const total = points.reduce((sum, p) => sum + p.count, 0);

  function handlePointerMove(event: React.PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    if (geometry.stepX <= 0) {
      setHoverIndex(0);
      return;
    }
    const index = Math.round((x - MARGIN.left) / geometry.stepX);
    setHoverIndex(Math.min(points.length - 1, Math.max(0, index)));
  }

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;
  const hoveredCoord = hoverIndex !== null ? geometry.coords[hoverIndex] : null;
  const lastCoord = geometry.coords[geometry.coords.length - 1];

  return (
    <div className="space-y-3">
      <div ref={containerRef} dir="ltr" className="relative w-full select-none">
        <svg
          width={width}
          height={HEIGHT}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          role="img"
          aria-label={`روند ثبت آگهی در ${toPersianDigits(points.length)} روز گذشته`}
          className="block overflow-visible"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="ads-trend-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ACCENT} stopOpacity="0.18" />
              <stop offset="100%" stopColor={ACCENT} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Horizontal hairline grid + y ticks (labels on the right for RTL readers) */}
          {geometry.ticks.map((tick) => {
            const y = MARGIN.top + geometry.innerHeight - (tick / geometry.top) * geometry.innerHeight;
            return (
              <g key={tick}>
                <line x1={MARGIN.left} x2={width - MARGIN.right} y1={y} y2={y} stroke={GRID} strokeWidth="1" />
                <text
                  x={width - MARGIN.right + 10}
                  y={y + 3.5}
                  fontSize="10"
                  fill="#5E6672"
                  textAnchor="start"
                  className="font-mono"
                >
                  {toPersianDigits(tick)}
                </text>
              </g>
            );
          })}

          {/* X labels */}
          {points.map((point, index) => {
            const isLast = index === points.length - 1;
            if (index % geometry.labelEvery !== 0 && !isLast) return null;
            // Skip a label that would collide with the final one.
            if (!isLast && points.length - 1 - index < geometry.labelEvery / 2) return null;
            return (
              <text
                key={point.key}
                x={geometry.coords[index].x}
                y={HEIGHT - 8}
                fontSize="10"
                fill="#5E6672"
                textAnchor="middle"
              >
                {point.label}
              </text>
            );
          })}

          {/* Area wash + line */}
          <path d={geometry.areaPath} fill="url(#ads-trend-area)" />
          <path
            d={geometry.linePath}
            fill="none"
            stroke={ACCENT}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Direct label on the peak */}
          {geometry.maxIndex >= 0 && (
            <g>
              <circle
                cx={geometry.coords[geometry.maxIndex].x}
                cy={geometry.coords[geometry.maxIndex].y}
                r="4"
                fill={ACCENT}
                stroke="#0D1117"
                strokeWidth="2"
              />
              <text
                x={geometry.coords[geometry.maxIndex].x}
                y={geometry.coords[geometry.maxIndex].y - 10}
                fontSize="11"
                fontWeight="700"
                fill="#F5F5F5"
                textAnchor="middle"
              >
                {formatPersianNumber(geometry.maxValue)}
              </text>
            </g>
          )}

          {/* End marker (today) */}
          {lastCoord && geometry.maxIndex !== points.length - 1 && (
            <circle cx={lastCoord.x} cy={lastCoord.y} r="4" fill={ACCENT} stroke="#0D1117" strokeWidth="2" />
          )}

          {/* Crosshair */}
          {hoveredCoord && (
            <g>
              <line
                x1={hoveredCoord.x}
                x2={hoveredCoord.x}
                y1={MARGIN.top}
                y2={geometry.baseline}
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1"
              />
              <circle cx={hoveredCoord.x} cy={hoveredCoord.y} r="5" fill={ACCENT} stroke="#0D1117" strokeWidth="2" />
            </g>
          )}
        </svg>

        {/* Tooltip */}
        {hovered && hoveredCoord && (
          <div
            dir="rtl"
            className={cn(
              "pointer-events-none absolute top-0 z-10 min-w-[120px] rounded-xl border border-white/[0.1] bg-[#171B21] px-3 py-2 text-right shadow-[0_12px_30px_rgba(0,0,0,0.6)]"
            )}
            style={{
              left: hoveredCoord.x,
              transform: hoveredCoord.x > width / 2 ? "translateX(calc(-100% - 12px))" : "translateX(12px)",
            }}
          >
            <p className="text-[10px] text-[#8B93A1]">{hovered.label}</p>
            <p className="mt-0.5 text-sm font-extrabold text-[#F5F5F5]">
              {formatPersianNumber(hovered.count)} <span className="text-[11px] font-semibold text-[#9BA3AE]">آگهی</span>
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#8B93A1]">
        <span>
          مجموع {formatPersianNumber(total)} آگهی در {toPersianDigits(points.length)} روز گذشته
        </span>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          aria-expanded={showTable}
          className="rounded-md px-2 py-1 font-bold text-[#9BA3AE] transition-colors hover:bg-white/[0.04] hover:text-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40"
        >
          {showTable ? "بستن جدول" : "نمایش جدول داده‌ها"}
        </button>
      </div>

      {showTable && <TrendTable points={points} />}
    </div>
  );
}

function TrendTable({ points }: { points: TrendPoint[] }) {
  const nonZero = points.filter((p) => p.count > 0);

  return (
    <div className="admin-animate-fade">
      <div className="admin-scrollbar max-h-56 overflow-auto rounded-xl border border-white/[0.08]">
        <table className="w-full text-right text-[11px]">
          <thead className="sticky top-0 bg-[#12161D] text-[#8B93A1]">
            <tr>
              <th className="px-3 py-2 font-semibold">روز</th>
              <th className="px-3 py-2 font-semibold">تعداد آگهی</th>
            </tr>
          </thead>
          <tbody>
            {nonZero.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-3 py-3 text-center text-[#5E6672]">
                  در این بازه آگهی ثبت نشده است
                </td>
              </tr>
            ) : (
              nonZero.map((point) => (
                <tr key={point.key} className="border-t border-white/[0.05] text-[#D2D7DF]">
                  <td className="px-3 py-1.5">{point.label}</td>
                  <td className="px-3 py-1.5 font-mono tabular-nums">{formatPersianNumber(point.count)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
