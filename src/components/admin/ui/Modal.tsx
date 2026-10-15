"use client";

import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "sm:max-w-md",
  md: "sm:max-w-xl",
  lg: "sm:max-w-3xl",
};

/**
 * Accessible dialog built on a portal so it escapes any stacking context.
 * - Focus is trapped inside the dialog while open and restored on close.
 * - ESC closes, backdrop click closes, scroll is locked.
 * - Announced to screen readers via role="dialog" + aria-labelledby.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Keep the latest onClose in a ref so the focus/scroll effect depends only
  // on `open` and never re-runs because of callback identity churn.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    // Move focus inside after the browser has painted the portal.
    const frame = requestAnimationFrame(() => {
      const firstFocusable = panel?.querySelector<HTMLElement>(
        '[data-autofocus], button, input, select, textarea, a[href]'
      );
      firstFocusable?.focus();
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      cancelAnimationFrame(frame);
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="admin-animate-fade absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? `${titleId}-desc` : undefined}
        className={cn(
          "admin-animate-in admin-scrollbar relative max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-white/[0.1] bg-[#0D1117] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.8)]",
          "sm:rounded-3xl sm:max-h-[85vh]",
          SIZE_CLASSES[size]
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/[0.07] bg-[#0D1117]/95 px-5 py-4 backdrop-blur">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-base font-extrabold leading-6 text-[#F5F5F5]"
            >
              {title}
            </h2>
            {description && (
              <p
                id={`${titleId}-desc`}
                className="mt-1 text-xs leading-5 text-[#8B93A1]"
              >
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-[#8B93A1] transition-colors hover:border-white/20 hover:text-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </header>

        {/* Body */}
        <div className="px-5 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <footer className="sticky bottom-0 z-10 flex flex-col-reverse gap-3 border-t border-white/[0.07] bg-[#0D1117]/95 px-5 py-4 backdrop-blur sm:flex-row sm:justify-end">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body
  );
}