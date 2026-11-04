import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Handshake } from "lucide-react";

import prisma from "@/lib/prisma";
import { requireAdminAccess } from "@/lib/auth/guards";
import { userToRecord } from "@/lib/users";
import { carRecordInclude, carToRecord } from "@/lib/cars";
import { saleTermToRecord } from "@/lib/sale-terms";
import { colorToRecord } from "@/lib/colors";
import { optionRecordInclude, optionToRecord } from "@/lib/options";
import { userCarInclude, userCarToRecord } from "@/lib/user-cars";
import { SaleAdsManager } from "@/components/admin/users/sale-ads/SaleAdsManager";

export const metadata: Metadata = {
  title: "مدیریت آگهی‌های فروش کاربر | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export default async function AdminUserSaleAdsPage({ params }: PageProps) {
  await requireAdminAccess("ads");

  let userId: bigint;
  try {
    userId = BigInt(params.id);
  } catch {
    return notFound();
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return notFound();
  }

  // Only collaborators publish ads: the section does not exist for regular users.
  if (!user.collabrate) {
    return (
      <div className="space-y-5">
        <Link
          href={`/admin/users/${user.id.toString()}`}
          className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-[#9BA3AE] transition-colors hover:bg-white/[0.06] hover:text-[#F5F5F5]"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          بازگشت به پروفایل کاربر
        </Link>
        <div className="rounded-3xl border border-dashed border-white/[0.12] bg-[#0D1117] px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/10 text-sky-300">
            <Handshake className="h-6 w-6" />
          </span>
          <p className="mt-4 text-sm font-bold text-[#F5F5F5]">«{user.name}» کاربر همکار نیست</p>
          <p className="mt-1.5 text-xs leading-6 text-[#8B93A1]">
            ثبت آگهی فقط برای کاربران همکار امکان‌پذیر است. ابتدا از جدول کاربران حالت همکاری این کاربر را فعال کنید.
          </p>
        </div>
      </div>
    );
  }

  const [userCars, cars, saleTerms, colors, options] = await Promise.all([
    prisma.userCar.findMany({
      where: { userId },
      include: userCarInclude,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    }),
    prisma.car.findMany({
      include: carRecordInclude,
      orderBy: [{ brand: { name: "asc" } }, { name: "asc" }],
    }),
    prisma.saleTerm.findMany({
      where: { isActive: true },
      orderBy: { title: "asc" },
    }),
    prisma.color.findMany({ orderBy: { name: "asc" } }),
    prisma.option.findMany({ where: { isActive: true }, include: optionRecordInclude, orderBy: { id: "asc" } }),
  ]);

  return (
    <SaleAdsManager
      user={userToRecord(user)}
      initialAds={userCars.map(userCarToRecord)}
      cars={cars.map(carToRecord)}
      saleTerms={saleTerms.map(saleTermToRecord)}
      colors={colors.map(colorToRecord)}
      options={options.map(optionToRecord)}
    />
  );
}
