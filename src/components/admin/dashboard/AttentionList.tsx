import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ChevronLeft,
  Clock3,
  ImageOff,
  PauseCircle,
  ShieldCheck,
  Tag,
  UserX,
  HandCoins,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { DashboardData } from "@/lib/dashboard";
import { cn, formatPersianNumber } from "@/lib/utils";

type Severity = "warning" | "info";

interface AttentionItem {
  key: string;
  label: string;
  description: string;
  count: number;
  href: string;
  icon: LucideIcon;
  severity: Severity;
}

const SEVERITY: Record<Severity, { icon: string; count: string }> = {
  warning: {
    icon: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    count: "bg-amber-500/15 text-amber-200",
  },
  info: {
    icon: "border-white/[0.1] bg-white/[0.04] text-[#C9CFD8]",
    count: "bg-white/[0.06] text-[#D2D7DF]",
  },
};

interface AttentionListProps {
  attention: DashboardData["attention"];
}

/** Things an administrator should act on, ordered by urgency; hides zero rows. */
export function AttentionList({ attention }: AttentionListProps) {
  const allItems: AttentionItem[] = [
    {
      key: "pending",
      label: "آگهی در انتظار تایید",
      description: "توسط کاربران ثبت شده و منتظر بررسی است",
      count: attention.pendingAds,
      href: "/admin/ads?status=pending",
      icon: Clock3,
      severity: "warning",
    },
    {
      key: "no-images",
      label: "خودرو بدون تصویر",
      description: "در سایت بدون عکس نمایش داده می‌شود",
      count: attention.carsWithoutImages,
      href: "/admin/cars",
      icon: ImageOff,
      severity: "warning",
    },
    {
      key: "brands-no-cars",
      label: "برند بدون خودرو",
      description: "برند تعریف شده ولی خودرویی ندارد",
      count: attention.brandsWithoutCars,
      href: "/admin/brands",
      icon: Tag,
      severity: "info",
    },
    {
      key: "inactive-ads",
      label: "آگهی غیرفعال",
      description: "از نمایش عمومی خارج شده است",
      count: attention.inactiveAds,
      href: "/admin/ads?active=0",
      icon: PauseCircle,
      severity: "info",
    },
    {
      key: "inactive-brands",
      label: "برند غیرفعال",
      description: "در سایت نمایش داده نمی‌شود",
      count: attention.inactiveBrands,
      href: "/admin/brands",
      icon: Tag,
      severity: "info",
    },
    {
      key: "inactive-sale-terms",
      label: "شرایط فروش غیرفعال",
      description: "برای آگهی‌های جدید قابل انتخاب نیست",
      count: attention.inactiveSaleTerms,
      href: "/admin/sale-terms",
      icon: HandCoins,
      severity: "info",
    },
    {
      key: "inactive-users",
      label: "کاربر غیرفعال",
      description: "امکان ورود و ثبت آگهی ندارد",
      count: attention.inactiveUsers,
      href: "/admin/users",
      icon: UserX,
      severity: "info",
    },
  ];
  const items = allItems.filter((item) => item.count > 0);

  if (items.length === 0) {
    return (
      <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-emerald-500/20 bg-emerald-500/[0.04] px-4 py-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-300">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <p className="text-sm font-extrabold text-[#F5F5F5]">همه‌چیز مرتب است</p>
        <p className="text-[11px] leading-5 text-[#8B93A1]">موردی برای رسیدگی وجود ندارد.</p>
      </div>
    );
  }

  const warnings = items.filter((item) => item.severity === "warning").length;

  return (
    <div className="flex h-full flex-col gap-3">
      {warnings > 0 && (
        <p className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2 text-[11px] font-semibold text-amber-200">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          {formatPersianNumber(warnings)} مورد نیازمند رسیدگی فوری
        </p>
      )}
      <ul className="space-y-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const tone = SEVERITY[item.severity];
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                className="group flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition-colors hover:border-white/[0.08] hover:bg-white/[0.03]"
              >
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border", tone.icon)}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-[#F5F5F5]">{item.label}</p>
                  <p className="truncate text-[10px] text-[#8B93A1]">{item.description}</p>
                </div>
                <span className={cn("rounded-md px-2 py-0.5 text-xs font-extrabold tabular-nums", tone.count)}>
                  {formatPersianNumber(item.count)}
                </span>
                <ChevronLeft className="h-4 w-4 shrink-0 text-[#42505F] transition-colors group-hover:text-[#FF8A2A]" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
