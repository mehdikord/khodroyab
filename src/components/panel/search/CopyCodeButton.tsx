"use client";

import React, { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn, toPersianDigits } from "@/lib/utils";

interface CopyCodeButtonProps {
  code: string;
  className?: string;
}

/** Ad code badge that copies the code to the clipboard on tap. */
export function CopyCodeButton({ code, className }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function handleCopy(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // Clipboard unavailable (insecure context / permissions): ignore silently.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "کد آگهی کپی شد" : `کپی کد آگهی ${toPersianDigits(code)}`}
      title="کپی کد آگهی"
      className={cn(
        "group/code inline-flex items-center gap-2 rounded-xl border px-2.5 py-1.5 font-mono text-sm font-extrabold tracking-[0.18em] transition-all",
        copied
          ? "border-emerald-500/40 bg-emerald-500/15 text-panel-success"
          : "border-[#FF6A00]/45 bg-panel-bg/85 text-panel-accent shadow-[0_0_18px_rgba(255,106,0,0.25)] hover:bg-[#FF6A00]/15",
        className
      )}
    >
      <span dir="ltr">{toPersianDigits(code)}</span>
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5 opacity-70 transition-opacity group-hover/code:opacity-100" />}
    </button>
  );
}
