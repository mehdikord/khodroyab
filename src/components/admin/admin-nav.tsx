import { LayoutDashboard, Tag, Car, Users, HandCoins, Megaphone, Table2, UserRoundPlus, Crown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
      },
      {
        // Listed before "users" so it wins the prefix match over "/admin/users".
        key: "users_pending",
        label: "کاربران در انتظار",
        enLabel: "PENDING USERS",
        href: "/admin/users/pending",
        icon: UserRoundPlus,
      },
      {
        key: "users",
        label: "کاربران",
        enLabel: "USERS",
        href: "/admin/users",
        icon: Users,
      },
      {
        key: "subscriptions",
        label: "لیست اشتراک‌ها",
        enLabel: "SUBSCRIPTIONS",
        href: "/admin/subscriptions",
        icon: Crown,
      },
      {
        key: "sale_terms",
        label: "شرایط فروش",
        enLabel: "SALE TERMS",
        href: "/admin/sale-terms",
        icon: HandCoins,
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
      },
      {
        key: "car_management",
        label: "مدیریت خودرو ها",
        enLabel: "CARS",
        icon: Car,
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
            key: "options",
            label: "ویژگی‌ها",
            enLabel: "FEATURES",
            href: "/admin/options",
          },
        ],
      },
      {
        key: "price_table",
        label: "مدیریت جدول قیمت",
        enLabel: "PRICE TABLE",
        href: "/admin/price-table",
        icon: Table2,
      },
    ],
  },
];

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
