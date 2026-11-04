"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/user-auth";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { ALLOWED_IMAGE_MIME_TYPES } from "@/lib/validation/brands";
import { normalizeDigits } from "@/lib/validation/admin";
import { isValidCompanyNationalId, isValidNationalCode } from "@/lib/validation/profile";
import { removeVerificationFiles, saveVerificationFile } from "@/lib/verification-files";
import {
  VERIFICATION_DOC_MAX_BYTES,
  VERIFICATION_DOC_MAX_COUNT,
  VERIFICATION_DOC_TITLE_MAX,
  VERIFICATION_IDENTITY_FIELDS,
  getUserVerification,
  isVerificationPersonType,
  verificationInclude,
  verificationToRecord,
  type VerificationIdentity,
  type VerificationPersonType,
  type VerificationRecord,
} from "@/lib/verification";
import { toPersianDigits } from "@/lib/utils";

const UNAUTHENTICATED_MESSAGE = "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";
const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

export type SubmitVerificationResult =
  | { ok: true; record: VerificationRecord }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

/**
 * Submit the signed-in collaborator's identity documents for review.
 *
 * Form fields: `personType` (natural | legal); the identity details of that type
 * (natural: `fullName`, `nationalCode` of the business-license owner; legal:
 * `companyName`, `companyNationalId`, plus `fullName`, `nationalCode` of the CEO);
 * then one `docTitle` and one `docFile` per document, in the same order. Allowed only for collaborators
 * with no submission yet or whose last one was rejected; a resubmission
 * replaces the rejected one (and its files) and resets `authenticaed`.
 */
export async function submitVerificationAction(formData: FormData): Promise<SubmitVerificationResult> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  if (!user.collabrate) return { ok: false, message: "احراز هویت فقط برای کاربران همکار فعال است." };
  const userId = BigInt(user.id);

  const existing = await prisma.userVerification.findUnique({
    where: { userId },
    select: { id: true, status: true, documents: { select: { imageUrl: true } } },
  });
  if (existing?.status === "pending") return { ok: false, message: "مدارک شما در حال بررسی است؛ تا اعلام نتیجه امکان ارسال مجدد وجود ندارد." };
  if (existing?.status === "approved") return { ok: false, message: "احراز هویت شما قبلاً تایید شده است." };

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

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "اطلاعات فرم احراز هویت کامل نیست؛ موارد مشخص‌شده را بررسی کنید", fieldErrors };
  }

  const stored: string[] = [];
  try {
    for (const doc of documents) stored.push(await saveVerificationFile(doc.file));
  } catch (error) {
    console.error("[verification:submit] file upload failed", error);
    await removeVerificationFiles(stored);
    return { ok: false, message: "خطا در ذخیره تصاویر مدارک؛ لطفاً دوباره تلاش کنید." };
  }

  try {
    const created = await prisma.$transaction(async (tx) => {
      if (existing) await tx.userVerification.delete({ where: { id: existing.id } });
      await tx.user.update({ where: { id: userId }, data: { authenticaed: false } });
      return tx.userVerification.create({
        data: {
          userId,
          personType: personType as VerificationPersonType,
          ...identity,
          status: "pending",
          documents: { create: documents.map((doc, index) => ({ title: doc.title, imageUrl: stored[index] })) },
        },
        include: verificationInclude,
      });
    });

    if (existing) await removeVerificationFiles(existing.documents.map((doc) => doc.imageUrl));
    revalidatePath("/panel/verification");
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${user.id}`);
    revalidatePath("/admin/dashboard");
    return { ok: true, record: verificationToRecord(created) };
  } catch (error) {
    console.error("[verification:submit] failed", error);
    await removeVerificationFiles(stored);
    // Another tab may have submitted concurrently (unique user_id); show the stored state.
    const current = await getUserVerification(userId).catch(() => null);
    if (current?.status === "pending") return { ok: true, record: current };
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
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
