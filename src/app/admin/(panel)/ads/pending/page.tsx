import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, Megaphone } from "lucide-react";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/guards";
import { toPersianDigits } from "@/lib/utils";

export const metadata: Metadata = {
  title: "آگهی‌های در انتظار تایید | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/**
 * Pending-ads queue. The moderation workflow lands in a later phase; for now the
 * page only reports how many ads are waiting and points to the full list.
 */
export default async function AdminPendingAdsPage() {
  await requireAdmin();

  const pendingCount = await prisma.userCar.count({ where: { status: "pending" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300">
          <Clock3 className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-[#F5F5F5]">آگهی‌های در انتظار تایید</h1>
          <p className="mt-0.5 text-xs text-[#8B93A1]">{toPersianDigits(pendingCount)} آگهی منتظر بررسی</p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/[0.12] bg-[#0D1117]/60 px-6 py-16 text-center">
        <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="relative">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0D1117] text-[#5E6672]">
            <Megaphone className="h-7 w-7" />
          </span>
          <p className="mt-5 text-base font-extrabold text-[#F5F5F5]">صف بررسی آگهی‌ها در مرحله بعد فعال می‌شود</p>
          <p className="mt-2 text-xs leading-6 text-[#8B93A1]">
            تا آن زمان می‌توانید آگهی‌های در انتظار را از صفحه «همه آگهی‌ها» با فیلتر وضعیت مشاهده و تایید یا رد کنید.
          </p>
          <Link
            href="/admin/ads?status=pending"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] transition-all hover:brightness-110"
          >
            مشاهده آگهی‌های در انتظار
          </Link>
        </div>
      </div>
    </div>
  );
}
