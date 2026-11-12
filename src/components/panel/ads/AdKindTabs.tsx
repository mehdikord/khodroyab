"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Megaphone, ShoppingBag } from "lucide-react";

import { cn, toPersianDigits } from "@/lib/utils";

export type AdKind = "sale" | "buy";

interface AdKindTabsProps {
  /** Route of the sale tab; the buy tab lives at `${baseHref}/buy`. */
  baseHref: string;
  saleCount: number;
  buyCount: number;
  saleHint: string;
  buyHint: string;
  /** Distinguishes the shared-layout animation of separate instances. */
  layoutKey: string;
}

const TABS = [
  { kind: "sale", label: "آگهی‌های فروش", short: "فروش", icon: Megaphone },
  { kind: "buy", label: "آگهی‌های خرید", short: "خرید", icon: ShoppingBag },
] as const;

function kindFor(pathname: string, buyHref: string): AdKind {
  return pathname === buyHref || pathname.startsWith(`${buyHref}/`) ? "buy" : "sale";
}

/**
 * Sale / buy switch at the top of the ads and search pages. It lives in the
 * shared layout, so the highlight slides between the tabs while the next
 * page loads, and switches immediately on tap.
 */
export function AdKindTabs({ baseHref, saleCount, buyCount, saleHint, buyHint, layoutKey }: AdKindTabsProps) {
  const pathname = usePathname();
  const buyHref = `${baseHref}/buy`;
  const routeKind = kindFor(pathname, buyHref);
  const [active, setActive] = useState<AdKind>(routeKind);
  const reduceMotion = useReducedMotion();

  useEffect(() => setActive(routeKind), [routeKind]);

  const meta: Record<AdKind, { href: string; count: number; hint: string }> = {
    sale: { href: baseHref, count: saleCount, hint: saleHint },
    buy: { href: buyHref, count: buyCount, hint: buyHint },
  };

  return (
    <nav
      aria-label="نوع آگهی"
      className="admin-animate-in relative grid grid-cols-2 gap-1.5 rounded-[1.4rem] border border-panel-line/[0.08] bg-panel-surface p-1.5 shadow-card-depth"
    >
      {TABS.map((tab) => {
        const isActive = active === tab.kind;
        const { href, count, hint } = meta[tab.kind];
        const Icon = tab.icon;
        return (
          <Link
            key={tab.kind}
            href={href}
            scroll={false}
            onClick={() => setActive(tab.kind)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group relative isolate flex min-w-0 items-center gap-2.5 rounded-2xl px-2.5 py-2.5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 sm:gap-3 sm:px-4 sm:py-3",
              isActive ? "text-panel-text" : "text-panel-muted hover:text-panel-text"
            )}
          >
            {isActive && (
              <motion.span
                layoutId={`ad-kind-tab-${layoutKey}`}
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-2xl border border-[#FF6A00]/40 bg-gradient-to-l from-[#FF6A00]/[0.16] via-[#FF6A00]/[0.07] to-transparent shadow-[0_0_28px_-6px_rgba(255,106,0,0.45)]"
              >
                <span className="absolute inset-x-6 -bottom-px h-px bg-gradient-to-l from-transparent via-[#FF8A2A] to-transparent" />
              </motion.span>
            )}

            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 sm:h-11 sm:w-11",
                isActive
                  ? "border-[#FF6A00]/50 bg-gradient-to-br from-[#FF6A00] to-[#FF8A2A] text-[#07090C] shadow-orange-subtle"
                  : "border-panel-line/[0.1] bg-panel-line/[0.03] text-panel-faint group-hover:text-panel-accent"
              )}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5">
                <span className="truncate text-sm font-black sm:text-[15px]">
                  <span className="sm:hidden">{tab.short}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-extrabold tabular-nums transition-colors",
                    isActive ? "bg-[#FF6A00]/20 text-panel-accent" : "bg-panel-line/[0.06] text-panel-muted-2"
                  )}
                >
                  {toPersianDigits(count)}
                </span>
              </span>
              <span className="mt-0.5 hidden truncate text-[11px] font-medium text-panel-faint sm:block">{hint}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
