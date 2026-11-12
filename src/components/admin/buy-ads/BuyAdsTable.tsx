"use client";

import React from "react";
import Link from "next/link";
import { Car, Gavel, Loader2, Lock, LockOpen, Trash2 } from "lucide-react";

import { Toggle } from "@/components/admin/ui/Toggle";
import { PersonCell } from "@/components/admin/buy-ads/BuyAdPerson";
import type { AdminBuyAdRecord } from "@/lib/admin-buy-ads-shared";
import { currencyLabel } from "@/lib/currency";
import { cn, formatMileage, formatPersianNumber, toPersianDigits } from "@/lib/utils";

interface BuyAdsTableProps {
  ads: AdminBuyAdRecord[];
  busyId: string | null;
  onToggleActive: (ad: AdminBuyAdRecord, next: boolean) => void;
  onToggleBidding: (ad: AdminBuyAdRecord, next: boolean) => void;
  onDelete: (ad: AdminBuyAdRecord) => void;
}

export function BuyAdsTable({ ads, busyId, onToggleActive, onToggleBidding, onDelete }: BuyAdsTableProps) {
  if (ads.length === 0) return null;

  return (
    <div className="admin-scrollbar overflow-x-auto rounded-2xl border border-white/[0.07]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.07] bg-[#0A0D12] text-xs font-bold uppercase tracking-wider text-[#8B93A1]">
            <th scope="col" className="py-4 pe-4 ps-5 text-right">کد</th>
            <th scope="col" className="px-4 py-4 text-right">خریدار</th>
            <th scope="col" className="px-4 py-4 text-right">خودروی درخواستی</th>
            <th scope="col" className="px-4 py-4 text-right">تاریخ ثبت</th>
            <th scope="col" className="px-4 py-4 text-center">فعال</th>
            <th scope="col" className="px-4 py-4 text-center">مدیریت قیمت‌دهی</th>
            <th scope="col" className="py-4 pe-5 ps-4 text-left">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {ads.map((ad) => {
            const isBusy = busyId === ad.id;
            return (
              <tr key={ad.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="py-4 pe-4 ps-5">
                  <Link
                    href={`/admin/buy-ads/${ad.id}`}
                    dir="ltr"
                    className="inline-flex rounded-lg border border-white/[0.08] bg-[#07090C] px-2 py-1 font-mono text-xs font-bold tracking-[0.2em] text-[#FF8A2A] hover:border-[#FF6A00]/40"
                  >
                    {ad.code}
                  </Link>
                </td>

                <td className="max-w-[240px] px-4 py-4">
                  <PersonCell person={ad.buyer} />
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/[0.08] bg-[#07090C] text-[#FF8A2A]">
                      {ad.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ad.imageUrl} alt={`${ad.brandName} ${ad.carName}`} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <Car className="h-4 w-4" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#F5F5F5]">
                        {ad.brandName} {ad.carName}
                      </p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-1 text-[11px] text-[#8B93A1]">
                        <span>سال {toPersianDigits(ad.year)}</span>·<span>{formatMileage(ad.mileage)}</span>·
                        <span className="inline-flex items-center gap-1">
                          <span className="h-2.5 w-2.5 rounded-full border border-white/20" style={{ backgroundColor: ad.colorCode }} />
                          {ad.colorName}
                        </span>
                      </p>
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-xs text-[#9BA3AE]">{ad.createdAtLabel}</td>

                <td className="px-4 py-4">
                  <div className="flex justify-center">
                    {isBusy ? (
                      <Loader2 className="h-5 w-5 animate-spin text-[#FF8A2A]" />
                    ) : (
                      <Toggle checked={ad.isActive} onCheckedChange={(next) => onToggleActive(ad, next)} label="فعال بودن آگهی" />
                    )}
                  </div>
                </td>

                {/* Bidding management: summary + entry to the detail page */}
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`/admin/buy-ads/${ad.id}#offers`}
                      title="مدیریت قیمت‌دهی و مشاهده پیشنهادها"
                      className="group flex min-w-[150px] items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#07090C] px-3 py-2 transition-colors hover:border-[#FF6A00]/40 hover:bg-[#FF6A00]/[0.06]"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FF6A00]/10 text-[#FF8A2A]">
                        <Gavel className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 text-start">
                        <span className="block text-xs font-bold text-[#F5F5F5] group-hover:text-[#FF8A2A]">
                          {ad.offerCount > 0 ? `${toPersianDigits(ad.offerCount)} پیشنهاد` : "بدون پیشنهاد"}
                        </span>
                        <span className="block whitespace-nowrap text-[11px] text-[#8B93A1]">
                          {ad.bestOffer ? (
                            <>
                              کمترین: <span className="font-bold text-[#D2D7DF]">{formatPersianNumber(ad.bestOffer)}</span> {currencyLabel(ad.currency)}
                            </>
                          ) : (
                            `ارز: ${currencyLabel(ad.currency)}`
                          )}
                        </span>
                      </span>
                    </Link>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onToggleBidding(ad, !ad.biddingOpen)}
                      title={ad.biddingOpen ? "قیمت‌دهی باز است — برای بستن کلیک کنید" : "قیمت‌دهی بسته است — برای باز کردن کلیک کنید"}
                      className={cn(
                        "flex h-9 shrink-0 items-center gap-1 rounded-lg border px-2 text-[11px] font-bold transition-colors disabled:opacity-40",
                        ad.biddingOpen
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:border-emerald-500/60"
                          : "border-red-500/30 bg-red-500/10 text-red-300 hover:border-red-500/60"
                      )}
                    >
                      {ad.biddingOpen ? <LockOpen className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                      {ad.biddingOpen ? "باز" : "بسته"}
                    </button>
                  </div>
                </td>

                <td className="py-4 pe-5 ps-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onDelete(ad)}
                      disabled={isBusy}
                      title="حذف آگهی خرید"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
