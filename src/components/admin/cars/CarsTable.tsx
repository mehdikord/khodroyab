"use client";

import React from "react";
import { Edit2, Trash2, ListChecks, Eye, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

import type { CarRecord } from "@/lib/cars";
import { toPersianDigits } from "@/lib/utils";

interface CarsTableProps {
  cars: CarRecord[];
  onEdit: (car: CarRecord) => void;
  onDelete: (car: CarRecord) => void;
  onViewDetails: (car: CarRecord) => void;
  isDeleting?: string | null;
}

export function CarsTable({
  cars,
  onEdit,
  onDelete,
  onViewDetails,
  isDeleting,
}: CarsTableProps) {
  if (cars.length === 0) return null;

  return (
    <div className="admin-scrollbar overflow-x-auto rounded-2xl border border-white/[0.07]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.07] bg-[#0A0D12]">
            <th scope="col" className="pr-5 py-4 text-right font-bold text-[#8B93A1] uppercase tracking-wider">
              نام خودرو
            </th>
            <th scope="col" className="px-4 py-4 text-right font-bold text-[#8B93A1] uppercase tracking-wider">
              برند / نوع
            </th>
            <th scope="col" className="px-4 py-4 text-right font-bold text-[#8B93A1] uppercase tracking-wider">
              مدل / سال
            </th>
            <th scope="col" className="px-4 py-4 text-center font-bold text-[#8B93A1] uppercase tracking-wider">
              مشخصات
            </th>
            <th scope="col" className="pl-5 py-4 text-left font-bold text-[#8B93A1] uppercase tracking-wider">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {cars.map((car) => (
            <tr key={car.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="pr-5 py-4">
                <p className="font-semibold text-[#F5F5F5]">{car.name}</p>
                <p className="mt-0.5 text-[11px] text-[#5E6672] font-mono">{car.slug}</p>
              </td>
              <td className="px-4 py-4">
                <p className="text-sm text-[#D2D7DF]">{car.brandName}</p>
                <p className="text-[11px] text-[#8B93A1]">{car.carTypeName}</p>
              </td>
              <td className="px-4 py-4 text-[#8B93A1]">
                <p>{toPersianDigits(car.model)}</p>
                <p className="text-xs">{toPersianDigits(car.year)}</p>
              </td>
              <td className="px-4 py-4 text-center">
                <button
                  onClick={() => onViewDetails(car)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-[#F5F5F5] transition-colors hover:bg-white/[0.06] hover:border-white/20"
                >
                  <Eye className="h-3.5 w-3.5 text-[#FF8A2A]" />
                  مشاهده
                </button>
              </td>
              <td className="pl-5 py-4">
                <div className="flex items-center justify-end gap-1.5">
                  <Link
                    href={`/admin/cars/${car.id}/options`}
                    title="مدیریت ویژگی‌ها"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-[#FF6A00]/40 hover:bg-[#FF6A00]/10 hover:text-[#FF8A2A]"
                  >
                    <ListChecks className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/admin/cars/${car.id}/images`}
                    title="مدیریت تصاویر"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-[#FF6A00]/40 hover:bg-[#FF6A00]/10 hover:text-[#FF8A2A]"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => onEdit(car)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-[#FF6A00]/40 hover:bg-[#FF6A00]/10 hover:text-[#FF8A2A]"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(car)}
                    disabled={isDeleting === car.id}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#9BA3AE] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30"
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
