"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    // Older / non-secure contexts: fall back to a hidden textarea.
    const area = document.createElement("textarea");
    area.value = value;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

/** Small "copy" button that turns into a check for a moment after copying. */
export function CopyButton({ value, label, className }: { value: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function handleClick() {
    if (!(await copyText(value))) return;
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={copied ? "کپی شد" : label}
      title={copied ? "کپی شد" : label}
      className={cn(
        "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 active:scale-90",
        copied
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
          : "border-panel-line/[0.1] bg-panel-surface-2 text-panel-muted hover:border-[#FF6A00]/40 hover:text-panel-accent",
        className
      )}
    >
      <Copy className={cn("absolute h-4 w-4 transition-all duration-200", copied ? "scale-50 opacity-0" : "scale-100 opacity-100")} />
      <Check className={cn("absolute h-4 w-4 transition-all duration-200", copied ? "scale-100 opacity-100" : "scale-50 opacity-0")} />
      <span aria-live="polite" className="sr-only">
        {copied ? "کپی شد" : ""}
      </span>
    </button>
  );
}
