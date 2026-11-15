"use client";

import React, { useId, useRef, useState, useTransition } from "react";
import {
  AlertCircle,
  AlertTriangle,
  BadgeDollarSign,
  Check,
  ExternalLink,
  Headset,
  Info,
  Instagram,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  Map as MapIcon,
  RefreshCcw,
  Save,
  Search,
  Send,
  Settings,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { Toggle } from "@/components/admin/ui/Toggle";
import { PRICE_TABLE_PRICE_FIELDS, type PriceTablePriceField } from "@/lib/price-table-shared";
import { saveSystemSettingsAction } from "@/app/admin/(panel)/settings/actions";
import {
  MAX_ABOUT_TEXT_LENGTH,
  MAX_AD_PAGE_NOTICE_LENGTH,
  MAX_CONTACT_ADDRESS_LENGTH,
  MAX_USER_CODE_ROTATION_MINUTES,
  MIN_USER_CODE_ROTATION_MINUTES,
  type SystemSettings,
} from "@/lib/system-settings-shared";
import { cn, toPersianDigits } from "@/lib/utils";

export interface SettingsProvinceOption {
  id: number;
  name: string;
  cityCount: number;
}

interface SystemSettingsFormProps {
  initialSettings: SystemSettings;
  /** Every province of the system, alphabetically. */
  provinces: SettingsProvinceOption[];
}

const inputClassName = (hasError: boolean) =>
  cn(
    "w-full rounded-xl border bg-[#07090C] px-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20"
  );

function SettingCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#0D1117] p-5 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-extrabold text-[#F5F5F5]">{title}</h2>
          <p className="mt-1 text-xs leading-6 text-[#8B93A1]">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

type ContactField =
  | "contactPhone"
  | "contactPostalCode"
  | "contactAddress"
  | "contactTelegram"
  | "contactWhatsapp"
  | "contactInstagram"
  | "contactLocation";

type ContactValues = Record<ContactField, string>;

function pickContact(settings: SystemSettings): ContactValues {
  return {
    contactPhone: settings.contactPhone,
    contactPostalCode: settings.contactPostalCode,
    contactAddress: settings.contactAddress,
    contactTelegram: settings.contactTelegram,
    contactWhatsapp: settings.contactWhatsapp,
    contactInstagram: settings.contactInstagram,
    contactLocation: settings.contactLocation,
  };
}

/** One single-line input of the contact-page card. */
function ContactInput({
  name,
  label,
  icon: Icon,
  value,
  error,
  hint,
  placeholder,
  ltr,
  inputMode,
  maxLength,
  disabled,
  onChange,
}: {
  name: ContactField;
  label: string;
  icon: LucideIcon;
  value: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  ltr?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  disabled: boolean;
  onChange: (name: ContactField, value: string) => void;
}) {
  const id = useId();
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[#D2D7DF]">
        <Icon className="h-3.5 w-3.5 text-[#FF8A2A]" />
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="text"
        dir={ltr ? "ltr" : undefined}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength ?? 300}
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className={cn(inputClassName(Boolean(error)), "h-12", ltr && "font-mono text-left placeholder:text-left")}
      />
      {error ? (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      ) : (
        hint && <p className="mt-2 text-[11px] leading-5 text-[#5E6672]">{hint}</p>
      )}
    </div>
  );
}

/** Root-only system settings: user-code rotation, consultation phone, the panel notice, the About page text and the Contact page details. */
export function SystemSettingsForm({ initialSettings, provinces }: SystemSettingsFormProps) {
  const [minutes, setMinutes] = useState(String(initialSettings.userCodeRotationMinutes));
  const [phone, setPhone] = useState(initialSettings.consultationPhone);
  const [notice, setNotice] = useState(initialSettings.adPageNotice);
  const [about, setAbout] = useState(initialSettings.aboutText);
  const [contact, setContact] = useState<ContactValues>(() => pickContact(initialSettings));
  const [priceFields, setPriceFields] = useState<PriceTablePriceField[]>(initialSettings.enabledPriceFields);
  const [registrationOpen, setRegistrationOpen] = useState(initialSettings.registrationOpen);
  // Never saved (null) = every province is active.
  const allProvinceIds = provinces.map((province) => province.id);
  const [activeProvinces, setActiveProvinces] = useState<Set<number>>(
    () => new Set(initialSettings.activeProvinceIds ?? allProvinceIds)
  );
  const [provinceQuery, setProvinceQuery] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isPending, startTransition] = useTransition();
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const minutesId = useId();
  const phoneId = useId();
  const noticeId = useId();
  const aboutId = useId();
  const addressId = useId();

  function setContactField(name: ContactField, value: string) {
    setContact((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  }

  function showToast(kind: ToastState["kind"], message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }

  function clearError(key: string) {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFormError(null);
    startTransition(async () => {
      const result = await saveSystemSettingsAction(formData);
      if (result.ok) {
        setFieldErrors({});
        setMinutes(String(result.settings.userCodeRotationMinutes));
        setPhone(result.settings.consultationPhone);
        setNotice(result.settings.adPageNotice);
        setAbout(result.settings.aboutText);
        setContact(pickContact(result.settings));
        setPriceFields(result.settings.enabledPriceFields);
        setRegistrationOpen(result.settings.registrationOpen);
        setActiveProvinces(new Set(result.settings.activeProvinceIds ?? allProvinceIds));
        showToast("success", "تنظیمات سیستم ذخیره شد.");
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        setFormError(result.message);
      }
    });
  }

  const noticeTrimmed = notice.trim();

  const query = provinceQuery.trim();
  const shownProvinces = query ? provinces.filter((province) => province.name.includes(query)) : provinces;
  const activeCount = provinces.filter((province) => activeProvinces.has(province.id)).length;

  function setProvinces(ids: number[], on: boolean) {
    setActiveProvinces((current) => {
      const next = new Set(current);
      for (const id of ids) {
        if (on) next.add(id);
        else next.delete(id);
      }
      return next;
    });
    clearError("activeProvinceIds");
  }

  /** Switch one price type on or off; the last active one cannot be switched off. */
  function togglePriceField(key: PriceTablePriceField, on: boolean) {
    setPriceFields((current) => {
      if (on) return PRICE_TABLE_PRICE_FIELDS.map((field) => field.key).filter((k) => k === key || current.includes(k));
      return current.length > 1 ? current.filter((k) => k !== key) : current;
    });
    clearError("enabledPriceFields");
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold leading-6 text-[#F5F5F5]">تنظیمات سیستم</h1>
          <p className="mt-0.5 text-xs text-[#8B93A1]">فقط مدیر کل به این بخش دسترسی دارد.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate aria-busy={isPending} className="space-y-5">
        {formError && (
          <div role="alert" className="admin-animate-in flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-red-200">
            <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-red-400" />
            <span className="leading-6">{formError}</span>
          </div>
        )}

        <SettingCard
          icon={RefreshCcw}
          title="مدت زمان تغییر کد کاربران"
          description="به جای نام و اطلاعات تماس، کد ۸ رقمی کاربر روی آگهی‌ها نمایش داده می‌شود. این کد پس از مدت زیر به‌صورت خودکار عوض می‌شود. با تغییر این مقدار، کدهای فعلی هم بر اساس مدت جدید تمدید یا منقضی می‌شوند."
        >
          <label htmlFor={minutesId} className="mb-2 block text-xs font-bold text-[#D2D7DF]">
            مدت زمان (دقیقه) <span className="text-[#FF6A00]">*</span>
          </label>
          <div className="flex max-w-xs items-center gap-2">
            <input
              id={minutesId}
              name="userCodeRotationMinutes"
              type="text"
              inputMode="numeric"
              dir="ltr"
              value={minutes}
              onChange={(e) => {
                setMinutes(e.target.value);
                clearError("userCodeRotationMinutes");
              }}
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.userCodeRotationMinutes)}
              className={cn(inputClassName(Boolean(fieldErrors.userCodeRotationMinutes)), "h-12 text-center font-mono")}
            />
            <span className="shrink-0 text-sm font-bold text-[#8B93A1]">دقیقه</span>
          </div>
          {fieldErrors.userCodeRotationMinutes ? (
            <p className="mt-2 text-xs text-red-400">{fieldErrors.userCodeRotationMinutes}</p>
          ) : (
            <p className="mt-2 text-[11px] text-[#5E6672]">
              بین {toPersianDigits(MIN_USER_CODE_ROTATION_MINUTES)} تا {toPersianDigits(MAX_USER_CODE_ROTATION_MINUTES)} دقیقه. پیش‌فرض: ۳۰ دقیقه.
            </p>
          )}
        </SettingCard>

        <SettingCard
          icon={BadgeDollarSign}
          title="تنظیمات قیمت‌دهی"
          description="انواع قیمتی که همکاران در «جدول من» وارد می‌کنند و در لیست قیمت نمایش داده می‌شوند. نوع غیرفعال در هیچ صفحه‌ای (پنل کاربران، لیست قیمت و پنل مدیریت) نمایش داده نمی‌شود، ولی مقادیر ثبت‌شده آن حذف نمی‌شوند و با فعال کردن دوباره برمی‌گردند. حداقل یک نوع قیمت باید فعال باشد."
        >
          {priceFields.map((key) => (
            <input key={key} type="hidden" name="enabledPriceFields" value={key} />
          ))}
          <div className="grid gap-3 sm:grid-cols-3">
            {PRICE_TABLE_PRICE_FIELDS.map((field) => {
              const on = priceFields.includes(field.key);
              const locked = on && priceFields.length === 1;
              return (
                <div
                  key={field.key}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors",
                    on ? "border-[#FF6A00]/35 bg-[#FF6A00]/[0.06]" : "border-white/[0.08] bg-[#07090C]"
                  )}
                >
                  <div className="min-w-0">
                    <p className={cn("text-sm font-bold", on ? "text-[#F5F5F5]" : "text-[#8B93A1]")}>{field.label}</p>
                    <p className="mt-0.5 text-[11px] text-[#5E6672]">{locked ? "تنها نوع فعال" : on ? "فعال" : "غیرفعال"}</p>
                  </div>
                  <Toggle
                    checked={on}
                    onCheckedChange={(value) => togglePriceField(field.key, value)}
                    label={field.label}
                    disabled={isPending || locked}
                  />
                </div>
              );
            })}
          </div>
          {fieldErrors.enabledPriceFields && <p className="mt-2 text-xs text-red-400">{fieldErrors.enabledPriceFields}</p>}
        </SettingCard>

        <SettingCard
          icon={UserPlus}
          title="ثبت‌نام کاربران جدید"
          description="وقتی خاموش است، فقط کاربرانی که مدیر در بخش «کاربران» ساخته است می‌توانند وارد پنل شوند و شماره‌های ناشناس پیام «حسابی با این شماره وجود ندارد» می‌گیرند. با روشن کردن، هر شماره جدید هنگام ورود حساب می‌سازد."
        >
          <input type="hidden" name="registrationOpen" value={registrationOpen ? "1" : "0"} />
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-[#07090C] px-4 py-3 sm:max-w-md">
            <div>
              <p className="text-sm font-bold text-[#F5F5F5]">ثبت‌نام از صفحه ورود پنل</p>
              <p className={cn("mt-0.5 text-[11px] font-bold", registrationOpen ? "text-emerald-400" : "text-[#8B93A1]")}>
                {registrationOpen ? "باز است" : "بسته است؛ فقط ورود"}
              </p>
            </div>
            <Toggle checked={registrationOpen} onCheckedChange={setRegistrationOpen} label="ثبت‌نام کاربران جدید" disabled={isPending} />
          </div>
        </SettingCard>

        <SettingCard
          icon={MapIcon}
          title="استان‌های فعال"
          description="در فرم «درخواست خرید» (صفحه آگهی و صفحه لیست قیمت خودرو)، کاربرانی که وارد حساب نشده‌اند فقط می‌توانند یکی از استان‌های فعال (و شهرهای آن) را انتخاب کنند. حداقل یک استان باید فعال باشد."
        >
          {provinces
            .filter((province) => activeProvinces.has(province.id))
            .map((province) => (
              <input key={province.id} type="hidden" name="activeProvinceIds" value={province.id} />
            ))}

          {provinces.length === 0 ? (
            <p className="rounded-xl border border-dashed border-white/[0.1] px-4 py-6 text-center text-xs text-[#8B93A1]">
              هنوز استانی در سیستم ثبت نشده است.
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1 sm:max-w-xs">
                  <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5E6672]" />
                  <input
                    type="search"
                    value={provinceQuery}
                    onChange={(e) => setProvinceQuery(e.target.value)}
                    placeholder="جستجوی استان…"
                    aria-label="جستجوی استان"
                    className={cn(inputClassName(false), "h-11 ps-10")}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-[11px] font-extrabold",
                      activeCount > 0 ? "bg-[#FF6A00]/10 text-[#FF8A2A]" : "bg-red-500/10 text-red-300"
                    )}
                  >
                    {toPersianDigits(activeCount)} از {toPersianDigits(provinces.length)} استان فعال
                  </span>
                  <button
                    type="button"
                    onClick={() => setProvinces(shownProvinces.map((province) => province.id), true)}
                    disabled={isPending}
                    className="h-9 rounded-lg border border-white/[0.1] px-3 text-[11px] font-bold text-[#D2D7DF] transition-colors hover:border-[#FF6A00]/40 hover:text-[#F5F5F5] disabled:opacity-50"
                  >
                    {query ? "فعال کردن نتایج" : "فعال کردن همه"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setProvinces(shownProvinces.map((province) => province.id), false)}
                    disabled={isPending}
                    className="h-9 rounded-lg border border-white/[0.1] px-3 text-[11px] font-bold text-[#D2D7DF] transition-colors hover:border-red-500/40 hover:text-red-300 disabled:opacity-50"
                  >
                    {query ? "غیرفعال کردن نتایج" : "غیرفعال کردن همه"}
                  </button>
                </div>
              </div>

              <div
                role="group"
                aria-label="استان‌ها"
                className="admin-scrollbar mt-4 grid max-h-[22rem] grid-cols-2 gap-2 overflow-y-auto p-0.5 sm:grid-cols-3 lg:grid-cols-4"
              >
                {shownProvinces.map((province) => {
                  const on = activeProvinces.has(province.id);
                  return (
                    <button
                      key={province.id}
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      onClick={() => setProvinces([province.id], !on)}
                      disabled={isPending}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:opacity-60",
                        on ? "border-[#FF6A00]/40 bg-[#FF6A00]/[0.07]" : "border-white/[0.08] bg-[#07090C] hover:border-white/20"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                          on ? "border-[#FF6A00] bg-[#FF6A00] text-[#07090C]" : "border-white/25"
                        )}
                        aria-hidden="true"
                      >
                        {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </span>
                      <span className="min-w-0">
                        <span className={cn("block truncate text-xs font-bold", on ? "text-[#F5F5F5]" : "text-[#8B93A1]")}>{province.name}</span>
                        <span className="block text-[10px] text-[#5E6672]">{toPersianDigits(province.cityCount)} شهر</span>
                      </span>
                    </button>
                  );
                })}
                {shownProvinces.length === 0 && (
                  <p className="col-span-full py-6 text-center text-xs text-[#8B93A1]">استانی با این نام پیدا نشد.</p>
                )}
              </div>
            </>
          )}
          {fieldErrors.activeProvinceIds && <p className="mt-2 text-xs text-red-400">{fieldErrors.activeProvinceIds}</p>}
        </SettingCard>

        <SettingCard
          icon={Headset}
          title="شماره تماس مشاوره خرید خودرو"
          description="این شماره در دکمه شناور «تماس با مشاوران» در همه صفحات پنل کاربران نمایش داده می‌شود. اگر خالی باشد، دکمه نمایش داده نمی‌شود."
        >
          <label htmlFor={phoneId} className="mb-2 block text-xs font-bold text-[#D2D7DF]">
            شماره تماس
          </label>
          <input
            id={phoneId}
            name="consultationPhone"
            type="tel"
            dir="ltr"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              clearError("consultationPhone");
            }}
            placeholder="021 1234 5678"
            maxLength={20}
            autoComplete="off"
            disabled={isPending}
            aria-invalid={Boolean(fieldErrors.consultationPhone)}
            className={cn(inputClassName(Boolean(fieldErrors.consultationPhone)), "h-12 max-w-xs font-mono")}
          />
          {fieldErrors.consultationPhone && <p className="mt-2 text-xs text-red-400">{fieldErrors.consultationPhone}</p>}
        </SettingCard>

        <SettingCard
          icon={AlertTriangle}
          title="متن قابل نمایش در صفحه آگهی"
          description="در صورت تنظیم، این متن به‌صورت پیام هشدار در بالای همه صفحات پنل کاربران نمایش داده می‌شود. برای حذف پیام، متن را خالی کنید."
        >
          <label htmlFor={noticeId} className="mb-2 block text-xs font-bold text-[#D2D7DF]">
            متن هشدار
          </label>
          <textarea
            id={noticeId}
            name="adPageNotice"
            rows={5}
            value={notice}
            onChange={(e) => {
              setNotice(e.target.value);
              clearError("adPageNotice");
            }}
            maxLength={MAX_AD_PAGE_NOTICE_LENGTH}
            placeholder="مثلاً: قبل از هرگونه پرداخت، از اصالت خودرو و مدارک آن اطمینان حاصل کنید."
            disabled={isPending}
            aria-invalid={Boolean(fieldErrors.adPageNotice)}
            className={cn(inputClassName(Boolean(fieldErrors.adPageNotice)), "resize-y py-3 leading-7")}
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            {fieldErrors.adPageNotice ? <p className="text-xs text-red-400">{fieldErrors.adPageNotice}</p> : <span />}
            <span className="font-mono text-[11px] text-[#5E6672]">
              {toPersianDigits(notice.length)} / {toPersianDigits(MAX_AD_PAGE_NOTICE_LENGTH)}
            </span>
          </div>

          {noticeTrimmed && (
            <div className="mt-4">
              <p className="mb-2 text-[11px] font-bold text-[#8B93A1]">پیش‌نمایش</p>
              <div className="flex items-start gap-2.5 rounded-2xl border border-red-500/35 bg-red-500/[0.08] px-4 py-3 text-xs leading-7 text-red-200">
                <AlertTriangle className="mt-1.5 h-4 w-4 shrink-0 text-red-400" />
                <p className="whitespace-pre-line break-words">{noticeTrimmed}</p>
              </div>
            </div>
          )}
        </SettingCard>

        <SettingCard
          icon={Info}
          title="متن صفحه «درباره خودرویاب»"
          description="این متن در صفحه «درباره خودرویاب» پنل کاربران نمایش داده می‌شود. برای جدا کردن پاراگراف‌ها یک خط خالی بگذارید."
        >
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor={aboutId} className="block text-xs font-bold text-[#D2D7DF]">
              متن درباره ما
            </label>
            <a
              href="/panel/about"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF8A2A] hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              مشاهده صفحه
            </a>
          </div>
          <textarea
            id={aboutId}
            name="aboutText"
            rows={12}
            value={about}
            onChange={(e) => {
              setAbout(e.target.value);
              clearError("aboutText");
            }}
            maxLength={MAX_ABOUT_TEXT_LENGTH}
            placeholder={"خودرویاب مرجع تخصصی خرید و فروش خودروهای وارداتی است…\n\nپاراگراف دوم…"}
            disabled={isPending}
            aria-invalid={Boolean(fieldErrors.aboutText)}
            className={cn(inputClassName(Boolean(fieldErrors.aboutText)), "resize-y py-3 leading-7")}
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            {fieldErrors.aboutText ? (
              <p className="text-xs text-red-400">{fieldErrors.aboutText}</p>
            ) : (
              <p className="text-[11px] text-[#5E6672]">اگر خالی باشد، صفحه پیام «به‌زودی» نشان می‌دهد.</p>
            )}
            <span className="shrink-0 font-mono text-[11px] text-[#5E6672]">
              {toPersianDigits(about.length)} / {toPersianDigits(MAX_ABOUT_TEXT_LENGTH)}
            </span>
          </div>
        </SettingCard>

        <SettingCard
          icon={PhoneCall}
          title="اطلاعات صفحه «تماس با ما»"
          description="این اطلاعات در بالای صفحه «تماس با ما» پنل کاربران نمایش داده می‌شود. هر فیلدی که خالی بماند، در صفحه نمایش داده نمی‌شود."
        >
          <div className="mb-4 flex justify-end">
            <a
              href="/panel/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF8A2A] hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              مشاهده صفحه
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ContactInput
              name="contactPhone"
              label="شماره تماس دفتر"
              icon={Phone}
              value={contact.contactPhone}
              error={fieldErrors.contactPhone}
              placeholder="021 1234 5678"
              ltr
              inputMode="tel"
              maxLength={20}
              disabled={isPending}
              onChange={setContactField}
            />
            <ContactInput
              name="contactPostalCode"
              label="کد پستی"
              icon={MapPin}
              value={contact.contactPostalCode}
              error={fieldErrors.contactPostalCode}
              hint="۱۰ رقم، بدون خط تیره."
              placeholder="1234567890"
              ltr
              inputMode="numeric"
              maxLength={14}
              disabled={isPending}
              onChange={setContactField}
            />
          </div>

          <div className="mt-4">
            <label htmlFor={addressId} className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[#D2D7DF]">
              <MapPin className="h-3.5 w-3.5 text-[#FF8A2A]" />
              آدرس دفتر
            </label>
            <textarea
              id={addressId}
              name="contactAddress"
              rows={3}
              value={contact.contactAddress}
              onChange={(e) => setContactField("contactAddress", e.target.value)}
              maxLength={MAX_CONTACT_ADDRESS_LENGTH}
              placeholder="مثلاً: تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲، طبقه ۳، واحد ۷"
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.contactAddress)}
              className={cn(inputClassName(Boolean(fieldErrors.contactAddress)), "resize-y py-3 leading-7")}
            />
            {fieldErrors.contactAddress && <p className="mt-2 text-xs text-red-400">{fieldErrors.contactAddress}</p>}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <ContactInput
              name="contactTelegram"
              label="تلگرام"
              icon={Send}
              value={contact.contactTelegram}
              error={fieldErrors.contactTelegram}
              hint="آیدی (مثل ‎@khodroyab) یا لینک کامل"
              placeholder="@khodroyab"
              ltr
              disabled={isPending}
              onChange={setContactField}
            />
            <ContactInput
              name="contactWhatsapp"
              label="واتس‌اپ"
              icon={MessageCircle}
              value={contact.contactWhatsapp}
              error={fieldErrors.contactWhatsapp}
              hint="شماره موبایل یا لینک wa.me"
              placeholder="0912 123 4567"
              ltr
              disabled={isPending}
              onChange={setContactField}
            />
            <ContactInput
              name="contactInstagram"
              label="اینستاگرام"
              icon={Instagram}
              value={contact.contactInstagram}
              error={fieldErrors.contactInstagram}
              hint="آیدی یا لینک صفحه"
              placeholder="@khodroyab"
              ltr
              disabled={isPending}
              onChange={setContactField}
            />
          </div>

          <div className="mt-4">
            <ContactInput
              name="contactLocation"
              label="موقعیت دفتر روی نقشه (عرض، طول جغرافیایی)"
              icon={MapPin}
              value={contact.contactLocation}
              error={fieldErrors.contactLocation}
              hint="در گوگل مپ روی محل دفتر کلیک راست کنید و مختصات را کپی کنید؛ لینک گوگل مپ هم قابل قبول است."
              placeholder="35.6997, 51.3380"
              ltr
              maxLength={500}
              disabled={isPending}
              onChange={setContactField}
            />
          </div>
        </SettingCard>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-6 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 hover:shadow-[0_0_36px_rgba(255,106,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isPending ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <Save className="h-[18px] w-[18px]" />}
            ذخیره تنظیمات
          </button>
        </div>
      </form>
    </div>
  );
}
