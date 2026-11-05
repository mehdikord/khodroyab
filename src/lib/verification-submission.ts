import "server-only";

import prisma from "@/lib/prisma";
import { ALLOWED_IMAGE_MIME_TYPES } from "@/lib/validation/brands";
import { normalizeDigits } from "@/lib/validation/admin";
import { isValidCompanyNationalId, isValidNationalCode } from "@/lib/validation/profile";
import { removeVerificationFiles, saveVerificationFile } from "@/lib/verification-files";
import {
  VERIFICATION_DOC_MAX_BYTES,
  VERIFICATION_DOC_MAX_COUNT,
  VERIFICATION_DOC_TITLE_MAX,
  VERIFICATION_IDENTITY_FIELDS,
  isVerificationPersonType,
  verificationInclude,
  verificationToRecord,
  type VerificationIdentity,
  type VerificationPersonType,
  type VerificationRecord,
} from "@/lib/verification";
import { toPersianDigits } from "@/lib/utils";

/**
 * Shared parsing and storage of an identity-verification submission, used both
 * by the collaborator (panel) and by an administrator filling it in on the
 * user's behalf.
 *
 * Form fields: `personType` (natural | legal); the identity details of that type
 * (natural: `fullName`, `nationalCode` of the business-license owner; legal:
 * `companyName`, `companyNationalId`, plus `fullName`, `nationalCode` of the CEO);
 * then one `docTitle` and one `docFile` per document, in the same order.
 */

export interface ParsedVerificationSubmission {
  personType: VerificationPersonType;
  identity: VerificationIdentity;
  documents: { title: string; file: File }[];
}

export type ParseVerificationResult =
  | { ok: true; submission: ParsedVerificationSubmission }
  | { ok: false; message: string; fieldErrors: Record<string, string> };

export function parseVerificationForm(formData: FormData): ParseVerificationResult {
  const fieldErrors: Record<string, string> = {};
  const personType = formData.get("personType");
  if (!isVerificationPersonType(personType)) fieldErrors.personType = "نوع کاربری (حقیقی یا حقوقی) را انتخاب کنید";

  const identity: VerificationIdentity = { fullName: null, nationalCode: null, companyName: null, companyNationalId: null };
  if (isVerificationPersonType(personType)) Object.assign(identity, readIdentity(formData, personType, fieldErrors));

  const titles = formData.getAll("docTitle").map((value) => (typeof value === "string" ? value.trim() : ""));
  const files = formData.getAll("docFile");
  if (titles.length === 0) {
    fieldErrors.documents = "حداقل یک مدرک ارسال کنید";
  } else if (titles.length > VERIFICATION_DOC_MAX_COUNT) {
    fieldErrors.documents = `حداکثر ${toPersianDigits(VERIFICATION_DOC_MAX_COUNT)} مدرک قابل ارسال است`;
  } else if (files.length !== titles.length) {
    fieldErrors.documents = "اطلاعات مدارک ناقص است؛ صفحه را به‌روزرسانی کنید";
  }

  const documents: { title: string; file: File }[] = [];
  if (!fieldErrors.documents) {
    titles.forEach((title, index) => {
      const file = files[index];
      if (!title) fieldErrors[`documents.${index}.title`] = "عنوان مدرک را وارد کنید";
      else if (title.length > VERIFICATION_DOC_TITLE_MAX) {
        fieldErrors[`documents.${index}.title`] = `عنوان حداکثر ${toPersianDigits(VERIFICATION_DOC_TITLE_MAX)} کاراکتر است`;
      }
      if (!(file instanceof File) || file.size === 0) fieldErrors[`documents.${index}.file`] = "تصویر مدرک را انتخاب کنید";
      else if (!(ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type)) {
        fieldErrors[`documents.${index}.file`] = "فقط تصویر PNG، JPG، WEBP یا AVIF پذیرفته می‌شود";
      } else if (file.size > VERIFICATION_DOC_MAX_BYTES) {
        fieldErrors[`documents.${index}.file`] = "حجم هر تصویر نباید بیشتر از ۳ مگابایت باشد";
      } else documents.push({ title, file });
    });
  }

  if (Object.keys(fieldErrors).length > 0 || !isVerificationPersonType(personType)) {
    return { ok: false, message: "اطلاعات فرم احراز هویت کامل نیست؛ موارد مشخص‌شده را بررسی کنید", fieldErrors };
  }
  return { ok: true, submission: { personType, identity, documents } };
}

export type StoreVerificationResult =
  | { ok: true; record: VerificationRecord }
  | { ok: false; reason: "upload" | "database" };

/**
 * Save the document files and replace the user's submission (and its files)
 * with the new one. `approve` stores it as already approved (an administrator
 * filling the form in for the user); otherwise it waits for review. The user's
 * `authenticaed` flag mirrors the resulting status.
 */
export async function storeVerificationSubmission(
  userId: bigint,
  submission: ParsedVerificationSubmission,
  { approve = false }: { approve?: boolean } = {}
): Promise<StoreVerificationResult> {
  const stored: string[] = [];
  try {
    for (const doc of submission.documents) stored.push(await saveVerificationFile(doc.file));
  } catch (error) {
    console.error("[verification:store] file upload failed", error);
    await removeVerificationFiles(stored);
    return { ok: false, reason: "upload" };
  }

  try {
    const { created, oldFiles } = await prisma.$transaction(async (tx) => {
      const existing = await tx.userVerification.findUnique({
        where: { userId },
        select: { id: true, documents: { select: { imageUrl: true } } },
      });
      if (existing) await tx.userVerification.delete({ where: { id: existing.id } });
      await tx.user.update({ where: { id: userId }, data: { authenticaed: approve } });
      const row = await tx.userVerification.create({
        data: {
          userId,
          personType: submission.personType,
          ...submission.identity,
          status: approve ? "approved" : "pending",
          reviewedAt: approve ? new Date() : null,
          documents: {
            create: submission.documents.map((doc, index) => ({ title: doc.title, imageUrl: stored[index] })),
          },
        },
        include: verificationInclude,
      });
      return { created: row, oldFiles: existing?.documents.map((doc) => doc.imageUrl) ?? [] };
    });

    await removeVerificationFiles(oldFiles);
    return { ok: true, record: verificationToRecord(created) };
  } catch (error) {
    console.error("[verification:store] failed", error);
    await removeVerificationFiles(stored);
    return { ok: false, reason: "database" };
  }
}

/**
 * Read and validate the identity details that belong to `personType`; fields of
 * the other type are ignored (stored as null). Errors go into `fieldErrors`.
 */
function readIdentity(
  formData: FormData,
  personType: VerificationPersonType,
  fieldErrors: Record<string, string>
): Partial<VerificationIdentity> {
  const result: Partial<VerificationIdentity> = {};
  for (const field of VERIFICATION_IDENTITY_FIELDS[personType]) {
    const raw = formData.get(field.key);
    const text = typeof raw === "string" ? raw.trim().replace(/\s+/g, " ") : "";
    const value = field.numeric ? normalizeDigits(text) : text;

    if (!value) {
      fieldErrors[field.key] = `${field.label} را وارد کنید`;
      continue;
    }
    if (field.key === "nationalCode" && !isValidNationalCode(value)) {
      fieldErrors[field.key] = `${field.label} معتبر نیست (۱۰ رقم)`;
    } else if (field.key === "companyNationalId" && !isValidCompanyNationalId(value)) {
      fieldErrors[field.key] = `${field.label} معتبر نیست (۱۱ رقم)`;
    } else if (!field.numeric && value.length < 2) {
      fieldErrors[field.key] = `${field.label} باید حداقل ۲ کاراکتر باشد`;
    } else if (value.length > field.maxLength) {
      fieldErrors[field.key] = `${field.label} حداکثر ${toPersianDigits(field.maxLength)} کاراکتر است`;
    }
    result[field.key] = value;
  }
  return result;
}
