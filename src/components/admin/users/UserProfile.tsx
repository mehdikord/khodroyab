import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Car,
  BadgeX,
  Building2,
  CalendarDays,
  Clock3,
  Fingerprint,
  Handshake,
  Hash,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  PhoneCall,
  Quote,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { UserRecord } from "@/lib/users";
import type { UserCarRecord } from "@/lib/user-cars";
import type { VerificationRecord } from "@/lib/verification-shared";
import type { RecentPriceTableEntryRecord } from "@/lib/price-table";
import { UserVerificationSection } from "@/components/admin/users/UserVerificationSection";
import { UserPriceTablePreview } from "@/components/admin/users/UserPriceTablePreview";
import { CountPill, ProfileSection, SectionEmpty } from "@/components/admin/users/ProfileSection";
import { Badge } from "@/components/admin/ui/Badge";
import { AdStatusBadge } from "@/components/admin/ads/AdStatusBadge";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";

interface UserProfileProps {
  user: UserRecord;
  saleAdsCount: number;
  /** Latest ads (max 3) for the minimal preview list. */
  recentAds: UserCarRecord[];
  /** Latest price-table rows (max 3) and the total row count. */
  priceTable: { total: number; entries: RecentPriceTableEntryRecord[] };
  /** Latest identity-verification submission (collaborators only); null when none was sent. */
  verification: VerificationRecord | null;
  /** What the viewing admin's role allows on this page. */
  access: UserProfileAccess;
}

export interface UserProfileAccess {
  /** "users" permission: identity verification review. */
  manageUser: boolean;
  /** "ads" permission: the user's sale ads. */
  ads: boolean;
  /** "price_table" permission: the user's price table. */
  priceTable: boolean;
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
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: string | null;
  mono?: boolean;
  multiline?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 items-start gap-2 rounded-xl border border-white/[0.05] bg-[#07090C]/60 px-2.5 py-2", className)}>
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FF8A2A]" />
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold text-[#5E6672]">{label}</p>
        <p
          dir={value && mono ? "ltr" : undefined}
          className={cn(
            "mt-0.5 text-[13px] font-semibold",
            value ? "text-[#F5F5F5]" : "text-[#5E6672]",
            value && mono && "text-start font-mono tracking-wider",
            multiline ? "line-clamp-2 whitespace-pre-line leading-6" : "truncate"
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

export function UserProfile({ user, saleAdsCount, recentAds, priceTable, verification, access }: UserProfileProps) {
  const membershipDays = daysSince(user.createdAt);
  const showVerification = user.collabrate && access.manageUser;
  const showAds = user.collabrate && access.ads;
  const showPriceTable = user.collabrate && access.priceTable;
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
                {user.collabrate ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold text-sky-300">
                    <Handshake className="h-3 w-3" />
                    کاربر همکار
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-[#9BA3AE]">
                    <UserRound className="h-3 w-3 text-[#FF8A2A]" />
                    کاربر عادی
                  </span>
                )}
              </div>

              <h2 className="mt-4 text-2xl font-black tracking-tight text-[#F5F5F5] sm:text-3xl">
                {user.name}
              </h2>
              {user.companyName && (
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-bold text-[#D2D7DF]">
                  <Building2 className="h-4 w-4 text-[#FF8A2A]" />
                  {user.companyName}
                </p>
              )}
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

      {/* ───────── Details + identity verification (collaborators only), side by side ───────── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ProfileSection icon={Fingerprint} title="اطلاعات هویتی و تماس" className={showVerification ? undefined : "xl:col-span-2"}>
          <div className="grid grid-cols-2 gap-2">
            <DetailRow icon={Fingerprint} label="کد ملی" value={user.nationalCode} mono />
            <DetailRow icon={Hash} label="کد پستی" value={user.postalCode} mono />
            <DetailRow icon={MapPin} label="آدرس" value={user.address} multiline className="col-span-2" />
            <DetailRow icon={Quote} label="درباره کاربر" value={user.bio} multiline className="col-span-2" />
          </div>
        </ProfileSection>

        {showVerification && (
          <UserVerificationSection userId={user.id} initialAuthenticaed={user.authenticaed} initialVerification={verification} />
        )}
      </div>

      {/* ───────── Collaborator modules: compact previews, each linking to its own manager ───────── */}
      {(showAds || showPriceTable) && (
        <div className={cn("grid grid-cols-1 gap-4", showAds && showPriceTable && "xl:grid-cols-2")}>
          {/* Sale ads (latest 3) */}
          {showAds && (
          <ProfileSection
            icon={Megaphone}
            title="آگهی‌های فروش"
            badge={<CountPill>{toPersianDigits(saleAdsCount)} آگهی</CountPill>}
            description={saleAdsCount > 0 ? "آخرین آگهی‌های ثبت‌شده" : "خودروهایی که کاربر برای فروش ثبت کرده است"}
            action={{ href: saleAdsHref, label: "مدیریت آگهی‌ها" }}
          >
            {recentAds.length === 0 ? (
              <SectionEmpty title="هنوز آگهی‌ای برای این کاربر ثبت نشده است" hint="از «مدیریت آگهی‌ها» می‌توانید اولین آگهی را به نام کاربر ثبت کنید." />
            ) : (
              <ul className="divide-y divide-white/[0.05] overflow-hidden rounded-xl border border-white/[0.06] bg-[#07090C]/60">
                {recentAds.map((ad) => {
                  const price = lowestPrice(ad);
                  return (
                    <li key={ad.id}>
                      <Link href={saleAdsHref} className="group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-white/[0.03]">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/[0.08] bg-[#0D1117] text-[#FF8A2A]">
                          {ad.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={ad.imageUrl} alt={`${ad.brandName} ${ad.carName}`} className="h-full w-full object-cover" loading="lazy" />
                          ) : (
                            <Car className="h-4 w-4" />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-bold text-[#F5F5F5]">
                            {ad.brandName} {ad.carName}
                          </p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-[#8B93A1]">
                            <span dir="ltr" className="font-mono text-[10px] font-bold tracking-[0.15em] text-[#FF8A2A]">
                              {ad.code}
                            </span>
                            <AdStatusBadge status={ad.status} size="sm" />
                            {!ad.isActive && <span className="text-[10px] font-bold text-[#8B93A1]">غیرفعال</span>}
                          </div>
                        </div>
                        <div className="shrink-0 text-end">
                          {price ? (
                            <>
                              <p className="text-[13px] font-black text-[#F5F5F5]">{formatPersianNumber(price)}</p>
                              <p className="text-[10px] text-[#5E6672]">تومان</p>
                            </>
                          ) : (
                            <p className="text-[11px] text-[#5E6672]">بدون قیمت</p>
                          )}
                        </div>
                        <span className="hidden shrink-0 text-[10px] text-[#5E6672] sm:block">{ad.createdAtLabel}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </ProfileSection>
          )}

          {/* Price table (latest 3 rows) */}
          {showPriceTable && (
            <UserPriceTablePreview userId={user.id} total={priceTable.total} entries={priceTable.entries} />
          )}
        </div>
      )}
    </div>
  );
}
