"use client";

import React from "react";

import { Badge } from "@/components/admin/ui/Badge";
import { Toggle } from "@/components/admin/ui/Toggle";
import type { CarRecord } from "@/lib/cars";
import { cn, toPersianDigits } from "@/lib/utils";

interface PriceTableCarsTableProps {
  cars: CarRecord[];
  pendingId: string | null;
  disabled?: boolean;
  onToggle: (car: CarRecord) => void;
}

/** Catalogue cars with their price-table eligibility switch. */
export function PriceTableCarsTable({ cars, pendingId, disabled, onToggle }: PriceTableCarsTableProps) {
  return (
    <div className="admin-scrollbar overflow-x-auto rounded-2xl border border-white/[0.07]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.07] bg-[#0A0D12]">
            <th scope="col" className="py-4 pr-5 text-right font-bold uppercase tracking-wider text-[#8B93A1]">
              نام خودرو
            </th>
            <th scope="col" className="hidden px-4 py-4 text-right font-bold uppercase tracking-wider text-[#8B93A1] md:table-cell">
              برند / نوع
            </th>
            <th scope="col" className="hidden px-4 py-4 text-right font-bold uppercase tracking-wider text-[#8B93A1] sm:table-cell">
              مدل
            </th>
            <th scope="col" className="px-4 py-4 text-center font-bold uppercase tracking-wider text-[#8B93A1]">
              وضعیت
            </th>
            <th scope="col" className="py-4 pl-5 text-left font-bold uppercase tracking-wider text-[#8B93A1]">
              مجاز در جدول قیمت
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {cars.map((car) => {
            const isPending = pendingId === car.id;
            return (
              <tr key={car.id} className={cn("transition-colors hover:bg-white/[0.02]", car.priceTable && "bg-[#FF6A00]/[0.03]")}>
                <td className="py-4 pr-5">
                  <p className="font-semibold text-[#F5F5F5]">{car.name}</p>
                  <p className="mt-0.5 text-[11px] text-[#8B93A1] md:hidden">{car.brandName} · {car.carTypeName}</p>
                  <p className="mt-0.5 text-[11px] text-[#5E6672] sm:hidden">
                    مدل {toPersianDigits(car.model)}
                  </p>
                </td>
                <td className="hidden px-4 py-4 md:table-cell">
                  <p className="text-sm text-[#D2D7DF]">{car.brandName}</p>
                  <p className="text-[11px] text-[#8B93A1]">{car.carTypeName}</p>
                </td>
                <td className="hidden px-4 py-4 text-[#8B93A1] sm:table-cell">
                  <p>{toPersianDigits(car.model)}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <Badge tone={car.priceTable ? "success" : "muted"}>{car.priceTable ? "مجاز" : "غیرمجاز"}</Badge>
                </td>
                <td className="py-4 pl-5">
                  <div className={cn("flex items-center justify-end", isPending && "opacity-60")}>
                    <Toggle
                      checked={car.priceTable}
                      disabled={disabled || isPending}
                      label={`مجاز بودن «${car.name}» در جدول قیمت`}
                      onCheckedChange={() => onToggle(car)}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
