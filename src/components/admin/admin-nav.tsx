import { LayoutDashboard, Tag, Car, Users, HandCoins, Megaphone, Table2, Crown, HeartHandshake, MapPinned, ShieldCheck, KeyRound, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { USER_DIRECTORY_ACCESS, canAccess, type AccessRequirement, type AdminAccess } from "@/lib/auth/permissions";

export interface AdminSubNavItem {
  key: string;
  label: string;
  enLabel?: string;
  href: string;
  icon?: LucideIcon;
}

export interface AdminNavItem {
  key: string;
  label: string;
  enLabel: string;
  href?: string;
  icon: LucideIcon;
  /** Who sees the item; mirrors the page guard (`requireAdminAccess`). */
  requirement: AccessRequirement;
  children?: AdminSubNavItem[];
}

export interface AdminNavGroup {
  key: string;
  label: string;
  items: AdminNavItem[];
}

export interface ActiveNavInfo {
  label: string;
  enLabel: string;
  href?: string;
}

/**
 * Admin navigation definition.
 */
export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    key: "overview",
    label: "نمای کلی",
    items: [
      {
        key: "dashboard",
        label: "داشبورد",
        enLabel: "DASHBOARD",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        requirement: "any",
      },
      {
        key: "users",
        label: "کاربران",
        enLabel: "USERS",
        href: "/admin/users",
        icon: Users,
        requirement: USER_DIRECTORY_ACCESS,
      },
      {
        key: "subscriptions",
        label: "لیست اشتراک‌ها",
        enLabel: "SUBSCRIPTIONS",
        href: "/admin/subscriptions",
        icon: Crown,
        requirement: "root",
      },
      {
        key: "sale_terms",
        label: "شرایط فروش",
        enLabel: "SALE TERMS",
        href: "/admin/sale-terms",
        icon: HandCoins,
        requirement: "ads",
      },
      {
        key: "sponsors",
        label: "حامیان",
        enLabel: "SPONSORS",
        href: "/admin/sponsors",
        icon: HeartHandshake,
        requirement: "sponsors",
      },
      {
        key: "branches",
        label: "مدیریت شعبه‌ها",
        enLabel: "BRANCHES",
        href: "/admin/branches",
        icon: MapPinned,
        requirement: "branches",
      },
    ],
  },
  {
    key: "ads",
    label: "آگهی‌ها",
    items: [
      {
        key: "ads_management",
        label: "مدیریت آگهی‌ها",
        enLabel: "ADS",
        icon: Megaphone,
        requirement: "ads",
        children: [
          {
            // Listed first so it wins the prefix match over "/admin/ads".
            key: "ads_pending",
            label: "در انتظار تایید",
            enLabel: "PENDING",
            href: "/admin/ads/pending",
          },
          {
            key: "ads_all",
            label: "همه آگهی‌ها",
            enLabel: "ALL ADS",
            href: "/admin/ads",
          },
        ],
      },
    ],
  },
  {
    key: "catalog",
    label: "کاتالوگ",
    items: [
      {
        key: "brands",
        label: "برندها",
        enLabel: "BRANDS",
        href: "/admin/brands",
        icon: Tag,
        requirement: "cars",
      },
      {
        key: "car_management",
        label: "مدیریت خودرو ها",
        enLabel: "CARS",
        icon: Car,
        requirement: "cars",
        children: [
          {
            key: "cars",
            label: "خودروها",
            enLabel: "CARS",
            href: "/admin/cars",
          },
          {
            key: "car_types",
            label: "انواع خودرو",
            enLabel: "CAR TYPES",
            href: "/admin/car-types",
          },
          {
            key: "colors",
            label: "رنگ‌ها",
            enLabel: "COLORS",
            href: "/admin/colors",
          },
          {
            key: "car_form",
            label: "فرم ثبت خودرو",
            enLabel: "CAR FORM",
            href: "/admin/car-form",
          },
        ],
      },
      {
        key: "price_table",
        label: "مدیریت جدول قیمت",
        enLabel: "PRICE TABLE",
        href: "/admin/price-table",
        icon: Table2,
        requirement: "price_table",
      },
    ],
  },
  {
    key: "system",
    label: "مدیریت سیستم",
    items: [
      {
        key: "admins",
        label: "مدیران",
        enLabel: "ADMINS",
        href: "/admin/admins",
        icon: ShieldCheck,
        requirement: "root",
      },
      {
        key: "roles",
        label: "نقش‌ها و دسترسی‌ها",
        enLabel: "ROLES",
        href: "/admin/roles",
        icon: KeyRound,
        requirement: "root",
      },
      {
        key: "settings",
        label: "تنظیمات سیستم",
        enLabel: "SETTINGS",
        href: "/admin/settings",
        icon: Settings,
        requirement: "root",
      },
    ],
  },
];

/** The nav groups this admin may see; empty groups are dropped. */
export function getVisibleNavGroups(access: AdminAccess): AdminNavGroup[] {
  return ADMIN_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => canAccess(access, item.requirement)),
  })).filter((group) => group.items.length > 0);
}

/** Resolve the active nav item for a given pathname. */
export function findActiveNavItem(pathname: string): ActiveNavInfo | undefined {
  for (const group of ADMIN_NAV_GROUPS) {
    for (const item of group.items) {
      if (item.children) {
        for (const child of item.children) {
          if (
            pathname === child.href ||
            pathname.startsWith(`${child.href}/`)
          ) {
            return {
              label: child.label,
              enLabel: child.enLabel || item.enLabel,
              href: child.href,
            };
          }
        }
      }
      if (
        item.href &&
        (pathname === item.href || pathname.startsWith(`${item.href}/`))
      ) {
        return {
          label: item.label,
          enLabel: item.enLabel,
          href: item.href,
        };
      }
    }
  }
  return undefined;
}
