import { LayoutDashboard, Megaphone, Search, Table2, UserRound } from "lucide-react";
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
}

/** Main navigation of the customer panel; rendered as the fixed bottom dock. */
export const PANEL_NAV_ITEMS: PanelNavItem[] = [
  { key: "dashboard", label: "داشبورد", shortLabel: "داشبورد", href: "/panel/dashboard", icon: LayoutDashboard },
  { key: "search", label: "جستجوی خودرو", shortLabel: "جستجو", href: "/panel/search", icon: Search, primary: true },
  { key: "ads", label: "آگهی‌های من", shortLabel: "آگهی‌ها", href: "/panel/ads", icon: Megaphone },
  { key: "price-table", label: "جدول قیمت", shortLabel: "جدول قیمت", href: "/panel/price-table", icon: Table2 },
  { key: "profile", label: "پروفایل", shortLabel: "پروفایل", href: "/panel/profile", icon: UserRound },
];

/** Resolve the active nav item for a pathname. */
export function findActivePanelItem(pathname: string): PanelNavItem | undefined {
  // Seller profiles are reached from the search, so the dock keeps "search" lit.
  if (pathname.startsWith("/panel/sellers/")) return PANEL_NAV_ITEMS.find((item) => item.key === "search");
  return PANEL_NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}
