"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarClock, ChevronDown, ExternalLink, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { PanelLogo } from "@/components/panel/PanelLogo";
import { PANEL_NAV_ITEMS, findActivePanelItem } from "@/components/panel/panel-nav";
import { logoutUserAction } from "@/app/panel/auth-actions";
import { ThemeSwitch } from "@/components/panel/ThemeSwitch";
import type { PanelTheme } from "@/lib/panel-theme";
import { SUBSCRIPTION_WARNING_DAYS } from "@/lib/subscriptions-shared";
import { toPersianDigits } from "@/lib/utils";

export interface PanelShellUser {
  name: string;
  phone: string;
  image: string | null;
}

interface PanelShellProps {
  user: PanelShellUser;
  /** Days left on the active subscription, shown as a header badge. */
  subscriptionDaysLeft: number;
  /** Server-resolved theme (from cookie). */
  theme: PanelTheme;
  children: React.ReactNode;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  if (parts.length === 1) return parts[0].slice(0, 1);
  return parts[0].slice(0, 1) + parts[1].slice(0, 1);
}

function Avatar({ user, className }: { user: PanelShellUser; className?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#FF6A00]/40 bg-[#FF6A00]/[0.12] text-xs font-bold text-panel-accent",
        className
      )}
    >
      {user.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.image} alt="" className="h-full w-full object-cover" />
      ) : (
        getInitials(user.name)
      )}
    </span>
  );
}

/** Remaining subscription days: green normally, red under the warning threshold. */
function SubscriptionDaysBadge({ days }: { days: number }) {
  const warning = days < SUBSCRIPTION_WARNING_DAYS;
  return (
    <span
      title={`${toPersianDigits(days)} روز از اشتراک شما باقی مانده است`}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-extrabold",
        warning
          ? "border-red-500/40 bg-red-500/[0.12] text-red-500"
          : "border-emerald-500/40 bg-emerald-500/[0.12] text-emerald-500"
      )}
    >
      <CalendarClock className="h-3.5 w-3.5" />
      <span>
        {toPersianDigits(days)} روز<span className="hidden sm:inline"> اشتراک</span>
      </span>
    </span>
  );
}

/** Fixed bottom dock holding the panel's main navigation. */
function Dock({ pathname }: { pathname: string }) {
  const active = findActivePanelItem(pathname);
  return (
    <nav aria-label="ناوبری اصلی پنل" className="panel-dock pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-3">
      <div className="panel-dock-glass pointer-events-auto mx-auto flex max-w-md items-center gap-1 rounded-[22px] p-1.5">
        {PANEL_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active?.key === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40",
                isActive
                  ? "bg-gradient-to-b from-[#FF6A00]/[0.22] to-[#FF6A00]/[0.08] text-panel-text"
                  : "text-panel-muted-2 hover:bg-panel-line/[0.04] hover:text-panel-text active:scale-95"
              )}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute top-1 h-1 w-6 rounded-full bg-[#FF6A00] shadow-[0_0_12px_#FF6A00]"
                />
              )}
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-xl transition-all duration-200",
                  item.primary && !isActive && "bg-[#FF6A00]/10 text-panel-accent",
                  isActive && "scale-110 text-panel-accent"
                )}
              >
                <Icon className="h-[19px] w-[19px]" strokeWidth={isActive ? 2.4 : 2} />
              </span>
              <span className={cn("text-[10px] leading-none", isActive ? "font-extrabold" : "font-semibold")}>
                {item.shortLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** Customer-panel chrome: sticky top bar, content area, fixed bottom dock. */
export const PanelShell: React.FC<PanelShellProps> = ({ user, subscriptionDaysLeft, theme, children }) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeItem = findActivePanelItem(pathname);
  const pageTitle = pathname.startsWith("/panel/sellers/") ? "پروفایل فروشنده" : activeItem?.label ?? "پنل کاربری";

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    function onPointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <div className="panel-root flex min-h-[100dvh] flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-panel-line/[0.07] bg-panel-bg/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link href="/panel/dashboard" className="flex items-center gap-2.5" aria-label="داشبورد پنل کاربری">
            <PanelLogo markOnly size="sm" />
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-black text-panel-text">خودرو یاب</span>
              <span className="text-[10px] text-panel-muted-2">پنل کاربری</span>
            </span>
          </Link>

          <div className="min-w-0 flex-1 border-s border-panel-line/[0.08] ps-3 sm:ps-4">
            <p className="truncate text-[15px] font-extrabold text-panel-text sm:text-base">{pageTitle}</p>
          </div>

          <SubscriptionDaysBadge days={subscriptionDaysLeft} />

          {/* Theme switch */}
          <ThemeSwitch initialTheme={theme} />

          {/* Account menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex items-center gap-2 rounded-full border border-panel-line/[0.08] bg-panel-surface p-1 pe-2.5 transition-colors hover:border-[#FF6A00]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40"
            >
              <Avatar user={user} className="h-8 w-8" />
              <span className="hidden max-w-[120px] truncate text-xs font-bold text-panel-text sm:block">{user.name}</span>
              <ChevronDown className={cn("h-4 w-4 text-panel-faint transition-transform", menuOpen && "rotate-180")} />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="admin-animate-in absolute end-0 mt-2 w-64 overflow-hidden rounded-2xl border border-panel-line/[0.1] bg-panel-surface shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
              >
                <div className="flex items-center gap-3 border-b border-panel-line/[0.07] px-4 py-3">
                  <Avatar user={user} className="h-10 w-10 text-sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-panel-text">{user.name}</p>
                    <p dir="ltr" className="mt-0.5 text-start font-mono text-[11px] text-panel-muted">
                      {user.phone}
                    </p>
                  </div>
                </div>
                <div className="p-1.5">
                  <Link
                    href="/"
                    role="menuitem"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-panel-muted transition-colors hover:bg-panel-line/[0.05] hover:text-panel-text"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>مشاهده سایت خودرو یاب</span>
                  </Link>
                  <form action={logoutUserAction}>
                    <button
                      type="submit"
                      role="menuitem"
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-panel-danger transition-colors hover:bg-red-500/10 hover:text-panel-danger"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>خروج از حساب</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="panel-content mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 sm:py-7">{children}</div>

      <Dock pathname={pathname} />
    </div>
  );
};

export default PanelShell;
