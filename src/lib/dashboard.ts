import "server-only";

import prisma from "@/lib/prisma";
import type { AdStatus } from "@/lib/ad-status";

/* ───────────────────────── Types ───────────────────────── */

export interface TrendPoint {
  /** ISO day key (YYYY-MM-DD, server local time). */
  key: string;
  /** Short Persian label, e.g. "۲۳ مهر". */
  label: string;
  count: number;
}

export interface DashboardDelta {
  /** Count inside the current 30-day window. */
  current: number;
  /** Count inside the previous 30-day window. */
  previous: number;
  /** Percentage change, or `null` when the previous window was empty. */
  percent: number | null;
}

export interface DashboardBrandStat {
  id: string;
  name: string;
  image: string | null;
  isActive: boolean;
  cars: number;
  ads: number;
}

export interface DashboardRecentAd {
  id: string;
  code: string;
  status: AdStatus;
  isActive: boolean;
  carName: string;
  carModel: string;
  carYear: string;
  brandName: string;
  userId: string;
  userName: string;
  userPhone: string;
  createdAtLabel: string;
}

export interface DashboardRecentUser {
  id: string;
  name: string;
  phone: string;
  image: string | null;
  isActive: boolean;
  adsCount: number;
  createdAtLabel: string;
}

export interface DashboardData {
  /** Long Persian date for the header, e.g. "سه‌شنبه ۲۳ مهر ۱۴۰۵". */
  todayLabel: string;
  /** Server hour (0–23) used for the greeting. */
  hour: number;

  ads: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    inactive: number;
    delta: DashboardDelta;
    /** Daily counts for the last 30 days (oldest first). */
    trend: TrendPoint[];
    /** Daily counts for the last 14 days (oldest first) – stat-tile sparkline. */
    sparkline: number[];
  };

  users: {
    total: number;
    active: number;
    inactive: number;
    delta: DashboardDelta;
    sparkline: number[];
  };

  catalog: {
    cars: number;
    brands: number;
    activeBrands: number;
    carTypes: number;
    options: number;
    optionItems: number;
    adOptionValues: number;
    carImages: number;
    saleTerms: number;
    activeSaleTerms: number;
  };

  attention: {
    pendingAds: number;
    inactiveAds: number;
    carsWithoutImages: number;
    brandsWithoutCars: number;
    inactiveBrands: number;
    inactiveSaleTerms: number;
    inactiveUsers: number;
  };

  topBrands: DashboardBrandStat[];
  recentAds: DashboardRecentAd[];
  recentUsers: DashboardRecentUser[];
}

/* ───────────────────────── Helpers ───────────────────────── */

const TREND_DAYS = 30;
const SPARKLINE_DAYS = 14;

const faLongDate = new Intl.DateTimeFormat("fa-IR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const faShortDate = new Intl.DateTimeFormat("fa-IR", {
  day: "numeric",
  month: "long",
});

const faDate = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function shiftDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Bucket timestamps into one entry per calendar day, oldest first. */
function bucketByDay(dates: Date[], today: Date, days: number): TrendPoint[] {
  const counts = new Map<string, number>();
  for (const date of dates) {
    const key = dayKey(date);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const points: TrendPoint[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = shiftDays(today, -i);
    const key = dayKey(day);
    points.push({ key, label: faShortDate.format(day), count: counts.get(key) ?? 0 });
  }
  return points;
}

function computeDelta(dates: Date[], windowStart: Date, previousStart: Date): DashboardDelta {
  let current = 0;
  let previous = 0;
  for (const date of dates) {
    if (date >= windowStart) current += 1;
    else if (date >= previousStart) previous += 1;
  }
  const percent = previous === 0 ? null : Math.round(((current - previous) / previous) * 100);
  return { current, previous, percent };
}

/* ───────────────────────── Loader ───────────────────────── */

/**
 * Load every figure the admin dashboard renders in a single parallel batch.
 * All values are plain, serialisable data (BigInt ids become strings and dates
 * are pre-formatted on the server to avoid hydration drift).
 */
export async function getDashboardData(now = new Date()): Promise<DashboardData> {
  const today = startOfDay(now);
  const windowStart = shiftDays(today, -(TREND_DAYS - 1));
  const previousStart = shiftDays(windowStart, -TREND_DAYS);

  const [
    adStatusGroups,
    inactiveAds,
    totalUsers,
    inactiveUsers,
    totalCars,
    totalBrands,
    inactiveBrands,
    totalCarTypes,
    totalOptions,
    totalOptionItems,
    totalAdOptionValues,
    totalCarImages,
    totalSaleTerms,
    inactiveSaleTerms,
    carsWithoutImages,
    brandsWithoutCars,
    recentAdDates,
    recentUserDates,
    brands,
    carsByBrand,
    recentAds,
    recentUsers,
  ] = await Promise.all([
    prisma.userCar.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.userCar.count({ where: { isActive: false } }),
    prisma.user.count(),
    prisma.user.count({ where: { isActive: false } }),
    prisma.car.count(),
    prisma.brand.count(),
    prisma.brand.count({ where: { isActive: false } }),
    prisma.carType.count(),
    prisma.option.count(),
    prisma.optionItem.count(),
    prisma.userCarOption.count(),
    prisma.carImage.count(),
    prisma.saleTerm.count(),
    prisma.saleTerm.count({ where: { isActive: false } }),
    prisma.car.count({ where: { carImages: { none: {} } } }),
    prisma.brand.count({ where: { cars: { none: {} } } }),
    prisma.userCar.findMany({
      where: { createdAt: { gte: previousStart } },
      select: { createdAt: true },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: previousStart } },
      select: { createdAt: true },
    }),
    prisma.brand.findMany({
      select: { id: true, name: true, image: true, isActive: true },
    }),
    prisma.car.findMany({
      select: { brandId: true, _count: { select: { userCars: true } } },
    }),
    prisma.userCar.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 6,
      include: {
        user: { select: { id: true, name: true, phone: true } },
        car: { include: { brand: { select: { name: true } } } },
      },
    }),
    prisma.user.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 5,
      select: {
        id: true,
        name: true,
        phone: true,
        image: true,
        isActive: true,
        createdAt: true,
        _count: { select: { userCars: true } },
      },
    }),
  ]);

  /* ───── Ads by status ───── */
  const statusCounts: Record<AdStatus, number> = { pending: 0, approved: 0, rejected: 0 };
  for (const group of adStatusGroups) {
    statusCounts[group.status] = group._count._all;
  }
  const totalAds = statusCounts.pending + statusCounts.approved + statusCounts.rejected;

  /* ───── Time series ───── */
  const adDates = recentAdDates.map((row) => row.createdAt);
  const userDates = recentUserDates.map((row) => row.createdAt);

  const adsTrend = bucketByDay(adDates, today, TREND_DAYS);
  const adsSparkline = adsTrend.slice(-SPARKLINE_DAYS).map((point) => point.count);
  const usersSparkline = bucketByDay(userDates, today, SPARKLINE_DAYS).map((point) => point.count);

  /* ───── Brands ranked by ads, then by catalogue size ───── */
  const brandStats = new Map<string, DashboardBrandStat>();
  for (const brand of brands) {
    brandStats.set(brand.id.toString(), {
      id: brand.id.toString(),
      name: brand.name,
      image: brand.image,
      isActive: brand.isActive,
      cars: 0,
      ads: 0,
    });
  }
  for (const car of carsByBrand) {
    const stat = brandStats.get(car.brandId.toString());
    if (!stat) continue;
    stat.cars += 1;
    stat.ads += car._count.userCars;
  }
  const topBrands = Array.from(brandStats.values())
    .filter((brand) => brand.cars > 0 || brand.ads > 0)
    .sort((a, b) => b.ads - a.ads || b.cars - a.cars || a.name.localeCompare(b.name, "fa"))
    .slice(0, 5);

  return {
    todayLabel: faLongDate.format(now),
    hour: now.getHours(),

    ads: {
      total: totalAds,
      pending: statusCounts.pending,
      approved: statusCounts.approved,
      rejected: statusCounts.rejected,
      inactive: inactiveAds,
      delta: computeDelta(adDates, windowStart, previousStart),
      trend: adsTrend,
      sparkline: adsSparkline,
    },

    users: {
      total: totalUsers,
      active: totalUsers - inactiveUsers,
      inactive: inactiveUsers,
      delta: computeDelta(userDates, windowStart, previousStart),
      sparkline: usersSparkline,
    },

    catalog: {
      cars: totalCars,
      brands: totalBrands,
      activeBrands: totalBrands - inactiveBrands,
      carTypes: totalCarTypes,
      options: totalOptions,
      optionItems: totalOptionItems,
      adOptionValues: totalAdOptionValues,
      carImages: totalCarImages,
      saleTerms: totalSaleTerms,
      activeSaleTerms: totalSaleTerms - inactiveSaleTerms,
    },

    attention: {
      pendingAds: statusCounts.pending,
      inactiveAds,
      carsWithoutImages,
        brandsWithoutCars,
      inactiveBrands,
      inactiveSaleTerms,
      inactiveUsers,
    },

    topBrands,

    recentAds: recentAds.map((ad) => ({
      id: ad.id.toString(),
      code: ad.code,
      status: ad.status,
      isActive: ad.isActive,
      carName: ad.car.name,
      carModel: ad.car.model,
      carYear: ad.year,
      brandName: ad.car.brand.name,
      userId: ad.user.id.toString(),
      userName: ad.user.name,
      userPhone: ad.user.phone,
      createdAtLabel: faDate.format(ad.createdAt),
    })),

    recentUsers: recentUsers.map((user) => ({
      id: user.id.toString(),
      name: user.name,
      phone: user.phone,
      image: user.image,
      isActive: user.isActive,
      adsCount: user._count.userCars,
      createdAtLabel: faDate.format(user.createdAt),
    })),
  };
}
