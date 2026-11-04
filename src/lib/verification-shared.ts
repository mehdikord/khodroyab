/** Client-safe constants and types for collaborators' identity verification (احراز هویت). */

export const VERIFICATION_PERSON_TYPES = ["natural", "legal"] as const;
export type VerificationPersonType = (typeof VERIFICATION_PERSON_TYPES)[number];

export const VERIFICATION_PERSON_TYPE_LABELS: Record<VerificationPersonType, string> = {
  natural: "حقیقی",
  legal: "حقوقی",
};

export function isVerificationPersonType(value: unknown): value is VerificationPersonType {
  return typeof value === "string" && (VERIFICATION_PERSON_TYPES as readonly string[]).includes(value);
}

/** Identity details entered with a submission (which ones apply depends on the person type). */
export type VerificationIdentityField = "fullName" | "nationalCode" | "companyName" | "companyNationalId";

export type VerificationIdentity = Record<VerificationIdentityField, string | null>;

/** Fields of each person type, in form order, with their labels. */
export const VERIFICATION_IDENTITY_FIELDS: Record<
  VerificationPersonType,
  { key: VerificationIdentityField; label: string; placeholder: string; numeric?: boolean; maxLength: number }[]
> = {
  natural: [
    { key: "fullName", label: "نام و نام خانوادگی صاحب جواز کسب", placeholder: "مثلاً: علی محمدی", maxLength: 120 },
    { key: "nationalCode", label: "کد ملی صاحب جواز کسب", placeholder: "۱۰ رقم", numeric: true, maxLength: 10 },
  ],
  legal: [
    { key: "companyName", label: "نام شرکت یا مجموعه", placeholder: "مثلاً: شرکت بازرگانی خودرو یاب", maxLength: 255 },
    { key: "companyNationalId", label: "شناسه ملی شرکت", placeholder: "۱۱ رقم", numeric: true, maxLength: 11 },
    { key: "fullName", label: "نام و نام خانوادگی مدیر عامل", placeholder: "مثلاً: علی محمدی", maxLength: 120 },
    { key: "nationalCode", label: "کد ملی مدیر عامل", placeholder: "۱۰ رقم", numeric: true, maxLength: 10 },
  ],
};

/** Guidance shown above the document uploads for each person type. */
export const VERIFICATION_DOC_HINTS: Record<VerificationPersonType, string> = {
  natural: "تصویر کارت ملی صاحب جواز کسب و تصویر جواز کسب را حتما ارسال کنید.",
  legal: "تصویر کارت ملی مدیر عامل را حتما ارسال کنید.",
};

export const VERIFICATION_DOC_TITLE_PLACEHOLDERS: Record<VerificationPersonType, string> = {
  natural: "مثلاً: کارت ملی صاحب جواز، جواز کسب",
  legal: "مثلاً: کارت ملی مدیر عامل، روزنامه رسمی",
};

export type VerificationStatus = "pending" | "approved" | "rejected";

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  pending: "در انتظار بررسی",
  approved: "تایید شده",
  rejected: "رد شده",
};

/** Most documents one submission may carry. */
export const VERIFICATION_DOC_MAX_COUNT = 8;
/** Largest accepted document image (8 × 3 MB stays under the server-action body limit). */
export const VERIFICATION_DOC_MAX_BYTES = 3 * 1024 * 1024;
export const VERIFICATION_DOC_TITLE_MAX = 120;
export const VERIFICATION_REJECT_REASON_MAX = 1000;

/** One identity document as shown to its owner and to the admin. */
export interface VerificationDocumentRecord {
  id: string;
  title: string;
  /** Protected URL: only the owner and administrators can open it. */
  url: string;
}

/** A user's latest verification submission. */
export interface VerificationRecord {
  id: string;
  personType: VerificationPersonType;
  /** Identity details; null on submissions sent before these fields existed. */
  identity: VerificationIdentity;
  status: VerificationStatus;
  rejectReason: string | null;
  documents: VerificationDocumentRecord[];
  /** Pre-formatted Persian dates (server-side, avoids hydration drift). */
  submittedAtLabel: string;
  reviewedAtLabel: string | null;
}

export function verificationDocumentUrl(documentId: string): string {
  return `/api/verification-documents/${documentId}`;
}
