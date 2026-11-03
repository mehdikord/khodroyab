"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert, X } from "lucide-react";

const DISMISS_KEY = "khodroyab:verification-notice-dismissed";

/**
 * Warning shown to collaborators whose identity is not verified yet. The user
 * may close it; it stays closed for the rest of the browser session and comes
 * back on the next visit until the verification is approved.
 */
export function VerificationNotice() {
  // Hidden until mounted so a dismissed notice never flashes.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      dismissed = false;
    }
    setVisible(!dismissed);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Storage unavailable: the notice simply returns on the next page load.
    }
  }

  if (!visible) return null;

  return (
    <div
      role="alert"
      className="admin-animate-in relative mb-5 overflow-hidden rounded-2xl border border-panel-warning/35 bg-panel-warning/10 px-4 py-4 pe-12 sm:px-5"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-panel-warning/30 bg-panel-warning/15 text-panel-warning">
          <ShieldAlert className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold leading-7 text-panel-text">
            حساب کاربری شما احراز هویت نشده است، برای استفاده کامل از سیستم لطفا احراز هویت خود را انجام دهید.
          </p>
          <Link
            href="/panel/verification"
            className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-xs font-extrabold text-[#07090C] shadow-orange-subtle transition-all hover:brightness-110"
          >
            احراز هویت
          </Link>
        </div>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="بستن پیام"
        className="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-panel-muted transition-colors hover:bg-panel-line/[0.06] hover:text-panel-text"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
