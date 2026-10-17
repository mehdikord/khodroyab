"use client";

import React from "react";
import { AlertCircle, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export const inputClassName = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-panel-bg px-4 text-sm text-panel-text outline-none transition-all placeholder:text-panel-faint disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-panel-line/[0.12] hover:border-panel-line/20"
  );

export const labelClassName = "block text-xs font-bold text-panel-text-2";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 text-xs font-semibold text-panel-danger-2">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

export function FormAlert({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-semibold text-panel-danger"
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

interface SubmitBarProps {
  pending: boolean;
  label: string;
  pendingLabel: string;
  icon: React.ReactNode;
  onCancel: () => void;
}

/** Primary + cancel pair, pinned to the sheet bottom on phones. */
export function SubmitBar({ pending, label, pendingLabel, icon, onCancel }: SubmitBarProps) {
  return (
    <div className="sticky bottom-0 -mx-5 -mb-5 mt-2 flex gap-3 border-t border-panel-line/[0.07] bg-panel-surface/95 px-5 py-4 backdrop-blur-md sm:static sm:m-0 sm:border-0 sm:bg-transparent sm:p-0 sm:pt-2">
      <button
        type="button"
        onClick={onCancel}
        disabled={pending}
        className="h-12 shrink-0 rounded-xl border border-panel-line/[0.1] bg-panel-elevated px-5 text-sm font-bold text-panel-muted transition-colors hover:text-panel-text disabled:opacity-50"
      >
        انصراف
      </button>
      <button
        type="submit"
        disabled={pending}
        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] text-sm font-extrabold text-[#07090C] shadow-[0_12px_30px_-10px_rgba(255,106,0,0.7)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        {pending ? pendingLabel : label}
      </button>
    </div>
  );
}
