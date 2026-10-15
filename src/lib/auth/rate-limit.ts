import "server-only";

/**
 * Lightweight in-memory login throttle to slow brute-force attempts.
 *
 * NOTE: this state is per-process. A multi-instance production deployment
 * should back this with a shared store (e.g. Redis). It is sufficient for the
 * single-node local/small deployment targeted in this phase.
 */

interface Bucket {
  failures: number;
  firstFailureAt: number;
  blockedUntil: number;
}

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_FAILURES = 5; // failures before lockout within a window
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout
const MAX_BUCKETS = 5_000;

function prune(now: number): void {
  if (buckets.size <= MAX_BUCKETS) return;
  const stale: string[] = [];
  buckets.forEach((bucket, key) => {
    if (now - bucket.firstFailureAt > WINDOW_MS && now > bucket.blockedUntil) {
      stale.push(key);
    }
  });
  stale.forEach((key) => buckets.delete(key));
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

/** Inspect the throttle state for a key without modifying it. */
export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket) {
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (now < bucket.blockedUntil) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.blockedUntil - now) / 1000),
    };
  }
  // Window expired: reset.
  if (now - bucket.firstFailureAt > WINDOW_MS) {
    buckets.delete(key);
    return { allowed: true, retryAfterSeconds: 0 };
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Record a failed login attempt and lock the key when the threshold is met. */
export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  prune(now);

  const existing = buckets.get(key);
  if (!existing || now - existing.firstFailureAt > WINDOW_MS) {
    buckets.set(key, {
      failures: 1,
      firstFailureAt: now,
      blockedUntil: 0,
    });
    return;
  }

  existing.failures += 1;
  if (existing.failures >= MAX_FAILURES) {
    existing.blockedUntil = now + LOCKOUT_MS;
  }
}

/** Clear the throttle for a key after a successful login. */
export function resetAttempts(key: string): void {
  buckets.delete(key);
}
