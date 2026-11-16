"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, ShieldAlert, Store } from "lucide-react";

import { cn } from "@/lib/utils";

/** Copy text, falling back to a hidden textarea where the async Clipboard API is unavailable (e.g. plain http). */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  area.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

/**
 * «لینک غرفه من»: copies the address of the collaborator's public page (their
 * profile with ads and price list). The link uses their current code; older
 * codes keep redirecting to the newest one, so a shared link never breaks.
 * The page is public only once the identity is verified.
 */
export function ShopLinkCard({ code, verified }: { code: string; verified: boolean }) {
  const path = `/panel/sellers/${code}`;
  const [url, setUrl] = useState(path);
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => setUrl(`${window.location.origin}${path}`), [path]);

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [state]);

  async function handleCopy() {
    setState((await copyText(`${window.location.origin}${path}`)) ? "copied" : "failed");
  }

  return (
    <section
      className="panel-card-in relative isolate overflow-hidden rounded-3xl border border-panel-line/[0.1] bg-panel-surface p-4 sm:p-5"
      style={{ animationDelay: "120ms" }}
    >
      <span aria-hidden="true" className="pointer-events-none absolute -start-10 -top-14 -z-10 h-40 w-40 rounded-full bg-[#FF6A00]/15 blur-3xl" />
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#FF6A00]/35 bg-[#FF6A00]/10 text-panel-accent">
          <Store className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-black text-panel-text">لینک غرفه من</h2>
          <p className="mt-0.5 text-[11px] leading-5 text-panel-muted">
            صفحه عمومی شما با آگهی‌ها و لیست قیمت؛ لینک را برای مشتریان بفرستید.
          </p>
        </div>
      </div>

      <div className="mt-3.5 flex items-center gap-2 rounded-2xl border border-panel-line/[0.1] bg-panel-bg/70 p-1.5 ps-3">
        <span dir="ltr" className="min-w-0 flex-1 truncate text-left font-mono text-[11px] text-panel-muted" title={url}>
          {url}
        </span>
        {verified && (
          <Link
            href={path}
            aria-label="مشاهده غرفه من"
            title="مشاهده غرفه"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-panel-line/[0.1] text-panel-muted transition-colors hover:border-[#FF6A00]/40 hover:text-panel-text"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
        )}
        <button
          type="button"
          onClick={handleCopy}
          disabled={!verified}
          aria-live="polite"
          className={cn(
            "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3.5 text-xs font-extrabold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40",
            state === "copied"
              ? "bg-emerald-500 text-white"
              : state === "failed"
                ? "bg-red-500/15 text-panel-danger-2"
                : "bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] text-[#07090C] shadow-orange-subtle hover:brightness-110"
          )}
        >
          {state === "copied" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {state === "copied" ? "کپی شد" : state === "failed" ? "کپی نشد" : "کپی لینک"}
        </button>
      </div>

      {!verified && (
        <p className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-panel-warning">
          <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
          غرفه شما پس از احراز هویت برای دیگران نمایش داده می‌شود.
        </p>
      )}
    </section>
  );
}
