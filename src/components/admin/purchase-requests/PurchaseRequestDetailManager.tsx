"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Car,
  ExternalLink,
  Eye,
  Fingerprint,
  History,
  ListOrdered,
  Loader2,
  Mail,
  MapPin,
  Megaphone,
  MessageSquareText,
  Phone,
  Save,
  ShieldAlert,
  StickyNote,
  Store,
  Tag,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { ColorSwatch } from "@/components/admin/ui/ColorSwatch";
import { PurchaseRequestStatusBadge, PurchaseRequestStatusSelect } from "@/components/admin/purchase-requests/PurchaseRequestStatus";
import { savePurchaseRequestNoteAction, setPurchaseRequestStatusAction } from "@/app/admin/(panel)/purchase-requests/actions";
import {
  PURCHASE_REQUEST_AUDIENCE_LABELS,
  PURCHASE_REQUEST_NOTE_MAX,
  PURCHASE_REQUEST_SOURCE_LABELS,
  PURCHASE_REQUEST_STATUS_LABELS,
  type AdminPurchaseRequestDetail,
  type PurchaseRequestPerson,
  type PurchaseRequestStatus,
} from "@/lib/purchase-requests-shared";
import { CURRENCY_LABELS } from "@/lib/currency";
import { cn, formatPersianNumber, toPersianDigits } from "@/lib/utils";

interface PurchaseRequestDetailManagerProps {
  request: AdminPurchaseRequestDetail;
  /** Opening this page marked the request as seen: refresh the sidebar badge. */
  justSeen: boolean;
}

const cardClass = "rounded-2xl border border-white/[0.07] bg-[#0D1117] p-5";

function groupCode(code: string): string {
  return code.length === 8 ? `${code.slice(0, 4)} ${code.slice(4)}` : code;
}

function CardTitle({ icon: Icon, children, extra }: { icon: LucideIcon; children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-sm font-extrabold text-[#F5F5F5]">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
          <Icon className="h-4 w-4" />
        </span>
        {children}
      </h2>
      {extra}
    </div>
  );
}

function Row({ label, children, ltr }: { label: string; children: React.ReactNode; ltr?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.05] py-2.5 last:border-0">
      <dt className="shrink-0 text-xs text-[#8B93A1]">{label}</dt>
      <dd dir={ltr ? "ltr" : undefined} className={cn("min-w-0 break-words text-end text-[13px] font-bold text-[#F5F5F5]", ltr && "font-mono")}>
        {children}
      </dd>
    </div>
  );
}

function CodeChip({ code, label }: { code: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-2 py-1 text-[11px] font-bold text-[#FF8A2A]">
      <Fingerprint className="h-3.5 w-3.5" />
      {label}
      <span dir="ltr" className="font-mono tracking-wider">
        {toPersianDigits(groupCode(code))}
      </span>
    </span>
  );
}

function PersonFlags({ person }: { person: PurchaseRequestPerson }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {person.isCollaborator && (
        <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-1.5 py-0.5 text-[10px] font-bold text-sky-300">همکار</span>
      )}
      {person.isCollaborator && (
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold",
            person.isVerified ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-amber-500/30 bg-amber-500/10 text-amber-300"
          )}
        >
          {person.isVerified ? <BadgeCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
          {person.isVerified ? "احراز شده" : "احراز نشده"}
        </span>
      )}
      {!person.isActive && (
        <span className="rounded-md border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-[10px] font-bold text-red-300">غیرفعال</span>
      )}
    </div>
  );
}

export function PurchaseRequestDetailManager({ request: initial, justSeen }: PurchaseRequestDetailManagerProps) {
  const router = useRouter();
  const [request, setRequest] = useState(initial);
  const [note, setNote] = useState(initial.adminNote);
  const [savedNote, setSavedNote] = useState(initial.adminNote);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [statusBusy, setStatusBusy] = useState(false);
  const [isSavingNote, startNoteTransition] = useTransition();
  const refreshed = useRef(false);

  useEffect(() => setRequest(initial), [initial]);

  // The layout's badge was rendered before this page marked the request seen.
  useEffect(() => {
    if (justSeen && !refreshed.current) {
      refreshed.current = true;
      router.refresh();
    }
  }, [justSeen, router]);

  function showToast(kind: ToastState["kind"], message: string) {
    setToast({ kind, message });
    setTimeout(() => setToast(null), 4000);
  }

  function changeStatus(status: PurchaseRequestStatus) {
    if (status === request.status) return;
    setStatusBusy(true);
    void setPurchaseRequestStatusAction(request.id, status).then((result) => {
      setStatusBusy(false);
      if (result.ok) {
        setRequest((prev) => ({ ...prev, status }));
        showToast("success", `وضعیت به «${PURCHASE_REQUEST_STATUS_LABELS[status]}» تغییر کرد`);
        router.refresh();
      } else {
        showToast("error", result.message);
      }
    });
  }

  function saveNote() {
    startNoteTransition(async () => {
      const result = await savePurchaseRequestNoteAction(request.id, note);
      if (result.ok) {
        setSavedNote(note.trim());
        setNote(note.trim());
        showToast("success", "یادداشت ذخیره شد");
      } else {
        showToast("error", result.message);
      }
    });
  }

  const audience = request.isGuest ? "public" : "members";
  const SourceIcon = request.source === "sale_ad" ? Megaphone : ListOrdered;
  const publicLink = request.source === "sale_ad" ? (request.adId ? `/panel/ads/${request.adId}` : null) : request.carId ? `/panel/price-list/${request.carId}` : null;
  const noteDirty = note.trim() !== savedNote.trim();

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <Link
        href={`/admin/purchase-requests/${audience}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8B93A1] transition-colors hover:text-[#F5F5F5]"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به {PURCHASE_REQUEST_AUDIENCE_LABELS[audience]}
      </Link>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0D1117]">
        <div className="pointer-events-none absolute -top-24 end-[-60px] h-56 w-56 rounded-full bg-[#FF6A00]/15 blur-3xl" aria-hidden="true" />
        <div className="relative grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-[#07090C]">
              {request.carImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={request.carImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <Car className="h-7 w-7 text-[#5E6672]" />
              )}
            </span>
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#8B93A1]">
                <span className="font-mono">درخواست #{toPersianDigits(request.id)}</span>
                <span className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] px-1.5 py-0.5">
                  <SourceIcon className="h-3 w-3 text-[#FF8A2A]" />
                  از {PURCHASE_REQUEST_SOURCE_LABELS[request.source]}
                </span>
                <span className="rounded-md border border-white/[0.08] px-1.5 py-0.5">{request.isGuest ? "کاربر مهمان" : "کاربر واردشده"}</span>
              </p>
              <h1 className="mt-1.5 break-words text-lg font-black leading-8 text-[#F5F5F5] sm:text-xl">{toPersianDigits(request.carLabel)}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <CodeChip code={request.sellerCode} label="فروشنده" />
                {request.adCode && (
                  <span className="rounded-lg border border-white/[0.08] px-2 py-1 text-[11px] font-bold text-[#D2D7DF]">
                    کد آگهی <span className="font-mono">{toPersianDigits(request.adCode)}</span>
                  </span>
                )}
                {(request.year || request.colorName) && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-2 py-1 text-[11px] font-bold text-[#D2D7DF]">
                    {request.colorCode && <ColorSwatch code={request.colorCode} className="h-3 w-3" />}
                    {[request.year && toPersianDigits(request.year), request.colorName].filter(Boolean).join(" · ")}
                  </span>
                )}
                {publicLink && (
                  <a
                    href={publicLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-[#FF8A2A] hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    مشاهده {request.source === "sale_ad" ? "آگهی" : "لیست قیمت"}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2 rounded-2xl border border-white/[0.07] bg-[#07090C]/70 p-3">
            <p className="text-[11px] font-bold text-[#8B93A1]">وضعیت درخواست</p>
            <PurchaseRequestStatusSelect value={request.status} onChange={changeStatus} busy={statusBusy} className="w-full" />
            <div className="space-y-1 pt-1 text-[10px] text-[#5E6672]">
              <p>ثبت: {request.createdAtLabel}</p>
              {request.seenAtLabel && (
                <p className="inline-flex items-center gap-1">
                  <Eye className="h-3 w-3" /> اولین مشاهده: {request.seenAtLabel}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Requester */}
        <section className={cardClass}>
          <CardTitle icon={UserRound} extra={request.requester && <PersonFlags person={request.requester} />}>
            درخواست‌کننده
          </CardTitle>
          <dl>
            <Row label="نام">{request.name}</Row>
            <Row label="شماره موبایل" ltr>
              <a href={`tel:${request.phone}`} className="inline-flex items-center gap-1 hover:text-[#FF8A2A]">
                <Phone className="h-3.5 w-3.5" />
                {request.phone}
              </a>
            </Row>
            {request.isGuest ? (
              <Row label="استان / شهر">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-[#FF8A2A]" />
                  {[request.provinceName, request.cityName].filter(Boolean).join(" · ") || "—"}
                </span>
              </Row>
            ) : (
              <>
                {request.requesterCode && (
                  <Row label="کد کاربر هنگام ثبت" ltr>
                    {toPersianDigits(groupCode(request.requesterCode))}
                  </Row>
                )}
                {request.requester ? (
                  <>
                    {request.requester.code && (
                      <Row label="کد فعلی کاربر" ltr>
                        {toPersianDigits(groupCode(request.requester.code))}
                      </Row>
                    )}
                    {request.requester.companyName && <Row label="نام مجموعه">{request.requester.companyName}</Row>}
                    {request.requester.email && (
                      <Row label="ایمیل" ltr>
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {request.requester.email}
                        </span>
                      </Row>
                    )}
                    {request.requester.address && <Row label="آدرس">{request.requester.address}</Row>}
                  </>
                ) : (
                  <Row label="حساب کاربری">حذف شده</Row>
                )}
              </>
            )}
          </dl>
          {request.requester && (
            <Link
              href={`/admin/users/${request.requester.id}`}
              className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 text-xs font-bold text-[#D2D7DF] hover:border-[#FF6A00]/40 hover:text-[#FF8A2A]"
            >
              پروفایل کاربر در پنل مدیریت
            </Link>
          )}
        </section>

        {/* Seller */}
        <section className={cardClass}>
          <CardTitle icon={Store} extra={request.seller && <PersonFlags person={request.seller} />}>
            فروشنده ({request.source === "sale_ad" ? "صاحب آگهی" : "ثبت‌کننده لیست قیمت"})
          </CardTitle>
          <dl>
            <Row label="کد فروشنده هنگام ثبت" ltr>
              {toPersianDigits(groupCode(request.sellerCode))}
            </Row>
            {request.seller ? (
              <>
                {request.seller.code && request.seller.code !== request.sellerCode && (
                  <Row label="کد فعلی فروشنده" ltr>
                    {toPersianDigits(groupCode(request.seller.code))}
                  </Row>
                )}
                <Row label="نام">{request.seller.name}</Row>
                {request.seller.companyName && <Row label="نام مجموعه">{request.seller.companyName}</Row>}
                <Row label="شماره موبایل" ltr>
                  <a href={`tel:${request.seller.phone}`} className="inline-flex items-center gap-1 hover:text-[#FF8A2A]">
                    <Phone className="h-3.5 w-3.5" />
                    {request.seller.phone}
                  </a>
                </Row>
              </>
            ) : (
              <Row label="حساب کاربری">حذف شده</Row>
            )}
          </dl>
          {request.seller && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/admin/users/${request.seller.id}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 text-xs font-bold text-[#D2D7DF] hover:border-[#FF6A00]/40 hover:text-[#FF8A2A]"
              >
                پروفایل فروشنده
              </Link>
              <Link
                href={`/admin/users/${request.seller.id}/${request.source === "sale_ad" ? "sale-ads" : "price-table"}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 text-xs font-bold text-[#D2D7DF] hover:border-[#FF6A00]/40 hover:text-[#FF8A2A]"
              >
                {request.source === "sale_ad" ? "آگهی‌های فروشنده" : "جدول قیمت فروشنده"}
              </Link>
            </div>
          )}
        </section>

        {/* Prices when sent */}
        <section className={cardClass}>
          <CardTitle
            icon={Tag}
            extra={request.currency && <span className="text-[11px] font-bold text-[#8B93A1]">واحد: {CURRENCY_LABELS[request.currency]}</span>}
          >
            قیمت‌ها هنگام ثبت درخواست
          </CardTitle>
          {request.priceLines.length === 0 ? (
            <p className="text-xs text-[#5E6672]">قیمتی برای نمایش ثبت نشده بود.</p>
          ) : (
            <ul className="divide-y divide-white/[0.05] overflow-hidden rounded-xl border border-white/[0.06] bg-[#07090C]/60">
              {request.priceLines.map((line, index) => (
                <li key={`${line.label}-${index}`} className="flex items-center justify-between gap-3 px-3 py-2">
                  <span className={cn("text-xs", line.partner ? "text-sky-300" : "text-[#D2D7DF]")}>{toPersianDigits(line.label)}</span>
                  <span className={cn("font-mono text-[13px] font-black tabular-nums", line.partner ? "text-sky-300" : "text-[#FF8A2A]")}>
                    {formatPersianNumber(line.price)}
                    {request.currency && <span className="ms-1 text-[10px] font-bold opacity-70">{request.currency === "usd" ? "$" : "ریال"}</span>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Description */}
        <section className={cardClass}>
          <CardTitle icon={MessageSquareText}>توضیحات درخواست‌کننده</CardTitle>
          {request.description ? (
            <p className="whitespace-pre-line break-words rounded-xl bg-white/[0.02] p-3 text-[13px] leading-7 text-[#D2D7DF]">{request.description}</p>
          ) : (
            <p className="text-xs text-[#5E6672]">توضیحی ثبت نشده است.</p>
          )}
        </section>

        {/* Internal note */}
        <section className={cardClass}>
          <CardTitle icon={StickyNote} extra={<span className="text-[10px] text-[#5E6672]">فقط مدیران می‌بینند</span>}>
            یادداشت داخلی
          </CardTitle>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={5}
            maxLength={PURCHASE_REQUEST_NOTE_MAX}
            disabled={isSavingNote}
            placeholder="مثلاً نتیجه تماس، زمان تماس بعدی، توافق‌ها…"
            className="w-full resize-y rounded-xl border border-white/[0.12] bg-[#07090C] px-4 py-3 text-sm leading-7 text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15 disabled:opacity-60"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] text-[#5E6672]">
              {toPersianDigits(note.length)} / {toPersianDigits(PURCHASE_REQUEST_NOTE_MAX)}
            </span>
            <button
              type="button"
              onClick={saveNote}
              disabled={isSavingNote || !noteDirty}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-4 text-xs font-extrabold text-[#07090C] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSavingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              ذخیره یادداشت
            </button>
          </div>
        </section>

        {/* History */}
        <section className={cardClass}>
          <CardTitle icon={History}>تاریخچه تغییر وضعیت</CardTitle>
          <ol className="relative space-y-4 border-s border-white/[0.08] ps-5">
            {request.logs.map((log) => (
              <li key={log.id} className="relative">
                <span className="absolute -start-[1.6rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-[#0D1117] bg-[#FF6A00]" aria-hidden="true" />
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {log.fromStatus && (
                    <>
                      <PurchaseRequestStatusBadge status={log.fromStatus} className="opacity-70" />
                      <span className="text-[#5E6672]">←</span>
                    </>
                  )}
                  <PurchaseRequestStatusBadge status={log.toStatus} />
                </div>
                <p className="mt-1 text-[11px] text-[#8B93A1]">
                  {log.adminName} · {log.createdAtLabel}
                </p>
              </li>
            ))}
            <li className="relative">
              <span className="absolute -start-[1.6rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-[#0D1117] bg-[#5E6672]" aria-hidden="true" />
              <div className="flex items-center gap-1.5 text-xs">
                <PurchaseRequestStatusBadge status="received" />
                <span className="text-[11px] text-[#8B93A1]">ثبت درخواست توسط {request.isGuest ? "کاربر مهمان" : "کاربر"}</span>
              </div>
              <p className="mt-1 text-[11px] text-[#5E6672]">{request.createdAtLabel}</p>
            </li>
          </ol>
        </section>
      </div>
    </div>
  );
}
