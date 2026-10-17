import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Search, Sparkles } from "lucide-react";

import { requireUser } from "@/lib/auth/user-auth";

export const metadata: Metadata = {
  title: "داشبورد | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/**
 * Customer dashboard. Intentionally minimal in this phase: a greeting and a
 * shortcut to the search module. Widgets land in later phases.
 */
export default async function PanelDashboardPage() {
  const user = await requireUser();
  const firstName = user.name.trim().split(/\s+/)[0] || user.name;

  return (
    <div className="space-y-5">
      <div className="admin-animate-in">
        <h1 className="text-xl font-black text-panel-text sm:text-2xl">سلام، {firstName} 👋</h1>
        <p className="mt-1 text-xs text-panel-muted sm:text-sm">به پنل کاربری خودرو یاب خوش آمدید.</p>
      </div>

      <div
        className="admin-animate-in relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-14 text-center"
        style={{ animationDelay: "80ms" }}
      >
        <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
            <Sparkles className="h-7 w-7" />
          </span>
          <p className="mt-5 text-base font-extrabold text-panel-text">داشبورد شما به‌زودی کامل می‌شود</p>
          <p className="mt-2 text-xs leading-6 text-panel-muted-2">
            تا آن زمان می‌توانید از بخش «جستجوی خودرو» همه آگهی‌های تایید‌شده را ببینید.
          </p>
          <Link
            href="/panel/search"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] shadow-orange-subtle transition-all hover:brightness-110"
          >
            <Search className="h-4 w-4" />
            جستجوی خودرو
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
