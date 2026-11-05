"use client";

import React, { useEffect, useId, useRef, useState, useTransition } from "react";
import { AlertCircle, BadgeCheck, Building2, FileImage, ImagePlus, Info, Loader2, Plus, Save, Trash2, UserRound } from "lucide-react";

import { Modal } from "@/components/admin/ui/Modal";
import { adminSubmitVerificationAction } from "@/app/admin/(panel)/users/[id]/verification-actions";
import {
  VERIFICATION_DOC_HINTS,
  VERIFICATION_DOC_MAX_BYTES,
  VERIFICATION_DOC_MAX_COUNT,
  VERIFICATION_DOC_TITLE_MAX,
  VERIFICATION_DOC_TITLE_PLACEHOLDERS,
  VERIFICATION_IDENTITY_FIELDS,
  VERIFICATION_PERSON_TYPE_LABELS,
  type VerificationIdentityField,
  type VerificationPersonType,
  type VerificationRecord,
} from "@/lib/verification-shared";
import { ALLOWED_IMAGE_MIME_TYPES } from "@/lib/validation/brands";
import { cn, toPersianDigits } from "@/lib/utils";

interface AdminVerificationFormProps {
  userId: string;
  /** Current submission, used to prefill the person type and identity details. */
  current: VerificationRecord | null;
  onClose: () => void;
  onSaved: (verification: VerificationRecord, authenticaed: boolean, approved: boolean) => void;
}

interface DocDraft {
  key: string;
  title: string;
  file: File | null;
  previewUrl: string | null;
}

type IdentityDraft = Record<VerificationIdentityField, string>;

let docSeq = 0;
const newDoc = (): DocDraft => ({ key: `admin-doc-${++docSeq}`, title: "", file: null, previewUrl: null });

const PERSON_TYPE_ICONS: Record<VerificationPersonType, typeof UserRound> = { natural: UserRound, legal: Building2 };

const inputClassName = (hasError: boolean) =>
  cn(
    "h-10 w-full rounded-xl border bg-[#07090C] px-3 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] disabled:opacity-60",
    hasError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20 focus:border-[#FF6A00]"
  );

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-[11px] font-semibold text-red-400">{message}</p>;
}

/**
 * Dialog where an administrator fills in a collaborator's identity form and
 * uploads their documents on the user's behalf, optionally approving it at once.
 * The new submission replaces whatever the user sent before.
 */
export function AdminVerificationForm({ userId, current, onClose, onSaved }: AdminVerificationFormProps) {
  const formId = useId();
  const [personType, setPersonType] = useState<VerificationPersonType | "">(current?.personType ?? "");
  const [identity, setIdentity] = useState<IdentityDraft>({
    fullName: current?.identity.fullName ?? "",
    nationalCode: current?.identity.nationalCode ?? "",
    companyName: current?.identity.companyName ?? "",
    companyNationalId: current?.identity.companyNationalId ?? "",
  });
  const [docs, setDocs] = useState<DocDraft[]>(() => [newDoc()]);
  const [approve, setApprove] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const previewsRef = useRef<string[]>([]);

  useEffect(() => {
    previewsRef.current = docs.map((doc) => doc.previewUrl).filter((url): url is string => Boolean(url));
  }, [docs]);
  useEffect(() => () => previewsRef.current.forEach((url) => URL.revokeObjectURL(url)), []);

  function clearError(key: string) {
    if (!fieldErrors[key]) return;
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function updateDoc(key: string, patch: Partial<DocDraft>) {
    setDocs((prev) => prev.map((doc) => (doc.key === key ? { ...doc, ...patch } : doc)));
  }

  function chooseFile(doc: DocDraft, index: number, file: File | null) {
    if (doc.previewUrl) URL.revokeObjectURL(doc.previewUrl);
    let error: string | undefined;
    if (file && !(ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type)) error = "فقط تصویر PNG، JPG، WEBP یا AVIF پذیرفته می‌شود";
    else if (file && file.size > VERIFICATION_DOC_MAX_BYTES) error = "حجم هر تصویر نباید بیشتر از ۳ مگابایت باشد";
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
    if (personType) {
      for (const field of VERIFICATION_IDENTITY_FIELDS[personType]) formData.set(field.key, identity[field.key]);
    }
    for (const doc of docs) {
      formData.append("docTitle", doc.title);
      formData.append("docFile", doc.file ?? new File([], "empty"));
    }
    if (approve) formData.set("approve", "1");

    startTransition(async () => {
      const result = await adminSubmitVerificationAction(userId, formData);
      if (result.ok) {
        onSaved(result.verification, result.authenticaed, approve);
      } else {
        setFormError(result.message);
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      }
    });
  }

  return (
    <Modal
      open
      onClose={() => !isPending && onClose()}
      title={current ? "ثبت مجدد مدارک احراز هویت" : "ثبت مدارک احراز هویت"}
      description={
        current
          ? "مدارک و اطلاعات جدید جایگزین مدارک فعلی کاربر می‌شود."
          : "اطلاعات و مدارک هویتی را به جای کاربر وارد کنید."
      }
      size="lg"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-[#D2D7DF]">
            <input
              type="checkbox"
              checked={approve}
              onChange={(e) => setApprove(e.target.checked)}
              disabled={isPending}
              className="h-4 w-4 accent-[#FF6A00]"
            />
            <BadgeCheck className="h-4 w-4 text-emerald-400" />
            تایید هم‌زمان احراز هویت
          </label>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isPending} className="px-4 py-2 text-sm text-[#D2D7DF]">
              انصراف
            </button>
            <button
              type="submit"
              form={formId}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-4 py-2 text-sm font-extrabold text-[#07090C] transition-all hover:brightness-110 disabled:opacity-60"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {approve ? "ثبت و تایید" : "ثبت مدارک"}
            </button>
          </div>
        </div>
      }
    >
      <form id={formId} onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
          <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs font-semibold leading-5 text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div>
          <p className="text-sm font-bold text-[#F5F5F5]">
            نوع کاربری <span className="text-[#FF6A00]">*</span>
          </p>
          <div role="radiogroup" aria-label="نوع کاربری" className="mt-2 grid grid-cols-2 gap-2 sm:max-w-sm">
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
                  onClick={() => {
                    setPersonType(type);
                    clearError("personType");
                  }}
                  className={cn(
                    "flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-extrabold transition-all disabled:opacity-60",
                    active ? "border-[#FF6A00]/60 bg-[#FF6A00]/10 text-[#FF8A2A]" : "border-white/[0.12] bg-[#07090C] text-[#D2D7DF] hover:border-white/25"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {VERIFICATION_PERSON_TYPE_LABELS[type]}
                </button>
              );
            })}
          </div>
          <FieldError message={fieldErrors.personType} />
        </div>

        {personType && (
          <div className="grid gap-3 sm:grid-cols-2">
            {VERIFICATION_IDENTITY_FIELDS[personType].map((field) => {
              const error = fieldErrors[field.key];
              const inputId = `${formId}-${field.key}`;
              return (
                <div key={field.key}>
                  <label htmlFor={inputId} className="mb-1 block text-xs font-bold text-[#D2D7DF]">
                    {field.label} <span className="text-[#FF6A00]">*</span>
                  </label>
                  <input
                    id={inputId}
                    type="text"
                    inputMode={field.numeric ? "numeric" : undefined}
                    dir={field.numeric ? "ltr" : undefined}
                    autoComplete="off"
                    value={identity[field.key]}
                    maxLength={field.maxLength}
                    disabled={isPending}
                    onChange={(e) => {
                      setIdentity((prev) => ({ ...prev, [field.key]: e.target.value }));
                      clearError(field.key);
                    }}
                    placeholder={field.placeholder}
                    aria-invalid={Boolean(error)}
                    className={cn(inputClassName(Boolean(error)), field.numeric && "text-left placeholder:text-right")}
                  />
                  <FieldError message={error} />
                </div>
              );
            })}
          </div>
        )}

        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-[#F5F5F5]">
                مدارک هویتی <span className="text-[#FF6A00]">*</span>
              </p>
              <p className="mt-0.5 text-[11px] text-[#5E6672]">
                حداکثر {toPersianDigits(VERIFICATION_DOC_MAX_COUNT)} مدرک، هر تصویر تا ۳ مگابایت
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDocs((prev) => [...prev, newDoc()])}
              disabled={isPending || docs.length >= VERIFICATION_DOC_MAX_COUNT}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-dashed border-[#FF6A00]/40 bg-[#FF6A00]/[0.05] px-3 text-xs font-bold text-[#FF8A2A] transition-all hover:bg-[#FF6A00]/10 disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
              افزودن مدرک
            </button>
          </div>
          {personType && (
            <p className="mb-2 flex items-start gap-2 rounded-xl border border-[#FF6A00]/25 bg-[#FF6A00]/[0.06] px-3 py-2 text-[11px] font-bold leading-5 text-[#D2D7DF]">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FF8A2A]" />
              {VERIFICATION_DOC_HINTS[personType]}
            </p>
          )}
          <FieldError message={fieldErrors.documents} />

          <ul className="space-y-2">
            {docs.map((doc, index) => {
              const titleError = fieldErrors[`documents.${index}.title`];
              const fileError = fieldErrors[`documents.${index}.file`];
              return (
                <li key={doc.key} className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-[#07090C]/60 p-2.5 sm:flex-row sm:items-start">
                  <label
                    className={cn(
                      "relative flex h-24 w-full shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed bg-[#0D1117] transition-colors sm:w-32",
                      fileError ? "border-red-500/50" : "border-white/[0.15] hover:border-[#FF6A00]/50"
                    )}
                  >
                    {doc.previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={doc.previewUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex flex-col items-center gap-1 text-[11px] font-bold text-[#5E6672]">
                        <ImagePlus className="h-5 w-5" />
                        انتخاب تصویر
                      </span>
                    )}
                    <input
                      type="file"
                      accept={ALLOWED_IMAGE_MIME_TYPES.join(",")}
                      disabled={isPending}
                      onChange={(e) => chooseFile(doc, index, e.target.files?.[0] ?? null)}
                      className="sr-only"
                      aria-label={`تصویر مدرک ${toPersianDigits(index + 1)}`}
                    />
                  </label>
                  <div className="min-w-0 flex-1">
                    <label htmlFor={`${doc.key}-title`} className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[#D2D7DF]">
                      <FileImage className="h-3.5 w-3.5 text-[#FF8A2A]" />
                      عنوان مدرک {toPersianDigits(index + 1)}
                    </label>
                    <input
                      id={`${doc.key}-title`}
                      type="text"
                      value={doc.title}
                      maxLength={VERIFICATION_DOC_TITLE_MAX}
                      disabled={isPending}
                      onChange={(e) => {
                        updateDoc(doc.key, { title: e.target.value });
                        clearError(`documents.${index}.title`);
                      }}
                      placeholder={personType ? VERIFICATION_DOC_TITLE_PLACEHOLDERS[personType] : "مثلاً: کارت ملی، جواز کسب"}
                      className={inputClassName(Boolean(titleError))}
                    />
                    <FieldError message={titleError} />
                    <FieldError message={fileError} />
                    {doc.file && !fileError && <p className="mt-1 truncate text-[10px] text-[#5E6672]">{doc.file.name}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDoc(doc)}
                    disabled={isPending}
                    title="حذف این مدرک"
                    aria-label={`حذف مدرک ${toPersianDigits(index + 1)}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-lg border border-white/[0.1] text-[#5E6672] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40 sm:self-start"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </form>
    </Modal>
  );
}
