"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlitterWarp } from "@/components/react-bits/GlitterWarp";
import { StaggeredText } from "@/components/react-bits/StaggeredText";
import { ShaderCard } from "@/components/react-bits/ShaderCard";
import { VehicleVarietyCenterFlow } from "@/components/sections/VehicleVarietyCenterFlow";
import { ConsultationFormSection } from "@/components/sections/ConsultationFormSection";
import {
  TRUST_PILLARS,
  SERVICES_DATA,
  QUALITY_CHECKPOINTS,
  LICENSES_AND_ACHIEVEMENTS,
  FREE_ZONES_LIST,
} from "@/data/khodroyab-data";
import {
  Search,
  PhoneCall,
  ArrowUpLeft,
  ShieldCheck,
  Scale,
  Headset,
  FileCheck2,
  Gauge,
  Layers,
  CheckCircle2,
  Sparkles,
  Award,
  Compass,
  FileText,
  Lock,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Scale,
  ShieldCheck,
  Headset,
  FileCheck2,
  Gauge,
  Layers,
};

export default function HomePage() {
  const [activeQualityIdx, setActiveQualityIdx] = useState(0);
  const [heroHotspot, setHeroHotspot] = useState<"origin" | "customs" | "quality">(
    "origin"
  );

  const activeQuality = QUALITY_CHECKPOINTS[activeQualityIdx];

  return (
    <div className="bg-[#07090C] text-[#F5F5F5]">
      {/* =====================================================================
          1. HERO — GLITTER WARP + STAGGERED TEXT + CINEMATIC AUTOMOTIVE STAGE
         ===================================================================== */}
      <section className="relative min-h-screen w-full overflow-hidden border-b border-white/[0.07] pt-24 pb-16 flex items-center">
        {/* React Bits Pro — Glitter Warp Subtle Orange/Dark Atmosphere */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <GlitterWarp
            width="100%"
            height="100%"
            speed={0.55}
            color="#FF6A00"
            secondaryColor="#FF8A2A"
            density={17}
            brightness={0.9}
            starSize={0.075}
            focalDepth={0.055}
            turbulence={0.1}
            autoPlay={true}
          />
        </div>

        {/* Architectural Vignette & Ambient Lighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_75%_35%,rgba(255,106,0,0.14),transparent_55%),linear-gradient(to_bottom,rgba(7,9,12,0.35)_0%,rgba(7,9,12,0.75)_75%,#07090C_100%)]"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            {/* Hero Editorial Copy & Staggered Headline (7 cols on desktop) */}
            <div className="lg:col-span-7 space-y-7">
              {/* Top Luxury Telemetry Pill */}
              <div className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-[#FF6A00]/35 bg-[#0D1117]/90 px-4 py-2 backdrop-blur-md shadow-[0_0_25px_rgba(255,106,0,0.2)]">
                <span className="h-2 w-2 rounded-full bg-[#FF6A00] animate-ping" />
                <span className="text-xs font-bold tracking-wide text-[#F5F5F5]">
                  مرجع تخصصی فروش و واردات خودروهای خارجی در مناطق آزاد
                </span>
                <span className="hidden sm:inline-block font-mono text-[10px] text-[#FF8A2A] border-r border-white/15 pr-2.5">
                  FREE-TRADE ZONE SPECIALIST
                </span>
              </div>

              {/* React Bits Pro — Staggered Text Headline */}
              <div className="space-y-3">
                <StaggeredText
                  as="h1"
                  text="خودرو یاب — انتخاب مطمئن خودروهای وارداتی"
                  segmentBy="words"
                  delay={85}
                  duration={0.78}
                  direction="bottom"
                  blur={true}
                  highlightWords={["خودرو", "یاب", "مطمئن", "وارداتی"]}
                  className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-[#F5F5F5] leading-[1.22]"
                />
              </div>

              {/* Supporting Copy */}
              <p className="max-w-2xl text-base sm:text-lg leading-8 sm:leading-9 text-[#9BA3AE]">
                تجربه‌ای فراتر از نمایشگاه‌های سنتی؛ در{" "}
                <strong className="text-[#F5F5F5] font-bold">خودرو یاب (KHODROYAB)</strong>{" "}
                فرآیند انتخاب، استعلام اصالت، کارشناسی فنی و ظاهری و خرید خودروهای
                وارداتی در مناطق آزاد کشور با شفافیت کامل قراردادی و همراهی ۲۴ ساعته
                کارشناسان انجام می‌پذیرد.
              </p>

              {/* Required Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href="/search"
                  className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-8 py-4 text-base font-extrabold text-[#07090C] shadow-[0_0_35px_rgba(255,106,0,0.45)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_45px_rgba(255,106,0,0.65)]"
                >
                  <Search className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span>جستجوی خودرو</span>
                  <ArrowUpLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <Link
                  href="#consultation"
                  className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/[0.14] bg-[#0D1117]/90 px-8 py-4 text-base font-bold text-[#F5F5F5] backdrop-blur-md transition-all duration-300 hover:border-[#FF6A00]/60 hover:bg-[#171B21]"
                >
                  <PhoneCall className="h-5 w-5 text-[#FF6A00]" />
                  <span>مشاوره رایگان</span>
                </Link>
              </div>

              {/* Trust Micro-Bar */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/[0.08]">
                <div className="rounded-xl border border-white/[0.06] bg-[#0D1117]/75 p-3">
                  <div className="font-mono text-[10px] text-[#FF8A2A] uppercase">
                    TRANSPARENCY
                  </div>
                  <div className="mt-1 text-xs sm:text-sm font-bold text-[#F5F5F5]">
                    شفافیت کامل قیمت و اسناد
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-[#0D1117]/75 p-3">
                  <div className="font-mono text-[10px] text-[#FF8A2A] uppercase">
                    QUALITY AUDIT
                  </div>
                  <div className="mt-1 text-xs sm:text-sm font-bold text-[#F5F5F5]">
                    کارشناسی فنی و ظاهری
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-[#0D1117]/75 p-3">
                  <div className="font-mono text-[10px] text-[#FF8A2A] uppercase">
                    24/7 SUPPORT
                  </div>
                  <div className="mt-1 text-xs sm:text-sm font-bold text-[#F5F5F5]">
                    پشتیبانی اختصاصی ۲۴ ساعته
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Cinematic Automotive Stage (5 cols on desktop) */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0D1117] shadow-[0_35px_90px_rgba(0,0,0,0.9)]">
                {/* Top Orange Specular Line */}
                <div className="absolute inset-x-0 top-0 z-20 h-[2px] bg-gradient-to-l from-transparent via-[#FF6A00] to-transparent" />

                {/* Main Hero Automotive Image */}
                <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3.4] w-full overflow-hidden">
                  <img
                    src="/images/hero-car.jpg"
                    alt="خودرو یاب — واردات و فروش تخصصی خودروهای خارجی در مناطق آزاد"
                    className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/20 to-transparent" />

                  {/* Floating Telemetry Badge Top-Right */}
                  <div className="absolute right-4 top-4 rounded-xl border border-white/[0.12] bg-[#07090C]/85 px-3 py-2 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#FF6A00]" />
                      <span className="font-mono text-[10px] font-semibold tracking-wider text-[#F5F5F5]">
                        IMPORT PROTOCOL // ACTIVE
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive Telemetry Inspection Strip Inside Hero Card */}
                <div className="relative z-20 p-5 sm:p-6 space-y-4 bg-[#0D1117]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#9BA3AE]">
                      چارچوب استاندارد تأمین و تحویل خودرو یاب:
                    </span>
                    <span className="font-mono text-[10px] text-[#FF8A2A]">
                      3-STAGE VERIFIED
                    </span>
                  </div>

                  {/* 3 Interactive Stage Pills */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setHeroHotspot("origin")}
                      className={cn(
                        "rounded-xl border px-3 py-2.5 text-right transition-all",
                        heroHotspot === "origin"
                          ? "border-[#FF6A00] bg-[#FF6A00]/15 text-[#F5F5F5]"
                          : "border-white/[0.07] bg-[#171B21]/60 text-[#9BA3AE] hover:text-[#F5F5F5]"
                      )}
                    >
                      <div className="font-mono text-[10px] text-[#FF8A2A]">01</div>
                      <div className="text-xs font-bold mt-0.5">تأمین از مبدأ</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHeroHotspot("customs")}
                      className={cn(
                        "rounded-xl border px-3 py-2.5 text-right transition-all",
                        heroHotspot === "customs"
                          ? "border-[#FF6A00] bg-[#FF6A00]/15 text-[#F5F5F5]"
                          : "border-white/[0.07] bg-[#171B21]/60 text-[#9BA3AE] hover:text-[#F5F5F5]"
                      )}
                    >
                      <div className="font-mono text-[10px] text-[#FF8A2A]">02</div>
                      <div className="text-xs font-bold mt-0.5">تشریفات منطقه آزاد</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setHeroHotspot("quality")}
                      className={cn(
                        "rounded-xl border px-3 py-2.5 text-right transition-all",
                        heroHotspot === "quality"
                          ? "border-[#FF6A00] bg-[#FF6A00]/15 text-[#F5F5F5]"
                          : "border-white/[0.07] bg-[#171B21]/60 text-[#9BA3AE] hover:text-[#F5F5F5]"
                      )}
                    >
                      <div className="font-mono text-[10px] text-[#FF8A2A]">03</div>
                      <div className="text-xs font-bold mt-0.5">کارشناسی و تحویل</div>
                    </button>
                  </div>

                  {/* Dynamic Stage Explanation */}
                  <div className="rounded-2xl border border-white/[0.07] bg-[#171B21]/70 p-3.5 text-xs leading-6 text-[#9BA3AE]">
                    {heroHotspot === "origin" && (
                      <p>
                        <strong className="text-[#F5F5F5]">انتخاب و استعلام مبدأ:</strong>{" "}
                        شناسایی خودرو از منابع رسمی، تطبیق شماره شاسی (VIN) و بررسی کامل
                        آپشن‌های فابریک پیش از بارگیری.
                      </p>
                    )}
                    {heroHotspot === "customs" && (
                      <p>
                        <strong className="text-[#F5F5F5]">لجستیک و ترخیص قانونی:</strong>{" "}
                        حمل ایمن، انجام کلیه تشریفات گمرکی مناطق آزاد و اخذ مجوزهای
                        استاندارد و شماره‌گذاری طبق ضوابط.
                      </p>
                    )}
                    {heroHotspot === "quality" && (
                      <p>
                        <strong className="text-[#F5F5F5]">ارزیابی فنی و تحویل امن:</strong>{" "}
                        اجرای کامل پروتکل کارشناسی فنی و بدنه و تحویل خودرو به همراه
                        پرونده مستند به خریدار.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Free Zones Coverage Marquee Strip at Bottom of Hero */}
          <div className="mt-12 rounded-2xl border border-white/[0.07] bg-[#0D1117]/80 px-5 py-4 backdrop-blur-md">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F5F5F5]">
                <Compass className="h-4 w-4 text-[#FF6A00]" />
                <span>دامنه خدمات فروش و واردات در مناطق آزاد کشور:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {FREE_ZONES_LIST.map((z) => (
                  <span
                    key={z.en}
                    className="rounded-lg border border-white/[0.07] bg-[#171B21]/90 px-3 py-1 text-xs text-[#9BA3AE]"
                  >
                    {z.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. COMPANY INTRODUCTION & HISTORY (معرفی و پیشینه خودرو یاب)
         ===================================================================== */}
      <section className="relative py-20 sm:py-28 border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Image Showcase (6 cols) */}
            <div className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0D1117] shadow-card-depth">
                <img
                  src="/images/showroom-freezone.jpg"
                  alt="شوروم و ترمینال اختصاصی خودرو یاب در منطقه آزاد"
                  className="aspect-[16/11] w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07090C] via-transparent to-transparent" />

                <div className="p-6 sm:p-8 bg-[#0D1117] border-t border-white/[0.07]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-[#FF8A2A] tracking-widest">
                      CORPORATE HERITAGE // EDITABLE PROFILE
                    </span>
                    <span className="rounded-full bg-[#FF6A00]/15 px-3 py-1 text-xs font-bold text-[#FF8A2A]">
                      مناطق آزاد تجاری
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm leading-7 text-[#9BA3AE]">
                    تمرکز انحصاری بر فرآیندهای استاندارد بازرگانی، واردات و عرضه خودروهای
                    خارجی در مناطق آزاد تجاری با تکیه بر تیم کارشناسی مجرب و زیرساخت
                    حقوقی شفاف.
                  </p>
                </div>
              </div>
            </div>

            {/* Company Story, Mission & Values (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/35 bg-[#FF6A00]/10 px-3.5 py-1.5 text-xs font-semibold text-[#FF8A2A]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>اصالت، شفافیت و تخصص در مناطق آزاد</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#F5F5F5] leading-[1.25]">
                داستان و رسالت{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A]">
                  خودرو یاب
                </span>
              </h2>

              <p className="text-sm sm:text-base leading-8 text-[#9BA3AE]">
                مجموعه <strong className="text-[#F5F5F5]">خودرو یاب (KHODROYAB)</strong> با
                هدف ارتقای استانداردهای خرید، فروش و واردات خودروهای خارجی در مناطق آزاد
                کشور شکل گرفته است. ما بر این باوریم که خریدار خودروی وارداتی شایسته
                دریافت اطلاعات دقیق، قیمت‌گذاری شفاف بدون واسطه‌های غیرضروری و اطمینان
                کامل از سلامت فنی و حقوقی خودرو است.
              </p>

              {/* Mission / Experience / Values Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
                <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/90 p-5">
                  <div className="font-mono text-[11px] text-[#FF8A2A] mb-1">
                    01 // MISSION
                  </div>
                  <h3 className="text-base font-bold text-[#F5F5F5]">ماموریت سازمانی</h3>
                  <p className="mt-2 text-xs leading-6 text-[#9BA3AE]">
                    تسهیل و ایمن‌سازی فرآیند واردات و خرید خودروهای خارجی در مناطق آزاد از
                    طریق قراردادهای شفاف، کارشناسی مستند و مشاوره تخصصی بی‌طرفانه.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/90 p-5">
                  <div className="font-mono text-[11px] text-[#FF8A2A] mb-1">
                    02 // EXPERIENCE & VALUES
                  </div>
                  <h3 className="text-base font-bold text-[#F5F5F5]">
                    ارزش‌ها و تجربه اجرایی
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-[#9BA3AE]">
                    تسلط بر ضوابط گمرکی مناطق آزاد، شناخت عمیق تریم‌های جهانی خودروها و
                    پایبندی کامل به تعهدات اعلام‌شده در قرارداد فیمابین.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#FF6A00]/45 bg-[#FF6A00]/10 px-6 py-3.5 text-sm font-bold text-[#F5F5F5] transition-all hover:bg-[#FF6A00] hover:text-[#07090C]"
                >
                  <span>آشنایی کامل با درباره خودرو یاب</span>
                  <ArrowUpLeft className="h-4 w-4" />
                </Link>
                <span className="text-xs text-[#5E6672]">
                  * محتوای تاریخچه و اطلاعات ثبتی به‌صورت ماژولار و قابل ویرایش طراحی شده است.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. WHY KHODROYAB — 6 PREMIUM TRUST BLOCKS (چرا خودرو یاب؟)
         ===================================================================== */}
      <section className="relative py-20 sm:py-28 border-b border-white/[0.06] bg-[#07090C]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,106,0,0.09),transparent_60%)]"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/35 bg-[#FF6A00]/10 px-4 py-1.5 text-xs font-semibold text-[#FF8A2A]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>ارکان اعتماد و تمایز خودرو یاب</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#F5F5F5]">
              چرا خریداران حرفه‌ای{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A]">
                خودرو یاب
              </span>{" "}
              را انتخاب می‌کنند؟
            </h2>

            <p className="text-sm sm:text-base leading-8 text-[#9BA3AE]">
              ما به جای شعارهای تبلیغاتی، شش اصل اجرایی و شفاف را در تمامی قراردادهای
              فروش و واردات خودرو در مناطق آزاد پیاده‌سازی کرده‌ایم.
            </p>
          </div>

          {/* 6 Architectural Trust Blocks */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TRUST_PILLARS.map((pillar) => {
              const IconComponent = ICON_MAP[pillar.iconName] || ShieldCheck;

              return (
                <div
                  key={pillar.id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#0D1117] to-[#07090C] p-6 sm:p-8 transition-all duration-300 hover:border-[#FF6A00]/50 hover:shadow-orange-subtle"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FF6A00]/35 bg-[#FF6A00]/10 text-[#FF6A00] transition-transform duration-300 group-hover:scale-110">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-xs font-bold tracking-widest text-[#5E6672] group-hover:text-[#FF8A2A] transition-colors">
                        {pillar.code}
                      </span>
                    </div>

                    <div className="font-mono text-[10px] tracking-widest text-[#FF8A2A] uppercase mb-1">
                      {pillar.enTitle}
                    </div>
                    <h3 className="text-xl font-extrabold text-[#F5F5F5] leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-xs font-semibold text-[#FF8A2A]/90">
                      {pillar.subtitle}
                    </p>
                    <p className="mt-3 text-xs sm:text-sm leading-7 text-[#9BA3AE]">
                      {pillar.description}
                    </p>
                  </div>

                  <ul className="mt-6 space-y-2 border-t border-white/[0.07] pt-4">
                    {pillar.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-xs text-[#F5F5F5]/85"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#FF6A00] shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. SERVICES PREVIEW — REACT BITS PRO SHADER CARD (خدمات خودرو یاب)
         ===================================================================== */}
      <section className="relative py-20 sm:py-28 border-b border-white/[0.06] bg-[#0D1117]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-14">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/35 bg-[#FF6A00]/10 px-3.5 py-1.5 text-xs font-semibold text-[#FF8A2A]">
                <Layers className="h-3.5 w-3.5" />
                <span>طیف کامل خدمات بازرگانی و فنی</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#F5F5F5]">
                خدمات تخصصی{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A]">
                  خودرو یاب
                </span>
              </h2>
              <p className="text-sm sm:text-base leading-8 text-[#9BA3AE]">
                از مشاوره اولیه و تأمین مستقیم خودروهای وارداتی تا کارشناسی چندمرحله‌ای،
                انجام تشریفات گمرکی مناطق آزاد و پشتیبانی پس از تحویل.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-[#171B21] px-5 py-3.5 text-xs sm:text-sm font-bold text-[#F5F5F5] transition-all hover:border-[#FF6A00] hover:text-[#FF8A2A] shrink-0"
            >
              <span>مشاهده صفحه کامل خدمات</span>
              <ArrowUpLeft className="h-4 w-4" />
            </Link>
          </div>

          {/* React Bits Pro — Shader Card Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES_DATA.map((service) => (
              <ShaderCard
                key={service.id}
                width="100%"
                height="100%"
                borderRadius="24px"
                color="#FF6A00"
                highlightColor="#FF8A2A"
                backgroundColor="#0D1117"
                speed={0.38}
                scale={3.6}
                effectRadius={0.88}
                effectBoost={0.42}
                waveAmount={0.12}
                contours={1.0}
                intensity={0.82}
                bloom={0.72}
                fade={0.64}
                opacity={0.88}
                interactive={true}
                tiltStrength={4.5}
                hoverRise={1.0}
                className="flex flex-col justify-between"
              >
                <div className="flex h-full flex-col justify-between p-6 sm:p-7">
                  <div>
                    {/* Service Card Top Header */}
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <span className="rounded-full border border-[#FF6A00]/35 bg-[#FF6A00]/15 px-3 py-1 text-[11px] font-bold text-[#FF8A2A]">
                        {service.badge}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#9BA3AE]">
                        {service.code}
                      </span>
                    </div>

                    {/* Thumbnail Preview Strip */}
                    <div className="relative mb-5 h-40 w-full overflow-hidden rounded-2xl border border-white/[0.08]">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-transparent" />
                      <span className="absolute bottom-2.5 left-3 font-mono text-[10px] tracking-wider text-[#F5F5F5]/80">
                        {service.enTitle}
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-[#F5F5F5] leading-snug">
                      {service.title}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm leading-7 text-[#9BA3AE]">
                      {service.shortDesc}
                    </p>

                    <ul className="mt-4 space-y-2">
                      {service.features.slice(0, 3).map((feat, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-[#F5F5F5]/90"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#FF6A00] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                    <span className="text-[11px] text-[#9BA3AE] line-clamp-1">
                      {service.deliverable}
                    </span>
                    <Link
                      href={`/services#${service.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#FF8A2A] hover:text-[#FF6A00] shrink-0"
                    >
                      <span>جزئیات</span>
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </ShaderCard>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. PRICE ADVANTAGE & TRANSPARENCY (مزیت رقابتی قیمت و تعهد قراردادی)
         ===================================================================== */}
      <section className="relative py-20 sm:py-28 border-b border-white/[0.06] bg-[#07090C]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/35 bg-[#FF6A00]/10 px-3.5 py-1.5 text-xs font-semibold text-[#FF8A2A]">
                <Scale className="h-3.5 w-3.5" />
                <span>قیمت مناسب و شفافیت مالی</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F5F5] leading-[1.25]">
                شفافیت ساختار قیمت و{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A]">
                  تعهد قیمت در شرایط اعلام‌شده
                </span>
              </h2>

              <p className="text-sm sm:text-base leading-8 text-[#9BA3AE]">
                یکی از چالش‌های اصلی خریداران در بازار خودروهای وارداتی، ابهام در هزینه‌های
                جانبی و تغییر قیمت‌ها در میانه فرآیند است. در خودرو یاب، ما با حذف
                واسطه‌های غیرضروری و ارائه جدول تفکیکی هزینه‌ها پیش از عقد قرارداد،
                شفافیت کامل مالی را تضمین می‌کنیم.
              </p>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117] p-5">
                  <h3 className="text-base font-bold text-[#F5F5F5] flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#FF6A00]" />
                    <span>پیش‌فاکتور تفکیکی و شفاف</span>
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-7 text-[#9BA3AE]">
                    بهای خرید در مبدأ، هزینه حمل و بیمه بین‌المللی، تعرفه‌ها و عوارض قانونی
                    منطقه آزاد و حق‌الزحمه خدمات شرکت به‌صورت کاملاً مجزا و قابل راستی‌آزمایی
                    درج می‌گردد.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#FF6A00]/30 bg-[#0D1117] p-5">
                  <h3 className="text-base font-bold text-[#F5F5F5] flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#FF6A00]" />
                    <span>تعهد قیمت در شرایط اعلام‌شده قرارداد</span>
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-7 text-[#9BA3AE]">
                    در چارچوب زمان‌بندی، نحوه پرداخت و شرایط تصریح‌شده در قرارداد رسمی،
                    خودرو یاب متعهد به حفظ بهای توافقی بوده و هیچ‌گونه هزینه پنهان یا
                    فراتر از توافق مکتوب به خریدار تحمیل نخواهد شد.
                  </p>
                </div>
              </div>
            </div>

            {/* Comparative Architectural Visual Card (6 cols) */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-white/[0.1] bg-[#0D1117] p-6 sm:p-8 shadow-card-depth space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div>
                    <span className="font-mono text-[11px] text-[#FF8A2A]">
                      COST TRANSPARENCY MATRIX
                    </span>
                    <h3 className="text-lg font-extrabold text-[#F5F5F5] mt-1">
                      مقایسه مدل شفاف خودرو یاب با بازار سنتی
                    </h3>
                  </div>
                  <Scale className="h-6 w-6 text-[#FF6A00]" />
                </div>

                <div className="space-y-4">
                  {[
                    {
                      label: "منبع تأمین خودرو",
                      khodroyab: "تأمین مستقیم از مبادی رسمی و هاب‌های صادراتی",
                      traditional: "خرید چنددست با حاشیه سود واسطه‌های متعدد",
                    },
                    {
                      label: "شفافیت ریز هزینه‌ها",
                      khodroyab: "ارائه جدول تفکیکی کامل پیش از امضای قرارداد",
                      traditional: "اعلام قیمت مقطوع بدون شفاف‌سازی هزینه‌های جانبی",
                    },
                    {
                      label: "پایداری توافق مالی",
                      khodroyab: "تعهد مکتوب به قیمت در شرایط اعلام‌شده قرارداد",
                      traditional: "احتمال تغییر شرایط و تحمیل هزینه‌های پیش‌بینی‌نشده",
                    },
                    {
                      label: "اصالت آپشن‌ها",
                      khodroyab: "تطبیق با لیست فابریک کارخانه (VIN Decoder)",
                      traditional: "عدم تفکیک شفاف آپشن‌های فابریک و نصبی",
                    },
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-white/[0.07] bg-[#171B21]/60 p-4 space-y-2.5"
                    >
                      <div className="text-xs font-bold text-[#F5F5F5]">
                        {row.label}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                        <div className="rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 p-2.5 text-[#F5F5F5]">
                          <span className="block font-bold text-[#FF8A2A] mb-0.5">
                            ✓ در خودرو یاب:
                          </span>
                          {row.khodroyab}
                        </div>
                        <div className="rounded-xl border border-white/[0.05] bg-[#07090C]/70 p-2.5 text-[#9BA3AE]">
                          <span className="block font-semibold text-[#5E6672] mb-0.5">
                            × روش سنتی:
                          </span>
                          {row.traditional}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. SAFE PURCHASE & 7. 24/7 SUPPORT (خرید امن + پشتیبانی ۲۴ ساعته)
         ===================================================================== */}
      <section className="relative py-20 sm:py-28 border-b border-white/[0.06] bg-[#0D1117]/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
          {/* Safe Purchase Architecture */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0D1117] shadow-card-depth">
                <img
                  src="/images/safe-delivery.jpg"
                  alt="فرآیند خرید امن و تحویل استاندارد خودرو در خودرو یاب"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-6 bg-[#0D1117] border-t border-white/[0.08]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#FF8A2A] mb-1">
                    <Lock className="h-4 w-4" />
                    <span>امنیت حقوقی و مالی در تمام مراحل</span>
                  </div>
                  <p className="text-xs leading-6 text-[#9BA3AE]">
                    هر مرحله از پرداخت و تحویل منطبق بر اسناد رسمی حمل، قبض انبار گمرکی و
                    برگه کارشناسی معتبر انجام می‌گیرد.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/35 bg-[#FF6A00]/10 px-3.5 py-1.5 text-xs font-semibold text-[#FF8A2A]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>معماری خرید امن (SAFE PURCHASE)</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F5F5]">
                چهار گام استاندارد برای یک{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A]">
                  خرید کاملاً امن
                </span>
              </h2>

              <p className="text-sm sm:text-base leading-8 text-[#9BA3AE]">
                فرآیند خرید در خودرو یاب به‌گونه‌ای طراحی شده است که خریدار در هر مرحله بر
                اسناد، وضعیت فیزیکی خودرو و روند پیشرفت پرونده نظارت کامل داشته باشد.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    step: "گام ۰۱",
                    title: "مشاوره و انتخاب مستند",
                    desc: "بررسی دقیق نیازها، بودجه و مقایسه فنی گزینه‌ها به همراه استعلام کد شاسی (VIN).",
                  },
                  {
                    step: "گام ۰۲",
                    title: "عقد قرارداد رسمی و شفاف",
                    desc: "تنظیم قرارداد حقوقی شفاف با درج دقیق مشخصات خودرو، زمان‌بندی و تعهدات طرفین.",
                  },
                  {
                    step: "گام ۰۳",
                    title: "تأمین، حمل و تشریفات گمرکی",
                    desc: "پرداخت مرحله‌ای متناسب با پیشرفت واقعی فرآیند خرید، حمل بیمه‌شده و ترخیص منطقه آزاد.",
                  },
                  {
                    step: "گام ۰۴",
                    title: "کارشناسی نهایی و تحویل قطعی",
                    desc: "بازرسی مجدد فنی و ظاهری در حضور خریدار، تحویل مدارک کامل و انتقال قطعی مالکیت.",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/90 p-5 hover:border-[#FF6A00]/40 transition-colors"
                  >
                    <span className="inline-block rounded-md bg-[#FF6A00]/15 px-2.5 py-1 font-mono text-xs font-bold text-[#FF8A2A]">
                      {item.step}
                    </span>
                    <h3 className="mt-3 text-base font-bold text-[#F5F5F5]">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-6 text-[#9BA3AE]">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 24/7 Support Showcase */}
          <div className="rounded-3xl border border-white/[0.1] bg-gradient-to-l from-[#0D1117] via-[#171B21]/90 to-[#0D1117] p-6 sm:p-10 lg:p-12 shadow-card-depth">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/35 bg-[#FF6A00]/10 px-3.5 py-1.5 text-xs font-semibold text-[#FF8A2A]">
                  <Headset className="h-3.5 w-3.5" />
                  <span>پشتیبانی ۲۴ ساعته (24/7 CONCIERGE)</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#F5F5F5] leading-tight">
                  همراهی بی‌وقفه در تمام ساعات شبانه‌روز؛ از نخستین استعلام تا سال‌ها پس از
                  تحویل
                </h3>

                <p className="text-sm sm:text-base leading-8 text-[#9BA3AE]">
                  تفاوت اصلی یک برند لوکس در کیفیت پاسخگویی آن است. هر خریدار در خودرو یاب
                  دارای یک کارشناس پرونده اختصاصی است که در تمام روزهای هفته به‌صورت ۲۴
                  ساعته آماده پاسخگویی به سوالات فنی، پیگیری وضعیت حمل و ترخیص و ارائه
                  خدمات پشتیبانی پس از خرید می‌باشد.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="rounded-2xl border border-white/[0.08] bg-[#07090C]/80 p-4">
                    <div className="text-sm font-bold text-[#F5F5F5]">
                      کارشناس اختصاصی پرونده
                    </div>
                    <p className="mt-1 text-xs text-[#9BA3AE]">
                      ارتباط مستقیم بدون نیاز به انتظار در صف‌های تلفنی
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-[#07090C]/80 p-4">
                    <div className="text-sm font-bold text-[#F5F5F5]">
                      گزارش‌دهی آنلاین لجستیک
                    </div>
                    <p className="mt-1 text-xs text-[#9BA3AE]">
                      اطلاع‌رسانی مرحله‌به‌مرحله از وضعیت حمل و گمرک
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-[#07090C]/80 p-4">
                    <div className="text-sm font-bold text-[#F5F5F5]">
                      همراهی پس از تحویل
                    </div>
                    <p className="mt-1 text-xs text-[#9BA3AE]">
                      مشاوره تمدید تردد، بیمه‌نامه و سرویس‌های تخصصی
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-2xl border border-white/[0.1]">
                  <img
                    src="/images/interior-cockpit.jpg"
                    alt="کابین لوکس و پشتیبانی ۲۴ ساعته خودرو یاب"
                    className="aspect-[16/10] w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07090C] via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-4 left-4 flex items-center justify-between rounded-xl border border-white/[0.12] bg-[#07090C]/90 px-4 py-3 backdrop-blur-md">
                    <div>
                      <div className="text-xs font-bold text-[#F5F5F5]">
                        خط ویژه پشتیبانی و مشاوره ۲۴/۷
                      </div>
                      <div className="font-mono text-xs text-[#FF8A2A]" dir="ltr">
                        021 - 8800 0000
                      </div>
                    </div>
                    <Link
                      href="/contact"
                      className="rounded-lg bg-[#FF6A00] px-3.5 py-2 text-xs font-bold text-[#07090C] hover:bg-[#FF8A2A]"
                    >
                      تماس مستقیم
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. QUALITY ASSURANCE (تضمین کیفیت فنی و ظاهری)
         ===================================================================== */}
      <section className="relative py-20 sm:py-28 border-b border-white/[0.06] bg-[#07090C]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/35 bg-[#FF6A00]/10 px-4 py-1.5 text-xs font-semibold text-[#FF8A2A]">
              <Gauge className="h-3.5 w-3.5" />
              <span>استاندارد کنترل کیفیت چندمرحله‌ای</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#F5F5F5]">
              تضمین کیفیت{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A]">
                فنی و ظاهری
              </span>{" "}
              با مستندات شفاف
            </h2>

            <p className="text-sm sm:text-base leading-8 text-[#9BA3AE]">
              هر دستگاه خودروی وارداتی در خودرو یاب تحت ۵ محور تخصصی مورد بازرسی و
              ارزیابی قرار می‌گیرد تا سلامت فنی، ظاهری و اصالت مدارک آن به‌طور کامل احراز
              شود.
            </p>
          </div>

          {/* 5 Interactive Quality Pillar Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
            {QUALITY_CHECKPOINTS.map((item, idx) => {
              const isActive = idx === activeQualityIdx;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveQualityIdx(idx)}
                  className={cn(
                    "flex items-center gap-2 rounded-2xl border px-5 py-3.5 text-xs sm:text-sm font-bold transition-all duration-200",
                    isActive
                      ? "border-[#FF6A00] bg-[#FF6A00] text-[#07090C] shadow-[0_0_25px_rgba(255,106,0,0.4)]"
                      : "border-white/[0.08] bg-[#0D1117] text-[#9BA3AE] hover:border-[#FF6A00]/40 hover:text-[#F5F5F5]"
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[11px]",
                      isActive ? "text-[#07090C]" : "text-[#FF8A2A]"
                    )}
                  >
                    0{idx + 1}
                  </span>
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Quality Pillar Detailed Telemetry Display */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center rounded-3xl border border-white/[0.1] bg-[#0D1117] p-6 sm:p-10 shadow-card-depth">
            {/* Left/Right Image Macro Visual */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.1]">
                <img
                  src={activeQuality.image}
                  alt={activeQuality.title}
                  className="aspect-[4/3] w-full object-cover transition-all duration-500"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07090C] via-transparent to-transparent" />
                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between rounded-xl border border-white/[0.1] bg-[#07090C]/90 px-3.5 py-2.5 backdrop-blur-md">
                  <span className="text-xs text-[#9BA3AE]">
                    {activeQuality.metricLabel}:
                  </span>
                  <span className="font-bold text-xs text-[#FF8A2A]">
                    {activeQuality.metricValue}
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Breakdown Details */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#FF8A2A]">
                    {activeQuality.code} // {activeQuality.enTitle}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#F5F5F5] mt-1">
                    {activeQuality.title}
                  </h3>
                </div>
                <span className="rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-3.5 py-1.5 text-xs font-bold text-[#FF8A2A]">
                  پروتکل رسمی کارشناسی
                </span>
              </div>

              <p className="text-sm sm:text-base leading-8 text-[#9BA3AE]">
                {activeQuality.description}
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
                {activeQuality.checkpoints.map((cp, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 rounded-xl border border-white/[0.07] bg-[#171B21]/70 p-3.5 text-xs leading-6 text-[#F5F5F5]"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#FF6A00] shrink-0 mt-1" />
                    <span>{cp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          9. VEHICLE VARIETY — SIGNATURE CENTER FLOW SECTION
         ===================================================================== */}
      <VehicleVarietyCenterFlow />

      {/* =====================================================================
          10. FREE CONSULTATION LEAD-GEN SECTION (مشاوره رایگان خرید خودرو)
         ===================================================================== */}
      <ConsultationFormSection />

      {/* =====================================================================
          11. LICENSES & ACHIEVEMENTS PREVIEW (مجوزها و دستاوردها)
         ===================================================================== */}
      <section className="relative py-20 sm:py-24 border-t border-white/[0.06] bg-[#0D1117]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end mb-12">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/35 bg-[#FF6A00]/10 px-3.5 py-1.5 text-xs font-semibold text-[#FF8A2A]">
                <Award className="h-3.5 w-3.5" />
                <span>اعتبار قانونی و دستاوردهای تخصصی</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#F5F5F5]">
                مجوزها، گواهینامه‌ها و{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A]">
                  دستاوردهای خودرو یاب
                </span>
              </h2>
              <p className="text-sm sm:text-base leading-8 text-[#9BA3AE]">
                فعالیت در چارچوب قوانین رسمی مناطق آزاد تجاری و رعایت استانداردهای حرفه‌ای
                بازرگانی خودرو. (تمامی قالب‌های مجوز برای جایگذاری مستندات رسمی کارفرما
                طراحی شده‌اند).
              </p>
            </div>

            <Link
              href="/licenses"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-[#171B21] px-5 py-3.5 text-xs sm:text-sm font-bold text-[#F5F5F5] transition-all hover:border-[#FF6A00] hover:text-[#FF8A2A] shrink-0"
            >
              <span>مشاهده کامل مجوزها و دستاوردها</span>
              <ArrowUpLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {LICENSES_AND_ACHIEVEMENTS.slice(0, 3).map((lic) => (
              <div
                key={lic.id}
                className="flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-[#0D1117] p-6 sm:p-7 hover:border-[#FF6A00]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-lg bg-[#FF6A00]/15 px-3 py-1 text-xs font-bold text-[#FF8A2A]">
                      {lic.category}
                    </span>
                    <span className="font-mono text-xs text-[#5E6672]">{lic.code}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#F5F5F5] leading-snug">
                    {lic.title}
                  </h3>
                  <p className="mt-2 font-mono text-[11px] text-[#FF8A2A]/90">
                    {lic.issuerPlaceholder}
                  </p>
                  <p className="mt-3 text-xs leading-6 text-[#9BA3AE]">
                    {lic.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.07] flex items-center justify-between text-xs">
                  <span className="text-[#5E6672]">{lic.statusLabel}</span>
                  <Link
                    href="/licenses"
                    className="font-bold text-[#FF8A2A] hover:text-[#FF6A00]"
                  >
                    بررسی جزئیات ←
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          12. FINAL CTA (فراخوان پایانی پیش از فوتر)
         ===================================================================== */}
      <section className="relative py-20 sm:py-24 border-t border-white/[0.06] bg-[#07090C]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-[#FF6A00]/35 bg-[#0D1117] shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
            <img
              src="/images/road-coastal.jpg"
              alt="خودرو یاب — انتخاب مطمئن خودروهای وارداتی"
              className="absolute inset-0 h-full w-full object-cover opacity-35"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#07090C] via-[#07090C]/85 to-[#07090C]/60" />

            <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-3xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/40 bg-[#FF6A00]/15 px-4 py-1.5 text-xs font-bold text-[#FF8A2A]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>تجربه خرید در تراز جهانی</span>
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F5F5F5] leading-[1.25]">
                با اطمینان، خودروی وارداتی شایسته خود را در مناطق آزاد انتخاب کنید
              </h2>

              <p className="text-sm sm:text-base leading-8 text-[#9BA3AE]">
                چه به دنبال خودروی وارداتی آماده تحویل باشید و چه قصد ثبت سفارش اختصاصی با
                رنگ و آپشن دلخواه خود را داشته باشید، تیم خودرو یاب در تمام مراحل کنار
                شماست.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-8 py-4 text-sm sm:text-base font-extrabold text-[#07090C] shadow-[0_0_30px_rgba(255,106,0,0.45)] transition-all hover:brightness-110"
                >
                  <Search className="h-5 w-5" />
                  <span>ورود به بخش جستجوی خودرو</span>
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2.5 rounded-2xl border border-white/[0.15] bg-[#0D1117]/90 px-7 py-4 text-sm sm:text-base font-bold text-[#F5F5F5] backdrop-blur-md transition-all hover:border-[#FF6A00]"
                >
                  <PhoneCall className="h-5 w-5 text-[#FF6A00]" />
                  <span>تماس با کارشناسان خودرو یاب</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
