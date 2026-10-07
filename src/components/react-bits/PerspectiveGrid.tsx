"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface PerspectiveGridProps {
  width?: number | string;
  height?: number | string;
  speed?: number;
  color?: string;
  gridScale?: number;
  lineThickness?: number;
  antialiasQuality?: number;
  autoPlay?: boolean;
  opacity?: number;
  fadeSmoothness?: number;
  perspective?: number;
  gridLength?: number;
  curve?: number;
  bottomFade?: string;
  className?: string;
  children?: React.ReactNode;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean.padEnd(6, "0");
  const num = parseInt(full.slice(0, 6), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export const PerspectiveGrid: React.FC<PerspectiveGridProps> = ({
  width = "100%",
  height = "100%",
  speed = 0.45,
  color = "#FF6A00",
  gridScale = 1.0,
  lineThickness = 1.0,
  autoPlay = true,
  opacity = 0.42,
  fadeSmoothness = 1.0,
  perspective = 18,
  gridLength = 12.0,
  curve = 0.08,
  bottomFade = "#07090C",
  className = "",
  children,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let isVisible = true;
    let w = container.clientWidth || 1200;
    let h = container.clientHeight || 480;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      if (!container || !canvas) return;
      w = container.clientWidth || 1200;
      h = container.clientHeight || 480;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    const [r, g, b] = hexToRgb(color);
    let offsetZ = 0;

    const renderGrid = () => {
      if (!isVisible && autoPlay) {
        animId = requestAnimationFrame(renderGrid);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      if (autoPlay && !prefersReducedMotion) {
        offsetZ = (offsetZ + 0.008 * speed) % 1;
      }

      const horizonY = h * (0.24 + (perspective / 180) * 0.2);
      const gridHeight = h - horizonY;
      const cx = w * 0.5;

      // Subtle orange horizon glow
      const horizonGlow = ctx.createRadialGradient(
        cx,
        horizonY,
        10,
        cx,
        horizonY,
        w * 0.55
      );
      horizonGlow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity * 0.35})`);
      horizonGlow.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${opacity * 0.08})`);
      horizonGlow.addColorStop(1, "rgba(7, 9, 12, 0)");
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, 0, w, h);

      // Perspective Longitudinal Lines (radiating from vanishing point)
      const numCols = Math.floor(22 * gridScale);
      ctx.lineWidth = lineThickness;

      for (let i = -numCols; i <= numCols; i++) {
        const normX = i / numCols;
        const topX = cx + normX * (w * 0.08);
        const bottomX = cx + normX * (w * 1.45);
        const edgeFade = Math.max(0, 1 - Math.abs(normX) * 0.92);
        const lineAlpha = edgeFade * opacity * 0.55;

        const grad = ctx.createLinearGradient(topX, horizonY, bottomX, h);
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        grad.addColorStop(0.25, `rgba(${r}, ${g}, ${b}, ${lineAlpha * 0.65})`);
        grad.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, ${lineAlpha})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${lineAlpha * 0.2})`);

        ctx.beginPath();
        ctx.moveTo(topX, horizonY);
        ctx.lineTo(bottomX, h);
        ctx.strokeStyle = grad;
        ctx.stroke();
      }

      // Perspective Transverse Lines (scrolling toward viewer)
      const numRows = Math.floor(gridLength * 1.5);
      for (let j = 0; j < numRows; j++) {
        const linearT = ((j + offsetZ) / numRows) % 1;
        // Exponential perspective spacing
        const pT = Math.pow(linearT, 2.35);
        const y = horizonY + pT * gridHeight;

        const rowAlpha =
          Math.sin(linearT * Math.PI) *
          opacity *
          (0.35 + pT * 0.65) *
          fadeSmoothness;

        ctx.beginPath();
        if (curve > 0.001) {
          const curveLift = Math.pow(1 - pT, 1.2) * curve * 45;
          ctx.moveTo(0, y - curveLift);
          ctx.quadraticCurveTo(cx, y + curveLift, w, y - curveLift);
        } else {
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
        }

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(
          0,
          Math.min(0.65, rowAlpha)
        )})`;
        ctx.lineWidth = Math.max(0.5, lineThickness * (0.4 + pT * 0.85));
        ctx.stroke();
      }

      // Bottom Fade Gradient if specified
      if (bottomFade) {
        const bGrad = ctx.createLinearGradient(0, h * 0.72, 0, h);
        bGrad.addColorStop(0, "rgba(7, 9, 12, 0)");
        bGrad.addColorStop(1, bottomFade);
        ctx.fillStyle = bGrad;
        ctx.fillRect(0, h * 0.72, w, h * 0.28);
      }

      if (autoPlay && !prefersReducedMotion) {
        animId = requestAnimationFrame(renderGrid);
      }
    };

    renderGrid();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      io.disconnect();
    };
  }, [
    speed,
    color,
    gridScale,
    lineThickness,
    autoPlay,
    opacity,
    fadeSmoothness,
    perspective,
    gridLength,
    curve,
    bottomFade,
  ]);

  return (
    <div
      ref={containerRef}
      style={{ width, height }}
      className={cn("relative overflow-hidden", className)}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  );
};

export default PerspectiveGrid;
