import React from "react";
import Link from "next/link";
import { Tag } from "lucide-react";

import type { DashboardBrandStat } from "@/lib/dashboard";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";
import { DashboardEmpty } from "@/components/admin/dashboard/DashboardCard";

interface TopBrandsProps {
  brands: DashboardBrandStat[];
}

/** Brands ranked by sale ads; single-hue horizontal bars with the value at the tip. */
export function TopBrands({ brands }: TopBrandsProps) {
  if (brands.length === 0) {
    return <DashboardEmpty icon={Tag} text="هنوز برندی با خودرو یا آگهی ثبت نشده است." />;
  }

  const max = Math.max(1, ...brands.map((b) => b.ads));

  return (
    <ol className="space-y-4">
      {brands.map((brand, index) => {
        const pct = (brand.ads / max) * 100;
        return (
          <li key={brand.id}>
            <Link
              href={`/admin/ads?brand=${brand.id}`}
              title={`${brand.name}: ${toPersianDigits(brand.ads)} آگهی، ${toPersianDigits(brand.cars)} خودرو`}
              className="group block rounded-xl px-1 py-1 transition-colors hover:bg-white/[0.03]"
            >
              <div className="flex items-center gap-3">
                <span className="w-4 shrink-0 text-center font-mono text-[10px] text-[#5E6672]">
                  {toPersianDigits(index + 1)}
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/[0.08] bg-[#12161D] text-[11px] font-bold text-[#9BA3AE]">
                  {brand.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={brand.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    brand.name.slice(0, 1)
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-bold text-[#F5F5F5]">
                      {brand.name}
                      {!brand.isActive && (
                        <span className="ms-1.5 text-[10px] font-semibold text-[#5E6672]">(غیرفعال)</span>
                      )}
                    </span>
                    <span className="shrink-0 text-[11px] text-[#8B93A1]">
                      {formatPersianNumber(brand.cars)} خودرو
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2" dir="ltr">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                      <div
                        className={cn(
                          "h-full rounded-e-full bg-[#FF6A00] transition-[width] duration-700 group-hover:bg-[#FF8A2A]",
                          brand.ads === 0 && "opacity-0"
                        )}
                        style={{ width: `${Math.max(pct, brand.ads > 0 ? 4 : 0)}%` }}
                      />
                    </div>
                    <span className="w-14 text-end text-[11px] font-extrabold tabular-nums text-[#F5F5F5]" dir="rtl">
                      {formatPersianNumber(brand.ads)} آگهی
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
