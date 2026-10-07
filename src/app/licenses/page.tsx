"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StaggeredText } from "@/components/react-bits/StaggeredText";
import {
  LICENSES_AND_ACHIEVEMENTS,
  LicenseItem,
} from "@/data/khodroyab-data";
import {
  Award,
  ShieldCheck,
  FileCheck2,
  Eye,
  X,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  Info,
} from "lucide-react";

export default function LicensesPage() {
  const [selectedLicense, setSelectedLicense] = useState<LicenseItem | null>(
    null
  );

  return (
    <div className="bg-[#07090C] text-[#F5F5F5] pt-28 pb-24">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/[0.07] pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,106,0,0.14),transparent_60%)]"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/35 bg-[#FF6A00]/10 px-4 py-1.5 text-xs font-semibold text-[#FF8A2A]">
              <Award className="h-3.5 w-3.5" />
              <span>مجوزها، گواهینامه‌ها و دستاوردها — CREDENTIALS</span>
            </div>

            <StaggeredText
              as="h1"
              text="مجوزها، استانداردهای کارشناسی و دستاوردهای مجموعه خودرو یاب"
              segmentBy="words"
              delay={70}
              duration={0.7}
              highlightWords={["مجوزها،", "استانداردهای", "دستاوردهای"]}
              className="text-3xl sm:text-5xl font-black tracking-tight text-[#F5F5F5] leading-[1.25]"
            />

            <p className="text-sm sm:text-base leading-8 text-[#9BA3AE]">
              شفافیت حقوقی و فعالیت در چارچوب مقررات رسمی مناطق آزاد تجاری، زیربنای
              اعتماد مشتریان به خودرو یاب است. در این صفحه، ساختار نمایش مجوزها،
              گواهینامه‌های تخصصی و دستاوردهای شرکت به‌صورت{" "}
              <strong className="text-[#F5F5F5]">ماژولار و قابل ویرایش</strong> جهت
              بارگذاری مستندات رسمی طراحی شده است.
            </p>

            {/* Transparency Notice Banner */}
            <div className="flex items-start gap-3 rounded-2xl border border-[#FF6A00]/30 bg-[#0D1117]/90 p-4 text-xs leading-6 text-[#9BA3AE]">
              <Info className="h-5 w-5 text-[#FF6A00] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#F5F5F5]">
                  توضیح شفافیت محتوایی:
                </span>{" "}
                در راستای رعایت کامل صداقت حرفه‌ای، هیچ‌گونه شماره ثبت، کد مجوز یا ادعای
                آماری غیرواقعی در این قالب درج نشده است و تمامی کارت‌های زیر آماده جایگذاری
                تصاویر و مشخصات اسناد رسمی کارفرما می‌باشند.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials & Achievements Grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {LICENSES_AND_ACHIEVEMENTS.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col justify-between rounded-3xl border border-white/[0.09] bg-[#0D1117] p-6 sm:p-8 shadow-card-depth transition-all duration-300 hover:border-[#FF6A00]/50"
              >
                <div>
                  {/* Top Badge & Code */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="rounded-xl border border-[#FF6A00]/35 bg-[#FF6A00]/15 px-3 py-1 text-xs font-bold text-[#FF8A2A]">
                      {item.category}
                    </span>
                    <span className="font-mono text-xs text-[#5E6672] group-hover:text-[#FF8A2A]">
                      {item.code}
                    </span>
                  </div>

                  {/* Stylized Document Frame Placeholder */}
                  <div className="relative mb-6 flex h-44 flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/[0.15] bg-[#171B21]/60 p-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6A00]/15 text-[#FF6A00] mb-3">
                      <FileCheck2 className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-[#FF8A2A] uppercase">
                      {item.enTitle}
                    </span>
                    <span className="mt-1.5 text-xs text-[#9BA3AE]">
                      [قاب اختصاصی نمایش تصویر اسکن‌شده سند / مجوز]
                    </span>
                  </div>

                  <h2 className="text-xl font-extrabold text-[#F5F5F5] leading-snug">
                    {item.title}
                  </h2>

                  <p className="mt-2 font-mono text-xs text-[#FF8A2A]">
                    {item.issuerPlaceholder}
                  </p>

                  <p className="mt-3 text-xs sm:text-sm leading-7 text-[#9BA3AE]">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] space-y-3">
                  <div className="text-[11px] text-[#5E6672]">{item.editableNote}</div>

                  <button
                    type="button"
                    onClick={() => setSelectedLicense(item)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.12] bg-[#171B21] px-4 py-3 text-xs font-bold text-[#F5F5F5] transition-all hover:border-[#FF6A00] hover:bg-[#FF6A00] hover:text-[#07090C]"
                  >
                    <Eye className="h-4 w-4" />
                    <span>مشاهده قالب شناسنامه سند</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Institutional Trust CTA */}
          <div className="mt-16 rounded-3xl border border-white/[0.1] bg-gradient-to-l from-[#0D1117] via-[#171B21] to-[#0D1117] p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-[#FF8A2A]">
                <ShieldCheck className="h-4 w-4" />
                <span>بررسی حضوری مستندات و قراردادها</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#F5F5F5]">
                امکان رویت کلیه مجوزها و اسناد گمرکی در دفتر مرکزی خودرو یاب
              </h3>
              <p className="text-xs sm:text-sm leading-7 text-[#9BA3AE]">
                متقاضیان گرامی می‌توانند پیش از هرگونه اقدام مالی، با هماهنگی قبلی در دفتر
                مرکزی شرکت حضور یافته و اسناد رسمی و نمونه قراردادهای حقوقی را بررسی
                نمایند.
              </p>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6A00] px-6 py-4 text-sm font-bold text-[#07090C] hover:bg-[#FF8A2A] shrink-0"
            >
              <PhoneCall className="h-4 w-4" />
              <span>هماهنگی جلسه حضوری</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Modal for Credential Preview */}
      {selectedLicense && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setSelectedLicense(null)}
        >
          <div
            className="relative w-full max-w-xl rounded-3xl border border-[#FF6A00]/40 bg-[#0D1117] p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.95)] space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="font-mono text-xs text-[#FF8A2A]">
                  {selectedLicense.code} // {selectedLicense.statusLabel}
                </span>
                <h3 className="text-xl font-black text-[#F5F5F5] mt-1">
                  {selectedLicense.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLicense(null)}
                aria-label="بستن"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] bg-[#171B21] text-[#9BA3AE] hover:text-[#F5F5F5]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-dashed border-[#FF6A00]/40 bg-[#07090C] p-8 text-center space-y-3">
              <Award className="mx-auto h-12 w-12 text-[#FF6A00]" />
              <div className="font-mono text-xs text-[#FF8A2A]">
                {selectedLicense.enTitle}
              </div>
              <p className="text-xs text-[#9BA3AE] leading-6">
                محل قرارگیری تصویر باکیفیت گواهینامه / مجوز رسمی{" "}
                <strong className="text-[#F5F5F5]">خودرو یاب</strong>
              </p>
              <div className="inline-block rounded-lg bg-[#171B21] px-3 py-1.5 text-[11px] text-[#FF8A2A]">
                {selectedLicense.issuerPlaceholder}
              </div>
            </div>

            <p className="text-xs sm:text-sm leading-7 text-[#9BA3AE]">
              {selectedLicense.description}
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedLicense(null)}
                className="rounded-xl bg-[#FF6A00] px-6 py-2.5 text-xs font-bold text-[#07090C] hover:bg-[#FF8A2A]"
              >
                بستن پیش‌نمایش
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
