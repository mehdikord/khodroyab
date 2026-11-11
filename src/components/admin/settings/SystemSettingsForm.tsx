"use client";

import React, { useId, useRef, useState, useTransition } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ExternalLink,
  Headset,
  Info,
  Instagram,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  RefreshCcw,
  Save,
  Send,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
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

interface SystemSettingsFormProps {
  initialSettings: SystemSettings;
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
export function SystemSettingsForm({ initialSettings }: SystemSettingsFormProps) {
  const [minutes, setMinutes] = useState(String(initialSettings.userCodeRotationMinutes));
  const [phone, setPhone] = useState(initialSettings.consultationPhone);
  const [notice, setNotice] = useState(initialSettings.adPageNotice);
  const [about, setAbout] = useState(initialSettings.aboutText);
  const [contact, setContact] = useState<ContactValues>(() => pickContact(initialSettings));
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
        showToast("success", "تنظیمات سیستم ذخیره شد.");
      } else {
        setFieldErrors(result.fieldErrors ?? {});
        setFormError(result.message);
      }
    });
  }

  const noticeTrimmed = notice.trim();

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
