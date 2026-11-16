import "server-only";

import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import type { CurrentUser } from "@/lib/auth/user-auth";
import { PUBLIC_AD_WHERE } from "@/lib/panel-search";
import { findUserIdsByAnyCode, getActiveUserCode, getActiveUserCodes } from "@/lib/user-codes";
import { getActiveProvinceIds, getEnabledPriceFields } from "@/lib/system-settings";
import { normalizeDigits } from "@/lib/validation/admin";
import { parseJalaliDate } from "@/lib/jalali";
import { withPriceMarket, type PriceMarket } from "@/lib/price-market";
import {
  priceColumnKey,
  priceFieldsFor,
  withEnabledPrices,
  withVisiblePrices,
} from "@/lib/price-table-shared";
import {
  ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS,
  PURCHASE_REQUEST_SOURCES,
  PURCHASE_REQUEST_STATUSES,
  isAdminPurchaseRequestSort,
  isPurchaseRequestSource,
  isPurchaseRequestStatus,
  type AdminPurchaseRequestCounts,
  type AdminPurchaseRequestDetail,
  type AdminPurchaseRequestFilterOptions,
  type AdminPurchaseRequestFilterValues,
  type AdminPurchaseRequestRecord,
  type AdminPurchaseRequestSort,
  type MyPurchaseRequestRecord,
  type PurchaseRequestAudience,
  type PurchaseRequestPerson,
  type PurchaseRequestPriceLine,
  type PurchaseRequestPriceSnapshot,
  type PurchaseRequestStatus,
  type PurchaseRequestUnseenCounts,
} from "@/lib/purchase-requests-shared";
import type { PurchaseRequestFormInput } from "@/lib/validation/purchase-requests";

export * from "@/lib/purchase-requests-shared";

export const ADMIN_PURCHASE_REQUEST_PAGE_SIZE = 20;

const faDateTime = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Tehran",
});

function toBigIntOrNull(value: string): bigint | null {
  if (!/^\d{1,20}$/.test(value)) return null;
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

function carLabelOf(car: { name: string; model: string; brand: { name: string } }): string {
  return `${car.brand.name} ${car.name} - مدل ${car.model}`;
}

/* ═════════════════════════ Creating (customer panel) ═════════════════════════ */

export type CreatePurchaseRequestResult = { ok: true; id: string } | { ok: false; message: string; fieldErrors?: Record<string, string> };

const MAX_SNAPSHOT_LINES = 40;

/** Resolved target of a request: who sells what, and what the requester saw. */
interface ResolvedTarget {
  source: "sale_ad" | "price_list";
  sellerId: bigint;
  carId: bigint;
  carLabel: string;
  userCarId: bigint | null;
  adCode: string | null;
  year: string | null;
  colorId: bigint | null;
  colorName: string | null;
  currency: "usd" | "rial" | null;
  /** Price list of a price-list request; null for sale ads. */
  market: PriceMarket | null;
  lines: PurchaseRequestPriceLine[];
}

async function resolveSaleAd(adIdRaw: string, showPartner: boolean): Promise<ResolvedTarget | string> {
  const id = toBigIntOrNull(adIdRaw);
  if (id === null) return "آگهی پیدا نشد.";
  const ad = await prisma.userCar.findFirst({
    where: { id, ...PUBLIC_AD_WHERE, user: { ...PUBLIC_AD_WHERE.user, isActive: true } },
    select: {
      id: true,
      userId: true,
      carId: true,
      code: true,
      year: true,
      currency: true,
      colorId: true,
      color: { select: { name: true } },
      car: { select: { name: true, model: true, brand: { select: { name: true } } } },
      saleTerms: {
        where: { isActive: true, saleTerm: { isActive: true } },
        select: { price: true, partnerPrice: true, saleTerm: { select: { title: true } } },
        orderBy: { id: "asc" },
      },
    },
  });
  if (!ad) return "این آگهی دیگر در دسترس نیست.";

  const lines: PurchaseRequestPriceLine[] = [];
  for (const term of ad.saleTerms) {
    if (term.price) lines.push({ label: term.saleTerm.title, price: term.price });
    if (showPartner && term.partnerPrice) lines.push({ label: `${term.saleTerm.title} (همکار)`, price: term.partnerPrice, partner: true });
  }
  return {
    source: "sale_ad",
    sellerId: ad.userId,
    carId: ad.carId,
    carLabel: carLabelOf(ad.car),
    userCarId: ad.id,
    adCode: ad.code,
    year: ad.year,
    colorId: ad.colorId,
    colorName: ad.color?.name ?? null,
    currency: ad.currency,
    market: null,
    lines,
  };
}

async function resolvePriceList(
  carIdRaw: string,
  sellerCode: string,
  tierKey: string,
  market: PriceMarket,
  showPartner: boolean
): Promise<ResolvedTarget | string> {
  const carId = toBigIntOrNull(carIdRaw);
  if (carId === null) return "خودرو پیدا نشد.";
  // Codes rotate; an expired code of the seller still identifies them here.
  const candidates = (await findUserIdsByAnyCode(sellerCode)).map((value) => BigInt(value));
  if (candidates.length === 0) return "فروشنده پیدا نشد؛ صفحه را دوباره باز کنید.";

  const entry = await prisma.userPriceTableEntry.findFirst({
    where: {
      carId,
      market,
      userId: { in: candidates },
      car: { priceTable: true },
      user: { isActive: true, collabrate: true, authenticaed: true },
      prices: { some: {} },
    },
    select: {
      userId: true,
      currency: true,
      car: { select: { name: true, model: true, brand: { select: { name: true } } } },
      prices: {
        select: {
          year: true,
          colorId: true,
          color: { select: { name: true } },
          priceUsd: true,
          clearancePrice: true,
          instantPrice: true,
          partnerPriceUsd: true,
          partnerClearancePrice: true,
          partnerInstantPrice: true,
        },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      },
    },
    orderBy: { updatedAt: "desc" },
  });
  if (!entry) return "این فروشنده دیگر قیمتی برای این خودرو ندارد.";

  const fields = priceFieldsFor(await getEnabledPriceFields());
  const enabledKeys = fields.map((field) => field.key);
  const visible = entry.prices.map((tier) => ({ ...tier, ...withEnabledPrices(withVisiblePrices(tier, showPartner), enabledKeys) }));

  const chosen = visible.find((tier) => priceColumnKey(tier.year, tier.colorId.toString(), entry.currency) === tierKey);
  if (!chosen) return "سال و رنگ انتخاب‌شده دیگر در قیمت‌های این فروشنده نیست؛ صفحه را دوباره باز کنید.";

  const lines: PurchaseRequestPriceLine[] = [];
  for (const field of fields) {
    const price = chosen[field.key];
    if (price) lines.push({ label: field.label, price });
    const partner = chosen[field.partnerKey];
    if (partner) lines.push({ label: `${field.label} (همکار)`, price: partner, partner: true });
  }

  return {
    source: "price_list",
    sellerId: entry.userId,
    carId,
    carLabel: carLabelOf(entry.car),
    userCarId: null,
    adCode: null,
    year: chosen.year,
    colorId: chosen.colorId,
    colorName: chosen.color.name,
    currency: entry.currency,
    market,
    lines: lines.slice(0, MAX_SNAPSHOT_LINES),
  };
}

/**
 * Store a validated purchase request. The seller, car and the prices the
 * requester could see are resolved on the server (never trusted from the
 * browser) and stored as a snapshot. Guests give their name, mobile and city;
 * a signed-in requester's name and mobile come from their profile.
 */
export async function createPurchaseRequest(input: PurchaseRequestFormInput, user: CurrentUser | null): Promise<CreatePurchaseRequestResult> {
  const showPartner = user?.isPartner ?? false;
  const target =
    input.target.source === "sale_ad"
      ? await resolveSaleAd(input.target.adId, showPartner)
      : await resolvePriceList(input.target.carId, input.target.sellerCode, input.target.tierKey, input.target.market, showPartner);
  if (typeof target === "string") return { ok: false, message: target };

  let requesterId: bigint | null = null;
  let name: string;
  let phone: string;
  let requesterCode: string | null = null;
  let provinceId: number | null = null;
  let cityId: number | null = null;

  if (user) {
    requesterId = BigInt(user.id);
    if (requesterId === target.sellerId) {
      return { ok: false, message: target.source === "sale_ad" ? "این آگهی متعلق به خودتان است." : "این قیمت‌ها متعلق به خودتان است." };
    }
    name = user.name;
    phone = user.phone;
    requesterCode = (await getActiveUserCode(requesterId)).code;
  } else {
    const guest = input.guest!;
    const activeProvinces = await getActiveProvinceIds();
    if (activeProvinces && !activeProvinces.includes(guest.provinceId)) {
      return { ok: false, message: "ثبت درخواست برای این استان فعال نیست.", fieldErrors: { provinceId: "استان دیگری انتخاب کنید" } };
    }
    const city = await prisma.city.findFirst({ where: { id: guest.cityId, provinceId: guest.provinceId }, select: { id: true } });
    if (!city) return { ok: false, message: "شهر انتخاب‌شده معتبر نیست.", fieldErrors: { cityId: "شهر را دوباره انتخاب کنید" } };
    name = guest.name;
    phone = guest.phone;
    provinceId = guest.provinceId;
    cityId = guest.cityId;
  }

  const sellerCode = (await getActiveUserCode(target.sellerId)).code;
  const snapshot: PurchaseRequestPriceSnapshot = { lines: target.lines };

  const created = await prisma.purchaseRequest.create({
    data: {
      source: target.source,
      isGuest: !user,
      requesterId,
      name,
      phone,
      requesterCode,
      provinceId,
      cityId,
      description: input.description || null,
      sellerId: target.sellerId,
      sellerCode,
      carId: target.carId,
      carLabel: target.carLabel,
      userCarId: target.userCarId,
      adCode: target.adCode,
      year: target.year,
      colorId: target.colorId,
      colorName: target.colorName,
      currency: target.currency,
      market: target.market,
      priceSnapshot: snapshot as unknown as Prisma.InputJsonValue,
    },
    select: { id: true },
  });
  return { ok: true, id: created.id.toString() };
}

/** The signed-in customer's own requests, newest first. */
export async function listMyPurchaseRequests(userId: bigint): Promise<MyPurchaseRequestRecord[]> {
  const rows = await prisma.purchaseRequest.findMany({
    where: { requesterId: userId },
    select: {
      id: true,
      source: true,
      status: true,
      carLabel: true,
      sellerCode: true,
      adCode: true,
      carId: true,
      userCarId: true,
      year: true,
      colorName: true,
      market: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 200,
  });
  return rows.map((row) => ({
    id: row.id.toString(),
    source: row.source,
    status: row.status,
    carLabel: row.carLabel,
    sellerCode: row.sellerCode,
    adCode: row.adCode,
    href:
      row.source === "sale_ad" && row.userCarId
        ? `/panel/ads/${row.userCarId.toString()}`
        : row.carId
          ? withPriceMarket(`/panel/price-list/${row.carId.toString()}`, row.market ?? "free_zone")
          : null,
    market: row.market,
    year: row.year,
    colorName: row.colorName,
    description: row.description,
    createdAtLabel: faDateTime.format(row.createdAt),
    updatedAtLabel: faDateTime.format(row.updatedAt),
  }));
}

/* ═════════════════════════ Admin ═════════════════════════ */

const personSelect = {
  id: true,
  name: true,
  companyName: true,
  phone: true,
  image: true,
  collabrate: true,
  authenticaed: true,
  isActive: true,
} satisfies Prisma.UserSelect;

type PersonRow = Prisma.UserGetPayload<{ select: typeof personSelect }>;

function toPerson(user: PersonRow, codes: Map<string, { code: string }>): PurchaseRequestPerson {
  return {
    id: user.id.toString(),
    name: user.name,
    companyName: user.companyName,
    phone: user.phone,
    image: user.image,
    code: codes.get(user.id.toString())?.code ?? "",
    isCollaborator: user.collabrate,
    isVerified: user.authenticaed,
    isActive: user.isActive,
  };
}

const recordInclude = {
  seller: { select: personSelect },
  province: { select: { name: true } },
  city: { select: { name: true } },
  color: { select: { code: true } },
  car: { select: { carImages: { select: { imageUrl: true }, orderBy: { id: "asc" }, take: 1 } } },
} satisfies Prisma.PurchaseRequestInclude;

type RecordRow = Prisma.PurchaseRequestGetPayload<{ include: typeof recordInclude }>;

function snapshotLines(value: Prisma.JsonValue | null): PurchaseRequestPriceLine[] {
  const lines = (value as { lines?: unknown } | null)?.lines;
  if (!Array.isArray(lines)) return [];
  return lines.filter(
    (line): line is PurchaseRequestPriceLine =>
      typeof line === "object" && line !== null && typeof line.label === "string" && typeof line.price === "string"
  );
}

function toRecord(row: RecordRow, codes: Map<string, { code: string }>): AdminPurchaseRequestRecord {
  return {
    id: row.id.toString(),
    source: row.source,
    status: row.status,
    isGuest: row.isGuest,
    seen: row.seenAt !== null,
    name: row.name,
    phone: row.phone,
    requesterCode: row.requesterCode,
    provinceName: row.province?.name ?? null,
    cityName: row.city?.name ?? null,
    description: row.description,
    sellerCode: row.sellerCode,
    seller: row.seller ? toPerson(row.seller, codes) : null,
    carId: row.carId?.toString() ?? null,
    carLabel: row.carLabel,
    carImage: row.car?.carImages[0]?.imageUrl ?? null,
    adId: row.userCarId?.toString() ?? null,
    adCode: row.adCode,
    year: row.year,
    colorName: row.colorName,
    colorCode: row.color?.code ?? null,
    currency: row.currency,
    market: row.market,
    priceLines: snapshotLines(row.priceSnapshot),
    hasNote: Boolean(row.adminNote?.trim()),
    createdAt: row.createdAt.toISOString(),
    createdAtLabel: faDateTime.format(row.createdAt),
    updatedAtLabel: faDateTime.format(row.updatedAt),
  };
}

/* ───────────────────────── Filters ───────────────────────── */

type SearchParams = Record<string, string | string[] | undefined>;

export function parseAdminPurchaseRequestFilters(searchParams: SearchParams): AdminPurchaseRequestFilterValues {
  const single = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";
  const id = (value: string) => (/^\d{1,20}$/.test(value) ? value : "");
  const date = (value: string) => (parseJalaliDate(value) ? value.trim() : "");
  const status = single(searchParams.status);
  const source = single(searchParams.source);
  const seen = single(searchParams.seen);
  const sort = single(searchParams.sort);
  return {
    q: single(searchParams.q).trim().slice(0, 100),
    status: isPurchaseRequestStatus(status) ? status : "",
    source: isPurchaseRequestSource(source) ? source : "",
    seen: seen === "0" || seen === "1" ? seen : "",
    brandId: id(single(searchParams.brand)),
    carId: id(single(searchParams.car)),
    sellerId: id(single(searchParams.seller)),
    provinceId: id(single(searchParams.province)),
    cityId: id(single(searchParams.city)),
    from: date(single(searchParams.from)),
    to: date(single(searchParams.to)),
    sort: isAdminPurchaseRequestSort(sort) ? sort : ADMIN_PURCHASE_REQUEST_FILTER_DEFAULTS.sort,
  };
}

function audienceWhere(audience: PurchaseRequestAudience): Prisma.PurchaseRequestWhereInput {
  return { isGuest: audience === "public" };
}

async function buildWhere(audience: PurchaseRequestAudience, filters: AdminPurchaseRequestFilterValues): Promise<Prisma.PurchaseRequestWhereInput> {
  const and: Prisma.PurchaseRequestWhereInput[] = [audienceWhere(audience)];

  if (filters.q) {
    const digits = normalizeDigits(filters.q);
    const or: Prisma.PurchaseRequestWhereInput[] = [
      { name: { contains: filters.q } },
      { carLabel: { contains: filters.q } },
      { colorName: { contains: filters.q } },
      { description: { contains: filters.q } },
      { adminNote: { contains: filters.q } },
      { province: { name: { contains: filters.q } } },
      { city: { name: { contains: filters.q } } },
      { seller: { name: { contains: filters.q } } },
      { seller: { companyName: { contains: filters.q } } },
    ];
    if (digits) {
      or.push({ phone: { contains: digits } });
      or.push({ sellerCode: { contains: digits } });
      or.push({ requesterCode: { contains: digits } });
      or.push({ adCode: { contains: digits } });
      or.push({ year: { contains: digits } });
      or.push({ seller: { phone: { contains: digits } } });
      const requestId = toBigIntOrNull(digits);
      if (requestId !== null) or.push({ id: requestId });
      // Any code a seller or requester ever had (codes rotate).
      const codeUserIds = (await findUserIdsByAnyCode(digits)).map((value) => BigInt(value));
      if (codeUserIds.length > 0) {
        or.push({ sellerId: { in: codeUserIds } });
        or.push({ requesterId: { in: codeUserIds } });
      }
    }
    and.push({ OR: or });
  }

  if (filters.status) and.push({ status: filters.status });
  if (filters.source) and.push({ source: filters.source });
  if (filters.seen) and.push({ seenAt: filters.seen === "1" ? { not: null } : null });

  const carId = toBigIntOrNull(filters.carId);
  const brandId = toBigIntOrNull(filters.brandId);
  if (carId !== null) and.push({ carId });
  else if (brandId !== null) and.push({ car: { brandId } });

  const sellerId = toBigIntOrNull(filters.sellerId);
  if (sellerId !== null) and.push({ sellerId });

  if (audience === "public") {
    const cityId = Number(filters.cityId);
    const provinceId = Number(filters.provinceId);
    if (filters.cityId && Number.isInteger(cityId)) and.push({ cityId });
    else if (filters.provinceId && Number.isInteger(provinceId)) and.push({ provinceId });
  }

  const from = filters.from ? parseJalaliDate(filters.from) : null;
  const to = filters.to ? parseJalaliDate(filters.to) : null;
  if (from) and.push({ createdAt: { gte: from } });
  // Inclusive: up to the end of that day.
  if (to) and.push({ createdAt: { lt: new Date(to.getTime() + 24 * 60 * 60 * 1000) } });

  return { AND: and };
}

function buildOrderBy(sort: AdminPurchaseRequestSort): Prisma.PurchaseRequestOrderByWithRelationInput[] {
  switch (sort) {
    case "oldest":
      return [{ createdAt: "asc" }, { id: "asc" }];
    case "updated":
      return [{ updatedAt: "desc" }, { id: "desc" }];
    case "unseen":
      // NULL sorts first in ascending MySQL order.
      return [{ seenAt: "asc" }, { createdAt: "desc" }, { id: "desc" }];
    case "status":
      return [{ status: "asc" }, { createdAt: "desc" }, { id: "desc" }];
    case "car":
      return [{ carLabel: "asc" }, { createdAt: "desc" }, { id: "desc" }];
    case "seller":
      return [{ sellerCode: "asc" }, { createdAt: "desc" }, { id: "desc" }];
    case "newest":
    default:
      return [{ createdAt: "desc" }, { id: "desc" }];
  }
}

export interface AdminPurchaseRequestPage {
  requests: AdminPurchaseRequestRecord[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
}

export async function listAdminPurchaseRequests(
  audience: PurchaseRequestAudience,
  filters: AdminPurchaseRequestFilterValues,
  requestedPage: number
): Promise<AdminPurchaseRequestPage> {
  const where = await buildWhere(audience, filters);
  const total = await prisma.purchaseRequest.count({ where });
  const pageSize = ADMIN_PURCHASE_REQUEST_PAGE_SIZE;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, requestedPage), pageCount);
  const rows = await prisma.purchaseRequest.findMany({
    where,
    include: recordInclude,
    orderBy: buildOrderBy(filters.sort),
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
  const codes = await getActiveUserCodes(rows.flatMap((row) => (row.sellerId ? [row.sellerId] : [])));
  return { requests: rows.map((row) => toRecord(row, codes)), total, page, pageCount, pageSize };
}

export async function getAdminPurchaseRequestCounts(audience: PurchaseRequestAudience): Promise<AdminPurchaseRequestCounts> {
  const where = audienceWhere(audience);
  const [total, unseen, byStatus, bySource] = await Promise.all([
    prisma.purchaseRequest.count({ where }),
    prisma.purchaseRequest.count({ where: { ...where, seenAt: null } }),
    prisma.purchaseRequest.groupBy({ by: ["status"], where, _count: { _all: true } }),
    prisma.purchaseRequest.groupBy({ by: ["source"], where, _count: { _all: true } }),
  ]);
  return {
    total,
    unseen,
    byStatus: Object.fromEntries(
      PURCHASE_REQUEST_STATUSES.map((status) => [status, byStatus.find((row) => row.status === status)?._count._all ?? 0])
    ) as AdminPurchaseRequestCounts["byStatus"],
    bySource: Object.fromEntries(
      PURCHASE_REQUEST_SOURCES.map((source) => [source, bySource.find((row) => row.source === source)?._count._all ?? 0])
    ) as AdminPurchaseRequestCounts["bySource"],
  };
}

/** Options for the filter selects: only brands, cars, sellers and places that appear in this list. */
export async function getAdminPurchaseRequestFilterOptions(audience: PurchaseRequestAudience): Promise<AdminPurchaseRequestFilterOptions> {
  const where = audienceWhere(audience);
  const [carGroups, sellerGroups, cityGroups] = await Promise.all([
    prisma.purchaseRequest.groupBy({ by: ["carId"], where: { ...where, carId: { not: null } }, _count: { _all: true } }),
    prisma.purchaseRequest.groupBy({ by: ["sellerId"], where: { ...where, sellerId: { not: null } }, _count: { _all: true } }),
    audience === "public"
      ? prisma.purchaseRequest.groupBy({ by: ["provinceId", "cityId"], where: { ...where, cityId: { not: null } }, _count: { _all: true } })
      : Promise.resolve([]),
  ]);

  const [cars, sellers, cities] = await Promise.all([
    prisma.car.findMany({
      where: { id: { in: carGroups.map((group) => group.carId!) } },
      select: { id: true, name: true, model: true, brandId: true, brand: { select: { name: true } } },
    }),
    prisma.user.findMany({
      where: { id: { in: sellerGroups.map((group) => group.sellerId!) } },
      select: { id: true, name: true, companyName: true, phone: true },
    }),
    prisma.city.findMany({
      where: { id: { in: cityGroups.map((group) => group.cityId!) } },
      select: { id: true, name: true, province: { select: { id: true, name: true } } },
    }),
  ]);

  const collator = new Intl.Collator("fa");
  const countOf = <T,>(groups: (T & { _count: { _all: number } })[], match: (group: T) => boolean) =>
    groups.filter(match).reduce((sum, group) => sum + group._count._all, 0);

  const brands = new Map<string, { id: string; name: string; count: number }>();
  for (const car of cars) {
    const key = car.brandId.toString();
    const count = countOf(carGroups, (group) => group.carId === car.id);
    const current = brands.get(key);
    if (current) current.count += count;
    else brands.set(key, { id: key, name: car.brand.name, count });
  }

  const provinces = new Map<string, { id: string; name: string; cities: { id: string; name: string }[] }>();
  for (const city of cities) {
    const key = String(city.province.id);
    const entry = provinces.get(key) ?? { id: key, name: city.province.name, cities: [] };
    entry.cities.push({ id: String(city.id), name: city.name });
    provinces.set(key, entry);
  }

  return {
    brands: Array.from(brands.values())
      .sort((a, b) => collator.compare(a.name, b.name))
      .map((brand) => ({ id: brand.id, name: brand.name, description: String(brand.count) })),
    cars: cars
      .map((car) => ({
        id: car.id.toString(),
        name: `${car.brand.name} ${car.name}`,
        brandId: car.brandId.toString(),
        description: `مدل ${car.model} · ${countOf(carGroups, (group) => group.carId === car.id)} درخواست`,
      }))
      .sort((a, b) => collator.compare(a.name, b.name)),
    sellers: sellers
      .map((seller) => ({
        id: seller.id.toString(),
        name: seller.companyName || seller.name,
        description: `${seller.phone} · ${countOf(sellerGroups, (group) => group.sellerId === seller.id)} درخواست`,
      }))
      .sort((a, b) => collator.compare(a.name, b.name)),
    provinces: Array.from(provinces.values())
      .map((province) => ({ ...province, cities: province.cities.sort((a, b) => collator.compare(a.name, b.name)) }))
      .sort((a, b) => collator.compare(a.name, b.name)),
  };
}

/** Unseen requests of each list, for the sidebar badges. */
export async function countUnseenPurchaseRequests(): Promise<PurchaseRequestUnseenCounts> {
  try {
    const groups = await prisma.purchaseRequest.groupBy({ by: ["isGuest"], where: { seenAt: null }, _count: { _all: true } });
    return {
      public: groups.find((group) => group.isGuest)?._count._all ?? 0,
      members: groups.find((group) => !group.isGuest)?._count._all ?? 0,
    };
  } catch (error) {
    // Rendered by the admin layout on every page: a failure here (e.g. the
    // migration not applied yet) must never take the whole panel down.
    console.error("[purchase-requests:unseen] failed", error);
    return { public: 0, members: 0 };
  }
}

/**
 * One request with everything the admin needs. Opening it marks it as seen;
 * `justSeen` tells whether this call did (so the sidebar badge can refresh).
 */
export async function getAdminPurchaseRequestDetail(
  idRaw: string
): Promise<{ request: AdminPurchaseRequestDetail; justSeen: boolean } | null> {
  const id = toBigIntOrNull(idRaw);
  if (id === null) return null;

  const existing = await prisma.purchaseRequest.findUnique({ where: { id }, select: { seenAt: true } });
  if (!existing) return null;
  let justSeen = false;
  if (!existing.seenAt) {
    // `updateMany` with the null guard keeps the first viewer's time when two admins open it at once.
    const marked = await prisma.purchaseRequest.updateMany({ where: { id, seenAt: null }, data: { seenAt: new Date() } });
    justSeen = marked.count > 0;
  }

  const row = await prisma.purchaseRequest.findUnique({
    where: { id },
    include: {
      ...recordInclude,
      requester: { select: { ...personSelect, address: true, email: true } },
      statusLogs: { orderBy: [{ createdAt: "desc" }, { id: "desc" }] },
    },
  });
  if (!row) return null;

  const codes = await getActiveUserCodes([row.sellerId, row.requesterId].filter((value): value is bigint => value !== null));
  const request: AdminPurchaseRequestDetail = {
    ...toRecord(row, codes),
    requester: row.requester ? { ...toPerson(row.requester, codes), address: row.requester.address, email: row.requester.email } : null,
    adminNote: row.adminNote ?? "",
    seenAtLabel: row.seenAt ? faDateTime.format(row.seenAt) : null,
    logs: row.statusLogs.map((log) => ({
      id: log.id.toString(),
      fromStatus: log.fromStatus,
      toStatus: log.toStatus,
      adminName: log.adminName,
      createdAtLabel: faDateTime.format(log.createdAt),
    })),
  };
  return { request, justSeen };
}

/** Change a request's status and log who did it. No-op (ok) when unchanged. */
export async function setPurchaseRequestStatus(
  idRaw: string,
  status: PurchaseRequestStatus,
  admin: { id: string; name: string }
): Promise<{ ok: true; isGuest: boolean } | { ok: false; message: string }> {
  const id = toBigIntOrNull(idRaw);
  if (id === null) return { ok: false, message: "درخواست پیدا نشد" };
  const current = await prisma.purchaseRequest.findUnique({ where: { id }, select: { status: true, isGuest: true } });
  if (!current) return { ok: false, message: "درخواست پیدا نشد" };
  if (current.status === status) return { ok: true, isGuest: current.isGuest };

  await prisma.$transaction([
    prisma.purchaseRequest.update({ where: { id }, data: { status } }),
    prisma.purchaseRequest.updateMany({ where: { id, seenAt: null }, data: { seenAt: new Date() } }),
    prisma.purchaseRequestStatusLog.create({
      data: { requestId: id, fromStatus: current.status, toStatus: status, adminId: BigInt(admin.id), adminName: admin.name },
    }),
  ]);
  return { ok: true, isGuest: current.isGuest };
}

export async function savePurchaseRequestNote(idRaw: string, note: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const id = toBigIntOrNull(idRaw);
  if (id === null) return { ok: false, message: "درخواست پیدا نشد" };
  const result = await prisma.purchaseRequest.updateMany({ where: { id }, data: { adminNote: note || null } });
  return result.count > 0 ? { ok: true } : { ok: false, message: "درخواست پیدا نشد" };
}
