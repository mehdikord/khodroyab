import React from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { cn } from "@/lib/utils";

interface VerificationRequiredProps {
  /** What is locked, e.g. "ثبت آگهی". */
  feature: string;
  className?: string;
}

/**
 * Shown in place of a collaborator-only form while the collaborator's identity
 * is not verified: publishing stays disabled until the admin approves it.
 */
export function VerificationRequired({ feature, className }: VerificationRequiredProps) {
  return (
    <div
      role="alert"
      className={cn(
        "admin-animate-in relative overflow-hidden rounded-3xl border border-panel-warning/35 bg-panel-warning/10 px-5 py-8 text-center sm:px-8",
        className
      )}
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-panel-warning/30 bg-panel-warning/15 text-panel-warning">
        <ShieldAlert className="h-6 w-6" />
      </span>
      <p className="mt-4 text-base font-extrabold text-panel-text">{feature} برای شما غیرفعال است</p>
      <p className="mx-auto mt-2 max-w-lg text-xs leading-7 text-panel-text-2 sm:text-sm">
        حساب کاربری شما احراز هویت نشده است. برای {feature}، ابتدا مدارک هویتی خود را ارسال کنید تا پس از تایید مدیر این بخش فعال شود.
      </p>
      <Link
        href="/panel/verification"
        className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-6 text-sm font-extrabold text-[#07090C] shadow-orange-subtle transition-all hover:brightness-110"
      >
        احراز هویت
      </Link>
    </div>
  );
}
