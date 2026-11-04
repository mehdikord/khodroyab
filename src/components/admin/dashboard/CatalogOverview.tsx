import React from "react";
import Link from "next/link";
import { Car, HandCoins, Images, Layers3, SlidersHorizontal, Tag } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { DashboardData } from "@/lib/dashboard";
import { hasPermission, type AdminAccess, type AdminPermission } from "@/lib/auth/permissions";
import { formatPersianNumber } from "@/lib/utils";

interface CatalogOverviewProps {
  catalog: DashboardData["catalog"];
  access: AdminAccess;
}

interface CatalogItem {
  key: string;
  /** Section that owns the link; hidden from admins without it. */
  permission: AdminPermission;
  label: string;
  value: number;
  hint: string;
  href: string;
  icon: LucideIcon;
}

/** Compact grid of catalogue entities with a one-line health hint each. */
export function CatalogOverview({ catalog, access }: CatalogOverviewProps) {
  const allItems: CatalogItem[] = [
    {
      key: "brands",
      permission: "cars",
      label: "برندها",
      value: catalog.brands,
      hint: `${formatPersianNumber(catalog.activeBrands)} فعال`,
      href: "/admin/brands",
      icon: Tag,
    },
    {
      key: "car-types",
      permission: "cars",
      label: "انواع خودرو",
      value: catalog.carTypes,
      hint: "دسته‌بندی بدنه",
      href: "/admin/car-types",
      icon: Layers3,
    },
    {
      key: "cars",
      permission: "cars",
      label: "خودروها",
      value: catalog.cars,
      hint: `${formatPersianNumber(catalog.carImages)} تصویر`,
      href: "/admin/cars",
      icon: Car,
    },
    {
      key: "options",
      permission: "cars",
      label: "فرم ثبت خودرو",
      value: catalog.options,
      hint: `${formatPersianNumber(catalog.optionItems)} گزینه · ${formatPersianNumber(catalog.adOptionValues)} مقدار`,
      href: "/admin/car-form",
      icon: SlidersHorizontal,
    },
    {
      key: "sale-terms",
      permission: "ads",
      label: "شرایط فروش",
      value: catalog.saleTerms,
      hint: `${formatPersianNumber(catalog.activeSaleTerms)} فعال`,
      href: "/admin/sale-terms",
      icon: HandCoins,
    },
    {
      key: "images",
      permission: "cars",
      label: "تصاویر خودرو",
      value: catalog.carImages,
      hint:
        catalog.cars > 0
          ? `میانگین ${formatPersianNumber(Math.round((catalog.carImages / catalog.cars) * 10) / 10)} به ازای هر خودرو`
          : "بدون خودرو",
      href: "/admin/cars",
      icon: Images,
    },
  ];
  const items = allItems.filter((item) => hasPermission(access, item.permission));

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.key}
            href={item.href}
            className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-[#FF6A00]/30 hover:bg-white/[0.04]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-[#9BA3AE]">{item.label}</span>
              <Icon className="h-4 w-4 text-[#5E6672] transition-colors group-hover:text-[#FF8A2A]" />
            </div>
            <p className="mt-2 text-xl font-black leading-none text-[#F5F5F5]">{formatPersianNumber(item.value)}</p>
            <p className="mt-1.5 truncate text-[10px] text-[#5E6672]">{item.hint}</p>
          </Link>
        );
      })}
    </div>
  );
}
