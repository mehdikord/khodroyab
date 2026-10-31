"use client";

import React from "react";
import Link from "next/link";
import { Car, Check, Edit2, ExternalLink, Loader2, Trash2, X } from "lucide-react";

import { Toggle } from "@/components/admin/ui/Toggle";
import { AdStatusBadge } from "@/components/admin/ads/AdStatusBadge";
import { lowestPrice } from "@/components/admin/users/sale-ads/SaleAdsTable";
import type { UserCarRecord } from "@/lib/user-cars";
import type { AdStatus } from "@/lib/ad-status";
import { formatPersianNumber, toPersianDigits } from "@/lib/utils";

interface AdsTableProps {
  ads: UserCarRecord[];
  busyId: string | null;
  onEdit: (ad: UserCarRecord) => void;
  onDelete: (ad: UserCarRecord) => void;
  onToggleActive: (ad: UserCarRecord, next: boolean) => void;
  onChangeStatus: (ad: UserCarRecord, status: AdStatus) => void;
}

const quickButton =
  "flex h-7 w-7 items-center justify-center rounded-md border text-[#9BA3AE] transition-colors disabled:cursor-not-allowed disabled:opacity-30";

export function AdsTable({ ads, busyId, onEdit, onDelete, onToggleActive, onChangeStatus }: AdsTableProps) {
  if (ads.length === 0) return null;

  return (
    <div className="admin-scrollbar overflow-x-auto rounded-2xl border border-white/[0.07]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.07] bg-[#0A0D12] text-xs font-bold uppercase tracking-wider text-[#8B93A1]">
            <th scope="col" className="py-4 pe-4 ps-5 text-right">کد</th>
            <th scope="col" className="px-4 py-4 text-right">کاربر</th>
            <th scope="col" className="px-4 py-4 text-right">خودرو</th>
            <th scope="col" className="px-4 py-4 text-center">تعداد</th>
            <th scope="col" className="px-4 py-4 text-right">کمترین قیمت</th>
            <th scope="col" className="px-4 py-4 text-right">تاریخ ثبت</th>
            <th scope="col" className="px-4 py-4 text-center">تایید</th>
            <th scope="col" className="px-4 py-4 text-center">فعال</th>
            <th scope="col" className="py-4 pe-5 ps-4 text-left">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {ads.map((ad) => {
            const isBusy = busyId === ad.id;
            const price = lowestPrice(ad);
            return (
              <tr key={ad.id} className="transition-colors hover:bg-white/[0.02]">
                <td className="py-4 pe-4 ps-5">
                  <span
                    dir="ltr"
                    className="inline-flex rounded-lg border border-white/[0.08] bg-[#07090C] px-2 py-1 font-mono text-xs font-bold tracking-[0.2em] text-[#FF8A2A]"
                  >
                    {ad.code}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <Link
                    href={`/admin/users/${ad.userId}/sale-ads`}
                    className="group flex items-center gap-2.5"
                    title="آگهی‌های این کاربر"
                  >
                    <span className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/[0.1] bg-[#07090C]">
                      {ad.userImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ad.userImage} alt={ad.userName} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-bold text-[#5E6672]">
                          {ad.userName.trim().charAt(0) || "?"}
                        </span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1 text-sm font-semibold text-[#F5F5F5] group-hover:text-[#FF8A2A]">
                        <span className="truncate">{ad.userName}</span>
                        <ExternalLink className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                      </span>
                      <span dir="ltr" className="block text-start font-mono text-[11px] text-[#8B93A1]">
                        {ad.userPhone}
                      </span>
                    </span>
                  </Link>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/[0.08] bg-[#07090C] text-[#FF8A2A]">
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
                      <p className="mt-0.5 text-[11px] text-[#8B93A1]">
                        {ad.carTypeName} · مدل {toPersianDigits(ad.carModel)} · {toPersianDigits(ad.carYear)}
                        {ad.colorName && ` · ${ad.colorName}`}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4 text-center font-mono text-[#D2D7DF]">{toPersianDigits(ad.qautity)}</td>

                <td className="px-4 py-4">
                  {price ? (
                    <p className="whitespace-nowrap font-bold text-[#F5F5F5]">
                      {formatPersianNumber(price)}
                      <span className="ms-1 text-[11px] font-semibold text-[#8B93A1]">تومان</span>
                    </p>
                  ) : (
                    <span className="text-xs text-[#5E6672]">—</span>
                  )}
                  <p className="mt-0.5 text-[11px] text-[#5E6672]">
                    {ad.saleTerms.length > 0 ? `${toPersianDigits(ad.saleTerms.length)} شرط فروش` : "بدون شرط فروش"}
                  </p>
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-xs text-[#9BA3AE]">{ad.createdAtLabel}</td>

                <td className="px-4 py-4">
                  <div className="flex flex-col items-center gap-2">
                    <AdStatusBadge status={ad.status} />
                    <div className="flex items-center gap-1">
                      {isBusy ? (
                        <Loader2 className="h-4 w-4 animate-spin text-[#FF8A2A]" />
                      ) : (
                        <>
                          <button
                            type="button"
                            title="تایید آگهی"
                            disabled={ad.status === "approved"}
                            onClick={() => onChangeStatus(ad, "approved")}
                            className={`${quickButton} border-white/[0.08] hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300`}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            title="رد آگهی"
                            disabled={ad.status === "rejected"}
                            onClick={() => onChangeStatus(ad, "rejected")}
                            className={`${quickButton} border-white/[0.08] hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="flex justify-center">
                    {isBusy ? (
                      <Loader2 className="h-5 w-5 animate-spin text-[#FF8A2A]" />
                    ) : (
                      <Toggle checked={ad.isActive} onCheckedChange={(next) => onToggleActive(ad, next)} label="فعال بودن آگهی" />
                    )}
                  </div>
                </td>

                <td className="py-4 pe-5 ps-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(ad)}
                      disabled={isBusy}
                      title="ویرایش آگهی"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-[#FF6A00]/40 hover:bg-[#FF6A00]/10 hover:text-[#FF8A2A] disabled:opacity-30"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(ad)}
                      disabled={isBusy}
                      title="حذف آگهی"
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
