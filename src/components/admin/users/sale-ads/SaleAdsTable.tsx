"use client";

import React from "react";
import { Car, Edit2, Loader2, Trash2 } from "lucide-react";

import { Toggle } from "@/components/admin/ui/Toggle";
import { Badge } from "@/components/admin/ui/Badge";
import { AdStatusBadge } from "@/components/admin/ads/AdStatusBadge";
import type { UserCarRecord } from "@/lib/user-cars";
import { formatPersianNumber, toPersianDigits } from "@/lib/utils";

interface SaleAdsTableProps {
  ads: UserCarRecord[];
  onEdit: (ad: UserCarRecord) => void;
  onDelete: (ad: UserCarRecord) => void;
  onToggleActive: (ad: UserCarRecord, next: boolean) => void;
  busyId: string | null;
}

/** Lowest active price across an ad's sale terms, or null when none exist. */
export function lowestPrice(ad: UserCarRecord): string | null {
  const prices = ad.saleTerms
    .filter((term) => term.isActive)
    .map((term) => Number(term.price))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (prices.length === 0) return null;
  return String(Math.min(...prices));
}

export function SaleAdsTable({ ads, onEdit, onDelete, onToggleActive, busyId }: SaleAdsTableProps) {
  if (ads.length === 0) return null;

  return (
    <div className="admin-scrollbar overflow-x-auto rounded-2xl border border-white/[0.07]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.07] bg-[#0A0D12] text-xs font-bold uppercase tracking-wider text-[#8B93A1]">
            <th scope="col" className="py-4 pe-4 ps-5 text-right">کد</th>
            <th scope="col" className="px-4 py-4 text-right">خودرو</th>
            <th scope="col" className="px-4 py-4 text-center">تعداد</th>
            <th scope="col" className="px-4 py-4 text-right">شرایط فروش</th>
            <th scope="col" className="px-4 py-4 text-right">کمترین قیمت</th>
            <th scope="col" className="px-4 py-4 text-right">تاریخ ثبت</th>
            <th scope="col" className="px-4 py-4 text-center">تایید</th>
            <th scope="col" className="px-4 py-4 text-center">وضعیت</th>
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
                  <span dir="ltr" className="inline-flex rounded-lg border border-white/[0.08] bg-[#07090C] px-2 py-1 font-mono text-xs font-bold tracking-[0.2em] text-[#FF8A2A]">
                    {ad.code}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#07090C] text-[#FF8A2A]">
                      <Car className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-[#F5F5F5]">
                        {ad.brandName} {ad.carName}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#8B93A1]">
                        {ad.carTypeName} · مدل {toPersianDigits(ad.carModel)} · {toPersianDigits(ad.carYear)}
                      </p>
                      {ad.description && (
                        <p className="mt-1 max-w-[280px] truncate text-[11px] text-[#5E6672]" title={ad.description}>
                          {ad.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-center font-mono text-[#D2D7DF]">
                  {toPersianDigits(ad.qautity)}
                </td>
                <td className="px-4 py-4">
                  {ad.saleTerms.length === 0 ? (
                    <span className="text-xs text-[#5E6672]">بدون شرط فروش</span>
                  ) : (
                    <div className="flex max-w-[320px] flex-wrap gap-1.5">
                      {ad.saleTerms.map((term) => (
                        <span
                          key={term.id}
                          title={`${formatPersianNumber(term.price)} تومان${term.perecentage ? ` · ${toPersianDigits(term.perecentage)}٪ تخفیف` : ""}`}
                          className={
                            term.isActive
                              ? "inline-flex items-center gap-1 rounded-full border border-[#FF6A00]/25 bg-[#FF6A00]/[0.08] px-2 py-0.5 text-[11px] font-semibold text-[#FFB070]"
                              : "inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[11px] font-semibold text-[#5E6672] line-through"
                          }
                        >
                          {term.saleTermTitle}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  {price ? (
                    <p className="whitespace-nowrap font-bold text-[#F5F5F5]">
                      {formatPersianNumber(price)}
                      <span className="ms-1 text-[11px] font-semibold text-[#8B93A1]">تومان</span>
                    </p>
                  ) : (
                    <span className="text-xs text-[#5E6672]">—</span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs text-[#9BA3AE]">{ad.createdAtLabel}</td>
                <td className="px-4 py-4 text-center">
                  <AdStatusBadge status={ad.status} />
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col items-center gap-1.5">
                    {isBusy ? (
                      <Loader2 className="h-5 w-5 animate-spin text-[#FF8A2A]" />
                    ) : (
                      <Toggle
                        checked={ad.isActive}
                        onCheckedChange={(next) => onToggleActive(ad, next)}
                        label="وضعیت آگهی"
                      />
                    )}
                    <Badge tone={ad.isActive ? "success" : "muted"}>{ad.isActive ? "فعال" : "غیرفعال"}</Badge>
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
