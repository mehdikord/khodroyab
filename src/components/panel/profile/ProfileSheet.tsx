"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface ProfileSheetProps {
  open: boolean;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onClose: () => void;
  /** Prevent closing while a submit is in flight. */
  locked?: boolean;
  children: React.ReactNode;
}

/**
 * App-style sheet: slides up from the bottom on phones (with a drag handle and
 * safe-area padding) and renders as a centered dialog from `sm` upwards.
 * Always portaled to `document.body` so it overlays the whole page.
 */
export function ProfileSheet({ open, title, description, icon, onClose, locked = false, children }: ProfileSheetProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  // Portal target exists only on the client; avoids SSR/hydration mismatch.
  // We mount inside `.panel-root` (not <body>) so the sheet inherits the
  // panel's theme tokens (dark/light) instead of the page defaults.
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalTarget(document.querySelector<HTMLElement>(".panel-root") ?? document.body);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !locked) onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    // Move focus into the sheet for keyboard / screen-reader users.
    const first = panelRef.current?.querySelector<HTMLElement>("[data-sheet-body] input, [data-sheet-body] textarea, [data-sheet-body] button");
    first?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, locked, onClose]);

  if (!open || !portalTarget) return null;

  // Rendered at the document root so ancestors with `transform` or
  // `overflow: hidden` (e.g. animated cards) cannot trap or clip the overlay.
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="بستن"
        onClick={() => !locked && onClose()}
        className="admin-animate-fade absolute inset-0 bg-[#03050A]/75 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "panel-sheet relative flex w-full max-h-[92dvh] flex-col overflow-hidden border border-panel-line/[0.1] bg-panel-surface",
          "rounded-t-[28px] shadow-[0_-24px_80px_rgba(0,0,0,0.9)]",
          "sm:max-w-lg sm:rounded-[28px] sm:shadow-[0_40px_90px_rgba(0,0,0,0.85),0_0_60px_-20px_rgba(255,106,0,0.35)]"
        )}
      >
        {/* Drag handle (mobile only) */}
        <div className="flex justify-center pt-2.5 sm:hidden" aria-hidden="true">
          <span className="h-1.5 w-12 rounded-full bg-panel-line/[0.18]" />
        </div>

        <div className="flex items-start gap-3 border-b border-panel-line/[0.07] bg-gradient-to-l from-[#FF6A00]/[0.09] to-transparent px-5 pb-4 pt-3 sm:pt-5">
          {icon && (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#FF6A00]/30 bg-[#FF6A00]/[0.12] text-panel-accent">
              {icon}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-base font-black text-panel-text">
              {title}
            </h2>
            {description && <p className="mt-0.5 text-[11px] leading-5 text-panel-muted">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={locked}
            aria-label="بستن"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-panel-line/[0.1] bg-panel-elevated text-panel-muted transition-colors hover:text-panel-text disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div data-sheet-body className="panel-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
          {children}
        </div>
      </div>
    </div>,
    portalTarget
  );
}
