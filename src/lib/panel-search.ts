import "server-only";

import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { hasCompanyName, publicDisplayName } from "@/lib/display-name";
import { normalizeDigits } from "@/lib/validation/admin";

import {
  type SearchAdRecord,
  type SearchAdSaleTerm,
  type SearchPricePoint,
  type SearchFilterValues,
  type SearchOption,
  type SearchOptions,
  type SearchResult,
  type SearchSort,
  type SellerProfile,
} from "@/lib/panel-search-shared";

export * from "@/lib/panel-search-shared";

/* ───────────────────────── Helpers ───────────────────────── */

export const SEARCH_PAGE_SIZE = 12;

const faDate = new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" });
const faShortDate = new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "short", day: "numeric" });
const faTime = new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit" });

function toPrice(value: string): number {
  const n = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function toBigIntOrNull(value: string): bigint | null {
  if (!/^\d+$/.test(value)) return null;
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

/** Only approved, active ads are ever visible to customers. */
const PUBLIC_AD_WHERE = { status: "approved", isActive: true } satisfies Prisma.UserCarWhereInput;

function buildWhere(filters: SearchFilterValues): Prisma.UserCarWhereInput {
  const and: Prisma.UserCarWhereInput[] = [];

  if (filters.q) {
    const digits = normalizeDigits(filters.q);
    const or: Prisma.UserCarWhereInput[] = [
      { car: { name: { contains: filters.q } } },
      { car: { model: { contains: filters.q } } },
      { car: { brand: { name: { contains: filters.q } } } },
      { car: { carType: { name: { contains: filters.q } } } },
      { user: { name: { contains: filters.q } } },
      { user: { companyName: { contains: filters.q } } },
    ];
    if (digits) {
      or.push({ code: { contains: digits } });
      or.push({ car: { year: { contains: digits } } });
    }
    and.push({ OR: or });
  }

  const brandId = toBigIntOrNull(filters.brand);
  if (brandId !== null) and.push({ car: { brandId } });

  const carTypeId = toBigIntOrNull(filters.carType);
  if (carTypeId !== null) and.push({ car: { carTypeId } });

  const saleTermId = toBigIntOrNull(filters.saleTerm);
  if (saleTermId !== null) and.push({ saleTerms: { some: { saleTermId, isActive: true } } });

  // Years are stored as 4-digit strings, so lexicographic comparison is safe.
  const yearFrom = normalizeDigits(filters.yearFrom);
  const yearTo = normalizeDigits(filters.yearTo);
  if (/^\d{4}$/.test(yearFrom)) and.push({ car: { year: { gte: yearFrom } } });
  if (/^\d{4}$/.test(yearTo)) and.push({ car: { year: { lte: yearTo } } });

  return and.length > 0 ? { ...PUBLIC_AD_WHERE, AND: and } : { ...PUBLIC_AD_WHERE };
}

function buildOrderBy(sort: SearchSort): Prisma.UserCarOrderByWithRelationInput[] {
  switch (sort) {
    case "oldest":
      return [{ createdAt: "asc" }, { id: "asc" }];
    case "brand":
      return [{ car: { brand: { name: "asc" } } }, { car: { name: "asc" } }, { id: "desc" }];
    case "name":
      return [{ car: { name: "asc" } }, { id: "desc" }];
    case "year_desc":
      return [{ car: { year: "desc" } }, { createdAt: "desc" }, { id: "desc" }];
    case "year_asc":
      return [{ car: { year: "asc" } }, { createdAt: "desc" }, { id: "desc" }];
    case "newest":
    default:
      return [{ createdAt: "desc" }, { id: "desc" }];
  }
}

const searchInclude = {
  user: { select: { id: true, name: true, companyName: true, image: true } },
  car: {
    include: {
      brand: { select: { name: true, image: true } },
      carType: { select: { name: true } },
      carImages: { select: { imageUrl: true }, orderBy: { id: "asc" }, take: 1 },
    },
  },
  saleTerms: {
    where: { isActive: true },
    select: {
      id: true,
      price: true,
      createdAt: true,
      saleTerm: { select: { title: true, isActive: true } },
      priceHistory: { select: { price: true, createdAt: true }, orderBy: [{ createdAt: "asc" }, { id: "asc" }] },
    },
    orderBy: { id: "asc" },
  },
} satisfies Prisma.UserCarInclude;

type SearchAdRow = Prisma.UserCarGetPayload<{ include: typeof searchInclude }>;
type SearchTermRow = SearchAdRow["saleTerms"][number];

function toPricePoint(price: string, at: Date): SearchPricePoint {
  return { price: toPrice(price), at: at.toISOString(), dateLabel: faShortDate.format(at), timeLabel: faTime.format(at) };
}

/**
 * Build the price timeline of a term. The history table is append-only, so
 * consecutive duplicates are collapsed defensively and the live `price` column
 * is appended if (for any reason) the log does not already end with it.
 */
function toSearchSaleTerm(row: SearchTermRow): SearchAdSaleTerm {
  const points: SearchPricePoint[] = [];
  for (const entry of row.priceHistory) {
    const point = toPricePoint(entry.price, entry.createdAt);
    if (points.length === 0 || points[points.length - 1].price !== point.price) points.push(point);
  }
  const current = toPrice(row.price);
  if (points.length === 0) points.push(toPricePoint(row.price, row.createdAt));
  else if (points[points.length - 1].price !== current) points.push({ ...toPricePoint(row.price, new Date()), price: current });

  const previousPrice = points.length >= 2 ? points[points.length - 2].price : null;
  return {
    id: row.id.toString(),
    title: row.saleTerm.title,
    currentPrice: current,
    previousPrice,
    delta: previousPrice === null ? null : current - previousPrice,
    history: points,
  };
}

function toSearchAdRecord(row: SearchAdRow): SearchAdRecord {
  return {
    id: row.id.toString(),
    code: row.code,
    carName: row.car.name,
    carModel: row.car.model,
    carYear: row.car.year,
    carTypeName: row.car.carType.name,
    brandName: row.car.brand.name,
    brandImage: row.car.brand.image,
    imageUrl: row.car.carImages[0]?.imageUrl ?? null,
    userId: row.user.id.toString(),
    userName: publicDisplayName(row.user),
    userIsCompany: hasCompanyName(row.user),
    userImage: row.user.image,
    saleTerms: row.saleTerms.filter((item) => item.saleTerm.isActive).map(toSearchSaleTerm),
    createdAtLabel: faDate.format(row.createdAt),
  };
}

/* ───────────────────────── Loaders ───────────────────────── */

/** Run a customer search over approved ads. */
export async function searchApprovedAds(filters: SearchFilterValues, requestedPage: number): Promise<SearchResult> {
  const where = buildWhere(filters);
  const total = await prisma.userCar.count({ where });

  const pageCount = Math.max(1, Math.ceil(total / SEARCH_PAGE_SIZE));
  const page = Math.min(Math.max(1, requestedPage), pageCount);

  const rows =
    total === 0
      ? []
      : await prisma.userCar.findMany({
          where,
          include: searchInclude,
          orderBy: buildOrderBy(filters.sort),
          skip: (page - 1) * SEARCH_PAGE_SIZE,
          take: SEARCH_PAGE_SIZE,
        });

  return { ads: rows.map(toSearchAdRecord), total, page, pageCount, pageSize: SEARCH_PAGE_SIZE };
}

/**
 * Filter options, restricted to values that actually occur among approved ads
 * so customers never pick a filter that can only return an empty list.
 */
export async function getSearchOptions(): Promise<SearchOptions> {
  const hasPublicAd = { userCars: { some: PUBLIC_AD_WHERE } } satisfies Prisma.CarWhereInput;

  const [brands, carTypes, saleTerms, years] = await Promise.all([
    prisma.brand.findMany({
      where: { cars: { some: hasPublicAd } },
      select: { id: true, name: true, image: true },
      orderBy: { name: "asc" },
    }),
    prisma.carType.findMany({
      where: { cars: { some: hasPublicAd } },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.saleTerm.findMany({
      where: { isActive: true, userCarSaleTerms: { some: { isActive: true, userCar: PUBLIC_AD_WHERE } } },
      select: { id: true, title: true },
      orderBy: { title: "asc" },
    }),
    prisma.car.findMany({
      where: hasPublicAd,
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    }),
  ]);

  return {
    brands: brands.map((brand) => ({ id: brand.id.toString(), name: brand.name, image: brand.image })),
    carTypes: carTypes.map((type) => ({ id: type.id.toString(), name: type.name })),
    saleTerms: saleTerms.map((term) => ({ id: term.id.toString(), name: term.title })),
    years: years.map((car) => car.year).filter((year) => /^\d{4}$/.test(year)),
  };
}

/* ───────────────────────── Sellers ───────────────────────── */

/**
 * Public seller profile (name, avatar, bio, contact details) plus the count of
 * their approved ads. Returns null for unknown or deactivated accounts so the page can 404.
 */
export async function getSellerProfile(idRaw: string): Promise<SellerProfile | null> {
  const id = toBigIntOrNull(idRaw);
  if (id === null) return null;
  const user = await prisma.user.findFirst({
    where: { id, isActive: true },
    select: {
      id: true,
      name: true,
      companyName: true,
      image: true,
      bio: true,
      phone: true,
      tel: true,
      address: true,
      createdAt: true,
      _count: { select: { userCars: { where: PUBLIC_AD_WHERE } } } },
  });
  if (!user) return null;
  return {
    id: user.id.toString(),
    name: publicDisplayName(user),
    isCompany: hasCompanyName(user),
    image: user.image,
    bio: user.bio,
    phone: user.phone,
    tel: user.tel?.trim() || null,
    address: user.address?.trim() || null,
    memberSinceLabel: faDate.format(user.createdAt),
    approvedAdCount: user._count.userCars,
  };
}

/** Every approved, active ad of one seller, newest first (same projection as search). */
export async function listSellerApprovedAds(idRaw: string): Promise<SearchAdRecord[]> {
  const id = toBigIntOrNull(idRaw);
  if (id === null) return [];
  const rows = await prisma.userCar.findMany({
    where: { ...PUBLIC_AD_WHERE, userId: id },
    include: searchInclude,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
  return rows.map(toSearchAdRecord);
}
