"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ChevronLeft, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { PanelLogo } from "@/components/panel/PanelLogo";
import { PANEL_SECONDARY_ITEMS } from "@/components/panel/panel-nav";

/**
 * Mobile-only side drawer (below `md`) holding the informational pages
 * (about, contact). On desktop these items sit in the bottom dock instead,
 * so the trigger is hidden there.
 */
export function PanelDrawer({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  // Portal target: the header's backdrop-filter would otherwise trap the fixed overlay inside it.
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.querySelector<HTMLElement>(".panel-root") ?? document.body);
  }, []);

  // Hidden drawer content must not be focusable (React 18 has no `inert` prop).
  useEffect(() => {
    if (panelRef.current) panelRef.current.inert = !open;
  }, [open, portalTarget]);

  // Navigating closes the drawer.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape to close, focus inside while open, focus back to the trigger after.
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", onKeyDown);
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", onKeyDown);
        document.body.style.overflow = previousOverflow;
      };
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      triggerRef.current?.focus();
    }
  }, [open]);

  // Close if the viewport grows to desktop while open.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const onChange = () => query.matches && setOpen(false);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="منوی بیشتر"
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-panel-line/[0.08] bg-panel-surface text-panel-text-2 transition-colors hover:border-[#FF6A00]/40 hover:text-panel-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40 active:scale-95 md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {portalTarget &&
        createPortal(
      <div className={cn("fixed inset-0 z-[70] md:hidden", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Panel: slides in from the start (right) side */}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={cn(
            "absolute inset-y-0 start-0 flex w-[min(20rem,86vw)] flex-col overflow-hidden border-e border-panel-line/[0.1] bg-panel-surface shadow-[0_0_60px_rgba(0,0,0,0.6)]",
            "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="pointer-events-none absolute -top-20 start-[-60px] h-56 w-56 rounded-full bg-[#FF6A00]/15 blur-3xl" aria-hidden="true" />

          <div className="relative flex items-center justify-between gap-3 border-b border-panel-line/[0.08] px-4 py-4">
            <div className="flex items-center gap-2.5">
              <PanelLogo markOnly size="sm" />
              <div className="leading-tight">
                <p id={titleId} className="text-sm font-black text-panel-text">
                  خودرو یاب
                </p>
                <p className="text-[10px] text-panel-muted-2">بیشتر بدانید</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="بستن منو"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-panel-line/[0.08] text-panel-muted transition-colors hover:text-panel-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav aria-label="صفحات اطلاعاتی" className="relative flex-1 space-y-2 overflow-y-auto p-3">
            {PANEL_SECONDARY_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  data-autofocus={index === 0 ? true : undefined}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  style={{ transitionDelay: open ? `${80 + index * 50}ms` : "0ms" }}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40",
                    open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0",
                    active
                      ? "border-[#FF6A00]/35 bg-gradient-to-l from-[#FF6A00]/[0.16] to-[#FF6A00]/[0.04]"
                      : "border-panel-line/[0.06] bg-panel-line/[0.02] hover:border-[#FF6A00]/25 hover:bg-panel-line/[0.04]"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                      active ? "border-[#FF6A00]/40 bg-[#FF6A00]/15 text-panel-accent" : "border-panel-line/[0.08] bg-panel-bg text-panel-text-2"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-extrabold text-panel-text">{item.label}</span>
                    {item.description && <span className="mt-0.5 block truncate text-[11px] text-panel-muted-2">{item.description}</span>}
                  </span>
                  <ChevronLeft className="h-4 w-4 shrink-0 text-panel-faint transition-transform group-hover:-translate-x-0.5 group-hover:text-panel-accent" />
                </Link>
              );
            })}
          </nav>

          <p className="relative border-t border-panel-line/[0.06] px-4 py-3 text-center text-[10px] text-panel-faint">
            © {new Date().getFullYear()} خودرو یاب — KHODROYAB
          </p>
        </div>
      </div>,
          portalTarget
        )}
    </>
  );
}

export default PanelDrawer;
