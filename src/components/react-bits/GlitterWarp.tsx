"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface GlitterWarpProps {
  width?: number | string;
  height?: number | string;
  speed?: number;
  color?: string;
  secondaryColor?: string;
  density?: number;
  brightness?: number;
  starSize?: number;
  focalDepth?: number;
  turbulence?: number;
  autoPlay?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function hexToRgbNormalized(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean.padEnd(6, "0");
  const num = parseInt(full.slice(0, 6), 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

export const GlitterWarp: React.FC<GlitterWarpProps> = ({
  width = "100%",
  height = "100%",
  speed = 0.65,
  color = "#FF6A00",
  secondaryColor = "#FF8A2A",
  density = 18.0,
  brightness = 0.95,
  starSize = 0.08,
  focalDepth = 0.06,
  turbulence = 0.12,
  autoPlay = true,
  className = "",
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId = 0;
    let isVisible = true;
    let widthPx = container.clientWidth || window.innerWidth;
    let heightPx = container.clientHeight || window.innerHeight;

    const isMobile = widthPx < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 2);

    const resize = () => {
      if (!container || !canvas) return;
      widthPx = container.clientWidth || window.innerWidth;
      heightPx = container.clientHeight || window.innerHeight;
      canvas.width = Math.floor(widthPx * dpr);
      canvas.height = Math.floor(heightPx * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Build particles for the refined dark automotive glitter warp
    const baseCount = Math.floor((isMobile ? 95 : 190) * (density / 15));
    const [r1, g1, b1] = hexToRgbNormalized(color);
    const [r2, g2, b2] = hexToRgbNormalized(secondaryColor);

    interface StarParticle {
      x: number;
      y: number;
      z: number;
      pz: number;
      tone: number; // 0: primary orange, 1: secondary amber, 2: warm platinum
      shimmerOffset: number;
      sizeFactor: number;
    }

    const stars: StarParticle[] = Array.from({ length: baseCount }, (_, idx) => {
      const z = Math.random();
      return {
        x: (Math.random() - 0.5) * 2.4,
        y: (Math.random() - 0.5) * 2.4,
        z,
        pz: z,
        tone: idx % 5 === 0 ? 2 : idx % 2 === 0 ? 0 : 1,
        shimmerOffset: Math.random() * Math.PI * 2,
        sizeFactor: 0.55 + Math.random() * 0.9,
      };
    });

    let time = 0;

    const renderFrame = () => {
      if (!isVisible && autoPlay) {
        animationFrameId = requestAnimationFrame(renderFrame);
        return;
      }

      ctx.clearRect(0, 0, widthPx, heightPx);

      const cx = widthPx * 0.5;
      const cy = heightPx * 0.44;
      const maxRadius = Math.hypot(widthPx, heightPx) * 0.65;

      // Subtle atmospheric central ambient glow
      const centerGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxRadius * 0.75);
      centerGrad.addColorStop(
        0,
        `rgba(${Math.round(r1 * 255)}, ${Math.round(g1 * 255)}, ${Math.round(b1 * 255)}, 0.07)`
      );
      centerGrad.addColorStop(
        0.45,
        `rgba(${Math.round(r2 * 255)}, ${Math.round(g2 * 255)}, ${Math.round(b2 * 255)}, 0.025)`
      );
      centerGrad.addColorStop(1, "rgba(7, 9, 12, 0)");
      ctx.fillStyle = centerGrad;
      ctx.fillRect(0, 0, widthPx, heightPx);

      const step = prefersReducedMotion || !autoPlay ? 0 : 0.0022 * speed;
      time += step * 12;

      const focalScale = Math.max(0.02, focalDepth) * 14;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.pz = s.z;
        s.z -= step;

        if (s.z <= 0.02) {
          s.x = (Math.random() - 0.5) * 2.4;
          s.y = (Math.random() - 0.5) * 2.4;
          s.z = 1.0;
          s.pz = 1.0;
        }

        const waveX =
          turbulence > 0
            ? Math.sin(time * 0.9 + s.shimmerOffset) * turbulence * 0.04
            : 0;
        const waveY =
          turbulence > 0
            ? Math.cos(time * 0.7 + s.shimmerOffset) * turbulence * 0.04
            : 0;

        const proj = 1 / (s.z * focalScale + 0.12);
        const prevProj = 1 / ((s.pz + step * 3.8) * focalScale + 0.12);

        const sx = cx + (s.x + waveX) * maxRadius * proj * 0.35;
        const sy = cy + (s.y + waveY) * maxRadius * proj * 0.35;

        const px = cx + (s.x + waveX) * maxRadius * prevProj * 0.35;
        const py = cy + (s.y + waveY) * maxRadius * prevProj * 0.35;

        if (sx < -40 || sx > widthPx + 40 || sy < -40 || sy > heightPx + 40) {
          continue;
        }

        const depthAlpha = Math.min(1, (1 - s.z) * 1.35) * Math.min(1, s.z * 6.0);
        const twinkle = 0.65 + 0.35 * Math.sin(time * 2.4 + s.shimmerOffset);
        const alpha = Math.max(0, Math.min(1, depthAlpha * twinkle * brightness));

        let cr = Math.round(r1 * 255);
        let cg = Math.round(g1 * 255);
        let cb = Math.round(b1 * 255);

        if (s.tone === 1) {
          cr = Math.round(r2 * 255);
          cg = Math.round(g2 * 255);
          cb = Math.round(b2 * 255);
        } else if (s.tone === 2) {
          cr = 245;
          cg = 245;
          cb = 245;
        }

        const radius = Math.max(
          0.6,
          (1 - s.z * 0.75) * (starSize * 22) * s.sizeFactor
        );

        // Subtle warp streak line
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha * 0.55})`;
        ctx.lineWidth = Math.max(0.5, radius * 0.65);
        ctx.lineCap = "round";
        ctx.stroke();

        // Glitter point head
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
        ctx.fill();
      }

      if (autoPlay && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [
    speed,
    color,
    secondaryColor,
    density,
    brightness,
    starSize,
    focalDepth,
    turbulence,
    autoPlay,
  ]);

  return (
    <div
      ref={containerRef}
      style={{ width, height }}
      className={cn("relative overflow-hidden select-none", className)}
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

export default GlitterWarp;
