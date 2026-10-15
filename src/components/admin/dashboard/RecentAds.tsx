import React from "react";
import Link from "next/link";
import { Megaphone } from "lucide-react";

import type { DashboardRecentAd } from "@/lib/dashboard";
import { toPersianDigits } from "@/lib/utils";
import { AdStatusBadge } from "@/components/admin/ads/AdStatusBadge";
import { DashboardEmpty } from "@/components/admin/dashboard/DashboardCard";

interface RecentAdsProps {
  ads: DashboardRecentAd[];
}

/** Latest sale ads across the whole system. */
export function RecentAds({ ads }: RecentAdsProps) {
  if (ads.length === 0) {
    return <DashboardEmpty icon={Megaphone} text="هنوز آگهی‌ای ثبت نشده است. اولین آگهی را از پروفایل یک کاربر ثبت کنید." />;
  }

  return (
    <div className="admin-scrollbar -mx-5 -mb-5 overflow-x-auto">
      <table className="w-full min-w-[560px] text-right text-xs">
        <thead>
          <tr className="border-b border-white/[0.06] text-[11px] text-[#8B93A1]">
            <th className="px-5 py-2.5 font-semibold">کد</th>
            <th className="px-3 py-2.5 font-semibold">خودرو</th>
            <th className="px-3 py-2.5 font-semibold">کاربر</th>
            <th className="px-3 py-2.5 font-semibold">وضعیت</th>
            <th className="px-5 py-2.5 font-semibold">تاریخ ثبت</th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad) => (
            <tr key={ad.id} className="border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.02]">
              <td className="px-5 py-3">
                <Link
                  href={`/admin/ads?q=${ad.code}`}
                  dir="ltr"
                  className="inline-block rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] font-bold tracking-wider text-[#FF8A2A] transition-colors hover:border-[#FF6A00]/40"
                >
                  {toPersianDigits(ad.code)}
                </Link>
              </td>
              <td className="px-3 py-3">
                <p className="truncate font-bold text-[#F5F5F5]">
                  {ad.brandName} {ad.carName}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-[#8B93A1]">
                  {ad.carModel} · {toPersianDigits(ad.carYear)}
                  {!ad.isActive && <span className="ms-1.5 text-[#5E6672]">· غیرفعال</span>}
                </p>
              </td>
              <td className="px-3 py-3">
                <Link href={`/admin/users/${ad.userId}`} className="group block">
                  <p className="truncate font-semibold text-[#D2D7DF] transition-colors group-hover:text-[#F5F5F5]">
                    {ad.userName}
                  </p>
                  <p dir="ltr" className="mt-0.5 text-start font-mono text-[10px] text-[#8B93A1]">
                    {toPersianDigits(ad.userPhone)}
                  </p>
                </Link>
              </td>
              <td className="px-3 py-3">
                <AdStatusBadge status={ad.status} size="sm" />
              </td>
              <td className="whitespace-nowrap px-5 py-3 text-[11px] text-[#9BA3AE]">{ad.createdAtLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
