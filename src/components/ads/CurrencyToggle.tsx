"use client";

import React from "react";

import { CURRENCY_LABELS, PRICE_CURRENCIES, type PriceCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface CurrencyToggleProps {
  value: PriceCurrency;
  onChange: (value: PriceCurrency) => void;
  disabled?: boolean;
  /** Visual theme: customer panel or admin panel. */
  tone?: "panel" | "admin";
  label?: string;
  size?: "md" | "sm";
  className?: string;
}

/** Segmented ریال / دلار switch for price fields. */
export function CurrencyToggle({ value, onChange, disabled, tone = "panel", label = "واحد قیمت", size = "md", className }: CurrencyToggleProps) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "inline-flex gap-1 border",
        size === "md" ? "rounded-xl p-1" : "rounded-lg p-0.5",
        tone === "panel" ? "border-panel-line/[0.1] bg-panel-bg" : "border-white/[0.1] bg-[#07090C]",
        className
      )}
    >
      {PRICE_CURRENCIES.map((currency) => {
        const active = value === currency;
        return (
          <button
            key={currency}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(currency)}
            className={cn(
              "font-extrabold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
              size === "md" ? "min-h-[36px] min-w-[64px] rounded-lg px-3 text-xs" : "min-h-[28px] min-w-[44px] rounded-md px-2 text-[11px]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40",
              active
                ? "bg-[#FF6A00]/[0.16] text-[#FF8A2A] shadow-[inset_0_0_0_1px_rgba(255,106,0,0.4)]"
                : tone === "panel"
                  ? "text-panel-muted hover:text-panel-text"
                  : "text-[#8B93A1] hover:text-[#F5F5F5]"
            )}
          >
            {CURRENCY_LABELS[currency]}
          </button>
        );
      })}
    </div>
  );
}

export default CurrencyToggle;
