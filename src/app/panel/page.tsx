import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { getCurrentUser } from "@/lib/auth/user-auth";
import { PANEL_HOME, safePanelNext } from "@/lib/auth/public-panel";
import { listActiveSponsors } from "@/lib/sponsors";
import { getSystemSettings } from "@/lib/system-settings";
import { cn } from "@/lib/utils";
import { PanelLogo } from "@/components/panel/PanelLogo";
import { SponsorsMarquee } from "@/components/panel/SponsorsMarquee";
import { UserAuthCard } from "@/components/panel/UserAuthCard";

export const metadata: Metadata = {
  title: "ورود همکاران | خودرو یاب",
  description: "ورود همکاران خودرو یاب برای مدیریت آگهی‌ها و جدول قیمت",
  robots: "noindex, nofollow",
};

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

/**
 * Login / registration screen at exactly `/panel`, with the active sponsors'
 * logo strip at the top. `?next=` (a panel path) is where the visitor returns
 * after signing in, e.g. the profile page they tapped as a guest.
 */
export default async function PanelLoginPage({ searchParams }: PageProps) {
  const next = safePanelNext(searchParams.next);

  // A *valid* session skips the login screen. A stale/invalid cookie simply
  // falls through to the form (never trusted without verification).
  const user = await getCurrentUser();
  if (user) {
    redirect(next ?? PANEL_HOME);
  }

  const [sponsors, settings] = await Promise.all([listActiveSponsors(), getSystemSettings()]);
  const { registrationOpen } = settings;

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden">
      <div className="panel-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />

      {sponsors.length > 0 && (
        <SponsorsMarquee
          sponsors={sponsors}
          className="admin-animate-in relative z-10 border-b border-panel-line/[0.06] bg-panel-surface/40 pb-3 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-sm"
        />
      )}

      <div
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col px-5 pb-10 sm:justify-center sm:py-12",
          sponsors.length > 0 ? "pt-8" : "pt-[max(2.5rem,env(safe-area-inset-top))]"
        )}
      >
        {/* Back to the public site */}
        <Link
          href={PANEL_HOME}
          className="admin-animate-in mb-6 inline-flex items-center gap-1.5 self-start rounded-xl px-1 py-1 text-xs font-bold text-panel-muted transition-colors hover:text-panel-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به خودرو یاب
        </Link>

        {/* Brand */}
        <div className="admin-animate-in flex flex-col items-center text-center">
          <PanelLogo markOnly size="lg" />
          <h1 className="mt-5 text-2xl font-black tracking-tight text-panel-text sm:text-3xl">
            {registrationOpen ? "ورود یا ثبت‌نام" : "ورود"}
            <span className="bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] bg-clip-text text-transparent"> همکاران</span>
          </h1>
          <p className="mt-2 max-w-xs text-sm leading-7 text-panel-muted">
            {registrationOpen
              ? "با شماره موبایل و کد تایید پیامکی وارد شوید؛ اگر حساب ندارید، همین‌جا ساخته می‌شود."
              : "با شماره موبایل ثبت‌شده و کد تایید پیامکی وارد شوید. برای ساخت حساب با پشتیبانی خودرو یاب تماس بگیرید."}
          </p>
        </div>

        {/* Card */}
        <div
          className="admin-animate-in mt-8 rounded-3xl border border-panel-line/[0.1] bg-panel-surface/95 p-5 shadow-[0_40px_80px_rgba(0,0,0,0.9),0_0_60px_rgba(255,106,0,0.07)] backdrop-blur-2xl sm:p-7"
          style={{ animationDelay: "80ms" }}
        >
          <UserAuthCard next={next} registrationOpen={registrationOpen} />
        </div>
      </div>

      <p className="relative z-10 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 text-center text-xs text-panel-faint">
        © {new Date().getFullYear()} خودرو یاب — KHODROYAB
      </p>
    </div>
  );
}
