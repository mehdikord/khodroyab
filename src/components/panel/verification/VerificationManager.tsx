"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BadgeCheck,
  Building2,
  Clock3,
  FileImage,
  ImagePlus,
  Loader2,
  Plus,
  Send,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";

import { submitVerificationAction } from "@/app/panel/(app)/verification/actions";
import {
  VERIFICATION_DOC_MAX_BYTES,
  VERIFICATION_DOC_MAX_COUNT,
  VERIFICATION_DOC_TITLE_MAX,
  VERIFICATION_PERSON_TYPE_LABELS,
  VERIFICATION_STATUS_LABELS,
  type VerificationPersonType,
  type VerificationRecord,
} from "@/lib/verification-shared";
import { ALLOWED_IMAGE_MIME_TYPES } from "@/lib/validation/brands";
import { cn, toPersianDigits } from "@/lib/utils";

interface VerificationManagerProps {
  collabrate: boolean;
  authenticaed: boolean;
  initialVerification: VerificationRecord | null;
}

interface DocDraft {
  key: string;
  title: string;
  file: File | null;
  previewUrl: string | null;
}

let docSeq = 0;
const newDoc = (): DocDraft => ({ key: `doc-${++docSeq}`, title: "", file: null, previewUrl: null });

const inputClassName = (hasError: boolean) =>
  cn(
    "h-11 w-full rounded-xl border bg-panel-bg px-3.5 text-sm text-panel-text outline-none transition-all placeholder:text-panel-faint disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-panel-line/[0.12] hover:border-panel-line/20"
  );

const cardClass = "admin-animate-in rounded-3xl border border-panel-line/[0.08] bg-panel-surface p-4 sm:p-5";

const PERSON_TYPE_ICONS: Record<VerificationPersonType, typeof UserRound> = { natural: UserRound, legal: Building2 };

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[11px] font-semibold text-panel-danger-2">{message}</p>;
}

/** Read-only list of the submitted documents (thumbnails open the full image). */
function SubmittedDocuments({ record }: { record: VerificationRecord }) {
  return (
    <section className={cardClass}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-extrabold text-panel-text">مدارک ارسال‌شده</h2>
        <span className="text-[11px] text-panel-faint">
          نوع کاربری: <span className="font-bold text-panel-text-2">{VERIFICATION_PERSON_TYPE_LABELS[record.personType]}</span> · ارسال در{" "}
          {record.submittedAtLabel}
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {record.documents.map((doc) => (
          <li key={doc.id}>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 transition-colors hover:border-[#FF6A00]/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={doc.url} alt={doc.title} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              <p className="truncate px-2.5 py-2 text-[11px] font-bold text-panel-text-2 group-hover:text-panel-accent">{doc.title}</p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Identity verification of a collaborator. Shows the review state of the last
 * submission (pending / approved / rejected with the admin's reason) and, when
 * nothing is under review, the form: person type plus any number of titled
 * document images (up to the limit).
 */
export function VerificationManager({ collabrate, authenticaed, initialVerification }: VerificationManagerProps) {
  const router = useRouter();
  const [record, setRecord] = useState<VerificationRecord | null>(initialVerification);
  const [personType, setPersonType] = useState<VerificationPersonType | "">(initialVerification?.personType ?? "");
  const [docs, setDocs] = useState<DocDraft[]>(() => [newDoc()]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const topRef = useRef<HTMLDivElement>(null);
  const previewsRef = useRef<string[]>([]);

  useEffect(() => {
    previewsRef.current = docs.map((doc) => doc.previewUrl).filter((url): url is string => Boolean(url));
  }, [docs]);
  useEffect(() => () => previewsRef.current.forEach((url) => URL.revokeObjectURL(url)), []);

  if (!collabrate) {
    return (
      <div className={cn(cardClass, "py-12 text-center")}>
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-bg text-panel-faint">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <p className="mt-4 text-sm font-extrabold text-panel-text">احراز هویت برای کاربران همکار است</p>
        <p className="mt-1.5 text-xs leading-6 text-panel-muted">
          پس از فعال شدن حساب همکاری توسط مدیر، می‌توانید مدارک هویتی خود را از این صفحه ارسال کنید.
        </p>
      </div>
    );
  }

  const canSubmit = !record || record.status === "rejected";

  function updateDoc(key: string, patch: Partial<DocDraft>) {
    setDocs((prev) => prev.map((doc) => (doc.key === key ? { ...doc, ...patch } : doc)));
  }

  function chooseFile(doc: DocDraft, file: File | null) {
    if (doc.previewUrl) URL.revokeObjectURL(doc.previewUrl);
    let error: string | undefined;
    if (file && !(ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type)) error = "فقط تصویر PNG، JPG، WEBP یا AVIF پذیرفته می‌شود";
    else if (file && file.size > VERIFICATION_DOC_MAX_BYTES) error = "حجم هر تصویر نباید بیشتر از ۳ مگابایت باشد";
    const index = docs.findIndex((item) => item.key === doc.key);
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (error) next[`documents.${index}.file`] = error;
      else delete next[`documents.${index}.file`];
      return next;
    });
    if (error || !file) updateDoc(doc.key, { file: null, previewUrl: null });
    else updateDoc(doc.key, { file, previewUrl: URL.createObjectURL(file) });
  }

  function removeDoc(doc: DocDraft) {
    if (doc.previewUrl) URL.revokeObjectURL(doc.previewUrl);
    setDocs((prev) => (prev.length <= 1 ? [newDoc()] : prev.filter((item) => item.key !== doc.key)));
    setFieldErrors({});
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const formData = new FormData();
    formData.set("personType", personType);
    for (const doc of docs) {
      formData.append("docTitle", doc.title);
      formData.append("docFile", doc.file ?? new File([], "empty"));
    }

    startTransition(async () => {
      const result = await submitVerificationAction(formData);
      if (result.ok) {
        docs.forEach((doc) => doc.previewUrl && URL.revokeObjectURL(doc.previewUrl));
        setRecord(result.record);
        setDocs([newDoc()]);
        router.refresh();
      } else {
        setFormError(result.message);
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      }
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div ref={topRef} className="scroll-mt-20 space-y-5">
      <div className="admin-animate-in">
        <h1 className="flex items-center gap-2 text-xl font-black text-panel-text sm:text-2xl">
          <ShieldCheck className="h-5 w-5 text-panel-accent" />
          احراز هویت
        </h1>
        <p className="mt-1 text-xs leading-6 text-panel-muted sm:text-sm">
          برای ثبت آگهی و جدول قیمت و مشاهده قیمت‌های همکاری، مدارک هویتی خود را ارسال کنید تا توسط مدیر بررسی شود.
        </p>
      </div>

      {/* Review state */}
      {record?.status === "approved" && authenticaed && (
        <div role="status" className="admin-animate-in flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5">
          <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-panel-success" />
          <div>
            <p className="text-sm font-extrabold text-panel-success">احراز هویت شما تایید شده است</p>
            <p className="mt-1 text-xs leading-6 text-panel-text-2">اکنون می‌توانید آگهی و جدول قیمت ثبت کنید و قیمت‌های همکاری را ببینید.</p>
          </div>
        </div>
      )}
      {record?.status === "pending" && (
        <div role="status" className="admin-animate-in flex items-start gap-3 rounded-2xl border border-panel-warning/30 bg-panel-warning/10 px-4 py-3.5">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-panel-warning" />
          <div>
            <p className="text-sm font-extrabold text-panel-warning">{VERIFICATION_STATUS_LABELS.pending}</p>
            <p className="mt-1 text-xs leading-6 text-panel-text-2">مدارک شما ارسال شده و پس از بررسی مدیر، نتیجه در همین صفحه نمایش داده می‌شود.</p>
          </div>
        </div>
      )}
      {record?.status === "rejected" && (
        <div role="alert" className="admin-animate-in flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-panel-danger-2" />
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-panel-danger-2">احراز هویت شما رد شد</p>
            {record.rejectReason && (
              <p className="mt-1.5 whitespace-pre-line break-words text-xs leading-6 text-panel-text-2">
                <span className="font-bold">دلیل رد: </span>
                {record.rejectReason}
              </p>
            )}
            <p className="mt-1.5 text-[11px] leading-5 text-panel-muted">لطفاً مدارک را اصلاح کرده و دوباره ارسال کنید.</p>
          </div>
        </div>
      )}

      {record && !canSubmit && <SubmittedDocuments record={record} />}

      {canSubmit && (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {formError && (
            <div role="alert" className="admin-animate-in flex items-start gap-2.5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-semibold leading-5 text-panel-danger-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <section className={cardClass}>
            <h2 className="text-sm font-extrabold text-panel-text">
              نوع کاربری <span className="text-[#FF6A00]">*</span>
            </h2>
            <div role="radiogroup" aria-label="نوع کاربری" className="mt-3 grid grid-cols-2 gap-2 sm:max-w-md">
              {(Object.keys(VERIFICATION_PERSON_TYPE_LABELS) as VerificationPersonType[]).map((type) => {
                const Icon = PERSON_TYPE_ICONS[type];
                const active = personType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    disabled={isPending}
                    onClick={() => setPersonType(type)}
                    className={cn(
                      "flex h-14 items-center justify-center gap-2 rounded-2xl border text-sm font-extrabold transition-all disabled:opacity-60",
                      active
                        ? "border-[#FF6A00]/60 bg-[#FF6A00]/10 text-panel-accent shadow-orange-subtle"
                        : "border-panel-line/[0.12] bg-panel-bg text-panel-text-2 hover:border-panel-line/25"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {VERIFICATION_PERSON_TYPE_LABELS[type]}
                  </button>
                );
              })}
            </div>
            <FieldError message={fieldErrors.personType} />
          </section>

          <section className={cardClass}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-extrabold text-panel-text">
                  مدارک هویتی <span className="text-[#FF6A00]">*</span>
                </h2>
                <p className="mt-0.5 text-[11px] text-panel-faint">
                  برای هر مدرک یک عنوان و یک تصویر وارد کنید (حداکثر {toPersianDigits(VERIFICATION_DOC_MAX_COUNT)} مدرک، هر تصویر تا ۳ مگابایت).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDocs((prev) => [...prev, newDoc()])}
                disabled={isPending || docs.length >= VERIFICATION_DOC_MAX_COUNT}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-[#FF6A00]/40 bg-[#FF6A00]/[0.05] px-3.5 text-xs font-extrabold text-panel-accent transition-all hover:border-solid hover:bg-[#FF6A00]/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
                افزودن مدرک
              </button>
            </div>
            <FieldError message={fieldErrors.documents} />

            <ul className="space-y-3">
              {docs.map((doc, index) => {
                const titleError = fieldErrors[`documents.${index}.title`];
                const fileError = fieldErrors[`documents.${index}.file`];
                return (
                  <li key={doc.key} className="admin-animate-fade flex flex-col gap-3 rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 p-3 sm:flex-row sm:items-start">
                    <label
                      className={cn(
                        "relative flex h-28 w-full shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed bg-panel-surface transition-colors sm:w-36",
                        fileError ? "border-red-500/50" : "border-panel-line/[0.15] hover:border-[#FF6A00]/50"
                      )}
                    >
                      {doc.previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={doc.previewUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex flex-col items-center gap-1.5 text-[11px] font-bold text-panel-faint">
                          <ImagePlus className="h-5 w-5" />
                          انتخاب تصویر
                        </span>
                      )}
                      <input
                        type="file"
                        accept={ALLOWED_IMAGE_MIME_TYPES.join(",")}
                        disabled={isPending}
                        onChange={(e) => chooseFile(doc, e.target.files?.[0] ?? null)}
                        className="sr-only"
                        aria-label={`تصویر مدرک ${toPersianDigits(index + 1)}`}
                      />
                    </label>
                    <div className="min-w-0 flex-1">
                      <label htmlFor={`${doc.key}-title`} className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-panel-text-2">
                        <FileImage className="h-3.5 w-3.5 text-panel-accent" />
                        عنوان مدرک {toPersianDigits(index + 1)}
                      </label>
                      <input
                        id={`${doc.key}-title`}
                        type="text"
                        value={doc.title}
                        maxLength={VERIFICATION_DOC_TITLE_MAX}
                        disabled={isPending}
                        onChange={(e) => updateDoc(doc.key, { title: e.target.value })}
                        placeholder="مثلاً: کارت ملی، روزنامه رسمی، جواز کسب"
                        className={inputClassName(Boolean(titleError))}
                      />
                      <FieldError message={titleError} />
                      <FieldError message={fileError} />
                      {doc.file && !fileError && <p className="mt-1 truncate text-[10px] text-panel-faint">{doc.file.name}</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDoc(doc)}
                      disabled={isPending}
                      title="حذف این مدرک"
                      aria-label={`حذف مدرک ${toPersianDigits(index + 1)}`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-xl border border-panel-line/[0.1] text-panel-faint transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-panel-danger sm:self-start disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Link
              href="/panel/dashboard"
              className="flex h-12 items-center justify-center rounded-xl border border-panel-line/[0.12] px-5 text-sm font-bold text-panel-text-2 transition-colors hover:border-panel-line/25 hover:text-panel-text"
            >
              بازگشت
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-6 text-sm font-extrabold text-[#07090C] shadow-orange-subtle transition-all hover:brightness-110 disabled:opacity-60"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              ارسال مدارک برای بررسی
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
