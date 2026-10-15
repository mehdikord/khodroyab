import "server-only";

import bcrypt from "bcryptjs";

import { PASSWORD_HASH_ROUNDS } from "@/lib/auth/constants";

/**
 * Hash a plaintext password using bcrypt with an appropriate cost factor.
 * Never store the plaintext value.
 */
export function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, PASSWORD_HASH_ROUNDS);
}

/**
 * Verify a plaintext password against a stored bcrypt hash.
 * bcrypt.compare is timing-safe.
 */
export function verifyPassword(
  plaintext: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}

/**
 * A pre-computed bcrypt hash used to equalize response timing when an
 * administrator cannot be found, mitigating user-enumeration via timing.
 */
export const DUMMY_PASSWORD_HASH =
  "$2a$12$eImiTXuWVxfM37uY4JANjQ.Z2pDu6z1nMQi1oVv0Z8y0m8QjT3K5O";

/**
 * Perform a throwaway password comparison to keep timing consistent for
 * unknown accounts. The result is intentionally ignored.
 */
export async function consumeTiming(plaintext: string): Promise<void> {
  try {
    await bcrypt.compare(plaintext, DUMMY_PASSWORD_HASH);
  } catch {
    // ignore
  }
}
