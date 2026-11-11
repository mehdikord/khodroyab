"use client";

import React, { useId, useMemo, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { AlertCircle, Building2, ListOrdered, Loader2, MapPin, Phone, UserRound } from "lucide-react";

import { Modal } from "@/components/admin/ui/Modal";
import { Toggle } from "@/components/admin/ui/Toggle";
import { SearchableSelect } from "@/components/admin/ui/SearchableSelect";
import { createBranchAction, updateBranchAction } from "@/app/admin/(panel)/branches/actions";
import type { BranchRecord, ProvinceOption } from "@/lib/branches";
import type { GeoPoint } from "@/lib/system-settings-shared";
import {
  BRANCH_ADDRESS_MAX_LENGTH,
  BRANCH_MANAGER_MAX_LENGTH,
  BRANCH_TITLE_MAX_LENGTH,
} from "@/lib/validation/branches";
import { cn, toPersianDigits } from "@/lib/utils";

// Leaflet needs `window`; load the picker on the client only.
const LocationPicker = dynamic(() => import("@/components/maps/LocationPicker"), {
  ssr: false,
  loading: () => <div className="h-[280px] animate-pulse rounded-2xl border border-white/[0.08] bg-[#0b0e13] sm:h-[320px]" />,
});

interface BranchFormModalProps {
  mode: "create" | "edit";
  branch: BranchRecord | null;
  provinces: ProvinceOption[];
  /** Position a new branch gets when the order field is left blank. */
  nextOrder: number;
  onClose: () => void;
  onSuccess: (record: BranchRecord) => void;
  onError: (message: string) => void;
}

const inputClassName = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-[#07090C] px-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20"
  );

function FieldLabel({ htmlFor, icon: Icon, children, required }: { htmlFor?: string; icon: React.ElementType; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-[#F5F5F5]">
      <Icon className="h-4 w-4 text-[#FF8A2A]" />
      {children}
      {required && <span className="text-[#FF6A00]">*</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-xs text-red-400">{message}</p> : null;
}

/** Create/Edit modal for a branch: province → city, title, manager, phone, address, map location, order, active flag. */
export function BranchFormModal({ mode, branch, provinces, nextOrder, onClose, onSuccess, onError }: BranchFormModalProps) {
  const isEdit = mode === "edit";
  const provinceFieldId = useId();
  const cityFieldId = useId();
  const titleId = useId();
  const managerId = useId();
  const phoneId = useId();
  const addressId = useId();
  const orderId = useId();

  const [provinceId, setProvinceId] = useState(branch ? String(branch.provinceId) : "");
  const [cityId, setCityId] = useState(branch ? String(branch.cityId) : "");
  const [title, setTitle] = useState(branch?.title ?? "");
  const [managerName, setManagerName] = useState(branch?.managerName ?? "");
  const [phone, setPhone] = useState(branch?.phone ?? "");
  const [address, setAddress] = useState(branch?.address ?? "");
  const [location, setLocation] = useState<GeoPoint | null>(branch ? { lat: branch.latitude, lng: branch.longitude } : null);
  const [sortOrder, setSortOrder] = useState(branch ? String(branch.sortOrder) : "");
  const [isActive, setIsActive] = useState(branch?.isActive ?? true);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const provinceOptions = useMemo(() => provinces.map((p) => ({ value: String(p.id), label: p.name })), [provinces]);
  const province = provinces.find((p) => String(p.id) === provinceId) ?? null;
  const cityOptions = useMemo(
    () => (province ? province.cities.map((c) => ({ value: String(c.id), label: c.name })) : []),
    [province]
  );
  const cityName = province?.cities.find((c) => String(c.id) === cityId)?.name;
  const focusQuery = province ? [cityName, province.name.replace(/^شهرستانهای\s+/, ""), "ایران"].filter(Boolean).join("، ") : "";

  function clearError(key: string) {
    setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const formData = new FormData();
    formData.set("provinceId", provinceId);
    formData.set("cityId", cityId);
    formData.set("title", title);
    formData.set("managerName", managerName);
    formData.set("phone", phone);
    formData.set("address", address);
    formData.set("latitude", location ? String(location.lat) : "");
    formData.set("longitude", location ? String(location.lng) : "");
    formData.set("sortOrder", sortOrder);
    formData.set("isActive", String(isActive));

    startTransition(async () => {
      const result = isEdit ? await updateBranchAction(branch!.id, formData) : await createBranchAction(formData);
      if (result.ok) {
        onSuccess(result.record);
      } else {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        setFormError(result.message);
        onError(result.message);
      }
    });
  }

  return (
    <Modal
      open
      onClose={isPending ? () => undefined : onClose}
      title={isEdit ? "ویرایش شعبه" : "افزودن شعبه جدید"}
      description={isEdit ? `به‌روزرسانی اطلاعات «${branch?.title ?? ""}»` : "شعبه فعال در صفحه «تماس با ما» پنل کاربران نمایش داده می‌شود"}
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-12 rounded-xl border border-white/[0.12] px-5 text-sm font-bold text-[#D2D7DF] transition-colors hover:border-white/25 hover:text-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            انصراف
          </button>
          <button
            type="submit"
            form="branch-form"
            disabled={isPending}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-6 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 hover:shadow-[0_0_36px_rgba(255,106,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isPending ? (
              <>
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
                {isEdit ? "در حال ذخیره…" : "در حال ایجاد…"}
              </>
            ) : isEdit ? (
              "ذخیره تغییرات"
            ) : (
              "افزودن شعبه"
            )}
          </button>
        </>
      }
    >
      <form id="branch-form" onSubmit={handleSubmit} noValidate aria-busy={isPending} className="space-y-5">
        {formError && (
          <div role="alert" className="admin-animate-in flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-red-200">
            <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-red-400" />
            <span className="leading-6">{formError}</span>
          </div>
        )}

        {/* Province → City */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor={provinceFieldId} icon={MapPin} required>
              استان
            </FieldLabel>
            <SearchableSelect
              id={provinceFieldId}
              value={provinceId}
              onChange={(value) => {
                setProvinceId(value);
                if (value !== provinceId) setCityId("");
                clearError("provinceId");
                clearError("cityId");
              }}
              options={provinceOptions}
              placeholder="انتخاب استان…"
              searchPlaceholder="جستجوی استان…"
              disabled={isPending}
              hasError={Boolean(fieldErrors.provinceId)}
            />
            <FieldError message={fieldErrors.provinceId} />
          </div>
          <div>
            <FieldLabel htmlFor={cityFieldId} icon={MapPin} required>
              شهر
            </FieldLabel>
            <SearchableSelect
              key={provinceId || "none"}
              id={cityFieldId}
              value={cityId}
              onChange={(value) => {
                setCityId(value);
                clearError("cityId");
              }}
              options={cityOptions}
              placeholder={province ? "انتخاب شهر…" : "ابتدا استان را انتخاب کنید"}
              searchPlaceholder="جستجوی شهر…"
              emptyText={province ? "شهری یافت نشد" : "ابتدا استان را انتخاب کنید"}
              disabled={isPending || !province}
              hasError={Boolean(fieldErrors.cityId)}
            />
            <FieldError message={fieldErrors.cityId} />
          </div>
        </div>

        {/* Title */}
        <div>
          <FieldLabel htmlFor={titleId} icon={Building2} required>
            عنوان شعبه
          </FieldLabel>
          <input
            id={titleId}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              clearError("title");
            }}
            data-autofocus
            maxLength={BRANCH_TITLE_MAX_LENGTH}
            placeholder="مثلاً: شعبه مرکزی تهران"
            autoComplete="off"
            disabled={isPending}
            aria-invalid={Boolean(fieldErrors.title)}
            className={inputClassName(Boolean(fieldErrors.title))}
          />
          <FieldError message={fieldErrors.title} />
        </div>

        {/* Manager + phone */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor={managerId} icon={UserRound} required>
              نام مدیر شعبه
            </FieldLabel>
            <input
              id={managerId}
              type="text"
              value={managerName}
              onChange={(e) => {
                setManagerName(e.target.value);
                clearError("managerName");
              }}
              maxLength={BRANCH_MANAGER_MAX_LENGTH}
              placeholder="مثلاً: علی رضایی"
              autoComplete="off"
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.managerName)}
              className={inputClassName(Boolean(fieldErrors.managerName))}
            />
            <FieldError message={fieldErrors.managerName} />
          </div>
          <div>
            <FieldLabel htmlFor={phoneId} icon={Phone} required>
              شماره تماس
            </FieldLabel>
            <input
              id={phoneId}
              type="tel"
              dir="ltr"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                clearError("phone");
              }}
              maxLength={20}
              placeholder="021 1234 5678"
              autoComplete="off"
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.phone)}
              className={cn(inputClassName(Boolean(fieldErrors.phone)), "text-left font-mono")}
            />
            <FieldError message={fieldErrors.phone} />
          </div>
        </div>

        {/* Address (optional) */}
        <div>
          <FieldLabel htmlFor={addressId} icon={MapPin}>
            آدرس <span className="text-[11px] font-normal text-[#5E6672]">(اختیاری)</span>
          </FieldLabel>
          <textarea
            id={addressId}
            rows={2}
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              clearError("address");
            }}
            maxLength={BRANCH_ADDRESS_MAX_LENGTH}
            placeholder="مثلاً: خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲"
            disabled={isPending}
            aria-invalid={Boolean(fieldErrors.address)}
            className={cn(inputClassName(Boolean(fieldErrors.address)), "h-auto resize-y py-3 leading-7")}
          />
          <FieldError message={fieldErrors.address} />
        </div>

        {/* Location */}
        <div>
          <FieldLabel icon={MapPin} required>
            موقعیت شعبه روی نقشه
          </FieldLabel>
          <LocationPicker
            value={location}
            onChange={(point) => {
              setLocation(point);
              clearError("location");
            }}
            focusQuery={focusQuery}
            disabled={isPending}
            hasError={Boolean(fieldErrors.location)}
          />
          <FieldError message={fieldErrors.location} />
        </div>

        {/* Order + active */}
        <div className="grid gap-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <FieldLabel htmlFor={orderId} icon={ListOrdered}>
              ترتیب نمایش
            </FieldLabel>
            <input
              id={orderId}
              type="text"
              inputMode="numeric"
              dir="ltr"
              value={toPersianDigits(sortOrder)}
              onChange={(e) => {
                setSortOrder(
                  e.target.value
                    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
                    .replace(/[^\d]/g, "")
                    .slice(0, 4)
                );
                clearError("sortOrder");
              }}
              placeholder={isEdit ? "" : `خودکار (${toPersianDigits(nextOrder)})`}
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.sortOrder)}
              className={cn(inputClassName(Boolean(fieldErrors.sortOrder)), "text-left font-mono placeholder:text-right placeholder:font-sans")}
            />
            <FieldError message={fieldErrors.sortOrder} />
          </div>
          <div className="flex items-center justify-between gap-4 self-end rounded-2xl border border-white/[0.08] bg-[#0A0D12] px-4 py-3">
            <div>
              <p className="text-sm font-bold text-[#F5F5F5]">نمایش در صفحه تماس با ما</p>
              <p className="mt-0.5 text-[11px] text-[#5E6672]">شعبه غیرفعال به کاربران نمایش داده نمی‌شود.</p>
            </div>
            <Toggle checked={isActive} onCheckedChange={setIsActive} label="وضعیت فعال شعبه" disabled={isPending} />
          </div>
        </div>
      </form>
    </Modal>
  );
}
