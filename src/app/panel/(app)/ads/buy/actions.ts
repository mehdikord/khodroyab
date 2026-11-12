"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/user-auth";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { AD_CODE_MAX_ATTEMPTS, generateAdCode, isAdCodeCollision } from "@/lib/user-cars";
import { PUBLIC_BUY_AD_WHERE, buyAdInclude, buyAdRowToRecord, getBuyAdOffersState, type BuyAdOffersState, type BuyAdRecord } from "@/lib/buy-ads";
import { parseBuyAdForm, parseOfferPrice, type BuyAdInput } from "@/lib/validation/buy-ads";

const UNAUTHENTICATED_MESSAGE = "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";
const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";
const NOT_COLLABORATOR_MESSAGE = "ثبت آگهی خرید فقط برای کاربران همکار امکان‌پذیر است.";
const NOT_VERIFIED_MESSAGE = "حساب کاربری شما احراز هویت نشده است؛ برای ثبت آگهی خرید ابتدا احراز هویت خود را انجام دهید.";
const NOT_FOUND_MESSAGE = "آگهی خرید یافت نشد";

export type BuyAdActionResult =
  | { ok: true; record: BuyAdRecord }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export type BuyAdSimpleResult = { ok: true } | { ok: false; message: string };

/** Offer actions answer with the refreshed panel, so the list updates without waiting for the next poll. */
export type BuyAdOffersResult = { ok: true; state: BuyAdOffersState } | { ok: false; message: string; state?: BuyAdOffersState };

function parseBigInt(value: string): bigint | null {
  if (!/^\d+$/.test(value)) return null;
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

/** Same gate as sale ads: only verified collaborators publish or change buy ads. */
async function guardRequest(): Promise<{ ok: false; message: string } | { ok: true; userId: bigint }> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  if (!user.collabrate) return { ok: false, message: NOT_COLLABORATOR_MESSAGE };
  if (!user.authenticaed) return { ok: false, message: NOT_VERIFIED_MESSAGE };
  const userId = parseBigInt(user.id);
  if (userId === null) return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  return { ok: true, userId };
}

function revalidateBuyAdPages(id?: bigint) {
  revalidatePath("/panel/ads/buy");
  revalidatePath("/panel/search/buy");
  revalidatePath("/panel/ads");
  if (id !== undefined) revalidatePath(`/panel/ads/buy/${id.toString()}`);
}

/** The referenced car and colour must exist. */
async function validateReferences(data: BuyAdInput): Promise<{ carId: bigint; colorId: bigint } | { fieldErrors: Record<string, string> }> {
  const carId = BigInt(data.carId);
  const colorId = BigInt(data.colorId);
  const [car, color] = await Promise.all([
    prisma.car.findUnique({ where: { id: carId }, select: { id: true } }),
    prisma.color.findUnique({ where: { id: colorId }, select: { id: true } }),
  ]);
  const fieldErrors: Record<string, string> = {};
  if (!car) fieldErrors.carId = "خودرو انتخاب‌شده وجود ندارد";
  if (!color) fieldErrors.colorId = "رنگ انتخاب‌شده وجود ندارد";
  return Object.keys(fieldErrors).length > 0 ? { fieldErrors } : { carId, colorId };
}

/** Create a buy ad. No moderation: it is public as soon as it is saved. */
export async function createBuyAdAction(formData: FormData): Promise<BuyAdActionResult> {
  const guard = await guardRequest();
  if (!guard.ok) return guard;

  const parsed = parseBuyAdForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };

  const refs = await validateReferences(parsed.data);
  if ("fieldErrors" in refs) return { ok: false, message: "خودرو یا رنگ انتخاب‌شده نامعتبر است", fieldErrors: refs.fieldErrors };

  for (let attempt = 1; attempt <= AD_CODE_MAX_ATTEMPTS; attempt += 1) {
    try {
      const created = await prisma.userBuyAd.create({
        data: {
          userId: guard.userId,
          carId: refs.carId,
          colorId: refs.colorId,
          code: generateAdCode(),
          year: parsed.data.year,
          mileage: parsed.data.mileage,
          currency: parsed.data.currency,
          description: parsed.data.description,
          isActive: true,
          biddingOpen: true,
        },
        include: buyAdInclude,
      });
      revalidateBuyAdPages();
      return { ok: true, record: await buyAdRowToRecord(created) };
    } catch (error) {
      if (isAdCodeCollision(error) && attempt < AD_CODE_MAX_ATTEMPTS) continue;
      console.error("[panel:buy-ads:create] failed", error);
      return { ok: false, message: GENERIC_FAILURE_MESSAGE };
    }
  }
  return { ok: false, message: GENERIC_FAILURE_MESSAGE };
}

/** Update one of the signed-in user's own buy ads. */
export async function updateBuyAdAction(idRaw: string, formData: FormData): Promise<BuyAdActionResult> {
  const guard = await guardRequest();
  if (!guard.ok) return guard;

  const id = parseBigInt(idRaw);
  if (id === null) return { ok: false, message: NOT_FOUND_MESSAGE };

  const parsed = parseBuyAdForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };

  // Ownership is part of the lookup, so another user's id simply "does not exist".
  const existing = await prisma.userBuyAd.findFirst({
    where: { id, userId: guard.userId },
    select: { id: true, currency: true, _count: { select: { offers: true } } },
  });
  if (!existing) return { ok: false, message: NOT_FOUND_MESSAGE };
  // Offers are stored in the ad's currency; switching it would misprice them.
  if (existing._count.offers > 0 && existing.currency !== parsed.data.currency) {
    return {
      ok: false,
      message: "این آگهی پیشنهاد قیمت دارد و واحد قیمت آن قابل تغییر نیست",
      fieldErrors: { currency: "پس از دریافت اولین پیشنهاد، واحد قیمت ثابت می‌ماند" },
    };
  }

  const refs = await validateReferences(parsed.data);
  if ("fieldErrors" in refs) return { ok: false, message: "خودرو یا رنگ انتخاب‌شده نامعتبر است", fieldErrors: refs.fieldErrors };

  try {
    const updated = await prisma.userBuyAd.update({
      where: { id },
      data: {
        carId: refs.carId,
        colorId: refs.colorId,
        year: parsed.data.year,
        mileage: parsed.data.mileage,
        currency: parsed.data.currency,
        description: parsed.data.description,
      },
      include: buyAdInclude,
    });
    revalidateBuyAdPages(id);
    return { ok: true, record: await buyAdRowToRecord(updated) };
  } catch (error) {
    console.error("[panel:buy-ads:update] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/** Pause or resume one of the user's own buy ads. Paused ads leave the search. */
export async function setBuyAdActiveAction(idRaw: string, isActive: boolean): Promise<BuyAdSimpleResult> {
  const guard = await guardRequest();
  if (!guard.ok) return guard;

  const id = parseBigInt(idRaw);
  if (id === null) return { ok: false, message: NOT_FOUND_MESSAGE };

  try {
    const { count } = await prisma.userBuyAd.updateMany({ where: { id, userId: guard.userId }, data: { isActive: Boolean(isActive) } });
    if (count === 0) return { ok: false, message: NOT_FOUND_MESSAGE };
    revalidateBuyAdPages(id);
    return { ok: true };
  } catch (error) {
    console.error("[panel:buy-ads:toggle] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/** Permanently delete one of the user's own buy ads. */
export async function deleteBuyAdAction(idRaw: string): Promise<BuyAdSimpleResult> {
  const guard = await guardRequest();
  if (!guard.ok) return guard;

  const id = parseBigInt(idRaw);
  if (id === null) return { ok: false, message: NOT_FOUND_MESSAGE };

  try {
    const { count } = await prisma.userBuyAd.deleteMany({ where: { id, userId: guard.userId } });
    if (count === 0) return { ok: false, message: NOT_FOUND_MESSAGE };
    revalidateBuyAdPages(id);
    return { ok: true };
  } catch (error) {
    console.error("[panel:buy-ads:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/* ───────────────────────── Bidding ───────────────────────── */

const BIDDING_CLOSED_MESSAGE = "قیمت‌دهی این آگهی توسط ثبت‌کننده بسته شده است";

/** Close or reopen bidding on one of the user's own buy ads. Offers are kept either way. */
export async function setBuyAdBiddingAction(idRaw: string, open: boolean): Promise<BuyAdOffersResult> {
  const guard = await guardRequest();
  if (!guard.ok) return guard;

  const id = parseBigInt(idRaw);
  if (id === null) return { ok: false, message: NOT_FOUND_MESSAGE };

  try {
    const { count } = await prisma.userBuyAd.updateMany({ where: { id, userId: guard.userId }, data: { biddingOpen: Boolean(open) } });
    if (count === 0) return { ok: false, message: NOT_FOUND_MESSAGE };
    revalidateBuyAdPages(id);
    const state = await getBuyAdOffersState(idRaw, { id: guard.userId.toString(), isPartner: true });
    return state ? { ok: true, state } : { ok: false, message: NOT_FOUND_MESSAGE };
  } catch (error) {
    console.error("[panel:buy-ads:bidding] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/**
 * Bidding gate shared by sending and withdrawing an offer: the ad must be
 * public with bidding open, and the bidder must not be its owner.
 */
async function findBiddableAd(idRaw: string, userId: bigint): Promise<{ ok: true; id: bigint } | { ok: false; message: string }> {
  const id = parseBigInt(idRaw);
  if (id === null) return { ok: false, message: NOT_FOUND_MESSAGE };
  const ad = await prisma.userBuyAd.findFirst({ where: { id, ...PUBLIC_BUY_AD_WHERE }, select: { userId: true, biddingOpen: true } });
  if (!ad) return { ok: false, message: NOT_FOUND_MESSAGE };
  if (ad.userId === userId) return { ok: false, message: "روی آگهی خرید خودتان نمی‌توانید پیشنهاد قیمت ثبت کنید" };
  if (!ad.biddingOpen) return { ok: false, message: BIDDING_CLOSED_MESSAGE };
  return { ok: true, id };
}

async function offersFailure(idRaw: string, userId: bigint, message: string): Promise<BuyAdOffersResult> {
  const state = await getBuyAdOffersState(idRaw, { id: userId.toString(), isPartner: true }).catch(() => null);
  return state ? { ok: false, message, state } : { ok: false, message };
}

/**
 * Send or change the signed-in collaborator's offer. A bidder has a single
 * offer per ad: changing it updates the same row instead of adding a new one.
 */
export async function submitBuyAdOfferAction(idRaw: string, priceRaw: string): Promise<BuyAdOffersResult> {
  const guard = await guardRequest();
  if (!guard.ok) return guard;

  const ad = await findBiddableAd(idRaw, guard.userId);
  if (!ad.ok) return offersFailure(idRaw, guard.userId, ad.message);

  const parsed = parseOfferPrice(priceRaw);
  if (!parsed.success) return { ok: false, message: parsed.message };

  try {
    await prisma.userBuyAdOffer.upsert({
      where: { buyAdId_userId: { buyAdId: ad.id, userId: guard.userId } },
      create: { buyAdId: ad.id, userId: guard.userId, price: parsed.price },
      update: { price: parsed.price },
    });
  } catch (error) {
    console.error("[panel:buy-ads:offer] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  revalidatePath(`/panel/ads/buy/${ad.id.toString()}`);
  const state = await getBuyAdOffersState(idRaw, { id: guard.userId.toString(), isPartner: true });
  return state ? { ok: true, state } : { ok: false, message: NOT_FOUND_MESSAGE };
}

/** Withdraw the signed-in collaborator's offer while bidding is open. */
export async function withdrawBuyAdOfferAction(idRaw: string): Promise<BuyAdOffersResult> {
  const guard = await guardRequest();
  if (!guard.ok) return guard;

  const ad = await findBiddableAd(idRaw, guard.userId);
  if (!ad.ok) return offersFailure(idRaw, guard.userId, ad.message);

  try {
    await prisma.userBuyAdOffer.deleteMany({ where: { buyAdId: ad.id, userId: guard.userId } });
  } catch (error) {
    console.error("[panel:buy-ads:withdraw] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  revalidatePath(`/panel/ads/buy/${ad.id.toString()}`);
  const state = await getBuyAdOffersState(idRaw, { id: guard.userId.toString(), isPartner: true });
  return state ? { ok: true, state } : { ok: false, message: NOT_FOUND_MESSAGE };
}
