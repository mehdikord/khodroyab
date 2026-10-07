"use client";

import React, { useState } from "react";
import {
  PhoneCall,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Clock,
  Sparkles,
  Send,
  RotateCcw,
} from "lucide-react";
import { cn, toPersianDigits } from "@/lib/utils";

interface FormState {
  fullName: string;
  mobile: string;
  topic: string;
  description: string;
}

interface FormErrors {
  fullName?: string;
  mobile?: string;
  topic?: string;
  description?: string;
}

const CONSULTATION_TOPICS = [
  "مشاوره خرید خودروی وارداتی آماده تحویل",
  "ثبت سفارش و واردات اختصاصی خودرو به منطقه آزاد",
  "استعلام قیمت، تعرفه‌ها و شرایط قراردادی",
  "درخواست کارشناسی فنی، ظاهری و اصالت مدارک",
  "راهنمایی قوانین تردد و پلاک‌گذاری مناطق آزاد",
  "سایر موضوعات بازرگانی و پشتیبانی",
];

function normalizeDigits(str: string): string {
  const persian = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const arabic = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let res = str;
  for (let i = 0; i < 10; i++) {
    res = res
      .replace(new RegExp(persian[i], "g"), String(i))
      .replace(new RegExp(arabic[i], "g"), String(i));
  }
  return res;
}

export const ConsultationFormSection: React.FC<{
  compact?: boolean;
  defaultTopic?: string;
}> = ({ compact = false, defaultTopic = "" }) => {
  const [form, setForm] = useState<FormState>({
    fullName: "",
    mobile: "",
    topic: defaultTopic || CONSULTATION_TOPICS[0],
    description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 3) {
      nextErrors.fullName = "لطفاً نام و نام خانوادگی خود را به‌درستی وارد نمایید (حداقل ۳ حرف).";
    }

    const cleanPhone = normalizeDigits(form.mobile).replace(/[\s-]/g, "");
    if (!/^(\+98|0)?9\d{9}$/.test(cleanPhone)) {
      nextErrors.mobile = "شماره موبایل معتبر وارد نمایید (مثال: ۰۹۱۲۱۲۳۴۵۶۷).";
    }

    if (!form.topic.trim()) {
      nextErrors.topic = "لطفاً موضوع مشاوره را انتخاب نمایید.";
    }

    if (form.description.trim().length > 0 && form.description.trim().length < 10) {
      nextErrors.description = "در صورت درج توضیحات، لطفاً حداقل ۱۰ کاراکتر بنویسید.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setTimeout(() => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setSubmittedCode(`KYB-${randomNum}`);
      setSubmitting(false);
    }, 650);
  };

  const handleReset = () => {
    setSubmittedCode(null);
    setForm({
      fullName: "",
      mobile: "",
      topic: CONSULTATION_TOPICS[0],
      description: "",
    });
    setErrors({});
  };

  return (
    <section
      id="consultation"
      className={cn(
        "relative overflow-hidden",
        compact ? "py-8" : "py-20 sm:py-28 border-t border-white/[0.06]"
      )}
    >
      {/* Background Ambient Glow */}
      {!compact && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,106,0,0.12),transparent_60%)]"
        />
      )}

      <div className={cn("relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8")}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          {/* Right Column (RTL): Editorial Persuasion & Trust Indicators */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/35 bg-[#FF6A00]/10 px-3.5 py-1.5 text-xs font-semibold text-[#FF8A2A]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>مشاوره تخصصی و رایگان</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#F5F5F5] leading-[1.25]">
              مشاوره رایگان{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A]">
                خرید خودرو
              </span>
            </h2>

            <p className="text-sm sm:text-base leading-8 text-[#9BA3AE]">
              انتخاب خودروی وارداتی در مناطق آزاد نیازمند بررسی دقیق اصالت، تریم، قوانین
              گمرکی و ارزش سرمایه‌گذاری است. فرم روبه‌رو را تکمیل فرمایید تا کارشناسان
              ارشد خودرو یاب در کوتاه‌ترین زمان با شما تماس بگیرند.
            </p>

            {/* 3 Architectural Guarantees */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3.5 rounded-2xl border border-white/[0.07] bg-[#0D1117]/90 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF6A00]/15 text-[#FF6A00]">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F5F5F5]">
                    پاسخگویی سریع و پشتیبانی ۲۴ ساعته
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-[#9BA3AE]">
                    بررسی درخواست شما توسط کارشناس تخصصی برند مربوطه و تماس تلفنی هماهنگ‌شده.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-white/[0.07] bg-[#0D1117]/90 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF6A00]/15 text-[#FF6A00]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F5F5F5]">
                    تحلیل شفاف هزینه‌ها و شرایط قراردادی
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-[#9BA3AE]">
                    ارائه اطلاعات دقیق درباره قیمت تمام‌شده در شرایط اعلام‌شده بدون هزینه‌های پنهان.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column (RTL): Interactive Form Card */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0D1117]/95 p-6 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.85)]">
              {/* Top Orange Accent Bar */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-[#FF6A00] via-[#FF8A2A] to-transparent"
              />

              {submittedCode ? (
                <div className="py-8 text-center space-y-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FF6A00]/40 bg-[#FF6A00]/15 text-[#FF6A00] shadow-[0_0_30px_rgba(255,106,0,0.35)]">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>

                  <div className="space-y-2">
                    <span className="inline-block rounded-full border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-3 py-1 font-mono text-xs text-[#FF8A2A]">
                      REFERENCE: {submittedCode}
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#F5F5F5]">
                      درخواست مشاوره شما با موفقیت ثبت شد
                    </h3>
                    <p className="mx-auto max-w-md text-sm leading-7 text-[#9BA3AE]">
                      جناب/سرکار{" "}
                      <span className="font-bold text-[#F5F5F5]">{form.fullName}</span>،
                      اطلاعات شما در سامانه مشاوره خودرو یاب ثبت گردید. کارشناس مربوطه در
                      خصوص «{form.topic}» با شماره{" "}
                      <span className="font-mono text-[#FF8A2A]" dir="ltr">
                        {toPersianDigits(form.mobile)}
                      </span>{" "}
                      تماس خواهد گرفت.
                    </p>
                  </div>

                  <div className="mx-auto max-w-md rounded-2xl border border-white/[0.08] bg-[#171B21]/70 p-4 text-right text-xs space-y-2 text-[#9BA3AE]">
                    <div className="flex justify-between">
                      <span>وضعیت درخواست:</span>
                      <span className="text-[#FF8A2A] font-semibold">
                        در صف تماس کارشناس ارشد (پشتیبانی ۲۴/۷)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>موضوع انتخابی:</span>
                      <span className="text-[#F5F5F5]">{form.topic}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-[#171B21] px-5 py-3 text-xs font-semibold text-[#F5F5F5] transition-colors hover:border-[#FF6A00]/50"
                  >
                    <RotateCcw className="h-4 w-4 text-[#FF6A00]" />
                    <span>ثبت درخواست جدید</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#F5F5F5]">
                        فرم درخواست مشاوره رایگان خرید خودرو
                      </h3>
                      <p className="text-xs text-[#9BA3AE] mt-0.5">
                        تمامی اطلاعات شما نزد خودرو یاب محفوظ است.
                      </p>
                    </div>
                    <span className="hidden sm:inline-block font-mono text-[11px] text-[#FF8A2A] tracking-widest">
                      VIP ADVISORY
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* Field 1: Full Name */}
                    <div className="space-y-2">
                      <label
                        htmlFor="consult-fullname"
                        className="block text-xs font-semibold text-[#F5F5F5]"
                      >
                        نام و نام خانوادگی <span className="text-[#FF6A00]">*</span>
                      </label>
                      <input
                        id="consult-fullname"
                        type="text"
                        value={form.fullName}
                        onChange={(e) => {
                          setForm({ ...form, fullName: e.target.value });
                          if (errors.fullName)
                            setErrors({ ...errors, fullName: undefined });
                        }}
                        placeholder="مثال: امیرحسین رادمنش"
                        className={cn(
                          "w-full rounded-xl border bg-[#171B21]/90 px-4 py-3.5 text-sm text-[#F5F5F5] placeholder-[#5E6672] transition-colors focus:outline-none",
                          errors.fullName
                            ? "border-red-500/70 focus:border-red-500"
                            : "border-white/[0.1] focus:border-[#FF6A00]"
                        )}
                      />
                      {errors.fullName && (
                        <p className="flex items-center gap-1.5 text-xs text-red-400">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    {/* Field 2: Mobile Number */}
                    <div className="space-y-2">
                      <label
                        htmlFor="consult-mobile"
                        className="block text-xs font-semibold text-[#F5F5F5]"
                      >
                        شماره موبایل <span className="text-[#FF6A00]">*</span>
                      </label>
                      <input
                        id="consult-mobile"
                        type="tel"
                        dir="ltr"
                        value={form.mobile}
                        onChange={(e) => {
                          setForm({ ...form, mobile: e.target.value });
                          if (errors.mobile)
                            setErrors({ ...errors, mobile: undefined });
                        }}
                        placeholder="0912 000 0000"
                        className={cn(
                          "w-full rounded-xl border bg-[#171B21]/90 px-4 py-3.5 text-sm text-right font-mono text-[#F5F5F5] placeholder-[#5E6672] transition-colors focus:outline-none",
                          errors.mobile
                            ? "border-red-500/70 focus:border-red-500"
                            : "border-white/[0.1] focus:border-[#FF6A00]"
                        )}
                      />
                      {errors.mobile && (
                        <p className="flex items-center gap-1.5 text-xs text-red-400">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{errors.mobile}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Field 3: Topic */}
                  <div className="space-y-2">
                    <label
                      htmlFor="consult-topic"
                      className="block text-xs font-semibold text-[#F5F5F5]"
                    >
                      موضوع مشاوره <span className="text-[#FF6A00]">*</span>
                    </label>
                    <select
                      id="consult-topic"
                      value={form.topic}
                      onChange={(e) => {
                        setForm({ ...form, topic: e.target.value });
                        if (errors.topic) setErrors({ ...errors, topic: undefined });
                      }}
                      className={cn(
                        "w-full rounded-xl border bg-[#171B21]/90 px-4 py-3.5 text-sm text-[#F5F5F5] transition-colors focus:outline-none",
                        errors.topic
                          ? "border-red-500/70 focus:border-red-500"
                          : "border-white/[0.1] focus:border-[#FF6A00]"
                      )}
                    >
                      {CONSULTATION_TOPICS.map((topic) => (
                        <option
                          key={topic}
                          value={topic}
                          className="bg-[#0D1117] text-[#F5F5F5]"
                        >
                          {topic}
                        </option>
                      ))}
                    </select>
                    {errors.topic && (
                      <p className="flex items-center gap-1.5 text-xs text-red-400">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.topic}</span>
                      </p>
                    )}
                  </div>

                  {/* Field 4: Description */}
                  <div className="space-y-2">
                    <label
                      htmlFor="consult-desc"
                      className="block text-xs font-semibold text-[#F5F5F5]"
                    >
                      توضیحات (برند، مدل، منطقه آزاد مدنظر یا سوالات شما)
                    </label>
                    <textarea
                      id="consult-desc"
                      rows={4}
                      value={form.description}
                      onChange={(e) => {
                        setForm({ ...form, description: e.target.value });
                        if (errors.description)
                          setErrors({ ...errors, description: undefined });
                      }}
                      placeholder="نام خودرو، محدوده بودجه یا منطقه آزاد مورد نظر خود را بنویسید..."
                      className={cn(
                        "w-full rounded-xl border bg-[#171B21]/90 p-4 text-sm text-[#F5F5F5] placeholder-[#5E6672] transition-colors focus:outline-none resize-none",
                        errors.description
                          ? "border-red-500/70 focus:border-red-500"
                          : "border-white/[0.1] focus:border-[#FF6A00]"
                      )}
                    />
                    {errors.description && (
                      <p className="flex items-center gap-1.5 text-xs text-red-400">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.description}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                    <p className="text-xs text-[#9BA3AE]">
                      با ثبت این فرم، مشاوره اولیه کاملاً{" "}
                      <span className="text-[#FF8A2A] font-semibold">رایگان</span> خواهد
                      بود.
                    </p>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-7 py-4 text-sm font-bold text-[#07090C] shadow-[0_0_30px_rgba(255,106,0,0.4)] transition-all hover:brightness-110 disabled:opacity-60"
                    >
                      <Send className="h-4 w-4" />
                      <span>
                        {submitting ? "در حال ثبت درخواست..." : "ثبت درخواست مشاوره رایگان"}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationFormSection;
