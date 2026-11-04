import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, Handshake, ShieldAlert } from "lucide-react";

import prisma from "@/lib/prisma";
import { requireAdminAccess } from "@/lib/auth/guards";
import { listColors } from "@/lib/colors";
import { listPriceTableCars, listUserPriceTableEntries } from "@/lib/price-table";
import { MyPriceTableManager } from "@/components/panel/price-table/MyPriceTableManager";
import { saveUserPriceTableAction } from "./actions";

export const metadata: Metadata = {
  title: "مدیریت جدول قیمت کاربر | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

/** The admin's editor for one collaborator's price table (same editor the collaborator uses). */
export default async function AdminUserPriceTablePage({ params }: PageProps) {
  await requireAdminAccess("price_table");

  let userId: bigint;
  try {
    userId = BigInt(params.id);
  } catch {
    return notFound();
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, companyName: true, collabrate: true, authenticaed: true },
  });
  if (!user) {
    return notFound();
  }

  const profileHref = `/admin/users/${user.id.toString()}`;
  const backLink = (
    <Link
      href={profileHref}
      className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-[#9BA3AE] transition-colors hover:bg-white/[0.06] hover:text-[#F5F5F5]"
    >
      <ArrowRight className="h-3.5 w-3.5" />
      بازگشت به پروفایل کاربر
    </Link>
  );

  // Price tables belong to collaborators only.
  if (!user.collabrate) {
    return (
      <div className="space-y-5">
        {backLink}
        <div className="rounded-3xl border border-dashed border-white/[0.12] bg-[#0D1117] px-6 py-14 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/10 text-sky-300">
            <Handshake className="h-6 w-6" />
          </span>
          <p className="mt-4 text-sm font-bold text-[#F5F5F5]">«{user.name}» کاربر همکار نیست</p>
          <p className="mt-1.5 text-xs leading-6 text-[#8B93A1]">
            جدول قیمت فقط برای کاربران همکار وجود دارد. ابتدا از جدول کاربران حالت همکاری این کاربر را فعال کنید.
          </p>
        </div>
      </div>
    );
  }

  const [cars, entries, colors] = await Promise.all([
    listPriceTableCars(),
    listUserPriceTableEntries(userId),
    listColors(),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {backLink}
        <span
          className={
            user.authenticaed
              ? "inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300"
              : "inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300"
          }
        >
          {user.authenticaed ? <BadgeCheck className="h-3.5 w-3.5" /> : <ShieldAlert className="h-3.5 w-3.5" />}
          {user.authenticaed ? "احراز هویت شده" : "احراز هویت نشده"}
        </span>
      </div>

      <MyPriceTableManager
        cars={cars}
        colors={colors}
        initialEntries={entries}
        saveAction={saveUserPriceTableAction.bind(null, user.id.toString())}
        title={`جدول قیمت ${user.companyName || user.name}`}
        successMessage="جدول قیمت کاربر ذخیره شد"
      />
    </div>
  );
}
