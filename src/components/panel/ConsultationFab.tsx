"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Headset, PhoneCall, X } from "lucide-react";

import { phoneToTelHref } from "@/lib/system-settings-shared";
import { cn, toPersianDigits } from "@/lib/utils";

interface ConsultationFabProps {
  /** Consultation phone number from the system settings. */
  phone: string;
}

/**
 * Floating "free car-buying consultation" button shown on every panel page,
 * above the bottom dock. Opens a small dialog with the phone number; tapping
 * the number starts a call.
 */
export function ConsultationFab({ phone }: ConsultationFabProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    const frame = requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus());
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(frame);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[60]" role="presentation">
          <div className="admin-animate-fade absolute inset-0 bg-black/45 backdrop-blur-[2px]" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="panel-consult-pop absolute bottom-[calc(var(--panel-dock-space)+4.75rem)] end-4 w-[calc(100vw-2rem)] max-w-[320px] overflow-hidden rounded-3xl border border-panel-line/[0.1] bg-panel-surface shadow-[0_30px_70px_-20px_rgba(0,0,0,0.75)] sm:end-6"
          >
            <div className="pointer-events-none absolute inset-x-0 -top-16 mx-auto h-36 w-36 rounded-full bg-[#FF6A00]/25 blur-3xl" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="بستن"
              className="absolute end-3 top-3 z-[1] flex h-8 w-8 items-center justify-center rounded-xl border border-panel-line/[0.08] text-panel-muted transition-colors hover:text-panel-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative px-5 pb-5 pt-6 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6A00] to-[#FF9A45] text-[#07090C] shadow-[0_14px_30px_-10px_rgba(255,106,0,0.8)]">
                <Headset className="h-7 w-7" />
              </span>
              <h2 id={titleId} className="mt-4 text-base font-black text-panel-text">
                مشاوره رایگان خرید خودرو
              </h2>
              <p className="mt-1.5 text-xs leading-6 text-panel-muted">
                برای انتخاب و خرید خودرو، با کارشناسان ما تماس بگیرید.
              </p>

              <a
                href={phoneToTelHref(phone)}
                data-autofocus
                className="group mt-4 flex items-center justify-between gap-3 rounded-2xl border border-[#FF6A00]/40 bg-[#FF6A00]/[0.1] px-4 py-3 transition-all hover:border-[#FF6A00]/70 hover:bg-[#FF6A00]/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 active:scale-[0.98]"
              >
                <span dir="ltr" className="font-mono text-lg font-black tracking-wider text-panel-text">
                  {toPersianDigits(phone)}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-3 py-1.5 text-xs font-extrabold text-[#07090C]">
                  <PhoneCall className="h-3.5 w-3.5" />
                  تماس
                </span>
              </a>
            </div>
          </div>
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="مشاوره رایگان خرید خودرو"
        className={cn(
          "panel-consult-fab group fixed bottom-[calc(var(--panel-dock-space)+0.75rem)] end-4 z-[61] flex h-14 items-center gap-2 rounded-full bg-gradient-to-br from-[#FF6A00] to-[#FF9A45] ps-4 pe-4 text-[#07090C] shadow-[0_16px_36px_-10px_rgba(255,106,0,0.85)] transition-transform hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6A00]/35 active:scale-95 sm:end-6 sm:pe-5",
          open && "scale-95"
        )}
      >
        {!open && <span className="panel-consult-ring pointer-events-none absolute inset-0 rounded-full" aria-hidden="true" />}
        <span className="relative flex h-6 w-6 items-center justify-center">
          {open ? <X className="h-6 w-6" /> : <Headset className="h-6 w-6" />}
        </span>
        <span className="relative hidden text-sm font-black sm:inline">مشاوره رایگان</span>
      </button>
    </>
  );
}
