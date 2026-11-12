"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { adminActionDenied } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";

const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";
const NOT_FOUND_MESSAGE = "آگهی خرید یافت نشد";

export type AdminBuyAdActionResult = { ok: true } | { ok: false; message: string };

function parseBigInt(value: string): bigint | null {
  if (!/^\d+$/.test(value)) return null;
  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

async function guardRequest(): Promise<{ ok: false; message: string } | null> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const denied = await adminActionDenied("ads");
  if (denied) return { ok: false, message: denied };
  return null;
}

/** Admin pages and every customer page that shows buy ads or their offers. */
function revalidateBuyAdPages(id: bigint) {
  revalidatePath("/admin/buy-ads");
  revalidatePath(`/admin/buy-ads/${id.toString()}`);
  revalidatePath("/panel/ads/buy");
  revalidatePath("/panel/search/buy");
  revalidatePath("/panel/ads");
  revalidatePath(`/panel/ads/buy/${id.toString()}`);
}

async function updateAd(idRaw: string, data: { biddingOpen?: boolean; isActive?: boolean }, tag: string): Promise<AdminBuyAdActionResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  const id = parseBigInt(idRaw);
  if (id === null) return { ok: false, message: NOT_FOUND_MESSAGE };

  try {
    const { count } = await prisma.userBuyAd.updateMany({ where: { id }, data });
    if (count === 0) return { ok: false, message: NOT_FOUND_MESSAGE };
    revalidateBuyAdPages(id);
    return { ok: true };
  } catch (error) {
    console.error(`[admin:buy-ads:${tag}] failed`, error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/** Close or reopen bidding on a buy ad. Existing offers are kept either way. */
export async function setAdminBuyAdBiddingAction(idRaw: string, open: boolean): Promise<AdminBuyAdActionResult> {
  return updateAd(idRaw, { biddingOpen: Boolean(open) }, "bidding");
}

/** Publish or pause a buy ad (a paused ad is hidden from other customers). */
export async function setAdminBuyAdActiveAction(idRaw: string, isActive: boolean): Promise<AdminBuyAdActionResult> {
  return updateAd(idRaw, { isActive: Boolean(isActive) }, "active");
}

/** Delete a buy ad; its offers are removed with it (onDelete: Cascade). */
export async function deleteAdminBuyAdAction(idRaw: string): Promise<AdminBuyAdActionResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  const id = parseBigInt(idRaw);
  if (id === null) return { ok: false, message: NOT_FOUND_MESSAGE };

  try {
    const { count } = await prisma.userBuyAd.deleteMany({ where: { id } });
    if (count === 0) return { ok: false, message: NOT_FOUND_MESSAGE };
    revalidateBuyAdPages(id);
    return { ok: true };
  } catch (error) {
    console.error("[admin:buy-ads:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/** Remove one price offer (e.g. a fake or abusive bid). */
export async function deleteAdminBuyAdOfferAction(adIdRaw: string, offerIdRaw: string): Promise<AdminBuyAdActionResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  const adId = parseBigInt(adIdRaw);
  const offerId = parseBigInt(offerIdRaw);
  if (adId === null || offerId === null) return { ok: false, message: "پیشنهاد قیمت یافت نشد" };

  try {
    const { count } = await prisma.userBuyAdOffer.deleteMany({ where: { id: offerId, buyAdId: adId } });
    if (count === 0) return { ok: false, message: "پیشنهاد قیمت یافت نشد" };
    revalidateBuyAdPages(adId);
    return { ok: true };
  } catch (error) {
    console.error("[admin:buy-ads:offer-delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
