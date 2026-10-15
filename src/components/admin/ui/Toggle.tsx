"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
}

/**
 * Premium toggle switch used for `isActive` in entity forms.
 * Keyboard-accessible (Space/Enter on a native `role="switch"`).
 */
export function Toggle({
  checked,
  onCheckedChange,
  label,
  id,
  disabled,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      id={id}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]",
        disabled && "cursor-not-allowed opacity-50",
        checked
          ? "border-[#FF6A00] bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] shadow-[0_0_12px_rgba(255,106,0,0.4)]"
          : "border-white/[0.12] bg-[#151A22]"
      )}
    >
      <span
        className={cn(
          "absolute left-[3px] flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200",
          checked && "translate-x-5"
        )}
        aria-hidden="true"
      />
    </button>
  );
}