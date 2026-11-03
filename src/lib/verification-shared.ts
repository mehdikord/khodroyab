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
