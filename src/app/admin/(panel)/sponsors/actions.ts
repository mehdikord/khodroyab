"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { sponsorToRecord, type SponsorRecord } from "@/lib/sponsors";
import { slugify } from "@/lib/validation/brands";
import { parseSponsorForm } from "@/lib/validation/sponsors";
import { isManagedUpload, removeUpload, saveUpload } from "@/lib/uploads";

const UNAUTHENTICATED_MESSAGE = "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";
const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";
const NOT_FOUND_MESSAGE = "حامی مورد نظر یافت نشد";

export type SponsorActionResult =
  | { ok: true; record: SponsorRecord }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export type SponsorSimpleActionResult = { ok: true } | { ok: false; message: string };

export type SponsorReorderResult = { ok: true; records: SponsorRecord[] } | { ok: false; message: string };

async function guardRequest(): Promise<{ ok: false; message: string } | null> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  if (!(await getCurrentAdmin())) return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  return null;
}

function parseId(id: string): bigint | null {
  if (!/^\d{1,20}$/.test(id)) return null;
  return BigInt(id);
}

/** The admin list and the customer login page (sponsor strip). */
function revalidateSponsorPages() {
  revalidatePath("/admin/sponsors");
  revalidatePath("/panel");
}

/** Next free display position (end of the list). */
async function nextSortOrder(): Promise<number> {
  const last = await prisma.sponsor.aggregate({ _max: { sortOrder: true } });
  return (last._max.sortOrder ?? 0) + 1;
}

/** Create a sponsor. Fields: name, logo (URL) or logoFile, sortOrder (blank = last), isActive. */
export async function createSponsorAction(formData: FormData): Promise<SponsorActionResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  const parsed = parseSponsorForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };
  if (!parsed.file && !parsed.data.logo) {
    return { ok: false, message: "لوگوی حامی را بارگذاری کنید", fieldErrors: { logoFile: "لوگوی حامی الزامی است" } };
  }

  try {
    const logo = parsed.file ? await saveUpload("sponsors", parsed.file, slugify(parsed.data.name) || "sponsor") : parsed.data.logo;
    const sponsor = await prisma.sponsor.create({
      data: {
        name: parsed.data.name,
        logo,
        isActive: parsed.data.isActive,
        sortOrder: parsed.data.sortOrder ?? (await nextSortOrder()),
      },
    });
    revalidateSponsorPages();
    return { ok: true, record: sponsorToRecord(sponsor) };
  } catch (error) {
    console.error("[sponsors:create] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/** Update a sponsor; a new upload replaces (and deletes) the previous managed logo file. */
export async function updateSponsorAction(id: string, formData: FormData): Promise<SponsorActionResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  const sponsorId = parseId(id);
  if (sponsorId === null) return { ok: false, message: NOT_FOUND_MESSAGE };

  const parsed = parseSponsorForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };
  if (!parsed.file && !parsed.data.logo) {
    return { ok: false, message: "لوگوی حامی را بارگذاری کنید", fieldErrors: { logoFile: "لوگوی حامی الزامی است" } };
  }

  const current = await prisma.sponsor.findUnique({ where: { id: sponsorId }, select: { logo: true, sortOrder: true } });
  if (!current) return { ok: false, message: NOT_FOUND_MESSAGE };

  try {
    const logo = parsed.file ? await saveUpload("sponsors", parsed.file, slugify(parsed.data.name) || "sponsor") : parsed.data.logo;
    const sponsor = await prisma.sponsor.update({
      where: { id: sponsorId },
      data: {
        name: parsed.data.name,
        logo,
        isActive: parsed.data.isActive,
        sortOrder: parsed.data.sortOrder ?? current.sortOrder,
      },
    });
    if (logo !== current.logo && isManagedUpload(current.logo)) await removeUpload(current.logo, "sponsors");
    revalidateSponsorPages();
    return { ok: true, record: sponsorToRecord(sponsor) };
  } catch (error) {
    console.error("[sponsors:update] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/** Flip a sponsor's active state. */
export async function toggleSponsorActiveAction(id: string): Promise<SponsorActionResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  const sponsorId = parseId(id);
  if (sponsorId === null) return { ok: false, message: NOT_FOUND_MESSAGE };

  const current = await prisma.sponsor.findUnique({ where: { id: sponsorId }, select: { isActive: true } });
  if (!current) return { ok: false, message: NOT_FOUND_MESSAGE };

  try {
    const sponsor = await prisma.sponsor.update({ where: { id: sponsorId }, data: { isActive: !current.isActive } });
    revalidateSponsorPages();
    return { ok: true, record: sponsorToRecord(sponsor) };
  } catch (error) {
    console.error("[sponsors:toggle] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/** Delete a sponsor and its uploaded logo file. */
export async function deleteSponsorAction(id: string): Promise<SponsorSimpleActionResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  const sponsorId = parseId(id);
  if (sponsorId === null) return { ok: false, message: NOT_FOUND_MESSAGE };

  const current = await prisma.sponsor.findUnique({ where: { id: sponsorId }, select: { logo: true } });
  if (!current) return { ok: false, message: NOT_FOUND_MESSAGE };

  try {
    await prisma.sponsor.delete({ where: { id: sponsorId } });
  } catch (error) {
    console.error("[sponsors:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  await removeUpload(current.logo, "sponsors");
  revalidateSponsorPages();
  return { ok: true };
}

/**
 * Persist a new display order: `ids` is the full list in the desired order;
 * each sponsor gets `sort_order = position + 1`.
 */
export async function reorderSponsorsAction(ids: string[]): Promise<SponsorReorderResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  if (!Array.isArray(ids) || ids.length > 1000) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const parsedIds = ids.map(parseId);
  if (parsedIds.some((id) => id === null) || new Set(ids).size !== ids.length) {
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  try {
    await prisma.$transaction(
      parsedIds.map((id, index) => prisma.sponsor.updateMany({ where: { id: id! }, data: { sortOrder: index + 1 } }))
    );
    const sponsors = await prisma.sponsor.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] });
    revalidateSponsorPages();
    return { ok: true, records: sponsors.map(sponsorToRecord) };
  } catch (error) {
    console.error("[sponsors:reorder] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
