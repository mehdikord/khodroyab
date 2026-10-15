"use client";

import React from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ToastState {
  kind: "success" | "error";
  message: string;
}

interface ToastProps {
  toast: ToastState | null;
  onDismiss: () => void;
}

/**
 * Lightweight, auto-dismissing toast rendered at the top of the panel.
 * The parent owns the timer; this component is purely presentational.
 */
export function Toast({ toast, onDismiss }: ToastProps) {
  if (!toast) return null;

  const isSuccess = toast.kind === "success";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "admin-animate-in fixed left-1/2 top-5 z-[120] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-2xl backdrop-blur-md",
        isSuccess
          ? "border-emerald-500/30 bg-emerald-950/80 text-emerald-100"
          : "border-red-500/30 bg-red-950/80 text-red-100"
      )}
    >
      {isSuccess ? (
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
      ) : (
        <XCircle className="h-5 w-5 shrink-0 text-red-400" />
      )}
      <p className="min-w-0 flex-1 truncate text-sm font-semibold">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="بستن اعلان"
        className="rounded-lg p-1 text-[#B6BDC8] transition-colors hover:bg-white/10 hover:text-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}