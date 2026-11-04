import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, ShieldX } from "lucide-react";

import { requireAdmin } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "عدم دسترسی | پنل مدیریت خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** Landing page for `requireAdminAccess()` when the admin's role lacks the section. */
export default async function AdminForbiddenPage() {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="admin-animate-in w-full max-w-md rounded-3xl border border-white/[0.1] bg-[#0D1117] px-6 py-12 text-center shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300">
          <ShieldX className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-lg font-black text-[#F5F5F5]">دسترسی به این بخش ندارید</h1>
        <p className="mt-2 text-xs leading-6 text-[#8B93A1]">
          {admin.roleName
            ? `نقش «${admin.roleName}» اجازه ورود به این بخش را ندارد.`
            : "هنوز نقشی به حساب شما اختصاص داده نشده است."}{" "}
          در صورت نیاز با مدیر کل سامانه تماس بگیرید.
        </p>
        <Link
          href="/admin/dashboard"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-5 text-xs font-bold text-[#D2D7DF] transition-colors hover:border-[#FF6A00]/40 hover:text-[#F5F5F5]"
        >
          <LayoutDashboard className="h-4 w-4 text-[#FF8A2A]" />
          بازگشت به داشبورد
        </Link>
      </div>
    </div>
  );
}
