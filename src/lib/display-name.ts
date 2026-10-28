/**
 * Name other customers see for a user: the business name (نام مجموعه) when
 * one is set, otherwise the person's own name. Client-safe.
 */
export function publicDisplayName(user: { name: string; companyName?: string | null }): string {
  return user.companyName?.trim() || user.name;
}

/** True when the public name comes from the business name. */
export function hasCompanyName(user: { companyName?: string | null }): boolean {
  return Boolean(user.companyName?.trim());
}
