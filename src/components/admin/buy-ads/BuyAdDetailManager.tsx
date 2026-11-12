"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  Car,
  Crown,
  Gauge,
  Gavel,
  Loader2,
  Lock,
  LockOpen,
  Pause,
  Play,
  RefreshCw,
  Trash2,
  Trophy,
  Wallet,
} from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { PersonAvatar, PersonCell } from "@/components/admin/buy-ads/BuyAdPerson";
import {
  deleteAdminBuyAdAction,
  deleteAdminBuyAdOfferAction,
  setAdminBuyAdActiveAction,
  setAdminBuyAdBiddingAction,
} from "@/app/admin/(panel)/buy-ads/actions";
import type { AdminBuyAdDetail, AdminBuyAdOffer } from "@/lib/admin-buy-ads-shared";
import { currencyLabel } from "@/lib/currency";
import { cn, formatMileage, formatPersianNumber, toPersianDigits } from "@/lib/utils";

type Confirm = { kind: "delete-ad" } | { kind: "close-bidding" } | { kind: "delete-offer"; offer: AdminBuyAdOffer };

export function BuyAdDetailManager({ ad }: { ad: AdminBuyAdDetail }) {
  const router = useRouter();
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [busy, setBusy] = useState<"active" | "bidding" | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isRefreshing, startRefresh] = useTransition();
  const [activeImage, setActiveImage] = useState(0);

  const currencyName = currencyLabel(ad.currency);
  const best = ad.offers[0] ?? null;
  const highest = ad.offers.length > 0 ? ad.offers[ad.offers.length - 1] : null;
  const average =
    ad.offers.length > 0
      ? (ad.offers.reduce((sum, offer) => sum + BigInt(offer.price), BigInt(0)) / BigInt(ad.offers.length)).toString()
      : null;

  function showToast(kind: ToastState["kind"], message: string) {
    setToast({ kind, message });
    setTimeout(() => setToast(null), 4000);
  }

  function toggleActive() {
    setBusy("active");
    void setAdminBuyAdActiveAction(ad.id, !ad.isActive).then((result) => {
      setBusy(null);
      if (result.ok) {
        showToast("success", ad.isActive ? "آگهی متوقف شد" : "آگهی فعال شد");
        router.refresh();
      } else showToast("error", result.message);
    });
  }

  function setBidding(open: boolean) {
    setBusy("bidding");
    void setAdminBuyAdBiddingAction(ad.id, open).then((result) => {
      setBusy(null);
      setConfirm(null);
      if (result.ok) {
        showToast("success", open ? "قیمت‌دهی دوباره باز شد" : "قیمت‌دهی بسته شد");
        router.refresh();
      } else showToast("error", result.message);
    });
  }

  function handleConfirm() {
    if (!confirm) return;
    if (confirm.kind === "close-bidding") {
      setBidding(false);
      return;
    }
    startTransition(async () => {
      if (confirm.kind === "delete-ad") {
        const result = await deleteAdminBuyAdAction(ad.id);
        if (result.ok) {
          router.replace("/admin/buy-ads");
          router.refresh();
          return;
        }
        setConfirm(null);
        showToast("error", result.message);
        return;
      }
      const result = await deleteAdminBuyAdOfferAction(ad.id, confirm.offer.id);
      setConfirm(null);
      if (result.ok) {
        showToast("success", `پیشنهاد ${confirm.offer.bidder.name} حذف شد`);
        router.refresh();
      } else showToast("error", result.message);
    });
  }

  const gallery = ad.galleryUrls.length > 0 ? ad.galleryUrls : [];

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {confirm && (
        <ConfirmDialog
          open
          title={
            confirm.kind === "delete-ad" ? "حذف آگهی خرید" : confirm.kind === "close-bidding" ? "بستن قیمت‌دهی" : "حذف پیشنهاد قیمت"
          }
          message={
            confirm.kind === "delete-ad" ? (
              <>
                آگهی خرید <span dir="ltr" className="font-mono font-bold text-[#F5F5F5]">{ad.code}</span> و
                {ad.offers.length > 0 ? ` ${toPersianDigits(ad.offers.length)} پیشنهاد قیمت آن` : " اطلاعات آن"} برای همیشه حذف
                می‌شود. ادامه می‌دهید؟
              </>
            ) : confirm.kind === "close-bidding" ? (
              "پس از بستن، هیچ همکاری نمی‌تواند پیشنهاد جدید ثبت یا پیشنهاد خود را ویرایش کند. پیشنهادهای فعلی حفظ می‌شوند و هر زمان می‌توانید دوباره قیمت‌دهی را باز کنید."
            ) : (
              <>
                پیشنهاد {formatPersianNumber(confirm.offer.price)} {currencyName} از «{confirm.offer.bidder.name}» حذف شود؟
              </>
            )
          }
          confirmLabel={
            isPending || busy === "bidding"
              ? "در حال انجام…"
              : confirm.kind === "close-bidding"
                ? "بستن قیمت‌دهی"
                : confirm.kind === "delete-ad"
                  ? "حذف آگهی"
                  : "حذف پیشنهاد"
          }
          pending={isPending || busy === "bidding"}
          onConfirm={handleConfirm}
          onClose={() => setConfirm(null)}
          danger
        />
      )}

      {/* Header + admin controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/buy-ads"
            aria-label="بازگشت به آگهی‌های خرید"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-white/20 hover:text-[#F5F5F5]"
          >
            <ArrowRight className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="flex flex-wrap items-center gap-2 text-lg font-extrabold text-[#F5F5F5]">
              آگهی خرید {ad.brandName} {ad.carName}
              <span dir="ltr" className="rounded-lg border border-white/[0.08] bg-[#07090C] px-2 py-0.5 font-mono text-xs tracking-[0.2em] text-[#FF8A2A]">
                {ad.code}
              </span>
            </h1>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <StatePill on={ad.isActive} onLabel="فعال" offLabel="متوقف" />
              <StatePill on={ad.biddingOpen} onLabel="قیمت‌دهی باز" offLabel="قیمت‌دهی بسته" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => (ad.biddingOpen ? setConfirm({ kind: "close-bidding" }) : setBidding(true))}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-bold transition-colors disabled:opacity-50",
              ad.biddingOpen
                ? "border-amber-500/40 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20"
                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20"
            )}
          >
            {busy === "bidding" ? <Loader2 className="h-4 w-4 animate-spin" /> : ad.biddingOpen ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
            {ad.biddingOpen ? "بستن قیمت‌دهی" : "باز کردن قیمت‌دهی"}
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={toggleActive}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 text-sm font-bold text-[#D2D7DF] transition-colors hover:border-white/20 hover:text-[#F5F5F5] disabled:opacity-50"
          >
            {busy === "active" ? <Loader2 className="h-4 w-4 animate-spin" /> : ad.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {ad.isActive ? "توقف آگهی" : "فعال‌سازی آگهی"}
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => setConfirm({ kind: "delete-ad" })}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 text-sm font-bold text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            حذف آگهی
          </button>
        </div>
      </div>

      {/* ───── Ad information ───── */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-5">
          <div className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0D1117] text-[#5E6672]">
            {gallery[activeImage] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={gallery[activeImage]} alt={`${ad.brandName} ${ad.carName}`} className="h-full w-full object-cover" />
            ) : (
              <Car className="h-12 w-12" />
            )}
          </div>
          {gallery.length > 1 && (
            <div className="admin-scrollbar flex gap-2 overflow-x-auto pb-1">
              {gallery.map((url, index) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`تصویر ${toPersianDigits(index + 1)}`}
                  className={cn(
                    "h-14 w-20 shrink-0 overflow-hidden rounded-xl border transition-colors",
                    index === activeImage ? "border-[#FF6A00]" : "border-white/[0.08] opacity-70 hover:opacity-100"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5 lg:col-span-7">
          <div className="rounded-3xl border border-white/[0.07] bg-[#0D1117] p-5">
            <h2 className="mb-4 text-sm font-extrabold text-[#F5F5F5]">مشخصات خودروی درخواستی</h2>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Spec label="برند" value={ad.brandName} />
              <Spec label="خودرو" value={ad.carName} />
              <Spec label="نوع" value={ad.carTypeName} />
              <Spec label="مدل کاتالوگ" value={toPersianDigits(ad.carModel)} />
              <Spec label="سال ساخت" value={toPersianDigits(ad.year)} icon={<Calendar className="h-3.5 w-3.5" />} />
              <Spec label="کارکرد" value={formatMileage(ad.mileage)} icon={<Gauge className="h-3.5 w-3.5" />} />
              <Spec
                label="رنگ"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: ad.colorCode }} />
                    {ad.colorName}
                  </span>
                }
              />
              <Spec label="ارز قیمت‌دهی" value={currencyName} icon={<Wallet className="h-3.5 w-3.5" />} />
              <Spec label="تاریخ ثبت" value={ad.createdAtLabel} />
              <Spec label="آخرین ویرایش" value={ad.updatedAtLabel} />
            </dl>
            <div className="mt-4 rounded-2xl border border-white/[0.06] bg-[#07090C] p-4">
              <p className="mb-1 text-[11px] font-bold text-[#8B93A1]">توضیحات خریدار</p>
              <p className="whitespace-pre-line text-sm leading-7 text-[#D2D7DF]">{ad.description || "توضیحاتی ثبت نشده است."}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/[0.07] bg-[#0D1117] p-5">
            <h2 className="mb-4 text-sm font-extrabold text-[#F5F5F5]">ثبت‌کننده آگهی (خریدار)</h2>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <PersonAvatar person={ad.buyer} size="lg" />
                <div>
                  <p className="font-bold text-[#F5F5F5]">{ad.buyer.name}</p>
                  {ad.buyer.companyName && <p className="text-xs text-[#9BA3AE]">{ad.buyer.companyName}</p>}
                  <p dir="ltr" className="mt-0.5 text-start font-mono text-xs text-[#8B93A1]">
                    {ad.buyer.phone}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                {ad.buyer.code && (
                  <span className="rounded-lg border border-white/[0.08] bg-[#07090C] px-2 py-1 text-[#8B93A1]">
                    کد کاربر: <span dir="ltr" className="font-mono font-bold tracking-[0.12em] text-[#FF8A2A]">{ad.buyer.code}</span>
                  </span>
                )}
                <span className={cn("rounded-lg border px-2 py-1 font-bold", ad.buyer.isVerified ? "border-emerald-500/30 text-emerald-300" : "border-white/[0.08] text-[#8B93A1]")}>
                  {ad.buyer.isVerified ? "احراز هویت شده" : "احراز هویت نشده"}
                </span>
                <Link
                  href={`/admin/users/${ad.buyer.id}`}
                  className="rounded-lg border border-white/[0.1] px-2 py-1 font-bold text-[#D2D7DF] hover:border-[#FF6A00]/40 hover:text-[#FF8A2A]"
                >
                  مشاهده پروفایل
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Price offers ───── */}
      <section id="offers" className="scroll-mt-24 rounded-3xl border border-white/[0.07] bg-[#0D1117] p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF6A00]/10 text-[#FF8A2A]">
              <Gavel className="h-[18px] w-[18px]" />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-[#F5F5F5]">سیستم قیمت‌دهی</h2>
              <p className="text-[11px] text-[#8B93A1]">مرتب‌شده از کمترین به بیشترین قیمت · واحد: {currencyName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => startRefresh(() => router.refresh())}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 text-xs font-semibold text-[#9BA3AE] transition-colors hover:border-white/20 hover:text-[#F5F5F5]"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
            به‌روزرسانی
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="تعداد پیشنهادها" value={toPersianDigits(ad.offers.length)} />
          <Stat label="کمترین پیشنهاد" value={best ? formatPersianNumber(best.price) : "—"} unit={best ? currencyName : undefined} accent />
          <Stat label="بیشترین پیشنهاد" value={highest ? formatPersianNumber(highest.price) : "—"} unit={highest ? currencyName : undefined} />
          <Stat label="میانگین پیشنهادها" value={average ? formatPersianNumber(average) : "—"} unit={average ? currencyName : undefined} />
        </div>

        {ad.offers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.1] px-6 py-12 text-center">
            <Gavel className="mx-auto h-8 w-8 text-[#5E6672]" />
            <p className="mt-3 text-sm font-bold text-[#F5F5F5]">هنوز پیشنهاد قیمتی ثبت نشده است</p>
            <p className="mt-1 text-xs text-[#8B93A1]">
              {ad.biddingOpen ? "همکاران احراز هویت شده می‌توانند روی این آگهی قیمت بدهند." : "قیمت‌دهی این آگهی بسته است."}
            </p>
          </div>
        ) : (
          <ol className="space-y-2">
            {ad.offers.map((offer, index) => {
              const rank = index + 1;
              const isBest = rank === 1;
              const gap = best && !isBest ? (BigInt(offer.price) - BigInt(best.price)).toString() : null;
              return (
                <li
                  key={offer.id}
                  className={cn(
                    "flex flex-col gap-3 rounded-2xl border p-3 sm:flex-row sm:items-center",
                    isBest ? "border-[#FF6A00]/45 bg-gradient-to-l from-[#FF6A00]/[0.12] to-transparent" : "border-white/[0.07] bg-[#07090C]/60"
                  )}
                >
                  <div className="flex items-center gap-3 sm:w-[46%]">
                    <RankMedal rank={rank} />
                    <div className="min-w-0 flex-1">
                      <PersonCell person={offer.bidder} />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="flex items-baseline gap-1.5">
                        <span className={cn("font-black tabular-nums", isBest ? "text-xl text-[#FF8A2A]" : "text-lg text-[#F5F5F5]")}>
                          {formatPersianNumber(offer.price)}
                        </span>
                        <span className="text-[11px] font-bold text-[#8B93A1]">{currencyName}</span>
                      </p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-[#5E6672]">
                        {isBest ? (
                          <span className="inline-flex items-center gap-0.5 font-bold text-[#FF8A2A]">
                            <Trophy className="h-3 w-3" />
                            کمترین پیشنهاد
                          </span>
                        ) : (
                          gap && <span className="tabular-nums">+{formatPersianNumber(gap)} نسبت به کمترین</span>
                        )}
                        <span title={`ثبت اولیه: ${offer.createdAtLabel}`}>
                          {offer.updatedAtLabel}
                          {offer.edited && " · ویرایش‌شده"}
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => setConfirm({ kind: "delete-offer", offer })}
                      title="حذف این پیشنهاد"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}

function StatePill({ on, onLabel, offLabel }: { on: boolean; onLabel: string; offLabel: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-bold",
        on ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-red-500/30 bg-red-500/10 text-red-300"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", on ? "bg-emerald-400" : "bg-red-400")} />
      {on ? onLabel : offLabel}
    </span>
  );
}

function Spec({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#07090C] px-3 py-2.5">
      <dt className="flex items-center gap-1 text-[11px] text-[#8B93A1]">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-[#F5F5F5]">{value}</dd>
    </div>
  );
}

function Stat({ label, value, unit, accent }: { label: string; value: string; unit?: string; accent?: boolean }) {
  return (
    <div className={cn("rounded-2xl border px-4 py-3", accent ? "border-[#FF6A00]/30 bg-[#FF6A00]/[0.06]" : "border-white/[0.06] bg-[#07090C]")}>
      <p className="text-[11px] text-[#8B93A1]">{label}</p>
      <p className={cn("mt-1 text-base font-black tabular-nums", accent ? "text-[#FF8A2A]" : "text-[#F5F5F5]")}>
        {value}
        {unit && <span className="ms-1 text-[11px] font-semibold text-[#8B93A1]">{unit}</span>}
      </p>
    </div>
  );
}

function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF8A2A] to-[#FF6A00] text-white">
        <Crown className="h-[18px] w-[18px]" strokeWidth={2.4} />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border font-mono text-sm font-black",
        rank <= 3 ? "border-[#FF6A00]/30 bg-[#FF6A00]/[0.08] text-[#FF8A2A]" : "border-white/[0.08] bg-white/[0.03] text-[#8B93A1]"
      )}
    >
      {toPersianDigits(rank)}
    </span>
  );
}
