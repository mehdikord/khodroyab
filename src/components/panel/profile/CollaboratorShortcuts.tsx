import React from "react";
import Link from "next/link";
import { ArrowLeft, ListOrdered, Megaphone, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { PriceMarketIcon } from "@/components/panel/price-list/PriceMarketTabs";
import { PRICE_MARKETS, PRICE_MARKET_LABELS, type PriceMarket } from "@/lib/price-market";
import type { ProfileAdStats } from "@/lib/profile";
import { cn, toPersianDigits } from "@/lib/utils";

interface CollaboratorShortcutsProps {
  stats: ProfileAdStats;
  /** Cars priced in each price list. */
  priceListCounts: Record<PriceMarket, number>;
  /** Identity verified: publishing is unlocked. */
  verified: boolean;
}

function Shortcut({
  href,
  icon: Icon,
  title,
  subtitle,
  primary = false,
  delay,
  children,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  primary?: boolean;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "panel-card-in group relative isolate flex min-w-0 flex-col overflow-hidden rounded-3xl border p-4 transition-all duration-300 sm:p-5",
        "hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/60 active:scale-[0.99]",
        primary
          ? "border-[#FF6A00]/50 bg-gradient-to-br from-[#FF6A00]/[0.22] via-[#FF6A00]/[0.08] to-panel-surface shadow-[0_24px_50px_-28px_rgba(255,106,0,0.9)] hover:border-[#FF6A00]/80"
          : "border-panel-line/[0.1] bg-panel-surface hover:border-[#FF6A00]/45 hover:shadow-[0_24px_50px_-28px_rgba(255,106,0,0.55)]"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Glow + sweeping shine */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -end-10 -top-12 -z-10 h-36 w-36 rounded-full bg-[#FF6A00]/25 blur-3xl transition-opacity duration-500 group-hover:opacity-100 sm:opacity-70"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -start-1/2 w-1/3 skew-x-[-20deg] bg-white/10 opacity-0 transition-all duration-700 group-hover:start-[120%] group-hover:opacity-100 motion-reduce:hidden"
      />

      <div className="flex items-start gap-3">
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105",
            primary
              ? "bg-gradient-to-br from-[#FF6A00] to-[#FF8A2A] text-[#07090C] shadow-[0_10px_30px_-8px_rgba(255,106,0,0.8)]"
              : "border border-[#FF6A00]/35 bg-[#FF6A00]/10 text-panel-accent"
          )}
        >
          <Icon className="h-6 w-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-black text-panel-text">{title}</span>
          <span className="mt-0.5 block text-[11px] leading-5 text-panel-muted">{subtitle}</span>
        </span>
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:-translate-x-1",
            primary ? "bg-[#FF6A00] text-[#07090C]" : "bg-panel-line/[0.06] text-panel-muted group-hover:bg-[#FF6A00] group-hover:text-[#07090C]"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-4">{children}</div>
    </Link>
  );
}

function Pill({ label, value, tone }: { label: string; value: number; tone: "orange" | "emerald" | "amber" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold",
        tone === "orange" && "border-[#FF6A00]/25 bg-[#FF6A00]/10 text-panel-accent",
        tone === "emerald" && "border-emerald-500/25 bg-emerald-500/10 text-panel-success",
        tone === "amber" && "border-amber-500/25 bg-amber-500/10 text-panel-warning"
      )}
    >
      <span className="text-sm font-black tabular-nums">{toPersianDigits(value)}</span>
      {label}
    </span>
  );
}

/**
 * The collaborator's two workspaces on their profile, as large tappable
 * cards: «آگهی‌های من» (with ad counts) and «لیست قیمت من» (cars priced in
 * each of the two price lists).
 */
export function CollaboratorShortcuts({ stats, priceListCounts, verified }: CollaboratorShortcutsProps) {
  return (
    <section aria-labelledby="collaborator-shortcuts" className="space-y-2.5">
      <h2 id="collaborator-shortcuts" className="px-1 text-sm font-extrabold text-panel-text-2">
        فضای کاری همکار
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Shortcut
          href="/panel/ads"
          icon={Megaphone}
          title="آگهی‌های من"
          subtitle="ثبت آگهی جدید، ویرایش و پیگیری وضعیت آگهی‌ها"
          primary
          delay={40}
        >
          <div className="flex flex-wrap gap-1.5">
            <Pill label="کل" value={stats.total} tone="orange" />
            <Pill label="تایید شده" value={stats.approved} tone="emerald" />
            {stats.pending > 0 && <Pill label="در انتظار" value={stats.pending} tone="amber" />}
          </div>
        </Shortcut>

        <Shortcut
          href="/panel/price-table"
          icon={ListOrdered}
          title="لیست قیمت من"
          subtitle="قیمت‌گذاری خودروها در لیست منطقه آزاد و پلاک ملی"
          delay={90}
        >
          <div className="grid grid-cols-2 gap-1.5">
            {PRICE_MARKETS.map((market) => (
              <span
                key={market}
                className="flex min-w-0 items-center gap-2 rounded-xl border border-panel-line/[0.08] bg-panel-bg/60 px-2.5 py-2"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center text-panel-accent">
                  <PriceMarketIcon market={market} className={market === "national" ? "scale-90" : "h-4 w-4"} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[10px] font-bold text-panel-muted">{PRICE_MARKET_LABELS[market]}</span>
                  <span className="block text-sm font-black leading-5 text-panel-text">
                    {toPersianDigits(priceListCounts[market])} <span className="text-[10px] font-bold text-panel-muted">خودرو</span>
                  </span>
                </span>
              </span>
            ))}
          </div>
          {!verified && (
            <p className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-panel-warning">
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
              برای ثبت قیمت ابتدا احراز هویت را کامل کنید.
            </p>
          )}
        </Shortcut>
      </div>
    </section>
  );
}
