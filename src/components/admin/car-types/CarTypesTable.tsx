"use client";

import React from "react";
import { Edit2, Trash2 } from "lucide-react";

import type { CarTypeRecord } from "@/lib/car-types";
import { toPersianDigits } from "@/lib/utils";

interface CarTypesTableProps {
  carTypes: CarTypeRecord[];
  onEdit: (carType: CarTypeRecord) => void;
  onDelete: (carType: CarTypeRecord) => void;
  isDeleting?: string | null;
}

export function CarTypesTable({
  carTypes,
  onEdit,
  onDelete,
  isDeleting,
}: CarTypesTableProps) {
  if (carTypes.length === 0) return null;

  return (
    <div className="admin-scrollbar overflow-x-auto rounded-2xl border border-white/[0.07]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.07] bg-[#0A0D12]">
            <th
              scope="col"
              className="sticky right-0 pr-5 py-4 text-right font-bold text-[#8B93A1] uppercase tracking-wider [&:last-child]:pl-5"
            >
              نوع خودرو
            </th>
            <th
              scope="col"
              className="px-4 py-4 text-right font-bold text-[#8B93A1] uppercase tracking-wider"
            >
              اسلاگ
            </th>
            <th
              scope="col"
              className="px-4 py-4 text-right font-bold text-[#8B93A1] uppercase tracking-wider hidden lg:table-cell"
            >
              تاریخ ایجاد
            </th>
            <th
              scope="col"
              className="pl-5 py-4 text-left font-bold text-[#8B93A1] uppercase tracking-wider"
            >
              عملیات
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {carTypes.map((carType) => (
            <tr
              key={carType.id}
              className="hover:bg-white/[0.02] transition-colors"
            >
              {/* Name column */}
              <td className="pr-5 py-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#F5F5F5]">
                    {carType.name}
                  </p>
                  {carType.description && (
                    <p className="mt-0.5 truncate text-[11px] text-[#5E6672]">
                      {carType.description}
                    </p>
                  )}
                </div>
              </td>

              {/* Slug column */}
              <td className="px-4 py-4">
                <span dir="ltr" className="font-mono text-[11px] text-[#8B93A1]">
                  {carType.slug}
                </span>
              </td>

              {/* Created Date */}
              <td className="px-4 py-4 hidden lg:table-cell">
                <span className="text-[11px] text-[#5E6672]">
                  {toPersianDigits(new Date(carType.createdAt).toLocaleDateString("fa-IR"))}
                </span>
              </td>

              {/* Actions */}
              <td className="pl-5 py-4">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEdit(carType)}
                    aria-label={`ویرایش ${carType.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-[#FF6A00]/40 hover:bg-[#FF6A00]/10 hover:text-[#FF8A2A]"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(carType)}
                    disabled={isDeleting === carType.id}
                    aria-label={`حذف ${carType.name}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
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
