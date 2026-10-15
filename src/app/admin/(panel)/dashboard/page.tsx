import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  Car,
  CalendarDays,
  Clock3,
  LayoutGrid,
  Megaphone,
  PieChart,
  Plus,
  Tag,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

import { requireAdmin } from "@/lib/auth/guards";
import { getDashboardData } from "@/lib/dashboard";
import { formatPersianNumber } from "@/lib/utils";
import { DashboardCard } from "@/components/admin/dashboard/DashboardCard";
import { StatTile } from "@/components/admin/dashboard/StatTile";
import { AdsTrendChart } from "@/components/admin/dashboard/AdsTrendChart";
import { StatusBreakdown } from "@/components/admin/dashboard/StatusBreakdown";
import { TopBrands } from "@/components/admin/dashboard/TopBrands";
import { RecentAds } from "@/components/admin/dashboard/RecentAds";
import { RecentUsers } from "@/components/admin/dashboard/RecentUsers";
import { CatalogOverview } from "@/components/admin/dashboard/CatalogOverview";
import { AttentionList } from "@/components/admin/dashboard/AttentionList";

export const metadata: Metadata = {
  title: "داشبورد | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

function greetingFor(hour: number): string {
  if (hour < 5) return "شب بخیر";
  if (hour < 12) return "صبح بخیر";
  if (hour < 17) return "ظهر بخیر";
  if (hour < 20) return "عصر بخیر";
  return "شب بخیر";
}

/**
 * Admin dashboard: a system-wide overview of ads, users and the catalogue,
 * plus the queue of things that need an administrator's attention.
 */
export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const data = await getDashboardData();

  const firstName = admin.name.trim().split(/\s+/)[0] || admin.name;

  return (
    <div className="space-y-6">
      {/* ───── Header ───── */}
      <div className="admin-animate-in flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-semibold text-[#8B93A1]">
            <CalendarDays className="h-3.5 w-3.5 text-[#FF8A2A]" />
            {data.todayLabel}
          </p>
          <h1 className="mt-1.5 text-2xl font-black text-[#F5F5F5] sm:text-[26px]">
            {greetingFor(data.hour)}، {firstName} 👋
          </h1>
          <p className="mt-1 text-xs text-[#9BA3AE]">
            {data.ads.pending > 0 ? (
              <>
                <span className="font-bold text-amber-300">{formatPersianNumber(data.ads.pending)} آگهی</span> منتظر بررسی
                شماست.
              </>
            ) : (
              "هیچ آگهی‌ای در صف بررسی نیست. خلاصه وضعیت سامانه را در ادامه ببینید."
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/ads?status=pending"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-4 text-xs font-bold text-[#D2D7DF] transition-colors hover:border-amber-400/40 hover:text-[#F5F5F5]"
          >
            <Clock3 className="h-4 w-4 text-amber-300" />
            بررسی آگهی‌ها
          </Link>
          <Link
            href="/admin/cars"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-4 text-xs font-extrabold text-[#07090C] shadow-orange-subtle transition-all hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            افزودن خودرو
          </Link>
        </div>
      </div>

      {/* ───── KPI row ───── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="کل آگهی‌ها"
          value={data.ads.total}
          icon={Megaphone}
          tone="accent"
          href="/admin/ads"
          delta={data.ads.delta}
          sparkline={data.ads.sparkline}
          sparklineLabel="آگهی‌های ثبت‌شده در ۱۴ روز گذشته"
          delay={0}
        />
        <StatTile
          label="در انتظار تایید"
          value={data.ads.pending}
          icon={Clock3}
          tone="warning"
          href="/admin/ads?status=pending"
          hint={
            data.ads.pending > 0
              ? "نیازمند بررسی مدیر"
              : "صف بررسی خالی است"
          }
          delay={60}
        />
        <StatTile
          label="کاربران"
          value={data.users.total}
          icon={Users}
          tone="success"
          href="/admin/users"
          delta={data.users.delta}
          sparkline={data.users.sparkline}
          sparklineLabel="کاربران ثبت‌نام‌شده در ۱۴ روز گذشته"
          delay={120}
        />
        <StatTile
          label="خودروهای کاتالوگ"
          value={data.catalog.cars}
          icon={Car}
          tone="neutral"
          href="/admin/cars"
          hint={`${formatPersianNumber(data.catalog.brands)} برند · ${formatPersianNumber(data.catalog.carTypes)} نوع بدنه`}
          delay={180}
        />
      </div>

      {/* ───── Trend + status ───── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <DashboardCard
          title="روند ثبت آگهی"
          subtitle="تعداد آگهی‌های ثبت‌شده در هر روز، ۳۰ روز گذشته"
          icon={TrendingUp}
          action={{ label: "همه آگهی‌ها", href: "/admin/ads" }}
          className="admin-animate-in xl:col-span-2"
        >
          <AdsTrendChart points={data.ads.trend} />
        </DashboardCard>

        <DashboardCard
          title="وضعیت آگهی‌ها"
          subtitle="سهم هر وضعیت از کل آگهی‌ها"
          icon={PieChart}
          className="admin-animate-in"
        >
          <StatusBreakdown
            counts={{ approved: data.ads.approved, pending: data.ads.pending, rejected: data.ads.rejected }}
            inactive={data.ads.inactive}
          />
        </DashboardCard>
      </div>

      {/* ───── Recent ads + attention ───── */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <DashboardCard
          title="آخرین آگهی‌ها"
          subtitle="جدیدترین آگهی‌های ثبت‌شده در سامانه"
          icon={Megaphone}
          action={{ label: "مشاهده همه", href: "/admin/ads" }}
          className="admin-animate-in xl:col-span-2"
        >
          <RecentAds ads={data.recentAds} />
        </DashboardCard>

        <DashboardCard
          title="نیازمند رسیدگی"
          subtitle="مواردی که بهتر است امروز بررسی شوند"
          icon={Activity}
          className="admin-animate-in"
        >
          <AttentionList attention={data.attention} />
        </DashboardCard>
      </div>

      {/* ───── Catalogue + brands + users ───── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="نمای کاتالوگ"
          subtitle="موجودی بخش‌های مختلف کاتالوگ"
          icon={LayoutGrid}
          className="admin-animate-in"
        >
          <CatalogOverview catalog={data.catalog} />
        </DashboardCard>

        <DashboardCard
          title="برندهای برتر"
          subtitle="بر اساس تعداد آگهی ثبت‌شده"
          icon={Tag}
          action={{ label: "همه برندها", href: "/admin/brands" }}
          className="admin-animate-in"
        >
          <TopBrands brands={data.topBrands} />
        </DashboardCard>

        <DashboardCard
          title="کاربران جدید"
          subtitle={`${formatPersianNumber(data.users.active)} کاربر فعال از ${formatPersianNumber(data.users.total)}`}
          icon={UserPlus}
          action={{ label: "همه کاربران", href: "/admin/users" }}
          className="admin-animate-in md:col-span-2 xl:col-span-1"
        >
          <RecentUsers users={data.recentUsers} />
        </DashboardCard>
      </div>
    </div>
  );
}
