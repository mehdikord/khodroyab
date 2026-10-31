"use client";

import React from "react";
import { Edit2, Loader2, Trash2 } from "lucide-react";

import { Toggle } from "@/components/admin/ui/Toggle";
import type { OptionRecord } from "@/lib/options";
import { toPersianDigits } from "@/lib/utils";

interface OptionsTableProps {
  options: OptionRecord[];
  onEdit: (option: OptionRecord) => void;
  onDelete: (option: OptionRecord) => void;
  onToggleActive: (option: OptionRecord, next: boolean) => void;
  busyId: string | null;
}

function typeLabel(option: OptionRecord): string {
  switch (option.type) {
    case "text":
      return "نوشتاری";
    case "number":
      return "عددی";
    case "checkbox":
      return "چک‌باکس";
    case "select":
      return option.multiple ? "چند گزینه‌ای · چند انتخابی" : "چند گزینه‌ای · تک انتخابی";
  }
}

export function OptionsTable({ options, onEdit, onDelete, onToggleActive, busyId }: OptionsTableProps) {
  if (options.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-[#07090C]/40 px-6 py-12 text-center">
        <p className="text-sm font-semibold text-[#8B93A1]">
          هیچ ویژگی ثبت نشده است.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-scrollbar overflow-x-auto rounded-2xl border border-white/[0.07] bg-[#07090C]">
      <table className="w-full text-right text-sm">
        <thead className="bg-white/[0.03] text-xs font-bold uppercase tracking-wider text-[#8B93A1]">
          <tr>
            <th className="px-6 py-4">عنوان ویژگی</th>
            <th className="px-6 py-4">نوع</th>
            <th className="px-6 py-4">توضیح کوتاه</th>
            <th className="px-6 py-4 text-center">الزامی</th>
            <th className="px-6 py-4 text-center">مقدار در آگهی‌ها</th>
            <th className="px-6 py-4 text-center">فعال</th>
            <th className="px-6 py-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.05]">
          {options.map((option) => (
            <tr key={option.id} className="hover:bg-white/[0.02]">
              <td className="px-6 py-4 font-semibold text-[#F5F5F5]">
                {option.name}
              </td>
              <td className="px-6 py-4">
                <span className="whitespace-nowrap rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[11px] font-semibold text-[#D2D7DF]">
                  {typeLabel(option)}
                </span>
                {option.type === "select" && (
                  <p className="mt-1.5 max-w-[260px] truncate text-[11px] text-[#5E6672]" title={option.optionItems.map((item) => item.title).join("، ")}>
                    {option.optionItems.map((item) => item.title).join("، ")}
                  </p>
                )}
              </td>
              <td className="px-6 py-4 text-[#8B93A1]">
                {option.description || "-"}
              </td>
              <td className="px-6 py-4 text-center text-xs font-semibold text-[#D2D7DF]">
                {option.isRequired ? "بله" : "خیر"}
              </td>
              <td className="px-6 py-4 text-center font-mono text-xs text-[#D2D7DF]">
                {toPersianDigits(option.usageCount)}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center">
                  {busyId === option.id ? (
                    <Loader2 className="h-5 w-5 animate-spin text-[#FF8A2A]" />
                  ) : (
                    <Toggle
                      checked={option.isActive}
                      onCheckedChange={(next) => onToggleActive(option, next)}
                      label={`فعال بودن «${option.name}»`}
                    />
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(option)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#8B93A1] transition-colors hover:border-[#FF6A00]/40 hover:bg-[#FF6A00]/10 hover:text-[#FF8A2A]"
                    title="ویرایش"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(option)}
                    disabled={option.usageCount > 0}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#8B93A1] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/[0.08] disabled:hover:bg-transparent disabled:hover:text-[#8B93A1]"
                    title={option.usageCount > 0 ? "این ویژگی در آگهی‌ها مقدار دارد؛ به‌جای حذف، آن را غیرفعال کنید" : "حذف"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
