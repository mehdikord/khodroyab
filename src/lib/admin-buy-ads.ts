import "server-only";

import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { isPriceCurrency } from "@/lib/currency";
import { findUserIdsByAnyCode, getActiveUserCodes } from "@/lib/user-codes";
import { normalizeDigits } from "@/lib/validation/admin";
import {
  ADMIN_BUY_AD_FILTER_DEFAULTS,
  isAdminBuyAdSort,
  type AdminBuyAdCounts,
  type AdminBuyAdDetail,
  type AdminBuyAdFilterOptions,
  type AdminBuyAdFilterValues,
  type AdminBuyAdPerson,
  type AdminBuyAdRecord,
  type AdminBuyAdSort,
} from "@/lib/admin-buy-ads-shared";

export * from "@/lib/admin-buy-ads-shared";

export const ADMIN_BUY_AD_PAGE_SIZE = 20;

const faDate = new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" });
const faDateTime = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function toBigIntOrNull(value: string): bigint | null {
  if (!/^\d+$/.test(value)) return null;
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

const personSelect = {
  id: true,
  name: true,
  companyName: true,
  phone: true,
  image: true,
  collabrate: true,
  authenticaed: true,
} satisfies Prisma.UserSelect;

type PersonRow = Prisma.UserGetPayload<{ select: typeof personSelect }>;

function toPerson(user: PersonRow, codes: Map<string, { code: string }>): AdminBuyAdPerson {
  return {
    id: user.id.toString(),
    name: user.name,
    companyName: user.companyName,
    phone: user.phone,
    image: user.image,
    code: codes.get(user.id.toString())?.code ?? "",
    isCollaborator: user.collabrate,
    isVerified: user.authenticaed,
  };
}

const adminBuyAdInclude = {
  user: { select: personSelect },
  car: {
    include: {
      brand: { select: { name: true } },
      carType: { select: { name: true } },
      carImages: { select: { imageUrl: true }, orderBy: { id: "asc" }, take: 1 },
    },
  },
  color: { select: { name: true, code: true } },
  _count: { select: { offers: true } },
} satisfies Prisma.UserBuyAdInclude;

type AdminBuyAdRow = Prisma.UserBuyAdGetPayload<{ include: typeof adminBuyAdInclude }>;

function toRecord(row: AdminBuyAdRow, codes: Map<string, { code: string }>, bestOffer: string | null): AdminBuyAdRecord {
  return {
    id: row.id.toString(),
    code: row.code,
    carId: row.carId.toString(),
    brandName: row.car.brand.name,
    carName: row.car.name,
    carModel: row.car.model,
    carTypeName: row.car.carType.name,
    imageUrl: row.car.carImages[0]?.imageUrl ?? null,
    year: row.year,
    mileage: row.mileage,
    colorName: row.color.name,
    colorCode: row.color.code,
    description: row.description,
    isActive: row.isActive,
    biddingOpen: row.biddingOpen,
    currency: row.currency,
    offerCount: row._count.offers,
    bestOffer,
    buyer: toPerson(row.user, codes),
    createdAtLabel: faDate.format(row.createdAt),
    updatedAtLabel: faDateTime.format(row.updatedAt),
  };
}

/* ───────────────────────── Filters ───────────────────────── */

type SearchParams = Record<string, string | string[] | undefined>;

export function parseAdminBuyAdFilters(searchParams: SearchParams): AdminBuyAdFilterValues {
  const single = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";
  const tri = (value: string): "" | "1" | "0" => (value === "1" ? "1" : value === "0" ? "0" : "");
  const id = (value: string) => (/^\d{1,20}$/.test(value) ? value : "");
  const year = (value: string) => {
    const digits = normalizeDigits(value);
    return /^\d{4}$/.test(digits) ? digits : "";
  };
  const sortRaw = single(searchParams.sort);
  const currencyRaw = single(searchParams.currency);

  return {
    q: single(searchParams.q).trim().slice(0, 100),
    brandId: id(single(searchParams.brand)),
    carId: id(single(searchParams.car)),
    userId: id(single(searchParams.user)),
    colorId: id(single(searchParams.color)),
    active: tri(single(searchParams.active)),
    bidding: tri(single(searchParams.bidding)),
    offers: tri(single(searchParams.offers)),
    currency: isPriceCurrency(currencyRaw) ? currencyRaw : "",
    yearFrom: year(single(searchParams.yearFrom)),
    yearTo: year(single(searchParams.yearTo)),
    sort: isAdminBuyAdSort(sortRaw) ? sortRaw : ADMIN_BUY_AD_FILTER_DEFAULTS.sort,
  };
}

async function buildWhere(filters: AdminBuyAdFilterValues): Promise<Prisma.UserBuyAdWhereInput> {
  const and: Prisma.UserBuyAdWhereInput[] = [];

  if (filters.q) {
    const digits = normalizeDigits(filters.q);
    const or: Prisma.UserBuyAdWhereInput[] = [
      { user: { name: { contains: filters.q } } },
      { user: { companyName: { contains: filters.q } } },
      { car: { name: { contains: filters.q } } },
      { car: { model: { contains: filters.q } } },
      { car: { brand: { name: { contains: filters.q } } } },
      { car: { carType: { name: { contains: filters.q } } } },
      { color: { name: { contains: filters.q } } },
      { description: { contains: filters.q } },
    ];
    if (digits) {
      or.push({ code: { contains: digits } });
      or.push({ year: { contains: digits } });
      or.push({ user: { phone: { contains: digits } } });
      // A public code (current or expired) finds the user's own requests and
      // every request they bid on.
      const codeUserIds = (await findUserIdsByAnyCode(digits)).map((value) => BigInt(value));
      if (codeUserIds.length > 0) {
        or.push({ userId: { in: codeUserIds } });
        or.push({ offers: { some: { userId: { in: codeUserIds } } } });
      }
    }
    and.push({ OR: or });
  }

  const carId = toBigIntOrNull(filters.carId);
  const brandId = toBigIntOrNull(filters.brandId);
  if (carId !== null) and.push({ carId });
  else if (brandId !== null) and.push({ car: { brandId } });

  const userId = toBigIntOrNull(filters.userId);
  if (userId !== null) and.push({ userId });

  const colorId = toBigIntOrNull(filters.colorId);
  if (colorId !== null) and.push({ colorId });

  if (filters.active) and.push({ isActive: filters.active === "1" });
  if (filters.bidding) and.push({ biddingOpen: filters.bidding === "1" });
  if (filters.offers === "1") and.push({ offers: { some: {} } });
  if (filters.offers === "0") and.push({ offers: { none: {} } });
  if (filters.currency) and.push({ currency: filters.currency });

  // Years are stored as 4-digit strings, so lexicographic comparison is safe.
  if (filters.yearFrom) and.push({ year: { gte: filters.yearFrom } });
  if (filters.yearTo) and.push({ year: { lte: filters.yearTo } });

  return and.length > 0 ? { AND: and } : {};
}

function buildOrderBy(sort: AdminBuyAdSort): Prisma.UserBuyAdOrderByWithRelationInput[] {
  switch (sort) {
    case "oldest":
      return [{ createdAt: "asc" }, { id: "asc" }];
    case "offers_desc":
      return [{ offers: { _count: "desc" } }, { createdAt: "desc" }, { id: "desc" }];
    case "offers_asc":
      return [{ offers: { _count: "asc" } }, { createdAt: "desc" }, { id: "desc" }];
    case "updated":
      return [{ updatedAt: "desc" }, { id: "desc" }];
    case "year_desc":
      return [{ year: "desc" }, { createdAt: "desc" }, { id: "desc" }];
    case "year_asc":
      return [{ year: "asc" }, { createdAt: "desc" }, { id: "desc" }];
    case "mileage_asc":
      return [{ mileage: "asc" }, { createdAt: "desc" }, { id: "desc" }];
    case "brand":
      return [{ car: { brand: { name: "asc" } } }, { car: { name: "asc" } }, { id: "desc" }];
    case "newest":
    default:
      return [{ createdAt: "desc" }, { id: "desc" }];
  }
}

/* ───────────────────────── List ───────────────────────── */

export interface AdminBuyAdListResult {
  ads: AdminBuyAdRecord[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
}

export async function listAdminBuyAds(filters: AdminBuyAdFilterValues, requestedPage: number): Promise<AdminBuyAdListResult> {
  const where = await buildWhere(filters);
  const total = await prisma.userBuyAd.count({ where });

  const pageCount = Math.max(1, Math.ceil(total / ADMIN_BUY_AD_PAGE_SIZE));
  const page = Math.min(Math.max(1, requestedPage), pageCount);

  const rows =
    total === 0
      ? []
      : await prisma.userBuyAd.findMany({
          where,
          include: adminBuyAdInclude,
          orderBy: buildOrderBy(filters.sort),
          skip: (page - 1) * ADMIN_BUY_AD_PAGE_SIZE,
          take: ADMIN_BUY_AD_PAGE_SIZE,
        });

  const ids = rows.map((row) => row.id);
  const [codes, best] = await Promise.all([
    getActiveUserCodes(rows.map((row) => row.userId)),
    ids.length === 0
      ? Promise.resolve([])
      : prisma.userBuyAdOffer.groupBy({ by: ["buyAdId"], where: { buyAdId: { in: ids } }, _min: { price: true } }),
  ]);
  const bestById = new Map(best.map((row) => [row.buyAdId.toString(), row._min.price?.toString() ?? null]));

  return {
    ads: rows.map((row) => toRecord(row, codes, bestById.get(row.id.toString()) ?? null)),
    total,
    page,
    pageCount,
    pageSize: ADMIN_BUY_AD_PAGE_SIZE,
  };
}

export async function getAdminBuyAdCounts(): Promise<AdminBuyAdCounts> {
  const [total, active, biddingOpen, withOffers, totalOffers] = await Promise.all([
    prisma.userBuyAd.count(),
    prisma.userBuyAd.count({ where: { isActive: true } }),
    prisma.userBuyAd.count({ where: { biddingOpen: true } }),
    prisma.userBuyAd.count({ where: { offers: { some: {} } } }),
    prisma.userBuyAdOffer.count(),
  ]);
  return {
    total,
    active,
    paused: total - active,
    biddingOpen,
    biddingClosed: total - biddingOpen,
    withOffers,
    totalOffers,
  };
}

/** Filter choices limited to values that occur among buy ads. */
export async function getAdminBuyAdFilterOptions(): Promise<AdminBuyAdFilterOptions> {
  const [cars, users, colors, years] = await Promise.all([
    prisma.car.findMany({
      where: { buyAds: { some: {} } },
      select: { id: true, name: true, model: true, brandId: true, brand: { select: { name: true } }, carType: { select: { name: true } } },
      orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
    }),
    prisma.user.findMany({
      where: { buyAds: { some: {} } },
      select: { id: true, name: true, companyName: true, phone: true },
      orderBy: { name: "asc" },
    }),
    prisma.color.findMany({ where: { buyAds: { some: {} } }, select: { id: true, name: true, code: true }, orderBy: { name: "asc" } }),
    prisma.userBuyAd.findMany({ select: { year: true }, distinct: ["year"], orderBy: { year: "desc" } }),
  ]);

  const brands = new Map<string, { name: string; count: number }>();
  for (const car of cars) {
    const key = car.brandId.toString();
    const entry = brands.get(key) ?? { name: car.brand.name, count: 0 };
    entry.count += 1;
    brands.set(key, entry);
  }

  return {
    brands: Array.from(brands, ([id, { name, count }]) => ({ id, name, description: `${count}` })),
    cars: cars.map((car) => ({
      id: car.id.toString(),
      brandId: car.brandId.toString(),
      name: `${car.brand.name} ${car.name}`,
      description: `${car.carType.name} · مدل ${car.model}`,
    })),
    users: users.map((user) => ({
      id: user.id.toString(),
      name: user.companyName ? `${user.name} (${user.companyName})` : user.name,
      description: user.phone,
    })),
    colors: colors.map((color) => ({ id: color.id.toString(), name: color.name, code: color.code })),
    years: years.map((row) => row.year).filter((value) => /^\d{4}$/.test(value)),
  };
}

/* ───────────────────────── Detail ───────────────────────── */

const adminBuyAdDetailInclude = {
  ...adminBuyAdInclude,
  car: {
    include: {
      brand: { select: { name: true } },
      carType: { select: { name: true } },
      carImages: { select: { imageUrl: true }, orderBy: { id: "asc" } },
    },
  },
  offers: {
    select: { id: true, price: true, createdAt: true, updatedAt: true, user: { select: personSelect } },
    orderBy: [{ price: "asc" }, { updatedAt: "asc" }, { id: "asc" }],
  },
} satisfies Prisma.UserBuyAdInclude;

/** One buy ad with every offer and the identity of every bidder. */
export async function getAdminBuyAdDetail(idRaw: string): Promise<AdminBuyAdDetail | null> {
  const id = toBigIntOrNull(idRaw);
  if (id === null) return null;

  const row = await prisma.userBuyAd.findUnique({ where: { id }, include: adminBuyAdDetailInclude });
  if (!row) return null;

  const codes = await getActiveUserCodes([row.userId, ...row.offers.map((offer) => offer.user.id)]);
  const bestOffer = row.offers[0]?.price.toString() ?? null;

  return {
    ...toRecord(row, codes, bestOffer),
    galleryUrls: row.car.carImages.map((image) => image.imageUrl),
    offers: row.offers.map((offer) => ({
      id: offer.id.toString(),
      price: offer.price.toString(),
      bidder: toPerson(offer.user, codes),
      edited: offer.updatedAt.getTime() - offer.createdAt.getTime() > 1000,
      createdAtLabel: faDateTime.format(offer.createdAt),
      updatedAtLabel: faDateTime.format(offer.updatedAt),
    })),
  };
}
