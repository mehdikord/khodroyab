"use client";

import React, { useState, useTransition } from "react";
import { BadgeCheck, Building2, FileImage, Loader2, ShieldCheck, ShieldX, UserRound } from "lucide-react";

import { Modal } from "@/components/admin/ui/Modal";
import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { VerificationStatusBadge } from "@/components/admin/users/VerificationStatusBadge";
import { reviewVerificationAction } from "@/app/admin/(panel)/users/[id]/verification-actions";
import {
  VERIFICATION_PERSON_TYPE_LABELS,
  VERIFICATION_REJECT_REASON_MAX,
  type VerificationRecord,
} from "@/lib/verification-shared";
import { cn, toPersianDigits } from "@/lib/utils";

interface UserVerificationSectionProps {
  userId: string;
  initialAuthenticaed: boolean;
  initialVerification: VerificationRecord | null;
}

/**
 * Identity verification of a collaborator on the admin's user page: the person
 * type, every submitted document (opens full size) and the approve / reject
 * decision. A rejection may carry a reason that the user sees in their panel.
 */
export function UserVerificationSection({ userId, initialAuthenticaed, initialVerification }: UserVerificationSectionProps) {
  const [verification, setVerification] = useState<VerificationRecord | null>(initialVerification);
  const [authenticaed, setAuthenticaed] = useState(initialAuthenticaed);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isPending, startTransition] = useTransition();

  function showToast(kind: ToastState["kind"], message: string) {
    setToast({ kind, message });
    window.setTimeout(() => setToast(null), 4000);
  }

  function review(decision: "approve" | "reject") {
    setReasonError(null);
    startTransition(async () => {
      const result = await reviewVerificationAction(userId, decision, decision === "reject" ? reason : "");
      if (result.ok) {
        setVerification(result.verification);
        setAuthenticaed(result.authenticaed);
        setRejectOpen(false);
        setReason("");
        showToast("success", decision === "approve" ? "احراز هویت کاربر تایید شد" : "احراز هویت کاربر رد شد");
      } else {
        if (result.fieldErrors?.reason) setReasonError(result.fieldErrors.reason);
        showToast("error", result.message);
      }
    });
  }

  const PersonIcon = verification?.personType === "legal" ? Building2 : UserRound;

  return (
    <section className="admin-animate-in rounded-3xl border border-white/[0.07] bg-[#0D1117] p-5 sm:p-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {rejectOpen && (
        <Modal
          open
          onClose={() => !isPending && setRejectOpen(false)}
          title="رد احراز هویت"
          description="در صورت نوشتن دلیل، کاربر آن را در صفحه احراز هویت پنل خود می‌بیند."
          size="sm"
          footer={
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setRejectOpen(false)} disabled={isPending} className="px-4 py-2 text-sm text-[#D2D7DF]">
                انصراف
              </button>
              <button
                type="button"
                onClick={() => review("reject")}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldX className="h-4 w-4" />}
                رد احراز هویت
              </button>
            </div>
          }
        >
          <label htmlFor="verification-reject-reason" className="block text-sm font-semibold text-[#F5F5F5]">
            دلیل رد <span className="text-[11px] font-normal text-[#5E6672]">(اختیاری)</span>
          </label>
          <textarea
            id="verification-reject-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={VERIFICATION_REJECT_REASON_MAX}
            rows={4}
            disabled={isPending}
            placeholder="مثلاً: تصویر کارت ملی خوانا نیست؛ لطفاً تصویر واضح‌تری ارسال کنید."
            className={cn(
              "mt-2 w-full resize-none rounded-xl border bg-[#07090C] px-4 py-3 text-sm leading-7 text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672]",
              reasonError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20 focus:border-[#FF6A00]"
            )}
          />
          <div className="mt-1 flex justify-between text-[11px]">
            <span className="text-red-400">{reasonError}</span>
            <span className="text-[#5E6672]">
              {toPersianDigits(reason.length)} / {toPersianDigits(VERIFICATION_REJECT_REASON_MAX)}
            </span>
          </div>
        </Modal>
      )}

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-extrabold text-[#F5F5F5]">احراز هویت</h3>
              <VerificationStatusBadge authenticaed={authenticaed} status={verification?.status ?? null} />
            </div>
            <p className="mt-0.5 text-xs text-[#8B93A1]">مدارک هویتی ارسال‌شده توسط کاربر همکار</p>
          </div>
        </div>

        {verification && (
          <div className="flex flex-wrap items-center gap-2">
            {!authenticaed && (
              <button
                type="button"
                onClick={() => review("approve")}
                disabled={isPending}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-extrabold text-[#07090C] transition-all hover:brightness-110 disabled:opacity-60"
              >
                {isPending && !rejectOpen ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
                تایید احراز هویت
              </button>
            )}
            {verification.status !== "rejected" && (
              <button
                type="button"
                onClick={() => {
                  setReason("");
                  setRejectOpen(true);
                }}
                disabled={isPending}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 text-sm font-bold text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-60"
              >
                <ShieldX className="h-4 w-4" />
                {authenticaed ? "لغو تایید و رد" : "رد احراز هویت"}
              </button>
            )}
          </div>
        )}
      </div>

      {!verification ? (
        <div className="rounded-2xl border border-dashed border-white/[0.12] bg-[#07090C]/60 px-6 py-10 text-center">
          <p className="text-sm font-bold text-[#D2D7DF]">این کاربر هنوز مدرکی برای احراز هویت ارسال نکرده است</p>
          <p className="mt-1.5 text-xs leading-6 text-[#5E6672]">پس از ارسال مدارک از پنل کاربری، آن‌ها در این بخش نمایش داده می‌شوند.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-white/[0.06] bg-[#07090C]/60 px-4 py-3 text-xs text-[#8B93A1]">
            <span className="inline-flex items-center gap-1.5">
              <PersonIcon className="h-4 w-4 text-[#FF8A2A]" />
              نوع کاربری: <span className="font-bold text-[#F5F5F5]">{VERIFICATION_PERSON_TYPE_LABELS[verification.personType]}</span>
            </span>
            <span>ارسال: {verification.submittedAtLabel}</span>
            {verification.reviewedAtLabel && <span>آخرین بررسی: {verification.reviewedAtLabel}</span>}
            <span>{toPersianDigits(verification.documents.length)} مدرک</span>
          </div>

          {verification.status === "rejected" && (
            <div className="rounded-2xl border border-red-500/25 bg-red-500/[0.06] px-4 py-3 text-xs leading-6 text-red-200">
              <span className="font-bold">دلیل رد: </span>
              {verification.rejectReason || "دلیلی ثبت نشده است"}
            </div>
          )}

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {verification.documents.map((doc) => (
              <li key={doc.id}>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block overflow-hidden rounded-2xl border border-white/[0.08] bg-[#07090C] transition-colors hover:border-[#FF6A00]/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={doc.url} alt={doc.title} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                  <p className="flex items-center gap-1.5 truncate px-3 py-2 text-xs font-bold text-[#D2D7DF] group-hover:text-[#FF8A2A]">
                    <FileImage className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{doc.title}</span>
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
