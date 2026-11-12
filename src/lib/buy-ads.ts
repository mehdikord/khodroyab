import "server-only";

import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { activeCodeUserWhere, getActiveUserCodes } from "@/lib/user-codes";
import { normalizeDigits } from "@/lib/validation/admin";
import { PUBLIC_SELLER_WHERE } from "@/lib/panel-search";
import {
  BUY_AD_FILTER_DEFAULTS,
  isBuyAdSort,
  type BuyAdDetailRecord,
  type BuyAdOffer,
  type BuyAdOffersState,
  type BuyAdFilterValues,
  type BuyAdRecord,
  type BuyAdSearchOptions,
  type BuyAdSearchResult,
  type BuyAdSort,
} from "@/lib/buy-ads-shared";

export * from "@/lib/buy-ads-shared";

export const BUY_AD_PAGE_SIZE = 12;

const faDate = new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" });

function toBigIntOrNull(value: string): bigint | null {
  if (!/^\d+$/.test(value)) return null;
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

/** Buy ads other customers may see: active, published by a verified collaborator. */
export const PUBLIC_BUY_AD_WHERE = { isActive: true, user: PUBLIC_SELLER_WHERE } satisfies Prisma.UserBuyAdWhereInput;

export const buyAdInclude = {
  car: {
    include: {
      brand: { select: { name: true, image: true } },
      carType: { select: { name: true } },
      carImages: { select: { imageUrl: true }, orderBy: { id: "asc" }, take: 1 },
    },
  },
  color: { select: { name: true, code: true } },
  _count: { select: { offers: true } },
} satisfies Prisma.UserBuyAdInclude;

type BuyAdRow = Prisma.UserBuyAdGetPayload<{ include: typeof buyAdInclude }>;

/** Current public code of each ad's owner, keyed by user id. */
async function buyerCodesFor(rows: { userId: bigint }[]): Promise<Map<string, string>> {
  const codes = await getActiveUserCodes(rows.map((row) => row.userId));
  return new Map(Array.from(codes, ([userId, value]) => [userId, value.code]));
}

function toBuyAdRecord(row: BuyAdRow, buyerCodes: Map<string, string>): BuyAdRecord {
  return {
    id: row.id.toString(),
    code: row.code,
    carId: row.carId.toString(),
    brandId: row.car.brandId.toString(),
    brandName: row.car.brand.name,
    brandImage: row.car.brand.image,
    carName: row.car.name,
    carModel: row.car.model,
    carTypeName: row.car.carType.name,
    imageUrl: row.car.carImages[0]?.imageUrl ?? null,
    year: row.year,
    mileage: row.mileage,
    colorId: row.colorId.toString(),
    colorName: row.color.name,
    colorCode: row.color.code,
    description: row.description,
    isActive: row.isActive,
    currency: row.currency,
    biddingOpen: row.biddingOpen,
    offerCount: row._count.offers,
    bestOffer: null,
    buyerCode: buyerCodes.get(row.userId.toString()) ?? "",
    createdAtLabel: faDate.format(row.createdAt),
  };
}

/** Map one freshly written row (the owner's own ad) to its record. */
export async function buyAdRowToRecord(row: BuyAdRow): Promise<BuyAdRecord> {
  return toBuyAdRecord(row, await buyerCodesFor([row]));
}

/* ───────────────────────── Owner ───────────────────────── */

/** Every buy ad of one user (active and paused), newest first. */
export async function listMyBuyAds(userId: bigint): Promise<BuyAdRecord[]> {
  const rows = await prisma.userBuyAd.findMany({
    where: { userId },
    include: buyAdInclude,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
  const [codes, best] = await Promise.all([
    buyerCodesFor(rows),
    prisma.userBuyAdOffer.groupBy({ by: ["buyAdId"], where: { buyAd: { userId } }, _min: { price: true } }),
  ]);
  const bestById = new Map(best.map((row) => [row.buyAdId.toString(), row._min.price?.toString() ?? null]));
  return rows.map((row) => ({ ...toBuyAdRecord(row, codes), bestOffer: bestById.get(row.id.toString()) ?? null }));
}

/* ───────────────────────── Search ───────────────────────── */

export function parseBuyAdFilters(searchParams: Record<string, string | string[] | undefined>): BuyAdFilterValues {
  const single = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";
  const sortRaw = single(searchParams.sort);
  return {
    q: single(searchParams.q).trim().slice(0, 100),
    brand: single(searchParams.brand).slice(0, 20),
    carType: single(searchParams.carType).slice(0, 20),
    color: single(searchParams.color).slice(0, 20),
    yearFrom: single(searchParams.yearFrom).slice(0, 4),
    yearTo: single(searchParams.yearTo).slice(0, 4),
    mileageMax: normalizeDigits(single(searchParams.mileageMax)).slice(0, 9),
    sort: isBuyAdSort(sortRaw) ? sortRaw : BUY_AD_FILTER_DEFAULTS.sort,
  };
}

/** Query string of the active filters (without the page), e.g. "?brand=3&sort=oldest". */
export function buyAdFiltersToQuery(filters: BuyAdFilterValues): string {
  const params = new URLSearchParams();
  (Object.keys(BUY_AD_FILTER_DEFAULTS) as (keyof BuyAdFilterValues)[]).forEach((key) => {
    const value = filters[key];
    if (value && value !== BUY_AD_FILTER_DEFAULTS[key]) params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function hasActiveBuyAdFilters(filters: BuyAdFilterValues): boolean {
  return Boolean(filters.q || filters.brand || filters.carType || filters.color || filters.yearFrom || filters.yearTo || filters.mileageMax);
}

function buildWhere(filters: BuyAdFilterValues): Prisma.UserBuyAdWhereInput {
  const and: Prisma.UserBuyAdWhereInput[] = [];

  if (filters.q) {
    const digits = normalizeDigits(filters.q);
    const or: Prisma.UserBuyAdWhereInput[] = [
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
      // A buyer's current public code finds all of their requests.
      if (/^\d{8}$/.test(digits)) or.push({ user: activeCodeUserWhere(digits) });
    }
    and.push({ OR: or });
  }

  const brandId = toBigIntOrNull(filters.brand);
  if (brandId !== null) and.push({ car: { brandId } });

  const carTypeId = toBigIntOrNull(filters.carType);
  if (carTypeId !== null) and.push({ car: { carTypeId } });

  const colorId = toBigIntOrNull(filters.color);
  if (colorId !== null) and.push({ colorId });

  // Years are stored as 4-digit strings, so lexicographic comparison is safe.
  const yearFrom = normalizeDigits(filters.yearFrom);
  const yearTo = normalizeDigits(filters.yearTo);
  if (/^\d{4}$/.test(yearFrom)) and.push({ year: { gte: yearFrom } });
  if (/^\d{4}$/.test(yearTo)) and.push({ year: { lte: yearTo } });

  if (/^\d+$/.test(filters.mileageMax)) and.push({ mileage: { lte: Number(filters.mileageMax) } });

  return and.length > 0 ? { ...PUBLIC_BUY_AD_WHERE, AND: and } : { ...PUBLIC_BUY_AD_WHERE };
}

function buildOrderBy(sort: BuyAdSort): Prisma.UserBuyAdOrderByWithRelationInput[] {
  switch (sort) {
    case "oldest":
      return [{ createdAt: "asc" }, { id: "asc" }];
    case "brand":
      return [{ car: { brand: { name: "asc" } } }, { car: { name: "asc" } }, { id: "desc" }];
    case "name":
      return [{ car: { name: "asc" } }, { id: "desc" }];
    case "year_desc":
      return [{ year: "desc" }, { createdAt: "desc" }, { id: "desc" }];
    case "year_asc":
      return [{ year: "asc" }, { createdAt: "desc" }, { id: "desc" }];
    case "mileage_asc":
      return [{ mileage: "asc" }, { createdAt: "desc" }, { id: "desc" }];
    case "newest":
    default:
      return [{ createdAt: "desc" }, { id: "desc" }];
  }
}

export async function searchBuyAds(filters: BuyAdFilterValues, requestedPage: number): Promise<BuyAdSearchResult> {
  const where = buildWhere(filters);
  const total = await prisma.userBuyAd.count({ where });

  const pageCount = Math.max(1, Math.ceil(total / BUY_AD_PAGE_SIZE));
  const page = Math.min(Math.max(1, requestedPage), pageCount);

  const rows =
    total === 0
      ? []
      : await prisma.userBuyAd.findMany({
          where,
          include: buyAdInclude,
          orderBy: buildOrderBy(filters.sort),
          skip: (page - 1) * BUY_AD_PAGE_SIZE,
          take: BUY_AD_PAGE_SIZE,
        });

  const codes = await buyerCodesFor(rows);
  return { ads: rows.map((row) => toBuyAdRecord(row, codes)), total, page, pageCount, pageSize: BUY_AD_PAGE_SIZE };
}

export function countPublicBuyAds(): Promise<number> {
  return prisma.userBuyAd.count({ where: PUBLIC_BUY_AD_WHERE });
}

/** Filter options limited to values that occur among public buy ads. */
export async function getBuyAdSearchOptions(): Promise<BuyAdSearchOptions> {
  const hasPublicBuyAd = { buyAds: { some: PUBLIC_BUY_AD_WHERE } } satisfies Prisma.CarWhereInput;

  const [brands, carTypes, colors, years] = await Promise.all([
    prisma.brand.findMany({ where: { cars: { some: hasPublicBuyAd } }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.carType.findMany({ where: { cars: { some: hasPublicBuyAd } }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.color.findMany({ where: { buyAds: { some: PUBLIC_BUY_AD_WHERE } }, select: { id: true, name: true, code: true }, orderBy: { name: "asc" } }),
    prisma.userBuyAd.findMany({ where: PUBLIC_BUY_AD_WHERE, select: { year: true }, distinct: ["year"], orderBy: { year: "desc" } }),
  ]);

  return {
    brands: brands.map((brand) => ({ id: brand.id.toString(), name: brand.name })),
    carTypes: carTypes.map((type) => ({ id: type.id.toString(), name: type.name })),
    colors: colors.map((color) => ({ id: color.id.toString(), name: color.name, code: color.code })),
    years: years.map((row) => row.year).filter((year) => /^\d{4}$/.test(year)),
  };
}

/* ───────────────────────── Detail ───────────────────────── */

const buyAdDetailInclude = {
  ...buyAdInclude,
  car: {
    include: {
      brand: { select: { name: true, image: true } },
      carType: { select: { name: true } },
      carImages: { select: { imageUrl: true }, orderBy: { id: "asc" } },
    },
  },
} satisfies Prisma.UserBuyAdInclude;

/**
 * One buy ad for its dedicated page. Other customers only reach public ads;
 * the owner also reaches their own paused ones.
 */
export async function getBuyAdDetail(idRaw: string, viewer: { id: string; isPartner: boolean }): Promise<BuyAdDetailRecord | null> {
  const id = toBigIntOrNull(idRaw);
  const viewerId = toBigIntOrNull(viewer.id);
  if (id === null || viewerId === null) return null;

  const row = await prisma.userBuyAd.findFirst({
    where: { id, OR: [PUBLIC_BUY_AD_WHERE, { userId: viewerId }] },
    include: buyAdDetailInclude,
  });
  if (!row) return null;

  const isOwner = row.userId === viewerId;
  const codes = await buyerCodesFor([row]);
  return {
    ...toBuyAdRecord(row, codes),
    isOwner,
    canEdit: isOwner && viewer.isPartner,
    galleryUrls: row.car.carImages.map((image) => image.imageUrl),
    updatedAtLabel: faDate.format(row.updatedAt),
  };
}

/* ───────────────────────── Form data ───────────────────────── */

/** Catalogue cars for the picker and the form (one car, or all of them). */
export async function listBuyAdCarChoices(carId?: bigint) {
  const cars = await prisma.car.findMany({
    where: carId === undefined ? undefined : { id: carId },
    include: {
      brand: { select: { name: true } },
      carType: { select: { name: true } },
      carImages: { select: { imageUrl: true }, orderBy: { id: "asc" }, take: 1 },
    },
    orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
  });
  return cars.map((car) => ({
    id: car.id.toString(),
    name: car.name,
    model: car.model,
    brandId: car.brandId.toString(),
    brandName: car.brand.name,
    carTypeName: car.carType.name,
    imageUrl: car.carImages[0]?.imageUrl ?? null,
  }));
}

export async function listBuyAdColors() {
  const colors = await prisma.color.findMany({ select: { id: true, name: true, code: true }, orderBy: { name: "asc" } });
  return colors.map((color) => ({ id: color.id.toString(), name: color.name, code: color.code }));
}

/** One of the user's own buy ads, for the edit page. */
export async function getMyBuyAd(idRaw: string, userId: bigint): Promise<BuyAdRecord | null> {
  const id = toBigIntOrNull(idRaw);
  if (id === null) return null;
  const row = await prisma.userBuyAd.findFirst({ where: { id, userId }, include: buyAdInclude });
  return row ? buyAdRowToRecord(row) : null;
}

/* ───────────────────────── Price offers ───────────────────────── */

const faDateTime = new Intl.DateTimeFormat("fa-IR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

/** Who is looking at the offers: their id and whether they are a verified collaborator. */
export interface OfferViewer {
  id: string;
  isPartner: boolean;
}

/**
 * The offers panel of one buy ad for one viewer, or null when the ad is not
 * visible to them. Only verified collaborators and the owner see the offers;
 * only verified collaborators other than the owner may bid, while bidding is
 * open and the ad is public. Lowest price first; equal prices keep the order
 * in which they were set.
 */
export async function getBuyAdOffersState(adIdRaw: string, viewer: OfferViewer): Promise<BuyAdOffersState | null> {
  const id = toBigIntOrNull(adIdRaw);
  const viewerId = toBigIntOrNull(viewer.id);
  if (id === null || viewerId === null) return null;

  const ad = await prisma.userBuyAd.findFirst({
    where: { id, OR: [PUBLIC_BUY_AD_WHERE, { userId: viewerId }] },
    select: { id: true, userId: true, currency: true, biddingOpen: true, isActive: true },
  });
  if (!ad) return null;

  const isOwner = ad.userId === viewerId;
  const canView = isOwner || viewer.isPartner;
  const base = {
    adId: ad.id.toString(),
    currency: ad.currency,
    biddingOpen: ad.biddingOpen,
    isOwner,
    canView,
    canBid: viewer.isPartner && !isOwner && ad.biddingOpen && ad.isActive,
  };
  if (!canView) return { ...base, offers: [], myOffer: null };

  const rows = await prisma.userBuyAdOffer.findMany({
    where: { buyAdId: ad.id },
    select: { id: true, userId: true, price: true, createdAt: true, updatedAt: true },
    orderBy: [{ price: "asc" }, { updatedAt: "asc" }, { id: "asc" }],
  });
  const codes = await getActiveUserCodes(rows.map((row) => row.userId));

  const offers: BuyAdOffer[] = rows.map((row) => ({
    id: row.id.toString(),
    price: row.price.toString(),
    bidderCode: codes.get(row.userId.toString())?.code ?? "",
    isMine: row.userId === viewerId,
    edited: row.updatedAt.getTime() - row.createdAt.getTime() > 1000,
    updatedAtLabel: faDateTime.format(row.updatedAt),
  }));
  const mineIndex = offers.findIndex((offer) => offer.isMine);
  const myOffer = mineIndex === -1 ? null : { id: offers[mineIndex].id, price: offers[mineIndex].price, rank: mineIndex + 1 };

  return { ...base, offers, myOffer };
}
