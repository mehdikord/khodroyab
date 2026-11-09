import "server-only";

import { randomInt } from "crypto";
import { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { getSystemSettings } from "@/lib/system-settings";

/**
 * Rotating public user codes (`user_codes`).
 *
 * Each user has at most one *active* code at a time (`expires_at` in the
 * future). Rotation is lazy: no background job runs; whenever a user's code
 * is needed and none is active, a fresh one is generated with the interval
 * from the system settings. Old rows are kept as history, so the admin can
 * still find a user by an expired code. Codes are unique across all history.
 */

export interface ActiveUserCode {
  code: string;
  expiresAt: Date;
}

const MAX_ATTEMPTS = 5;

/** A random 8-digit code that never starts with 0. */
function randomCode(): string {
  return String(randomInt(10_000_000, 100_000_000));
}

function isUniqueViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

/** The newest active code of each user in `userIds` (users without one are absent). */
async function findActiveCodes(userIds: bigint[], now: Date): Promise<Map<string, ActiveUserCode>> {
  const rows = await prisma.userCode.findMany({
    where: { userId: { in: userIds }, expiresAt: { gt: now } },
    select: { userId: true, code: true, expiresAt: true },
    orderBy: [{ expiresAt: "desc" }, { id: "desc" }],
  });
  const result = new Map<string, ActiveUserCode>();
  for (const row of rows) {
    const key = row.userId.toString();
    if (!result.has(key)) result.set(key, { code: row.code, expiresAt: row.expiresAt });
  }
  return result;
}

/** Insert one new code per user, retrying with fresh codes on a (rare) collision. */
async function createCodes(userIds: bigint[], now: Date): Promise<void> {
  const { userCodeRotationMinutes } = await getSystemSettings();
  const expiresAt = new Date(now.getTime() + userCodeRotationMinutes * 60_000);

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const candidates = new Set<string>();
    while (candidates.size < userIds.length) candidates.add(randomCode());
    const codes = Array.from(candidates);

    const taken = await prisma.userCode.findMany({ where: { code: { in: codes } }, select: { code: true } });
    if (taken.length > 0) continue;

    try {
      await prisma.userCode.createMany({
        data: userIds.map((userId, index) => ({ userId, code: codes[index], createdAt: now, expiresAt })),
      });
      return;
    } catch (error) {
      if (!isUniqueViolation(error)) throw error;
    }
  }
  throw new Error("[user-codes] could not generate unique codes");
}

/**
 * The active code of every given user, generating new codes for those whose
 * code has expired (or who never had one). Keyed by the user id as a string.
 */
export async function getActiveUserCodes(userIds: Iterable<bigint>): Promise<Map<string, ActiveUserCode>> {
  const unique = Array.from(new Map(Array.from(userIds, (id) => [id.toString(), id])).values());
  if (unique.length === 0) return new Map();

  const now = new Date();
  const active = await findActiveCodes(unique, now);
  const missing = unique.filter((id) => !active.has(id.toString()));
  if (missing.length === 0) return active;

  await createCodes(missing, now);
  // Re-read so concurrent requests agree on the same (newest) code.
  const created = await findActiveCodes(missing, now);
  created.forEach((value, key) => active.set(key, value));
  return active;
}

/** The active code of one user (generated when needed). */
export async function getActiveUserCode(userId: bigint): Promise<ActiveUserCode> {
  const codes = await getActiveUserCodes([userId]);
  const code = codes.get(userId.toString());
  if (!code) throw new Error("[user-codes] missing code after generation");
  return code;
}

/** Ids of users that ever had this exact code (active or expired). */
export async function findUserIdsByAnyCode(code: string): Promise<string[]> {
  if (!/^\d{8}$/.test(code)) return [];
  const rows = await prisma.userCode.findMany({ where: { code }, select: { userId: true } });
  return Array.from(new Set(rows.map((row) => row.userId.toString())));
}

/** Prisma filter: the user's *active* code is exactly `code`. */
export function activeCodeUserWhere(code: string, now = new Date()): Prisma.UserWhereInput {
  return { codes: { some: { code, expiresAt: { gt: now } } } };
}

/**
 * Apply a new rotation interval to the codes that are active right now, so a
 * shorter (or longer) interval takes effect immediately instead of after the
 * current codes run out. Codes whose new expiry is already past rotate on
 * their next use.
 */
export async function applyRotationToActiveCodes(minutes: number): Promise<void> {
  const now = new Date();
  await prisma.$executeRaw`UPDATE user_codes SET expires_at = DATE_ADD(created_at, INTERVAL ${minutes} MINUTE) WHERE expires_at > ${now}`;
}
