"use client";

import React from "react";
import Link from "next/link";
import { PerspectiveGrid } from "@/components/react-bits/PerspectiveGrid";
import { NAV_ITEMS, FREE_ZONES_LIST } from "@/data/khodroyab-data";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpLeft,
  ShieldCheck,
  Sparkles,
  Instagram,
  Send,
  Linkedin,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-white/[0.08] bg-[#07090C] text-[#F5F5F5] overflow-hidden pb-24 lg:pb-0">
      {/* React Bits Pro — Perspective Grid Background */}
      <PerspectiveGrid
        width="100%"
        height="100%"
        speed={0.42}
        color="#FF6A00"
        gridScale={1.1}
        lineThickness={1.0}
        opacity={0.38}
        perspective={22}
        gridLength={12}
        curve={0.06}
        bottomFade="#07090C"
        className="min-h-[540px]"
      >
        {/* Top Ambient Radial Fade */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#07090C] to-transparent"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
          {/* Top Signature Banner */}
          <div className="mb-14 flex flex-col justify-between gap-6 rounded-2xl border border-white/[0.08] bg-[#0D1117]/85 p-6 sm:p-8 backdrop-blur-md lg:flex-row lg:items-center">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-3 py-1 text-xs font-medium text-[#FF8A2A]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>تجربه متمایز واردات خودرو در مناطق آزاد</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#F5F5F5]">
                آماده انتخاب خودروی وارداتی بعدی خود هستید؟
              </h3>
              <p className="text-sm text-[#9BA3AE] max-w-2xl">
                کارشناسان خودرو یاب آماده ارائه مشاوره تخصصی رایگان درباره قوانین مناطق آزاد،
                تأمین سفارشی و معرفی خودروهای آماده تحویل هستند.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact#consultation"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-6 py-3.5 text-sm font-bold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.4)] transition-all hover:brightness-110"
              >
                <span>دریافت مشاوره رایگان</span>
                <ArrowUpLeft className="h-4 w-4" />
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-[#171B21]/90 px-5 py-3.5 text-sm font-semibold text-[#F5F5F5] transition-all hover:border-[#FF6A00]/50"
              >
                <span>جستجوی خودرو</span>
              </Link>
            </div>
          </div>

          {/* Main 4-Column Footer Grid */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 pb-12 border-b border-white/[0.08]">
            {/* Col 1: Brand Identity (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#FF6A00]/50 bg-[#0D1117] shadow-[0_0_20px_rgba(255,106,0,0.25)]">
                  <svg
                    viewBox="0 0 36 36"
                    fill="none"
                    className="h-6 w-6 text-[#FF6A00]"
                  >
                    <path
                      d="M6 23L11.5 12H24.5L30 23H25.5L23 17.5H13L10.5 23H6Z"
                      fill="currentColor"
                    />
                    <path
                      d="M4 25.5H32"
                      stroke="#FF8A2A"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <circle cx="18" cy="10" r="2" fill="#F5F5F5" />
                  </svg>
                </div>
                <div>
                  <div className="text-xl font-black text-[#F5F5F5]">
                    خودرو یاب — KHODROYAB
                  </div>
                  <div className="font-mono text-[11px] tracking-widest text-[#FF8A2A]">
                    FREE-TRADE ZONE AUTOMOTIVE IMPORT
                  </div>
                </div>
              </div>

              <p className="text-sm leading-7 text-[#9BA3AE]">
                شرکت تخصصی فروش و واردات خودروهای خارجی در مناطق آزاد تجاری. ما با تمرکز
                بر شفافیت مالی، کارشناسی چندمرحله‌ای فنی و ظاهری، و پشتیبانی ۲۴ ساعته،
                فرآیند انتخاب و خرید خودروی وارداتی را به تجربه‌ای امن و استاندارد تبدیل
                می‌کنیم.
              </p>

              <div className="flex items-center gap-3 pt-1">
                <a
                  href="#instagram"
                  onClick={(e) => e.preventDefault()}
                  aria-label="اینستاگرام خودرو یاب"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0D1117]/90 text-[#9BA3AE] transition-colors hover:border-[#FF6A00]/50 hover:text-[#FF6A00]"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="#telegram"
                  onClick={(e) => e.preventDefault()}
                  aria-label="تلگرام خودرو یاب"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0D1117]/90 text-[#9BA3AE] transition-colors hover:border-[#FF6A00]/50 hover:text-[#FF6A00]"
                >
                  <Send className="h-4 w-4" />
                </a>
                <a
                  href="#linkedin"
                  onClick={(e) => e.preventDefault()}
                  aria-label="لینکدین خودرو یاب"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0D1117]/90 text-[#9BA3AE] transition-colors hover:border-[#FF6A00]/50 hover:text-[#FF6A00]"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Col 2: Navigation Links (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-sm font-bold tracking-wide text-[#F5F5F5] flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00]" />
                دسترسی سریع
              </h4>
              <ul className="space-y-2.5 text-sm">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[#9BA3AE] transition-colors hover:text-[#FF8A2A] flex items-center gap-1.5"
                    >
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: Free Trade Zones Coverage (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-sm font-bold tracking-wide text-[#F5F5F5] flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00]" />
                پوشش مناطق آزاد تجاری
              </h4>
              <div className="flex flex-wrap gap-2">
                {FREE_ZONES_LIST.map((zone) => (
                  <span
                    key={zone.en}
                    className="rounded-lg border border-white/[0.08] bg-[#0D1117]/90 px-3 py-1.5 text-xs text-[#F5F5F5]/85"
                  >
                    {zone.name}
                  </span>
                ))}
              </div>
              <div className="rounded-xl border border-[#FF6A00]/20 bg-[#0D1117]/80 p-3.5 text-xs leading-6 text-[#9BA3AE]">
                <div className="flex items-center gap-1.5 font-semibold text-[#FF8A2A] mb-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span>تعهد شفافیت قراردادی</span>
                </div>
                کلیه فرآیندهای تأمین، ترخیص و تحویل در چارچوب ضوابط اعلام‌شده در قرارداد
                رسمی شرکت انجام می‌پذیرد.
              </div>
            </div>

            {/* Col 4: Contact Details (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-sm font-bold tracking-wide text-[#F5F5F5] flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF6A00]" />
                ارتباط با دفتر مرکزی
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-[#9BA3AE]">
                <li className="flex items-start gap-2.5">
                  <Phone className="h-4 w-4 text-[#FF6A00] shrink-0 mt-1" />
                  <div>
                    <div className="text-[#F5F5F5] font-semibold" dir="ltr">
                      ۰۲۱ - ۸۸۰۰ ۰۰۰۰ (خط ویژه مشاوره)
                    </div>
                    <div className="text-xs text-[#9BA3AE]">
                      موبایل پشتیبانی ۲۴/۷: ۰۹۱۲ ۰۰۰ ۰۰۰۰
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="h-4 w-4 text-[#FF6A00] shrink-0 mt-1" />
                  <span className="font-mono text-xs text-[#F5F5F5]">
                    info@khodroyab-freezone.ir
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-[#FF6A00] shrink-0 mt-1" />
                  <span>
                    دفتر مرکزی و شوروم مناطق آزاد (اطلاعات آدرس دقیق قابل ویرایش بر اساس
                    شعبه منتخب)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-[#FF6A00] shrink-0 mt-1" />
                  <span>
                    مراجعه حضوری: شنبه تا پنج‌شنبه ۹ الی ۲۰ | پشتیبانی تلفنی: ۲۴ ساعته
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 text-xs text-[#9BA3AE] sm:flex-row">
            <p>
              © تمامی حقوق مادی و معنوی برای{" "}
              <span className="font-bold text-[#F5F5F5]">خودرو یاب (KHODROYAB)</span> محفوظ
              است.
            </p>
            <div className="flex items-center gap-4 font-mono text-[11px] text-[#9BA3AE]">
              <span>DARK AUTOMOTIVE ARCHITECTURE</span>
              <span className="text-[#FF6A00]">•</span>
              <span>PERSIAN RTL EXPERIENCE</span>
            </div>
          </div>
        </div>
      </PerspectiveGrid>
    </footer>
  );
};

export default Footer;
