import "server-only";

import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { activeCodeUserWhere, getActiveUserCodes } from "@/lib/user-codes";
import { normalizeDigits } from "@/lib/validation/admin";
import { adOptionsToDisplay, userCarImagesOrder, userCarOptionsInclude } from "@/lib/user-cars";

import {
  type AdDetailRecord,
  type SearchAdRecord,
  type SearchAdSaleTerm,
  type SearchPricePoint,
  type SearchFilterValues,
  type SearchOption,
  type SearchOptions,
  type SearchResult,
  type SearchSort,
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

/** Sellers whose content is public: collaborators with a verified identity. */
const PUBLIC_SELLER_WHERE = { collabrate: true, authenticaed: true } satisfies Prisma.UserWhereInput;

/** Only approved, active ads of verified collaborators are ever visible to customers. */
const PUBLIC_AD_WHERE = { status: "approved", isActive: true, user: PUBLIC_SELLER_WHERE } satisfies Prisma.UserCarWhereInput;

function buildWhere(filters: SearchFilterValues): Prisma.UserCarWhereInput {
  const and: Prisma.UserCarWhereInput[] = [];

  if (filters.q) {
    const digits = normalizeDigits(filters.q);
    const or: Prisma.UserCarWhereInput[] = [
      { car: { name: { contains: filters.q } } },
      { car: { model: { contains: filters.q } } },
      { car: { brand: { name: { contains: filters.q } } } },
      { car: { carType: { name: { contains: filters.q } } } },
      { color: { name: { contains: filters.q } } },
    ];
    if (digits) {
      or.push({ code: { contains: digits } });
      or.push({ year: { contains: digits } });
      // A seller's current (not expired) public code finds all of their ads.
      if (/^\d{8}$/.test(digits)) or.push({ user: activeCodeUserWhere(digits) });
    }
    and.push({ OR: or });
  }

  const brandId = toBigIntOrNull(filters.brand);
  if (brandId !== null) and.push({ car: { brandId } });

  const carTypeId = toBigIntOrNull(filters.carType);
  if (carTypeId !== null) and.push({ car: { carTypeId } });

  const saleTermId = toBigIntOrNull(filters.saleTerm);
  if (saleTermId !== null) and.push({ saleTerms: { some: { saleTermId, isActive: true } } });

  const colorId = toBigIntOrNull(filters.color);
  if (colorId !== null) and.push({ colorId });

  // Years are stored as 4-digit strings, so lexicographic comparison is safe.
  const yearFrom = normalizeDigits(filters.yearFrom);
  const yearTo = normalizeDigits(filters.yearTo);
  if (/^\d{4}$/.test(yearFrom)) and.push({ year: { gte: yearFrom } });
  if (/^\d{4}$/.test(yearTo)) and.push({ year: { lte: yearTo } });

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
      return [{ year: "desc" }, { createdAt: "desc" }, { id: "desc" }];
    case "year_asc":
      return [{ year: "asc" }, { createdAt: "desc" }, { id: "desc" }];
    case "newest":
    default:
      return [{ createdAt: "desc" }, { id: "desc" }];
  }
}

const searchInclude = {
  car: {
    include: {
      brand: { select: { name: true, image: true } },
      carType: { select: { name: true } },
      carImages: { select: { imageUrl: true }, orderBy: { id: "asc" }, take: 1 },
    },
  },
  color: { select: { name: true, code: true } },
  images: { select: { imageUrl: true }, orderBy: userCarImagesOrder, take: 1 },
  saleTerms: {
    where: { isActive: true },
    select: {
      id: true,
      price: true,
      partnerPrice: true,
      sale: true,
      perecentage: true,
      description: true,
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
 * The timeline tracks the public price only. The collaborator price is
 * included only when `showPartner` is set, so it never reaches other viewers.
 */
function toSearchSaleTerm(row: SearchTermRow, showPartner: boolean): SearchAdSaleTerm {
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
    partnerPrice: showPartner && row.partnerPrice ? toPrice(row.partnerPrice) : null,
    previousPrice,
    delta: previousPrice === null ? null : current - previousPrice,
    history: points,
  };
}

/** Current public code of each ad's seller, keyed by user id. */
async function sellerCodesFor(rows: { userId: bigint }[]): Promise<Map<string, string>> {
  const codes = await getActiveUserCodes(rows.map((row) => row.userId));
  return new Map(Array.from(codes, ([userId, value]) => [userId, value.code]));
}

function toSearchAdRecord(row: SearchAdRow, showPartner: boolean, sellerCodes: Map<string, string>): SearchAdRecord {
  return {
    id: row.id.toString(),
    code: row.code,
    carName: row.car.name,
    carModel: row.car.model,
    carYear: row.year,
    colorName: row.color?.name ?? null,
    colorCode: row.color?.code ?? null,
    carTypeName: row.car.carType.name,
    brandName: row.car.brand.name,
    brandImage: row.car.brand.image,
    imageUrl: row.images[0]?.imageUrl ?? row.car.carImages[0]?.imageUrl ?? null,
    sellerCode: sellerCodes.get(row.userId.toString()) ?? "",
    saleTerms: row.saleTerms.filter((item) => item.saleTerm.isActive).map((term) => toSearchSaleTerm(term, showPartner)),
    createdAtLabel: faDate.format(row.createdAt),
  };
}

/* ───────────────────────── Loaders ───────────────────────── */

/** Run a customer search over approved ads. `showPartner`: the viewer is a verified collaborator. */
export async function searchApprovedAds(filters: SearchFilterValues, requestedPage: number, showPartner: boolean): Promise<SearchResult> {
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

  const sellerCodes = await sellerCodesFor(rows);
  return { ads: rows.map((row) => toSearchAdRecord(row, showPartner, sellerCodes)), total, page, pageCount, pageSize: SEARCH_PAGE_SIZE };
}

/**
 * Filter options, restricted to values that actually occur among approved ads
 * so customers never pick a filter that can only return an empty list.
 */
export async function getSearchOptions(): Promise<SearchOptions> {
  const hasPublicAd = { userCars: { some: PUBLIC_AD_WHERE } } satisfies Prisma.CarWhereInput;

  const [brands, carTypes, saleTerms, colors, years] = await Promise.all([
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
    prisma.color.findMany({
      where: { userCars: { some: PUBLIC_AD_WHERE } },
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    }),
    prisma.userCar.findMany({
      where: PUBLIC_AD_WHERE,
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    }),
  ]);

  return {
    brands: brands.map((brand) => ({ id: brand.id.toString(), name: brand.name, image: brand.image })),
    carTypes: carTypes.map((type) => ({ id: type.id.toString(), name: type.name })),
    saleTerms: saleTerms.map((term) => ({ id: term.id.toString(), name: term.title })),
    colors: colors.map((color) => ({ id: color.id.toString(), name: color.name, code: color.code })),
    years: years.map((ad) => ad.year).filter((year) => /^\d{4}$/.test(year)),
  };
}

const adDetailInclude = {
  ...searchInclude,
  car: {
    include: {
      brand: { select: { name: true, image: true } },
      carType: { select: { name: true } },
      carImages: { select: { imageUrl: true }, orderBy: { id: "asc" } },
    },
  },
  images: { select: { imageUrl: true }, orderBy: userCarImagesOrder },
  options: userCarOptionsInclude,
} satisfies Prisma.UserCarInclude;

/** Who is looking at an ad: their id and whether they are a verified collaborator. */
export interface AdViewer {
  id: string;
  isPartner: boolean;
}

/**
 * One ad for its dedicated page. Other customers only reach approved, active
 * ads; the owner also reaches their own pending, rejected or deactivated ones.
 * Collaborator prices are shown to verified collaborators and to the owner.
 */
export async function getAdDetail(idRaw: string, adViewer: AdViewer): Promise<AdDetailRecord | null> {
  const id = toBigIntOrNull(idRaw);
  const viewer = toBigIntOrNull(adViewer.id);
  if (id === null || viewer === null) return null;

  const row = await prisma.userCar.findFirst({
    where: { id, OR: [PUBLIC_AD_WHERE, { userId: viewer }] },
    include: adDetailInclude,
  });
  if (!row) return null;

  const ownPhotos = row.images.map((image) => image.imageUrl);
  const liveTerms = row.saleTerms.filter((term) => term.saleTerm.isActive);
  const isOwner = row.userId === viewer;
  const showPartner = adViewer.isPartner || isOwner;
  const sellerCodes = await sellerCodesFor([row]);

  return {
    ...toSearchAdRecord(row, showPartner, sellerCodes),
    status: row.status,
    isActive: row.isActive,
    isOwner,
    // Editing is publishing: only a verified collaborator may edit their own ad.
    canEdit: isOwner && adViewer.isPartner,
    showPartnerPrices: showPartner,
    qautity: row.qautity,
    description: row.description,
    galleryUrls: ownPhotos.length > 0 ? ownPhotos : row.car.carImages.map((image) => image.imageUrl),
    galleryIsCatalogue: ownPhotos.length === 0,
    options: adOptionsToDisplay(row.options),
    saleTerms: liveTerms.map((term) => ({
      ...toSearchSaleTerm(term, showPartner),
      sale: term.sale,
      perecentage: term.perecentage,
      description: term.description,
    })),
  };
}
