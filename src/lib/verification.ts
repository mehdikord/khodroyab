import "server-only";

import type { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { verificationDocumentUrl, type VerificationRecord } from "@/lib/verification-shared";

export * from "@/lib/verification-shared";

export const verificationInclude = {
  documents: { orderBy: { id: "asc" } },
} satisfies Prisma.UserVerificationInclude;

type VerificationRow = Prisma.UserVerificationGetPayload<{ include: typeof verificationInclude }>;

const faDateTime = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function verificationToRecord(row: VerificationRow): VerificationRecord {
  return {
    id: row.id.toString(),
    personType: row.personType,
    identity: {
      fullName: row.fullName,
      nationalCode: row.nationalCode,
      companyName: row.companyName,
      companyNationalId: row.companyNationalId,
    },
    status: row.status,
    rejectReason: row.rejectReason,
    documents: row.documents.map((doc) => ({
      id: doc.id.toString(),
      title: doc.title,
      url: verificationDocumentUrl(doc.id.toString()),
    })),
    submittedAtLabel: faDateTime.format(row.createdAt),
    reviewedAtLabel: row.reviewedAt ? faDateTime.format(row.reviewedAt) : null,
  };
}

/** A user's latest verification submission, or null when they never sent one. */
export async function getUserVerification(userId: bigint): Promise<VerificationRecord | null> {
  const row = await prisma.userVerification.findUnique({ where: { userId }, include: verificationInclude });
  return row ? verificationToRecord(row) : null;
}
