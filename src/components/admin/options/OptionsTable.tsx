"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OptionRecord } from "@/lib/options";

interface OptionsTableProps {
  options: OptionRecord[];
  onEdit: (option: OptionRecord) => void;
  onDelete: (option: OptionRecord) => void;
}

export function OptionsTable({ options, onEdit, onDelete }: OptionsTableProps) {
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
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#07090C]">
      <table className="w-full text-right text-sm">
        <thead className="bg-white/[0.03] text-xs font-bold uppercase tracking-wider text-[#8B93A1]">
          <tr>
            <th className="px-6 py-4">عنوان ویژگی</th>
            <th className="px-6 py-4">نوع</th>
            <th className="px-6 py-4">توضیحات</th>
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
                <span className="rounded-full bg-white/[0.05] px-2.5 py-0.5 font-mono text-[10px] text-[#D2D7DF]">
                  {option.type.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 text-[#8B93A1]">
                {option.description || "-"}
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
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#8B93A1] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                    title="حذف"
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
