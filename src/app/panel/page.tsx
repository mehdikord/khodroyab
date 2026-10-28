import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/user-auth";
import { listActiveSponsors } from "@/lib/sponsors";
import { PanelLogo } from "@/components/panel/PanelLogo";
import { SponsorsMarquee } from "@/components/panel/SponsorsMarquee";
import { UserAuthCard } from "@/components/panel/UserAuthCard";

export const metadata: Metadata = {
  title: "ورود / ثبت‌نام | پنل کاربری خودرو یاب",
  description: "ورود یا ثبت‌نام کاربران خودرو یاب برای جستجوی خودرو و مدیریت آگهی‌ها",
  robots: "noindex, nofollow",
};

/** Customer login / registration screen at exactly `/panel`, with the active sponsors' logo strip at the bottom. */
export default async function PanelLoginPage() {
  // A *valid* session skips the login screen. A stale/invalid cookie simply
  // falls through to the form (never trusted without verification).
  const user = await getCurrentUser();
  if (user) {
    redirect("/panel/dashboard");
  }

  const sponsors = await listActiveSponsors();

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden">
      <div className="panel-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10 pt-[max(2.5rem,env(safe-area-inset-top))] sm:justify-center sm:py-12">
        {/* Brand */}
        <div className="admin-animate-in flex flex-col items-center text-center">
          <PanelLogo markOnly size="lg" />
          <h1 className="mt-5 text-2xl font-black tracking-tight text-panel-text sm:text-3xl">
            پنل کاربری
            <span className="bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] bg-clip-text text-transparent"> خودرو یاب</span>
          </h1>
          <p className="mt-2 max-w-xs text-sm leading-7 text-panel-muted">
            با شماره موبایل و رمز عبور وارد شوید، یا اگر حساب ندارید ثبت‌نام کنید.
          </p>
        </div>

        {/* Card */}
        <div
          className="admin-animate-in mt-8 rounded-3xl border border-panel-line/[0.1] bg-panel-surface/95 p-5 shadow-[0_40px_80px_rgba(0,0,0,0.9),0_0_60px_rgba(255,106,0,0.07)] backdrop-blur-2xl sm:p-7"
          style={{ animationDelay: "80ms" }}
        >
          <UserAuthCard />
        </div>
      </div>

      {sponsors.length > 0 && (
        <SponsorsMarquee sponsors={sponsors} className="admin-animate-in relative z-10 pb-2" />
      )}

      <p className="relative z-10 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 text-center text-xs text-panel-faint">
        © {new Date().getFullYear()} خودرو یاب — KHODROYAB
      </p>
    </div>
  );
}
