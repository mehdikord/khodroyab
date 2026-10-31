import "server-only";

import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { removeUpload, saveUpload } from "@/lib/uploads";
import { AD_IMAGE_MAX_COUNT, AD_OPTION_NUMBER_MAX, AD_OPTION_TEXT_MAX, foldNumber } from "@/lib/ad-form-shared";
import { ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE_BYTES } from "@/lib/validation/brands";
import { toPersianDigits } from "@/lib/utils";

/**
 * Sale-ad fields shared by the customer and admin actions: the chosen colour,
 * the values of the global options and the ad's photos.
 */

export interface AdOptionRow {
  optionId: bigint;
  optionItemId?: bigint;
  val?: string;
}

export interface AdImagePlan {
  keptIds: bigint[];
  removedUrls: string[];
  newFiles: File[];
  primary: { kind: "existing"; id: bigint } | { kind: "new"; index: number } | null;
}

export interface StoredAdImages {
  newRows: { imageUrl: string; isPrimary: boolean }[];
  primaryExistingId: bigint | null;
}

type PreparedAdExtras =
  | { ok: true; optionRows: AdOptionRow[]; images: AdImagePlan }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

const INVALID_MESSAGE = "اطلاعات فرم آگهی نامعتبر است؛ موارد مشخص‌شده را بررسی کنید";

function parseJson(value: FormDataEntryValue | null): unknown {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

/* ───────────────────────── options ───────────────────────── */

/** Validate submitted values against the active options; hidden options are left alone. */
async function resolveOptionRows(formData: FormData) {
  const parsed = parseJson(formData.get("optionValues"));
  const submitted = (parsed && typeof parsed === "object" ? parsed : {}) as Record<string, unknown>;

  const options = await prisma.option.findMany({
    where: { isActive: true },
    include: { optionItems: { select: { id: true } } },
  });

  const rows: AdOptionRow[] = [];
  const errors: Record<string, string> = {};

  for (const option of options) {
    const key = option.id.toString();
    const errorKey = `options.${key}`;
    const raw = submitted[key];

    if (option.type === "checkbox") {
      if (raw === true) rows.push({ optionId: option.id, val: "1" });
      continue;
    }

    if (option.type === "select") {
      const chosen = (Array.isArray(raw) ? raw : typeof raw === "string" && raw ? [raw] : []).filter(
        (id): id is string => typeof id === "string"
      );
      const validIds = new Map(option.optionItems.map((item) => [item.id.toString(), item.id]));
      const unique = Array.from(new Set(chosen));
      if (unique.some((id) => !validIds.has(id))) errors[errorKey] = "گزینه انتخاب‌شده معتبر نیست";
      else if (!option.multiple && unique.length > 1) errors[errorKey] = "فقط یک گزینه قابل انتخاب است";
      else if (option.isRequired && unique.length === 0) errors[errorKey] = `انتخاب «${option.name}» الزامی است`;
      else for (const id of unique) rows.push({ optionId: option.id, optionItemId: validIds.get(id) });
      continue;
    }

    const text = typeof raw === "string" ? raw.trim() : "";
    if (!text) {
      if (option.isRequired) errors[errorKey] = `«${option.name}» الزامی است`;
      continue;
    }
    if (option.type === "number") {
      const value = foldNumber(text);
      if (!/^\d+(\.\d+)?$/.test(value) || value.length > AD_OPTION_NUMBER_MAX) errors[errorKey] = `«${option.name}» باید عدد باشد`;
      else rows.push({ optionId: option.id, val: value });
      continue;
    }
    if (text.length > AD_OPTION_TEXT_MAX) errors[errorKey] = `«${option.name}» حداکثر ${toPersianDigits(AD_OPTION_TEXT_MAX)} کاراکتر است`;
    else rows.push({ optionId: option.id, val: text });
  }

  return { rows, errors };
}

/* ───────────────────────── images ───────────────────────── */

/** Work out which photos stay, leave and arrive. Ids from other ads are ignored. */
function planImages(formData: FormData, existing: { id: bigint; imageUrl: string }[]) {
  const keepRaw = parseJson(formData.get("keepImageIds"));
  const keep = new Set(Array.isArray(keepRaw) ? keepRaw.map(String) : []);
  const kept = existing.filter((image) => keep.has(image.id.toString()));
  const removedUrls = existing.filter((image) => !keep.has(image.id.toString())).map((image) => image.imageUrl);
  const newFiles = formData.getAll("newImages").filter((file): file is File => file instanceof File && file.size > 0);

  if (kept.length + newFiles.length > AD_IMAGE_MAX_COUNT) {
    return { error: `حداکثر ${toPersianDigits(AD_IMAGE_MAX_COUNT)} تصویر برای هر آگهی مجاز است` };
  }
  for (const file of newFiles) {
    if (!(ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type)) {
      return { error: "فرمت تصویر معتبر نیست؛ فقط PNG، JPG، WEBP و AVIF پذیرفته می‌شود" };
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return { error: "حجم هر تصویر نباید بیشتر از ۲ مگابایت باشد" };
    }
  }

  let primary: AdImagePlan["primary"] = null;
  const token = formData.get("primaryImage");
  if (typeof token === "string") {
    const [kind, value] = token.split(":");
    if (kind === "existing" && kept.some((image) => image.id.toString() === value)) {
      primary = { kind: "existing", id: BigInt(value) };
    } else if (kind === "new" && /^\d+$/.test(value ?? "") && Number(value) < newFiles.length) {
      primary = { kind: "new", index: Number(value) };
    }
  }
  // Exactly one photo is primary whenever the ad has any.
  if (!primary && kept.length > 0) primary = { kind: "existing", id: kept[0].id };
  if (!primary && newFiles.length > 0) primary = { kind: "new", index: 0 };

  return { plan: { keptIds: kept.map((image) => image.id), removedUrls, newFiles, primary } satisfies AdImagePlan };
}

/** Everything that can fail validation, checked before any file is written. */
export async function prepareAdExtras(
  formData: FormData,
  existingImages: { id: bigint; imageUrl: string }[]
): Promise<PreparedAdExtras> {
  const colorIdRaw = formData.get("colorId");
  const color =
    typeof colorIdRaw === "string" && /^\d+$/.test(colorIdRaw)
      ? await prisma.color.findUnique({ where: { id: BigInt(colorIdRaw) }, select: { id: true } })
      : null;

  const { rows, errors } = await resolveOptionRows(formData);
  if (!color) errors.colorId = "رنگ انتخاب‌شده دیگر وجود ندارد";

  const images = planImages(formData, existingImages);
  if (images.error) errors.images = images.error;

  if (Object.keys(errors).length > 0 || !images.plan) {
    return { ok: false, message: images.error ?? INVALID_MESSAGE, fieldErrors: errors };
  }
  return { ok: true, optionRows: rows, images: images.plan };
}

export async function storeNewAdImages(plan: AdImagePlan): Promise<StoredAdImages> {
  const urls: string[] = [];
  try {
    for (const file of plan.newFiles) urls.push(await saveUpload("ads", file, "ad"));
  } catch (error) {
    await discardAdImageFiles(urls);
    throw error;
  }
  return {
    newRows: urls.map((imageUrl, index) => ({
      imageUrl,
      isPrimary: plan.primary?.kind === "new" && plan.primary.index === index,
    })),
    primaryExistingId: plan.primary?.kind === "existing" ? plan.primary.id : null,
  };
}

export async function discardAdImageFiles(urls: string[]): Promise<void> {
  await Promise.all(urls.map((url) => removeUpload(url, "ads")));
}

/* ───────────────────────── update helpers ───────────────────────── */

export async function syncAdImages(tx: Prisma.TransactionClient, userCarId: bigint, plan: AdImagePlan, stored: StoredAdImages) {
  await tx.userCarImage.deleteMany({ where: { userCarId, id: { notIn: plan.keptIds } } });
  await tx.userCarImage.updateMany({ where: { userCarId }, data: { isPrimary: false } });
  if (stored.primaryExistingId !== null) {
    await tx.userCarImage.update({ where: { id: stored.primaryExistingId }, data: { isPrimary: true } });
  }
  if (stored.newRows.length > 0) {
    await tx.userCarImage.createMany({ data: stored.newRows.map((row) => ({ ...row, userCarId })) });
  }
}

/** Replace the values of active options; values of deactivated options are kept. */
export async function syncAdOptions(tx: Prisma.TransactionClient, userCarId: bigint, rows: AdOptionRow[]) {
  await tx.userCarOption.deleteMany({ where: { userCarId, option: { isActive: true } } });
  if (rows.length > 0) {
    await tx.userCarOption.createMany({ data: rows.map((row) => ({ ...row, userCarId })) });
  }
}
