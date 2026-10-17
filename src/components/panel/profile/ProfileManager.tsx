"use client";

import React, { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  AtSign,
  BadgeCheck,
  CalendarDays,
  ChevronLeft,
  Copy,
  Check,
  FileText,
  Fingerprint,
  KeyRound,
  Mailbox,
  MapPin,
  Megaphone,
  Phone,
  Smartphone,
  Sparkles,
  UserRoundPen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { SafeImage } from "@/components/panel/SafeImage";
import { ProfileSheet } from "@/components/panel/profile/ProfileSheet";
import { ProfileEditForm } from "@/components/panel/profile/ProfileEditForm";
import { PasswordChangeForm } from "@/components/panel/profile/PasswordChangeForm";
import { displayNationalCode, profileCompletion, type ProfileAdStats, type ProfileRecord } from "@/lib/profile";
import { AD_STATUS_LABELS } from "@/lib/ad-status";
import { cn, toPersianDigits } from "@/lib/utils";

interface ProfileManagerProps {
  initialProfile: ProfileRecord;
  stats: ProfileAdStats;
}

type SheetKind = "edit" | "password" | null;

/* ───────────────────────── helpers ───────────────────────── */

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  if (parts.length === 1) return parts[0].slice(0, 1);
  return parts[0].slice(0, 1) + parts[1].slice(0, 1);
}

function formatJalali(iso: string, options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }): string {
  try {
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", options).format(new Date(iso));
  } catch {
    return "";
  }
}

/** "۰۹۱۲ ۳۴۵ ۶۷۸۹" */
function formatMobile(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 11) return toPersianDigits(phone);
  return toPersianDigits(`${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`);
}

/* ───────────────────────── sub-components ───────────────────────── */

function CompletionRing({ percent }: { percent: number }) {
  const size = 132;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="absolute inset-0 -rotate-90"
      aria-hidden="true"
    >
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" className="stroke-panel-line/[0.08]" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#profileRingGradient)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="panel-ring-progress"
        style={{ ["--ring-circumference" as string]: circumference }}
      />
      <defs>
        <linearGradient id="profileRingGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6A00" />
          <stop offset="100%" stopColor="#FFB070" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function StatChip({ label, value, tone }: { label: string; value: number; tone: "orange" | "amber" | "emerald" | "red" }) {
  const toneClasses = {
    orange: "border-[#FF6A00]/25 bg-[#FF6A00]/[0.08] text-panel-accent",
    amber: "border-amber-500/25 bg-amber-500/[0.08] text-panel-warning",
    emerald: "border-emerald-500/25 bg-emerald-500/[0.08] text-panel-success",
    red: "border-red-500/25 bg-red-500/[0.08] text-panel-danger",
  }[tone];
  return (
    <div className={cn("flex min-w-0 flex-col items-center justify-center rounded-2xl border px-2 py-3", toneClasses)}>
      <span className="text-xl font-black tabular-nums leading-none">{toPersianDigits(value)}</span>
      <span className="mt-1.5 truncate text-[10px] font-bold text-panel-muted">{label}</span>
    </div>
  );
}

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  value: string | null;
  mono?: boolean;
  copyable?: boolean;
  multiline?: boolean;
}

function InfoRow({ icon: Icon, label, value, mono, copyable, multiline }: InfoRowProps) {
  const [copied, setCopied] = useState(false);
  const empty = !value;

  async function copy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex items-start gap-3.5 px-4 py-3.5">
      <span
        className={cn(
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
          empty ? "border-panel-line/[0.06] bg-panel-line/[0.02] text-panel-faint" : "border-[#FF6A00]/20 bg-[#FF6A00]/[0.08] text-panel-accent"
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold text-panel-muted-2">{label}</p>
        {empty ? (
          <p className="mt-0.5 text-sm text-panel-faint">ثبت نشده</p>
        ) : (
          <p
            dir={mono ? "ltr" : undefined}
            className={cn(
              "mt-0.5 text-sm font-semibold text-panel-text",
              mono && "text-start font-mono tracking-wide",
              multiline ? "whitespace-pre-line leading-6" : "truncate"
            )}
          >
            {mono ? toPersianDigits(value) : value}
          </p>
        )}
      </div>
      {copyable && !empty && (
        <button
          type="button"
          onClick={copy}
          aria-label={`کپی ${label}`}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all",
            copied
              ? "border-emerald-500/40 bg-emerald-500/10 text-panel-success"
              : "border-panel-line/[0.08] bg-panel-elevated text-panel-muted-2 hover:text-panel-text"
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
}

function InfoGroup({ title, children, delay }: { title: string; children: React.ReactNode; delay: number }) {
  return (
    <section className="panel-card-in" style={{ animationDelay: `${delay}ms` }}>
      <h2 className="mb-2 px-1 text-[11px] font-extrabold uppercase tracking-wider text-panel-muted-2">{title}</h2>
      <div className="divide-y divide-panel-line/[0.06] overflow-hidden rounded-3xl border border-panel-line/[0.08] bg-panel-surface">
        {children}
      </div>
    </section>
  );
}

function ActionTile({
  icon: Icon,
  title,
  subtitle,
  onClick,
  primary,
  delay,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
  primary?: boolean;
  delay: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "panel-card-in group flex items-center gap-3.5 rounded-3xl border px-4 py-4 text-start transition-all active:scale-[0.98]",
        primary
          ? "border-[#FF6A00]/35 bg-gradient-to-l from-[#FF6A00]/[0.16] via-panel-surface to-panel-surface shadow-[0_18px_40px_-20px_rgba(255,106,0,0.6)] hover:border-[#FF6A00]/60"
          : "border-panel-line/[0.08] bg-panel-surface hover:border-panel-line/20"
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-transform group-hover:scale-105",
          primary
            ? "border-[#FF6A00]/40 bg-gradient-to-br from-[#FF6A00] to-[#FF8A2A] text-[#07090C]"
            : "border-panel-line/[0.1] bg-panel-elevated text-panel-text"
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-extrabold text-panel-text">{title}</span>
        <span className="mt-0.5 block truncate text-[11px] text-panel-muted">{subtitle}</span>
      </span>
      <ChevronLeft className="h-5 w-5 shrink-0 text-panel-faint transition-transform group-hover:-translate-x-0.5" />
    </button>
  );
}

/* ───────────────────────── main ───────────────────────── */

export function ProfileManager({ initialProfile, stats }: ProfileManagerProps) {
  const [profile, setProfile] = useState<ProfileRecord>(initialProfile);
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [sheetLocked, setSheetLocked] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const completion = useMemo(() => profileCompletion(profile), [profile]);
  const nationalCode = displayNationalCode(profile.nationalCode);
  const memberSince = formatJalali(profile.createdAt);
  const lastUpdate = formatJalali(profile.updatedAt, { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const showToast = useCallback((kind: ToastState["kind"], message: string) => {
    setToast({ kind, message });
    window.setTimeout(() => setToast(null), 4500);
  }, []);

  const closeSheet = useCallback(() => {
    setSheet(null);
    setSheetLocked(false);
  }, []);

  function handleProfileSaved(next: ProfileRecord) {
    setProfile(next);
    closeSheet();
    showToast("success", "پروفایل شما با موفقیت به‌روزرسانی شد");
  }

  function handlePasswordChanged() {
    closeSheet();
    showToast("success", "رمز عبور با موفقیت تغییر کرد");
  }

  return (
    <div className="space-y-5">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Hero */}
      <section className="panel-card-in relative overflow-hidden rounded-[32px] border border-panel-line/[0.1] bg-panel-surface">
        <div className="panel-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-24 end-[-60px] h-64 w-64 rounded-full bg-[#FF6A00]/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative px-5 pb-5 pt-7 sm:px-8 sm:pb-7 sm:pt-9">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-7">
            {/* Avatar + completion ring */}
            <div className="relative h-[132px] w-[132px] shrink-0">
              <CompletionRing percent={completion.percent} />
              <div className="panel-avatar-ring absolute inset-[14px] rounded-[30px]">
                <div className="relative h-full w-full overflow-hidden rounded-[30px] border-[3px] border-panel-surface bg-panel-surface-2">
                  {profile.image ? (
                    <SafeImage
                      key={profile.image}
                      src={profile.image}
                      alt=""
                      className="h-full w-full object-cover"
                      fallback={
                        <span className="flex h-full w-full items-center justify-center bg-[#FF6A00]/[0.12] text-3xl font-black text-panel-accent">
                          {getInitials(profile.name)}
                        </span>
                      }
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-[#FF6A00]/[0.12] text-3xl font-black text-panel-accent">
                      {getInitials(profile.name)}
                    </span>
                  )}
                </div>
              </div>
              <span className="absolute -bottom-1 start-1/2 -translate-x-1/2 rounded-full border border-[#FF6A00]/40 bg-panel-bg px-2.5 py-0.5 text-[10px] font-black tabular-nums text-panel-accent shadow-lg">
                {toPersianDigits(completion.percent)}٪
              </span>
            </div>

            {/* Identity */}
            <div className="min-w-0 flex-1 text-center sm:text-start">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="truncate text-2xl font-black text-panel-text sm:text-3xl">{profile.name}</h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-panel-success">
                  <BadgeCheck className="h-3 w-3" />
                  حساب فعال
                </span>
              </div>
              <p dir="ltr" className="mt-1.5 font-mono text-sm tracking-[0.12em] text-panel-muted sm:text-start">
                {formatMobile(profile.phone)}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-panel-muted-2 sm:justify-start">
                {memberSince && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-panel-accent" />
                    عضو از {memberSince}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Fingerprint className="h-3.5 w-3.5 text-panel-accent" />
                  شناسه کاربری {toPersianDigits(profile.id)}
                </span>
              </div>

              {/* Completion hint */}
              <div className="mt-4 rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 px-3.5 py-3 text-start">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-panel-text-2">
                    <Sparkles className="h-3.5 w-3.5 text-panel-accent" />
                    تکمیل پروفایل
                  </span>
                  <span className="text-[11px] font-black tabular-nums text-panel-accent">{toPersianDigits(completion.percent)}٪</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-panel-line/[0.08]">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-[#FF6A00] to-[#FFB070] transition-[width] duration-700"
                    style={{ width: `${completion.percent}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] leading-5 text-panel-muted-2">
                  {completion.missing.length === 0
                    ? "عالی! همه اطلاعات پروفایل شما کامل است."
                    : `برای تکمیل: ${completion.missing.slice(0, 3).join("، ")}${completion.missing.length > 3 ? " و…" : ""}`}
                </p>
              </div>
            </div>
          </div>

          {/* Ad stats */}
          <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-3">
            <StatChip label="کل آگهی‌ها" value={stats.total} tone="orange" />
            <StatChip label={AD_STATUS_LABELS.approved} value={stats.approved} tone="emerald" />
            <StatChip label={AD_STATUS_LABELS.pending} value={stats.pending} tone="amber" />
            <StatChip label={AD_STATUS_LABELS.rejected} value={stats.rejected} tone="red" />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ActionTile
          icon={UserRoundPen}
          title="ویرایش پروفایل"
          subtitle="نام، تصویر، ایمیل، کد ملی، آدرس و…"
          onClick={() => setSheet("edit")}
          primary
          delay={60}
        />
        <ActionTile
          icon={KeyRound}
          title="تغییر رمز عبور"
          subtitle="با وارد کردن رمز فعلی، رمز جدید بسازید"
          onClick={() => setSheet("password")}
          delay={110}
        />
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <InfoGroup title="اطلاعات هویتی" delay={160}>
            <InfoRow icon={UserRoundPen} label="نام و نام خانوادگی" value={profile.name} />
            <InfoRow icon={Fingerprint} label="کد ملی" value={nationalCode} mono />
            <InfoRow icon={Smartphone} label="شماره موبایل" value={profile.phone} mono copyable />
          </InfoGroup>

          <InfoGroup title="اطلاعات تماس" delay={210}>
            <InfoRow icon={AtSign} label="ایمیل" value={profile.email} mono copyable />
            <InfoRow icon={Phone} label="تلفن ثابت" value={profile.tel} mono />
          </InfoGroup>
        </div>

        <div className="space-y-5">
          <InfoGroup title="نشانی" delay={260}>
            <InfoRow icon={MapPin} label="آدرس" value={profile.address} multiline />
            <InfoRow icon={Mailbox} label="کد پستی" value={profile.postalCode} mono copyable />
          </InfoGroup>

          <InfoGroup title="درباره من" delay={310}>
            <InfoRow icon={FileText} label="بیوگرافی" value={profile.bio} multiline />
          </InfoGroup>
        </div>
      </div>

      {/* Footer meta */}
      <div
        className="panel-card-in flex flex-col gap-3 rounded-3xl border border-dashed border-panel-line/[0.1] bg-panel-surface/60 px-4 py-4 text-[11px] text-panel-muted-2 sm:flex-row sm:items-center sm:justify-between"
        style={{ animationDelay: "360ms" }}
      >
        <span>{lastUpdate ? `آخرین به‌روزرسانی: ${lastUpdate}` : ""}</span>
        <Link
          href="/panel/ads"
          className="inline-flex items-center gap-1.5 font-bold text-panel-accent transition-colors hover:text-panel-accent-soft"
        >
          <Megaphone className="h-3.5 w-3.5" />
          مدیریت آگهی‌های من
          <ChevronLeft className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Sheets */}
      <ProfileSheet
        open={sheet === "edit"}
        title="ویرایش پروفایل"
        description="اطلاعات حساب خود را به‌روز کنید؛ شماره موبایل قابل تغییر نیست."
        icon={<UserRoundPen className="h-5 w-5" />}
        onClose={closeSheet}
        locked={sheetLocked}
      >
        <ProfileEditForm
          profile={profile}
          onCancel={closeSheet}
          onSuccess={handleProfileSaved}
          onPendingChange={setSheetLocked}
        />
      </ProfileSheet>

      <ProfileSheet
        open={sheet === "password"}
        title="تغییر رمز عبور"
        description="رمز فعلی، رمز جدید و تکرار آن را وارد کنید."
        icon={<KeyRound className="h-5 w-5" />}
        onClose={closeSheet}
        locked={sheetLocked}
      >
        <PasswordChangeForm onCancel={closeSheet} onSuccess={handlePasswordChanged} onPendingChange={setSheetLocked} />
      </ProfileSheet>
    </div>
  );
}
