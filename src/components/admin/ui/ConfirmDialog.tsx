"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

import { Modal } from "@/components/admin/ui/Modal";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  pending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Reusable destructive-confirmation dialog built on <Modal />.
 * Rendered on demand; parent controls open state and pending flag.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "حذف",
  cancelLabel = "انصراف",
  danger = true,
  pending = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={pending ? () => undefined : onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="h-11 rounded-xl border border-white/[0.12] px-5 text-sm font-bold text-[#D2D7DF] transition-colors hover:border-white/25 hover:text-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            data-autofocus={danger ? undefined : "true"}
            onClick={onConfirm}
            disabled={pending}
            className={cn(
              "flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117] disabled:cursor-not-allowed disabled:opacity-60",
              danger
                ? "bg-gradient-to-l from-red-600 to-red-500 text-white shadow-[0_0_24px_rgba(220,38,38,0.35)] hover:brightness-110 focus-visible:ring-red-500/50"
                : "bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] text-[#07090C] shadow-[0_0_24px_rgba(255,106,0,0.35)] hover:brightness-110 focus-visible:ring-[#FF6A00]/50"
            )}
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-500/25 bg-red-500/10 text-red-400">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="min-w-0 pt-1 text-sm leading-7 text-[#B6BDC8]">
          {message}
        </div>
      </div>
    </Modal>
  );
}