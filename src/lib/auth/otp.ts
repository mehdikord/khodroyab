import "server-only";

import crypto from "node:crypto";

import prisma from "@/lib/prisma";

/**
 * One-time SMS sign-in codes (OTP) for the customer panel.
 *
 * Only an HMAC of the code is stored. A code lives for `OTP_TTL_SECONDS`, may
 * be guessed at most `OTP_MAX_ATTEMPTS` times and is consumed on success.
 *
 * NOTE: no SMS gateway is connected yet, so every code is the fixed
 * `OTP_PLACEHOLDER_CODE` (123456). Once a provider is available, replace
 * `generateOtpCode` with a random code and implement `deliverOtpSms`.
 */

export const OTP_LENGTH = 6;
/** Lifetime of a code. */
export const OTP_TTL_SECONDS = 120;
/** Minimum delay before another code may be requested for the same number. */
export const OTP_RESEND_SECONDS = 60;
/** Wrong guesses allowed before the code is burned. */
export const OTP_MAX_ATTEMPTS = 5;
/** Codes one number may request per hour. */
const OTP_MAX_PER_HOUR = 8;

/** Fixed code used until an SMS panel is connected. */
const OTP_PLACEHOLDER_CODE = "123456";
/** True while no SMS gateway is connected and every code is the placeholder. */
export const OTP_IS_PLACEHOLDER = true;

function generateOtpCode(): string {
  return OTP_PLACEHOLDER_CODE;
}

/** Send the code by SMS. Stub until an SMS provider is connected. */
async function deliverOtpSms(phone: string, code: string): Promise<void> {
  void phone;
  void code;
}

function hashOtp(phone: string, code: string): string {
  const secret = process.env.AUTH_SECRET ?? "";
  return crypto.createHmac("sha256", secret).update(`${phone}:${code}`).digest("hex");
}

export type RequestOtpResult =
  | { ok: true; resendInSeconds: number; expiresInSeconds: number }
  | { ok: false; reason: "cooldown" | "too_many"; retryAfterSeconds: number };

/** Create (and send) a new code for `phone`, invalidating any earlier unused one. */
export async function requestOtp(phone: string): Promise<RequestOtpResult> {
  const now = Date.now();

  const recent = await prisma.userOtp.findMany({
    where: { phone, createdAt: { gte: new Date(now - 60 * 60 * 1000) } },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  if (recent.length > 0) {
    const sinceLast = Math.floor((now - recent[0].createdAt.getTime()) / 1000);
    if (sinceLast < OTP_RESEND_SECONDS) {
      return { ok: false, reason: "cooldown", retryAfterSeconds: OTP_RESEND_SECONDS - sinceLast };
    }
  }
  if (recent.length >= OTP_MAX_PER_HOUR) {
    const oldest = recent[recent.length - 1].createdAt.getTime();
    return { ok: false, reason: "too_many", retryAfterSeconds: Math.max(60, Math.ceil((oldest + 60 * 60 * 1000 - now) / 1000)) };
  }

  const code = generateOtpCode();
  await prisma.$transaction([
    // Only the latest code is valid.
    prisma.userOtp.updateMany({ where: { phone, consumedAt: null }, data: { consumedAt: new Date(now) } }),
    prisma.userOtp.create({
      data: { phone, codeHash: hashOtp(phone, code), expiresAt: new Date(now + OTP_TTL_SECONDS * 1000) },
    }),
  ]);

  await deliverOtpSms(phone, code);
  return { ok: true, resendInSeconds: OTP_RESEND_SECONDS, expiresInSeconds: OTP_TTL_SECONDS };
}

export type VerifyOtpResult = { ok: true } | { ok: false; reason: "invalid" | "expired" | "locked" };

/**
 * Check `code` against the latest unused code of `phone`. With `consume`
 * (the default) a correct code is used up; pass `false` to only validate it
 * (e.g. before asking a new user for their name).
 */
export async function verifyOtp(phone: string, code: string, { consume = true } = {}): Promise<VerifyOtpResult> {
  const otp = await prisma.userOtp.findFirst({
    where: { phone, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });
  if (!otp) return { ok: false, reason: "expired" };
  if (otp.expiresAt.getTime() < Date.now()) return { ok: false, reason: "expired" };
  if (otp.attempts >= OTP_MAX_ATTEMPTS) return { ok: false, reason: "locked" };

  const expected = Buffer.from(otp.codeHash, "hex");
  const actual = Buffer.from(hashOtp(phone, code), "hex");
  const valid = expected.length === actual.length && crypto.timingSafeEqual(expected, actual);

  if (!valid) {
    const attempts = otp.attempts + 1;
    await prisma.userOtp.update({ where: { id: otp.id }, data: { attempts } });
    return { ok: false, reason: attempts >= OTP_MAX_ATTEMPTS ? "locked" : "invalid" };
  }

  if (consume) {
    // Conditional update so two concurrent requests cannot both use the code.
    const used = await prisma.userOtp.updateMany({ where: { id: otp.id, consumedAt: null }, data: { consumedAt: new Date() } });
    if (used.count === 0) return { ok: false, reason: "expired" };
  }
  return { ok: true };
}
