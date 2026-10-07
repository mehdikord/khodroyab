"use client";

import React, { useState } from "react";
import { StaggeredText } from "@/components/react-bits/StaggeredText";
import { ConsultationFormSection } from "@/components/sections/ConsultationFormSection";
import { FREE_ZONES_LIST } from "@/data/khodroyab-data";
import {
  Phone,
  Smartphone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Send,
  Linkedin,
  Compass,
  ShieldCheck,
  Navigation,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [activeZoneIdx, setActiveZoneIdx] = useState(0);
  const selectedZone = FREE_ZONES_LIST[activeZoneIdx];

  return (
    <div className="bg-[#07090C] text-[#F5F5F5] pt-28 pb-20">
      {/* Page Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.07] pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,106,0,0.14),transparent_60%)]"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/35 bg-[#FF6A00]/10 px-4 py-1.5 text-xs font-semibold text-[#FF8A2A]">
              <Phone className="h-3.5 w-3.5" />
              <span>تماس با خودرو یاب — CONTACT & CONCIERGE</span>
            </div>

            <StaggeredText
              as="h1"
              text="ارتباط مستقیم با کارشناسان فروش و واردات خودرو یاب"
              segmentBy="words"
              delay={70}
              duration={0.7}
              highlightWords={["ارتباط", "مستقیم", "خودرو", "یاب"]}
              className="text-3xl sm:text-5xl font-black tracking-tight text-[#F5F5F5] leading-[1.25]"
            />

            <p className="text-sm sm:text-base leading-8 text-[#9BA3AE]">
              تیم مشاوره و پشتیبانی ۲۴ ساعته خودرو یاب در تمام روزهای هفته آماده پاسخگویی
              به استعلام‌های قیمتی، هماهنگی بازدید حضوری و ارائه راهنمایی تخصصی درباره
              مقررات واردات خودرو در مناطق آزاد است.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Channels Grid (Phone, Mobile, Email, Address, Working Hours, Socials) */}
      <section className="py-16 border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1. Landline Phone */}
            <div className="rounded-3xl border border-white/[0.09] bg-[#0D1117] p-6 sm:p-7 space-y-3 hover:border-[#FF6A00]/45 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6A00]/15 text-[#FF6A00]">
                <Phone className="h-6 w-6" />
              </div>
              <div className="font-mono text-xs text-[#FF8A2A]">LANDLINE // OFFICE</div>
              <h2 className="text-lg font-extrabold text-[#F5F5F5]">تلفن دفتر مرکزی</h2>
              <p className="font-mono text-lg font-bold text-[#F5F5F5]" dir="ltr">
                021 - 8800 0000
              </p>
              <p className="text-xs text-[#9BA3AE]">
                داخلی ۱۰۱ (واحد فروش و موجودی) | داخلی ۱۰۲ (واحد ثبت سفارش وارداتی)
              </p>
            </div>

            {/* 2. Mobile 24/7 */}
            <div className="rounded-3xl border border-white/[0.09] bg-[#0D1117] p-6 sm:p-7 space-y-3 hover:border-[#FF6A00]/45 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6A00]/15 text-[#FF6A00]">
                <Smartphone className="h-6 w-6" />
              </div>
              <div className="font-mono text-xs text-[#FF8A2A]">
                24/7 MOBILE // VIP HOTLINE
              </div>
              <h2 className="text-lg font-extrabold text-[#F5F5F5]">
                شماره موبایل پشتیبانی ۲۴ ساعته
              </h2>
              <p className="font-mono text-lg font-bold text-[#FF8A2A]" dir="ltr">
                0912 000 0000
              </p>
              <p className="text-xs text-[#9BA3AE]">
                پاسخگویی مستقیم کارشناس ارشد در تمامی ساعات شبانه‌روز و ایام تعطیل
              </p>
            </div>

            {/* 3. Email & Digital Correspondence */}
            <div className="rounded-3xl border border-white/[0.09] bg-[#0D1117] p-6 sm:p-7 space-y-3 hover:border-[#FF6A00]/45 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6A00]/15 text-[#FF6A00]">
                <Mail className="h-6 w-6" />
              </div>
              <div className="font-mono text-xs text-[#FF8A2A]">
                EMAIL // OFFICIAL INQUIRIES
              </div>
              <h2 className="text-lg font-extrabold text-[#F5F5F5]">پست الکترونیک رسمی</h2>
              <p className="font-mono text-sm font-bold text-[#F5F5F5]" dir="ltr">
                info@khodroyab-freezone.ir
              </p>
              <p className="text-xs text-[#9BA3AE]">
                جهت ارسال اسناد بازرگانی، درخواست‌های سازمانی و مکاتبات رسمی
              </p>
            </div>

            {/* 4. Physical Address */}
            <div className="rounded-3xl border border-white/[0.09] bg-[#0D1117] p-6 sm:p-7 space-y-3 hover:border-[#FF6A00]/45 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6A00]/15 text-[#FF6A00]">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="font-mono text-xs text-[#FF8A2A]">
                SHOWROOM & HEADQUARTERS
              </div>
              <h2 className="text-lg font-extrabold text-[#F5F5F5]">نشانی دفتر و شوروم</h2>
              <p className="text-xs sm:text-sm leading-6 text-[#F5F5F5]">
                دفتر مرکزی و شوروم اختصاصی مناطق آزاد — [نشانی دقیق ساختمان و پلاک قابل
                ویرایش بر اساس شعبه کارفرما]
              </p>
              <p className="text-xs text-[#9BA3AE]">
                دارای پارکینگ اختصاصی VIP جهت بازدید حضوری مشتریان گرامی
              </p>
            </div>

            {/* 5. Working Hours */}
            <div className="rounded-3xl border border-white/[0.09] bg-[#0D1117] p-6 sm:p-7 space-y-3 hover:border-[#FF6A00]/45 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6A00]/15 text-[#FF6A00]">
                <Clock className="h-6 w-6" />
              </div>
              <div className="font-mono text-xs text-[#FF8A2A]">OPERATING HOURS</div>
              <h2 className="text-lg font-extrabold text-[#F5F5F5]">ساعات کاری مجموعه</h2>
              <p className="text-xs sm:text-sm leading-6 text-[#F5F5F5]">
                مراجعه حضوری: شنبه تا پنج‌شنبه از ساعت ۰۹:۰۰ الی ۲۰:۰۰
              </p>
              <p className="text-xs text-[#FF8A2A] font-semibold">
                پشتیبانی تلفنی و مشاوره آنلاین: ۲۴ ساعته در ۷ روز هفته
              </p>
            </div>

            {/* 6. Social Networks */}
            <div className="rounded-3xl border border-white/[0.09] bg-[#0D1117] p-6 sm:p-7 space-y-3 hover:border-[#FF6A00]/45 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6A00]/15 text-[#FF6A00]">
                <Send className="h-6 w-6" />
              </div>
              <div className="font-mono text-xs text-[#FF8A2A]">SOCIAL CHANNELS</div>
              <h2 className="text-lg font-extrabold text-[#F5F5F5]">
                شبکه‌های اجتماعی رسمی
              </h2>
              <p className="text-xs text-[#9BA3AE]">
                مشاهده ویدیوهای کارشناسی و معرفی خودروهای جدید وارداتی در صفحات رسمی ما:
              </p>
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href="#instagram"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-[#171B21] px-3 py-2 text-xs font-semibold text-[#F5F5F5] hover:border-[#FF6A00]"
                >
                  <Instagram className="h-3.5 w-3.5 text-[#FF6A00]" />
                  <span>اینستاگرام</span>
                </a>
                <a
                  href="#telegram"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-[#171B21] px-3 py-2 text-xs font-semibold text-[#F5F5F5] hover:border-[#FF6A00]"
                >
                  <Send className="h-3.5 w-3.5 text-[#FF6A00]" />
                  <span>تلگرام</span>
                </a>
                <a
                  href="#linkedin"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-[#171B21] px-3 py-2 text-xs font-semibold text-[#F5F5F5] hover:border-[#FF6A00]"
                >
                  <Linkedin className="h-3.5 w-3.5 text-[#FF6A00]" />
                  <span>لینکدین</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Dark Architectural Map Placeholder */}
          <div className="overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0D1117] shadow-card-depth">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-5 p-6 sm:p-8 space-y-5 border-b lg:border-b-0 lg:border-l border-white/[0.08]">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF8A2A]">
                  <Compass className="h-4 w-4" />
                  <span>موقعیت‌یاب دفاتر و هاب‌های مناطق آزاد</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#F5F5F5]">
                  نقشه تعاملی و مراکز خدمات مناطق آزاد
                </h3>
                <p className="text-xs sm:text-sm leading-7 text-[#9BA3AE]">
                  منطقه آزاد مورد نظر خود را انتخاب نمایید تا موقعیت هاب لجستیک و هماهنگی
                  تحویل خودرو یاب را مشاهده فرمایید:
                </p>

                <div className="flex flex-wrap gap-2">
                  {FREE_ZONES_LIST.map((zone, idx) => (
                    <button
                      key={zone.en}
                      type="button"
                      onClick={() => setActiveZoneIdx(idx)}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-xs font-semibold transition-all",
                        idx === activeZoneIdx
                          ? "border-[#FF6A00] bg-[#FF6A00] text-[#07090C] font-bold"
                          : "border-white/[0.08] bg-[#171B21] text-[#9BA3AE] hover:text-[#F5F5F5]"
                      )}
                    >
                      {zone.name}
                    </button>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#07090C] p-4 space-y-1.5 text-xs">
                  <div className="font-mono text-[10px] text-[#FF8A2A]">
                    ACTIVE ZONE TELEMETRY
                  </div>
                  <div className="text-sm font-bold text-[#F5F5F5]">
                    {selectedZone.name} ({selectedZone.region})
                  </div>
                  <p className="text-[#9BA3AE] leading-6">
                    امکان ثبت سفارش، ترخیص گمرکی، کارشناسی پیش از تحویل و شماره‌گذاری
                    رسمی منطقه آزاد.
                  </p>
                </div>
              </div>

              {/* Stylized Dark Vector Map Canvas Placeholder */}
              <div className="lg:col-span-7 relative min-h-[340px] bg-[#07090C] flex items-center justify-center overflow-hidden p-6">
                {/* Architectural Radar Grid SVG */}
                <svg
                  viewBox="0 0 600 360"
                  className="absolute inset-0 h-full w-full opacity-45"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      id="map-grid"
                      width="40"
                      height="40"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="600" height="360" fill="url(#map-grid)" />
                  <circle
                    cx="300"
                    cy="180"
                    r="130"
                    fill="none"
                    stroke="rgba(255,106,0,0.22)"
                    strokeDasharray="4 6"
                  />
                  <circle
                    cx="300"
                    cy="180"
                    r="75"
                    fill="none"
                    stroke="rgba(255,106,0,0.35)"
                  />
                  <line
                    x1="0"
                    y1="180"
                    x2="600"
                    y2="180"
                    stroke="rgba(255,106,0,0.15)"
                  />
                  <line
                    x1="300"
                    y1="0"
                    x2="300"
                    y2="360"
                    stroke="rgba(255,106,0,0.15)"
                  />
                </svg>

                {/* Central Pin Card */}
                <div className="relative z-10 max-w-sm rounded-2xl border border-[#FF6A00]/50 bg-[#0D1117]/95 p-6 text-center backdrop-blur-md shadow-[0_0_40px_rgba(255,106,0,0.25)] space-y-3">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6A00] text-[#07090C] shadow-orange-glow">
                    <Navigation className="h-6 w-6" />
                  </div>
                  <div className="font-mono text-[11px] tracking-widest text-[#FF8A2A]">
                    {selectedZone.en} // HUB LOCATION
                  </div>
                  <h4 className="text-lg font-extrabold text-[#F5F5F5]">
                    پایگاه خدمات خودرو یاب — {selectedZone.name}
                  </h4>
                  <p className="text-xs text-[#9BA3AE] leading-6">
                    [جایگاه نقشه تعاملی و مختصات دقیق GPS دفتر مرکزی / شوروم خودرو یاب]
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation & Contact Form */}
      <ConsultationFormSection />
    </div>
  );
}
