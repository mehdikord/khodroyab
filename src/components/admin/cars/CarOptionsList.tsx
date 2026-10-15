"use client";

import React from "react";
import type { CarOptionRecord } from "@/lib/car-options";

interface CarOptionsListProps {
  options: CarOptionRecord[];
}

export function CarOptionsList({ options }: CarOptionsListProps) {
  if (options.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-[#8B93A1]">هیچ ویژگی برای این خودرو ثبت نشده است.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#07090C]/40">
      <table className="w-full text-right text-sm">
        <thead className="bg-white/[0.03] text-xs font-bold text-[#8B93A1]">
          <tr>
            <th className="px-4 py-3">ویژگی</th>
            <th className="px-4 py-3">مقدار</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05]">
          {options.map((opt) => (
            <tr key={opt.id}>
              <td className="px-4 py-3 font-medium text-[#D2D7DF]">{opt.optionName}</td>
              <td className="px-4 py-3 text-[#F5F5F5]">{opt.displayValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
