"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ShaderCardProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: string;
  color?: string;
  highlightColor?: string;
  backgroundColor?: string;
  speed?: number;
  positionY?: number;
  scale?: number;
  effectRadius?: number;
  effectBoost?: number;
  waveAmount?: number;
  contours?: number;
  intensity?: number;
  bloom?: number;
  fade?: number;
  opacity?: number;
  interactive?: boolean;
  tiltStrength?: number;
  hoverRise?: number;
  autoPlay?: boolean;
  paused?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
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

export const ShaderCard: React.FC<ShaderCardProps> = ({
  width = "100%",
  height = "100%",
  borderRadius = "16px",
  color = "#FF6A00",
  highlightColor = "#FF8A2A",
  backgroundColor = "#0D1117",
  speed = 0.42,
  positionY = 0,
  scale = 3.8,
  effectRadius = 0.9,
  effectBoost = 0.45,
  waveAmount = 0.14,
  contours = 1.0,
  intensity = 0.85,
  bloom = 0.75,
  fade = 0.62,
  opacity = 0.9,
  interactive = true,
  tiltStrength = 5.5,
  hoverRise = 1.0,
  autoPlay = true,
  paused = false,
  children,
  className = "",
  style,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 85 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let isVisible = true;
    let w = card.clientWidth || 360;
    let h = card.clientHeight || 440;

    const resize = () => {
      if (!card || !canvas) return;
      w = Math.max(200, card.clientWidth);
      h = Math.max(200, card.clientHeight);
      // Low internal resolution gives natural soft shader bloom at 60fps
      canvas.width = Math.floor(w * 0.5);
      canvas.height = Math.floor(h * 0.5);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(card);

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(card);

    const [r1, g1, b1] = hexToRgb(color);
    const [r2, g2, b2] = hexToRgb(highlightColor);

    let t = Math.random() * 100;
    let currentRise = 0;

    const drawShader = () => {
      if (!isVisible && autoPlay) {
        animId = requestAnimationFrame(drawShader);
        return;
      }

      const cw = canvas.width;
      const ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);

      const targetRise = hovered ? hoverRise * 0.14 : 0;
      currentRise += (targetRise - currentRise) * 0.08;

      if (autoPlay && !paused && !prefersReducedMotion) {
        t += 0.016 * speed * (hovered ? 1.45 : 1.0);
      }

      const baseCenterY = ch * (0.94 - positionY * 0.2 - currentRise);
      const baseRadius = Math.max(cw, ch) * (0.58 * effectRadius + currentRise * 0.35);

      // Primary rising thermal shader core
      const coreGrad = ctx.createRadialGradient(
        cw * 0.5 + Math.sin(t * 1.3) * cw * waveAmount * 0.4,
        baseCenterY,
        cw * 0.04,
        cw * 0.5,
        baseCenterY - ch * 0.18,
        baseRadius
      );

      const alphaCore = Math.min(
        1,
        (0.32 + effectBoost * 0.22 + (hovered ? 0.14 : 0)) * intensity * opacity
      );
      const alphaMid = Math.min(1, alphaCore * 0.55 * bloom);

      coreGrad.addColorStop(0, `rgba(${r2}, ${g2}, ${b2}, ${alphaCore})`);
      coreGrad.addColorStop(0.42, `rgba(${r1}, ${g1}, ${b1}, ${alphaMid})`);
      coreGrad.addColorStop(1, `rgba(${r1}, ${g1}, ${b1}, 0)`);

      ctx.fillStyle = coreGrad;
      ctx.fillRect(0, 0, cw, ch);

      // Luminous contour ribbons inside the rising shader
      if (contours > 0) {
        const ribbonCount = 5;
        for (let i = 0; i < ribbonCount; i++) {
          const ratio = i / ribbonCount;
          const yBase =
            ch * (0.88 - ratio * (0.42 + currentRise * 0.5)) -
            ((t * 14 + i * 22) % (ch * 0.38));

          ctx.beginPath();
          for (let x = 0; x <= cw; x += 8) {
            const nx = x / cw;
            const wave =
              Math.sin(nx * scale + t * 1.8 + i * 1.1) * (ch * 0.045 * waveAmount * 5) +
              Math.cos(nx * (scale * 0.6) - t * 1.2 + i) * (ch * 0.025);
            const arch = Math.sin(nx * Math.PI) * -ch * 0.06;
            const y = yBase + wave + arch;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          const ribbonAlpha =
            Math.max(0, (yBase / ch - (1 - fade)) / fade) *
            0.22 *
            contours *
            intensity *
            (hovered ? 1.35 : 0.9);

          ctx.strokeStyle =
            i % 2 === 0
              ? `rgba(${r2}, ${g2}, ${b2}, ${Math.max(0, Math.min(0.45, ribbonAlpha))})`
              : `rgba(${r1}, ${g1}, ${b1}, ${Math.max(0, Math.min(0.35, ribbonAlpha))})`;
          ctx.lineWidth = i === 0 ? 1.6 : 1.0;
          ctx.stroke();
        }
      }

      // Top readability fade mask
      const maskGrad = ctx.createLinearGradient(0, 0, 0, ch);
      maskGrad.addColorStop(0, backgroundColor);
      maskGrad.addColorStop(Math.max(0.15, 1 - fade), `${backgroundColor}D9`);
      maskGrad.addColorStop(1, `${backgroundColor}15`);
      ctx.fillStyle = maskGrad;
      ctx.fillRect(0, 0, cw, ch * 0.72);

      if (autoPlay && !paused && !prefersReducedMotion) {
        animId = requestAnimationFrame(drawShader);
      }
    };

    drawShader();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      io.disconnect();
    };
  }, [
    color,
    highlightColor,
    backgroundColor,
    speed,
    positionY,
    scale,
    effectRadius,
    effectBoost,
    waveAmount,
    contours,
    intensity,
    bloom,
    fade,
    opacity,
    hoverRise,
    autoPlay,
    paused,
    hovered,
  ]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * tiltStrength * 2;
    const rx = (0.5 - py) * tiltStrength * 2;
    setTilt({ rx, ry, gx: px * 100, gy: py * 100 });
  };

  const handlePointerLeave = () => {
    setHovered(false);
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 85 });
  };

  return (
    <div
      ref={cardRef}
      onPointerEnter={() => setHovered(true)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor,
        transform: interactive
          ? `perspective(1100px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(
              2
            )}deg)`
          : undefined,
        transition: hovered
          ? "transform 120ms ease-out, border-color 300ms ease, box-shadow 300ms ease"
          : "transform 450ms cubic-bezier(0.16, 1, 0.3, 1), border-color 300ms ease, box-shadow 300ms ease",
        ...style,
      }}
      className={cn(
        "group relative overflow-hidden border border-white/[0.08] hover:border-[#FF6A00]/45 shadow-card-depth hover:shadow-orange-subtle",
        className
      )}
    >
      {/* Rising Shader Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500"
      />

      {/* Subtle Pointer Specular Rim */}
      <div
        aria-hidden="true"
        style={{
          background: `radial-gradient(380px circle at ${tilt.gx}% ${tilt.gy}%, rgba(255, 106, 0, ${
            hovered ? 0.14 : 0.04
          }), transparent 70%)`,
        }}
        className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300"
      />

      {/* Bottom Orange Horizon Hairline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[2px] bg-gradient-to-r from-transparent via-[#FF6A00]/70 to-transparent opacity-65 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Card Foreground Content */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
};

export default ShaderCard;
