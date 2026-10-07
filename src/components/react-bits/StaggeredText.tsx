"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StaggeredTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  segmentBy?: "chars" | "words" | "lines";
  separator?: string;
  delay?: number; // ms between segments
  duration?: number; // seconds
  threshold?: number;
  rootMargin?: string;
  direction?: "top" | "bottom" | "left" | "right";
  blur?: boolean;
  staggerDirection?: "forward" | "reverse" | "center";
  respectReducedMotion?: boolean;
  exitOnScrollOut?: boolean;
  highlightWords?: string[];
  highlightClassName?: string;
  onAnimationComplete?: () => void;
}

export const StaggeredText: React.FC<StaggeredTextProps> = ({
  text,
  className = "",
  as: Tag = "h1",
  segmentBy = "words",
  separator,
  delay = 75,
  duration = 0.72,
  threshold = 0.1,
  rootMargin = "0px",
  direction = "bottom",
  blur = true,
  staggerDirection = "forward",
  respectReducedMotion = true,
  exitOnScrollOut = false,
  highlightWords = [],
  highlightClassName = "text-transparent bg-clip-text bg-gradient-to-l from-[#FF6A00] via-[#FF8A2A] to-[#F5F5F5]",
  onAnimationComplete,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (respectReducedMotion && typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mq.matches);
    }
  }, [respectReducedMotion]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else if (exitOnScrollOut) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, exitOnScrollOut]);

  // Note: For Persian/Arabic script, splitting by 'words' or 'lines' preserves cursive letter connections.
  const segments = React.useMemo(() => {
    if (separator) {
      return text.split(separator);
    }
    if (segmentBy === "lines") {
      return text.split("\n");
    }
    if (segmentBy === "chars") {
      // Only split into chars for Latin strings; for Persian keep words intact to preserve ligatures
      const hasPersian = /[\u0600-\u06FF]/.test(text);
      if (hasPersian) {
        return text.split(" ");
      }
      return text.split("");
    }
    return text.split(" ");
  }, [text, segmentBy, separator]);

  const getOffset = () => {
    switch (direction) {
      case "top":
        return { x: 0, y: -28 };
      case "bottom":
        return { x: 0, y: 28 };
      case "left":
        return { x: -28, y: 0 };
      case "right":
        return { x: 28, y: 0 };
      default:
        return { x: 0, y: 28 };
    }
  };

  const getStaggerIndex = (index: number, total: number) => {
    if (staggerDirection === "reverse") {
      return total - 1 - index;
    }
    if (staggerDirection === "center") {
      const center = (total - 1) / 2;
      return Math.abs(index - center);
    }
    return index;
  };

  const offset = getOffset();

  if (reducedMotion) {
    return React.createElement(
      Tag,
      { ref: containerRef as React.RefObject<HTMLHeadingElement>, className },
      text
    );
  }

  return React.createElement(
    Tag,
    {
      ref: containerRef as React.RefObject<HTMLHeadingElement>,
      className: cn("flex flex-wrap items-baseline gap-x-[0.28em] gap-y-2", className),
      "aria-label": text,
    },
    segments.map((segment, idx) => {
      const staggerOrder = getStaggerIndex(idx, segments.length);
      const isHighlighted = highlightWords.some((hw) => segment.includes(hw));

      return (
        <motion.span
          key={`${segment}-${idx}`}
          initial={{
            opacity: 0,
            x: offset.x,
            y: offset.y,
            filter: blur ? "blur(10px)" : "blur(0px)",
          }}
          animate={
            inView
              ? {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  filter: "blur(0px)",
                }
              : {
                  opacity: 0,
                  x: offset.x,
                  y: offset.y,
                  filter: blur ? "blur(10px)" : "blur(0px)",
                }
          }
          transition={{
            duration,
            delay: (staggerOrder * delay) / 1000,
            ease: [0.16, 1, 0.3, 1],
          }}
          onAnimationComplete={
            idx === segments.length - 1 ? onAnimationComplete : undefined
          }
          className={cn(
            "inline-block will-change-transform",
            isHighlighted && highlightClassName
          )}
        >
          {segment}
        </motion.span>
      );
    })
  );
};

export default StaggeredText;
