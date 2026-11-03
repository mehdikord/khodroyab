/** Client-safe helpers for the admin users table. */

/** Quick filters of the users table (also accepted as `?filter=` in the URL). */
export const USER_FILTERS = ["all", "collaborators", "review", "regular"] as const;
export type UserFilter = (typeof USER_FILTERS)[number];

export function isUserFilter(value: unknown): value is UserFilter {
  return typeof value === "string" && (USER_FILTERS as readonly string[]).includes(value);
}
