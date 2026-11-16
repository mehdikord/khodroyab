import { CarFront, ListOrdered, PhoneCall, Store, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface PanelNavItem {
  key: string;
  label: string;
  /** Short label used inside the bottom dock. */
  shortLabel: string;
  href: string;
  icon: LucideIcon;
  /** Needs an account: for a guest the dock item opens the sign-in screen instead. */
  requiresAccount?: boolean;
}

/**
 * The fixed bottom dock, the same for guests and members, in this order:
 * sellers, price list, used cars (sale-ad search), contact (with the about
 * tab), profile. Collaborators reach "my ads" / "my price list" from the
 * account menu and the price list page.
 */
export const PANEL_NAV_ITEMS: PanelNavItem[] = [
  { key: "sellers", label: "فروشندگان", shortLabel: "فروشندگان", href: "/panel/sellers", icon: Store },
  { key: "price-list", label: "لیست قیمت", shortLabel: "لیست قیمت", href: "/panel/price-list", icon: ListOrdered },
  { key: "search", label: "خودرو کارکرده", shortLabel: "خودرو کارکرده", href: "/panel/search", icon: CarFront },
  { key: "contact", label: "تماس با ما", shortLabel: "تماس با ما", href: "/panel/contact", icon: PhoneCall },
  { key: "profile", label: "پروفایل همکاران", shortLabel: "پروفایل همکاران", href: "/panel/profile", icon: UserRound, requiresAccount: true },
];

const startsWith = (pathname: string, prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);

/** The dock item a page belongs to (highlighted in the dock). */
export function activeDockKey(pathname: string): string | null {
  if (startsWith(pathname, "/panel/sellers")) return "sellers";
  if (startsWith(pathname, "/panel/price-list") || startsWith(pathname, "/panel/price-table")) return "price-list";
  // A public sale ad (/panel/ads/123) belongs to the used-car search; the rest of /panel/ads is "my ads".
  if (startsWith(pathname, "/panel/search") || /^\/panel\/ads\/\d+$/.test(pathname)) return "search";
  if (startsWith(pathname, "/panel/contact") || startsWith(pathname, "/panel/about")) return "contact";
  if (
    pathname === "/panel" ||
    ["/panel/profile", "/panel/requests", "/panel/verification", "/panel/ads"].some((prefix) => startsWith(pathname, prefix))
  ) {
    return "profile";
  }
  return null;
}

const PAGE_TITLES: [prefix: string, title: string][] = [
  ["/panel/dashboard", "داشبورد"],
  ["/panel/sellers", "فروشندگان"],
  ["/panel/price-list", "لیست قیمت"],
  ["/panel/price-table", "لیست قیمت من"],
  ["/panel/search", "خودرو کارکرده"],
  ["/panel/contact", "تماس با ما"],
  ["/panel/about", "درباره خودرویاب"],
  ["/panel/profile", "پروفایل"],
  ["/panel/requests", "درخواست‌های خرید من"],
  ["/panel/verification", "احراز هویت"],
];

/** Title shown in the top bar for a pathname. */
export function panelPageTitle(pathname: string): string {
  if (pathname === "/panel") return "ورود همکاران";
  if (/^\/panel\/ads\/\d+$/.test(pathname)) return "جزئیات آگهی";
  if (startsWith(pathname, "/panel/ads")) return "آگهی‌های من";
  return PAGE_TITLES.find(([prefix]) => startsWith(pathname, prefix))?.[1] ?? "پنل کاربری";
}
