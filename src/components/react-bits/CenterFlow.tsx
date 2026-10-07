"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface CenterFlowNodeItem {
  id: string;
  content: React.ReactNode;
  label?: string;
  sublabel?: string;
}

export interface CenterFlowProps {
  nodeItems: CenterFlowNodeItem[];
  centerContent?: React.ReactNode;
  centerSize?: number;
  nodeSize?: number;
  pulseDuration?: number;
  pulseInterval?: number;
  pulseLength?: number;
  lineWidth?: number;
  pulseWidth?: number;
  pulseSoftness?: number;
  lineColor?: string;
  lineColorLight?: string;
  pulseColor?: string;
  pulseColorLight?: string;
  glowColor?: string;
  glowColorLight?: string;
  maxGlowIntensity?: number;
  glowDecay?: number;
  borderRadius?: number;
  nodeDistance?: number;
  disableBlinking?: boolean;
  activeNodeId?: string;
  onSelectNode?: (id: string) => void;
  className?: string;
}

export const CenterFlow: React.FC<CenterFlowProps> = ({
  nodeItems,
  centerContent,
  centerSize = 148,
  nodeSize = 86,
  pulseDuration = 3.8,
  lineWidth = 1.5,
  pulseWidth = 2.4,
  lineColor = "rgba(255, 255, 255, 0.09)",
  pulseColor = "#FF6A00",
  glowColor = "#FF6A00",
  borderRadius = 28,
  nodeDistance = 0.78,
  disableBlinking = false,
  activeNodeId,
  onSelectNode,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 960, height: 620 });
  const [arrivedNodeIdx, setArrivedNodeIdx] = useState<number>(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      if (!el) return;
      setDimensions({
        width: el.clientWidth || 960,
        height: el.clientHeight || 620,
      });
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Periodic arrival glow cycle across nodes
  useEffect(() => {
    if (disableBlinking || nodeItems.length === 0) return;
    const interval = setInterval(() => {
      setArrivedNodeIdx((prev) => (prev + 1) % nodeItems.length);
    }, 950);
    return () => clearInterval(interval);
  }, [disableBlinking, nodeItems.length]);

  const isMobile = dimensions.width < 640;
  const isTablet = dimensions.width >= 640 && dimensions.width < 1024;

  const effectiveCenterSize = isMobile
    ? Math.min(112, centerSize * 0.78)
    : isTablet
    ? Math.min(130, centerSize * 0.88)
    : centerSize;

  const effectiveNodeSize = isMobile
    ? 68
    : isTablet
    ? 78
    : nodeSize;

  const cx = dimensions.width / 2;
  const cy = dimensions.height / 2;

  // Calculate elliptical radial coordinates so all 12 brand nodes fit with generous padding
  const rx =
    (dimensions.width / 2 - effectiveNodeSize * 0.72) *
    (isMobile ? 0.92 : nodeDistance);
  const ry =
    (dimensions.height / 2 - effectiveNodeSize * 0.72) *
    (isMobile ? 0.88 : nodeDistance);

  const computedNodes = nodeItems.map((item, idx) => {
    const total = nodeItems.length;
    const angle = (idx / total) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * rx;
    const y = cy + Math.sin(angle) * ry;

    // Create an architectural curved cubic bezier path from center to node
    const midR = 0.48;
    const ctrlAngleOffset = idx % 2 === 0 ? 0.14 : -0.14;
    const c1x = cx + Math.cos(angle + ctrlAngleOffset) * (rx * midR);
    const c1y = cy + Math.sin(angle + ctrlAngleOffset) * (ry * midR);
    const c2x = cx + Math.cos(angle) * (rx * 0.76);
    const c2y = cy + Math.sin(angle) * (ry * 0.76);

    const pathD = `M ${cx} ${cy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x} ${y}`;

    return {
      ...item,
      idx,
      x,
      y,
      angle,
      pathD,
    };
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden select-none",
        isMobile ? "h-[540px]" : isTablet ? "h-[600px]" : "h-[660px]",
        className
      )}
    >
      {/* Ambient Radial Center Aura */}
      <div
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColor}24 0%, ${glowColor}08 38%, transparent 70%)`,
        }}
        className="pointer-events-none absolute inset-0"
      />

      {/* Concentric Technical Radar Rings */}
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <filter id="center-flow-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="orange-pulse-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6A00" stopOpacity="1" />
            <stop offset="60%" stopColor="#FF8A2A" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#F5F5F5" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Subtle Orbital Reference Ellipses */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx * 0.55}
          ry={ry * 0.55}
          fill="none"
          stroke="rgba(255,255,255,0.035)"
          strokeDasharray="4 8"
        />
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke="rgba(255,106,0,0.08)"
          strokeDasharray="2 10"
        />

        {/* Base Connection Lines + Flowing Energy Pulses */}
        {computedNodes.map((node) => {
          const isSelected = activeNodeId === node.id;
          const isArriving = arrivedNodeIdx === node.idx;

          return (
            <g key={`path-${node.id}`}>
              {/* Base structural track */}
              <path
                d={node.pathD}
                fill="none"
                stroke={isSelected ? "rgba(255, 106, 0, 0.55)" : lineColor}
                strokeWidth={isSelected ? lineWidth * 1.6 : lineWidth}
              />

              {/* Animated Orange Energy Pulse Stream */}
              <path
                d={node.pathD}
                fill="none"
                stroke={node.idx % 3 === 0 ? "#F5F5F5" : pulseColor}
                strokeWidth={isSelected ? pulseWidth * 1.35 : pulseWidth}
                strokeLinecap="round"
                strokeDasharray="36 260"
                filter="url(#center-flow-glow)"
                opacity={isSelected ? 1 : 0.82}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="296"
                  to="0"
                  dur={`${(pulseDuration + (node.idx % 4) * 0.45).toFixed(2)}s`}
                  begin={`${(node.idx * 0.32).toFixed(2)}s`}
                  repeatCount="indefinite"
                />
              </path>

              {/* Node terminal ring highlight */}
              {(isSelected || isArriving) && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={effectiveNodeSize * 0.56}
                  fill="none"
                  stroke={pulseColor}
                  strokeOpacity={isSelected ? 0.55 : 0.25}
                  strokeWidth="1.2"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Center Hub: KHODROYAB / خودرو یاب */}
      <div
        style={{
          width: effectiveCenterSize,
          height: effectiveCenterSize,
          borderRadius,
          left: cx - effectiveCenterSize / 2,
          top: cy - effectiveCenterSize / 2,
          boxShadow: `0 0 55px -6px ${glowColor}66, inset 0 0 24px ${glowColor}28`,
        }}
        className="absolute z-20 flex flex-col items-center justify-center border border-[#FF6A00]/60 bg-[#0D1117]/95 backdrop-blur-md transition-transform duration-500 hover:scale-105"
      >
        {/* Rotating subtle corner ring */}
        <div
          aria-hidden="true"
          style={{ borderRadius }}
          className="pointer-events-none absolute -inset-2 border border-[#FF6A00]/25 animate-pulse"
        />
        {centerContent || (
          <div className="flex flex-col items-center justify-center text-center px-2">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#FF8A2A] uppercase">
              KHODROYAB
            </span>
            <span className="mt-1 text-base sm:text-lg font-extrabold text-[#F5F5F5] tracking-tight">
              خودرو یاب
            </span>
            <span className="mt-1 rounded-full bg-[#FF6A00]/15 border border-[#FF6A00]/30 px-2 py-0.5 text-[9px] text-[#FF8A2A]">
              مناطق آزاد
            </span>
          </div>
        )}
      </div>

      {/* Connected Brand Nodes */}
      {computedNodes.map((node) => {
        const isSelected = activeNodeId === node.id;
        const isArriving = arrivedNodeIdx === node.idx && !disableBlinking;

        return (
          <button
            key={node.id}
            type="button"
            onClick={() => onSelectNode && onSelectNode(node.id)}
            style={{
              width: effectiveNodeSize,
              height: effectiveNodeSize,
              left: node.x - effectiveNodeSize / 2,
              top: node.y - effectiveNodeSize / 2,
              boxShadow: isSelected
                ? `0 0 32px -4px ${glowColor}80`
                : isArriving
                ? `0 0 22px -6px ${glowColor}50`
                : "0 12px 28px -8px rgba(0,0,0,0.8)",
            }}
            className={cn(
              "group absolute z-20 flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]",
              isSelected
                ? "border-[#FF6A00] bg-[#171B21] scale-110"
                : isArriving
                ? "border-[#FF8A2A]/60 bg-[#0D1117]/95 scale-[1.03]"
                : "border-white/[0.09] bg-[#0D1117]/90 hover:border-[#FF6A00]/55 hover:bg-[#171B21]/95 hover:scale-105"
            )}
            aria-label={node.label || node.id}
          >
            {node.content}
          </button>
        );
      })}
    </div>
  );
};

export default CenterFlow;
