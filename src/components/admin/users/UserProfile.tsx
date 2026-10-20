import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpLeft,
  BadgeCheck,
  Car,
  BadgeX,
  CalendarDays,
  Clock3,
  Fingerprint,
  Hash,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  PhoneCall,
  Quote,
  Settings2,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { UserRecord } from "@/lib/users";
import type { UserCarRecord } from "@/lib/user-cars";
import type { SubscriptionPlanRecord, UserSubscriptionRecord } from "@/lib/subscriptions";
import type { ActiveSubscriptionSummary } from "@/lib/subscriptions-shared";
import { UserSubscriptionsSection } from "@/components/admin/subscriptions/UserSubscriptionsSection";
import { Badge } from "@/components/admin/ui/Badge";
import { AdStatusBadge } from "@/components/admin/ads/AdStatusBadge";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";

interface UserProfileProps {
  user: UserRecord;
  saleAdsCount: number;
  /** Latest ads (max 5) for the minimal preview list. */
  recentAds: UserCarRecord[];
  subscriptionHistory: UserSubscriptionRecord[];
  activeSubscription: ActiveSubscriptionSummary | null;
  /** Active plans offered in the "add subscription" modal. */
  plans: SubscriptionPlanRecord[];
}

/** Lowest active price across an ad's sale terms, or null when none exist. */
function lowestPrice(ad: UserCarRecord): string | null {
  const prices = ad.saleTerms
    .filter((term) => term.isActive)
    .map((term) => Number(term.price))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (prices.length === 0) return null;
  return String(Math.min(...prices));
}

/* ───────────────────────── helpers ───────────────────────── */

const faDate = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const faDateTime = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(iso: string): string {
  return faDate.format(new Date(iso));
}

function formatDateTime(iso: string): string {
  return faDateTime.format(new Date(iso));
}

function daysSince(iso: string): number {
  const diff = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(diff / 86_400_000));
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2);
  return parts[0][0] + parts[1][0];
}

/** Pad the numeric id into a stable 6-digit display code (e.g. #000012). */
function displayId(id: string): string {
  return `#${id.padStart(6, "0")}`;
}

/* ───────────────────────── sub-components ───────────────────────── */

function ContactChip({
  icon: Icon,
  label,
  value,
  href,
  ltr = true,
}: {
  icon: LucideIcon;
  label: string;
  value: string | null;
  href?: string;
  ltr?: boolean;
}) {
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#07090C] text-[#FF8A2A] transition-colors group-hover:border-[#FF6A00]/40">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#5E6672]">
          {label}
        </span>
        <span
          dir={value && ltr ? "ltr" : undefined}
          className={cn(
            "block truncate text-sm font-bold",
            value ? "text-[#F5F5F5]" : "text-[#5E6672]",
            value && ltr && "text-start font-mono"
          )}
        >
          {value || "ثبت نشده"}
        </span>
      </span>
    </>
  );

  const className =
    "group flex min-w-0 items-center gap-3 rounded-2xl border border-white/[0.07] bg-[#0D1117]/80 px-3 py-2.5 backdrop-blur-sm transition-colors";

  if (value && href) {
    return (
      <a href={href} className={cn(className, "hover:border-[#FF6A00]/35 hover:bg-[#FF6A00]/[0.05]")}>
        {content}
      </a>
    );
  }
  return <div className={className}>{content}</div>;
}

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  accent = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-4 transition-colors",
        accent
          ? "border-[#FF6A00]/30 bg-gradient-to-br from-[#FF6A00]/[0.14] via-[#0D1117] to-[#0D1117]"
          : "border-white/[0.07] bg-[#0D1117] hover:border-white/[0.14]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold text-[#8B93A1]">{label}</span>
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
            accent
              ? "border-[#FF6A00]/40 bg-[#FF6A00]/15 text-[#FF8A2A]"
              : "border-white/[0.08] bg-white/[0.03] text-[#9BA3AE]"
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-xl font-black leading-none tracking-tight text-[#F5F5F5]">
        {value}
      </p>
      {hint && <p className="mt-2 text-[11px] text-[#5E6672]">{hint}</p>}
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  mono = false,
  multiline = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string | null;
  mono?: boolean;
  multiline?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-[#07090C]/60 p-4">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0D1117] text-[#FF8A2A]">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-[#5E6672]">{label}</p>
        <p
          dir={value && mono ? "ltr" : undefined}
          className={cn(
            "mt-1 text-sm font-semibold",
            value ? "text-[#F5F5F5]" : "text-[#5E6672]",
            value && mono && "text-start font-mono tracking-wider",
            multiline ? "whitespace-pre-line leading-7" : "truncate"
          )}
          title={value ?? undefined}
        >
          {value ? (mono ? value : toPersianDigits(value)) : "ثبت نشده"}
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────── main ───────────────────────── */

export function UserProfile({
  user,
  saleAdsCount,
  recentAds,
  subscriptionHistory,
  activeSubscription,
  plans,
}: UserProfileProps) {
  const membershipDays = daysSince(user.createdAt);
  const saleAdsHref = `/admin/users/${user.id}/sale-ads`;

  return (
    <div className="space-y-6">
      {/* Breadcrumb / back */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/users"
          className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-[#9BA3AE] transition-colors hover:bg-white/[0.06] hover:text-[#F5F5F5]"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          بازگشت به مدیریت کاربران
        </Link>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#0D1117]/80 px-3 py-1 text-[11px] text-[#5E6672]">
          <Sparkles className="h-3.5 w-3.5 text-[#FF8A2A]" />
          <span className="font-mono tracking-wider">USER PROFILE</span>
        </span>
      </div>

      {/* ───────── Hero card ───────── */}
      <section className="admin-animate-in relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0D1117] shadow-[0_30px_80px_rgba(0,0,0,0.75),0_0_60px_rgba(255,106,0,0.06)]">
        {/* Ambient layers */}
        <div className="admin-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-32 end-[-6rem] h-72 w-72 rounded-full bg-[#FF6A00]/20 blur-[90px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-[#FF8A2A]/70 to-transparent"
          aria-hidden="true"
        />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            {/* Avatar */}
            <div className="relative mx-auto shrink-0 md:mx-0">
              <div className="rounded-[1.75rem] bg-gradient-to-br from-[#FF6A00] via-[#FF8A2A] to-[#FFA858]/40 p-[3px] shadow-[0_0_40px_-6px_rgba(255,106,0,0.55)]">
                <div className="h-32 w-32 overflow-hidden rounded-[1.6rem] border border-black/40 bg-[#07090C] sm:h-36 sm:w-36">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#171B21] to-[#07090C] text-4xl font-black text-[#FF8A2A]">
                      {getInitials(user.name)}
                    </div>
                  )}
                </div>
              </div>
              <span
                className={cn(
                  "absolute -bottom-1.5 -end-1.5 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-[#0D1117]",
                  user.isActive ? "bg-emerald-500 text-[#07090C]" : "bg-red-500 text-white"
                )}
                title={user.isActive ? "حساب فعال" : "حساب غیرفعال"}
              >
                {user.isActive ? <BadgeCheck className="h-4 w-4" /> : <BadgeX className="h-4 w-4" />}
              </span>
            </div>

            {/* Identity */}
            <div className="min-w-0 flex-1 text-center md:text-start">
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <Badge tone={user.isActive ? "success" : "error"}>
                  {user.isActive ? "فعال" : "غیرفعال"}
                </Badge>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] font-bold tracking-widest text-[#9BA3AE]">
                  <Hash className="h-3 w-3 text-[#FF8A2A]" />
                  {displayId(user.id)}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-[#9BA3AE]">
                  <UserRound className="h-3 w-3 text-[#FF8A2A]" />
                  کاربر عادی
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-black tracking-tight text-[#F5F5F5] sm:text-3xl">
                {user.name}
              </h2>
              <p className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-[#8B93A1] md:justify-start">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-[#5E6672]" />
                  عضویت از {formatDate(user.createdAt)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#5E6672]" />
                  {toPersianDigits(membershipDays)} روز عضویت
                </span>
              </p>

              {/* Contact chips */}
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <ContactChip
                  icon={Phone}
                  label="موبایل"
                  value={user.phone}
                  href={`tel:${user.phone}`}
                />
                <ContactChip
                  icon={Mail}
                  label="ایمیل"
                  value={user.email}
                  href={user.email ? `mailto:${user.email}` : undefined}
                />
                <ContactChip
                  icon={PhoneCall}
                  label="تلفن ثابت"
                  value={user.tel}
                  href={user.tel ? `tel:${user.tel}` : undefined}
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile
              icon={Megaphone}
              label="آگهی‌های فروش"
              value={toPersianDigits(saleAdsCount)}
              hint="تعداد خودروهای ثبت‌شده برای فروش"
              accent
            />
            <StatTile
              icon={CalendarDays}
              label="تاریخ عضویت"
              value={formatDate(user.createdAt)}
              hint={`${toPersianDigits(membershipDays)} روز پیش`}
            />
            <StatTile
              icon={Clock3}
              label="آخرین بروزرسانی"
              value={formatDate(user.updatedAt)}
              hint={formatDateTime(user.updatedAt)}
            />
            <StatTile
              icon={user.isActive ? BadgeCheck : BadgeX}
              label="وضعیت حساب"
              value={user.isActive ? "فعال" : "غیرفعال"}
              hint={user.isActive ? "دسترسی کامل به سامانه" : "دسترسی کاربر مسدود است"}
            />
          </div>
        </div>
      </section>

      {/* ───────── Details ───────── */}
      <section className="admin-animate-in rounded-3xl border border-white/[0.07] bg-[#0D1117] p-5 sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
            <Fingerprint className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-extrabold text-[#F5F5F5]">اطلاعات هویتی و تماس</h3>
            <p className="mt-0.5 text-xs text-[#8B93A1]">جزئیات ثبت‌شده در پروفایل کاربر</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <DetailRow icon={Fingerprint} label="کد ملی" value={user.nationalCode} mono />
          <DetailRow icon={Hash} label="کد پستی" value={user.postalCode} mono />
          <div className="md:col-span-2">
            <DetailRow icon={MapPin} label="آدرس" value={user.address} multiline />
          </div>
          <div className="md:col-span-2">
            <DetailRow icon={Quote} label="درباره کاربر" value={user.bio} multiline />
          </div>
        </div>
      </section>

      {/* ───────── Subscriptions ───────── */}
      <UserSubscriptionsSection
        user={{ id: user.id, name: user.name }}
        plans={plans}
        initialHistory={subscriptionHistory}
        initialActive={activeSubscription}
      />

      {/* ───────── Sale ads (latest 5) ───────── */}
      <section className="admin-animate-in rounded-3xl border border-white/[0.07] bg-[#0D1117] p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
              <Megaphone className="h-5 w-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-extrabold text-[#F5F5F5]">آگهی‌های فروش</h3>
                <span className="inline-flex items-center rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-bold text-[#9BA3AE]">
                  {toPersianDigits(saleAdsCount)} آگهی
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[#8B93A1]">
                {saleAdsCount > 0 ? "آخرین آگهی‌های ثبت‌شده برای این کاربر" : "خودروهایی که این کاربر برای فروش ثبت کرده است"}
              </p>
            </div>
          </div>
          <Link
            href={saleAdsHref}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-4 text-sm font-extrabold text-[#07090C] shadow-[0_0_24px_rgba(255,106,0,0.3)] transition-all hover:brightness-110"
          >
            <Settings2 className="h-4 w-4" />
            مدیریت آگهی‌های فروش
          </Link>
        </div>

        {recentAds.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl border border-dashed border-white/[0.12] bg-[#07090C]/60 px-6 py-12 text-center">
            <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
            <div className="relative">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0D1117] text-[#5E6672]">
                <Megaphone className="h-6 w-6" />
              </span>
              <p className="mt-4 text-sm font-bold text-[#D2D7DF]">هنوز آگهی‌ای برای این کاربر ثبت نشده است</p>
              <p className="mt-1.5 text-xs leading-6 text-[#5E6672]">
                از دکمه «مدیریت آگهی‌های فروش» می‌توانید اولین آگهی را به نام این کاربر ثبت کنید.
              </p>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.05] overflow-hidden rounded-2xl border border-white/[0.06] bg-[#07090C]/60">
            {recentAds.map((ad) => {
              const price = lowestPrice(ad);
              const activeTerms = ad.saleTerms.filter((term) => term.isActive).length;
              return (
                <li key={ad.id}>
                  <Link
                    href={saleAdsHref}
                    className="group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-white/[0.03]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0D1117] text-[#FF8A2A]">
                      <Car className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span dir="ltr" className="rounded-md border border-white/[0.08] bg-[#0D1117] px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-[0.18em] text-[#FF8A2A]">
                          {ad.code}
                        </span>
                        <p className="truncate text-sm font-bold text-[#F5F5F5]">
                          {ad.brandName} {ad.carName}
                        </p>
                        <AdStatusBadge status={ad.status} size="sm" />
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold",
                            ad.isActive ? "bg-emerald-500/10 text-emerald-300" : "bg-white/[0.05] text-[#8B93A1]"
                          )}
                        >
                          {ad.isActive ? "فعال" : "غیرفعال"}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-[11px] text-[#8B93A1]">
                        مدل {toPersianDigits(ad.carModel)} · {toPersianDigits(ad.carYear)} · تعداد {toPersianDigits(ad.qautity)}
                        {" · "}
                        {activeTerms > 0 ? `${toPersianDigits(activeTerms)} شرط فروش` : "بدون شرط فروش"}
                      </p>
                    </div>
                    <div className="hidden shrink-0 text-end sm:block">
                      {price ? (
                        <>
                          <p className="text-sm font-black text-[#F5F5F5]">{formatPersianNumber(price)}</p>
                          <p className="text-[10px] text-[#5E6672]">تومان · کمترین قیمت</p>
                        </>
                      ) : (
                        <p className="text-[11px] text-[#5E6672]">بدون قیمت</p>
                      )}
                    </div>
                    <div className="hidden shrink-0 text-[11px] text-[#5E6672] md:block">{ad.createdAtLabel}</div>
                    <ArrowUpLeft className="h-4 w-4 shrink-0 text-[#5E6672] transition-colors group-hover:text-[#FF8A2A]" />
                  </Link>
                </li>
              );
            })}
            {saleAdsCount > recentAds.length && (
              <li>
                <Link
                  href={saleAdsHref}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-[#FF8A2A] transition-colors hover:bg-[#FF6A00]/[0.06]"
                >
                  مشاهده همه {toPersianDigits(saleAdsCount)} آگهی
                  <ArrowUpLeft className="h-3.5 w-3.5" />
                </Link>
              </li>
            )}
          </ul>
        )}
      </section>
    </div>
  );
}
