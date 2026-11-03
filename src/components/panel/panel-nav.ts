import { LayoutDashboard, ListOrdered, Megaphone, Search, Table2, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface PanelNavItem {
  key: string;
  label: string;
  /** Short label used inside the bottom dock. */
  shortLabel: string;
  href: string;
  icon: LucideIcon;
  /** Marks the primary action of the panel (visually emphasised in the dock). */
  primary?: boolean;
  /** Only collaborators (کاربران همکار) see this item: publishing ads and a price table. */
  collaboratorOnly?: boolean;
}

/** Main navigation of the customer panel; rendered as the fixed bottom dock. */
export const PANEL_NAV_ITEMS: PanelNavItem[] = [
  { key: "dashboard", label: "داشبورد", shortLabel: "داشبورد", href: "/panel/dashboard", icon: LayoutDashboard },
  { key: "search", label: "جستجوی خودرو", shortLabel: "جستجو", href: "/panel/search", icon: Search, primary: true },
  { key: "ads", label: "آگهی‌های من", shortLabel: "آگهی‌ها", href: "/panel/ads", icon: Megaphone, collaboratorOnly: true },
  { key: "price-list", label: "لیست قیمت", shortLabel: "لیست قیمت", href: "/panel/price-list", icon: ListOrdered },
  { key: "price-table", label: "جدول من", shortLabel: "جدول من", href: "/panel/price-table", icon: Table2, collaboratorOnly: true },
  { key: "profile", label: "پروفایل", shortLabel: "پروفایل", href: "/panel/profile", icon: UserRound },
];

/** The dock items a user sees: non-collaborators cannot publish, so their publishing items are hidden. */
export function panelNavItemsFor(collabrate: boolean): PanelNavItem[] {
  return collabrate ? PANEL_NAV_ITEMS : PANEL_NAV_ITEMS.filter((item) => !item.collaboratorOnly);
}

/** Resolve the active nav item for a pathname. */
export function findActivePanelItem(pathname: string): PanelNavItem | undefined {
  // Seller profiles are reached from the search, so the dock keeps "search" lit.
  if (pathname.startsWith("/panel/sellers/")) return PANEL_NAV_ITEMS.find((item) => item.key === "search");
  return PANEL_NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}
