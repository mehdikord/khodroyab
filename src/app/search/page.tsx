"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StaggeredText } from "@/components/react-bits/StaggeredText";
import {
  INTERNATIONAL_BRANDS,
  MOCK_SHOWCASE_VEHICLES,
  FREE_ZONES_LIST,
} from "@/data/khodroyab-data";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  RotateCcw,
  PhoneCall,
  BellRing,
  CheckCircle2,
  CarFront,
  Fuel,
  Cog,
  Calendar,
  MapPin,
  Wallet,
  Layers,
  Info,
  ArrowUpLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BODY_TYPES = [
  "همه کلاس‌های بدنه",
  "شاسی‌بلند لوکس (SUV)",
  "سدان تشریفاتی (Sedan)",
  "کراس‌اوور شهری (Crossover)",
  "کوپه اسپرت (Coupe / GT)",
  "پیکاپ دوکابین (Pickup)",
];

const PRICE_RANGES = [
  "همه محدوده‌های بودجه",
  "اقتصادی و شهری مناطق آزاد",
  "میان‌رده پریمیوم",
  "لوکس و تشریفاتی مدیران",
  "فوق‌لوکس و سفارش ویژه (Bespoke)",
];

const PRODUCTION_YEARS = [
  "همه سال‌های مجاز واردات",
  "۲۰۲۶ / صفرکیلومتر روز",
  "۲۰۲۵ / صفرکیلومتر",
  "۲۰۲۴ / صفر و کم‌کارکرد",
  "۲۰۲۳ / کارشناسی‌شده استاندارد",
];

const FUEL_TYPES = [
  "همه پیشرانه‌ها",
  "بنزینی تنفس طبیعی / توربو",
  "هیبریدی (HEV)",
  "پلاگین هیبرید (PHEV)",
  "تمام برقی (BEV)",
];

const TRANSMISSIONS = [
  "همه گیربکس‌ها",
  "اتوماتیک تیپ‌ترونیک (AT)",
  "اتوماتیک دوکلاچه (DCT / PDK)",
  "اتوماتیک ضریب پیوسته (E-CVT)",
  "گیربکس مستقیم برقی (Single-Speed EV)",
];

export default function VehicleSearchPage() {
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedBody, setSelectedBody] = useState(BODY_TYPES[0]);
  const [selectedPrice, setSelectedPrice] = useState(PRICE_RANGES[0]);
  const [selectedYear, setSelectedYear] = useState(PRODUCTION_YEARS[0]);
  const [selectedFuel, setSelectedFuel] = useState(FUEL_TYPES[0]);
  const [selectedTransmission, setSelectedTransmission] = useState(
    TRANSMISSIONS[0]
  );
  const [selectedZone, setSelectedZone] = useState("همه مناطق آزاد");
  const [keyword, setKeyword] = useState("");

  const [searchTriggered, setSearchTriggered] = useState(false);
  const [notifyPhone, setNotifyPhone] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  const activeBrandObj = INTERNATIONAL_BRANDS.find(
    (b) => b.id === selectedBrand
  );
  const availableModels = activeBrandObj ? activeBrandObj.popularModels : [];

  const handleResetFilters = () => {
    setSelectedBrand("all");
    setSelectedModel("");
    setSelectedBody(BODY_TYPES[0]);
    setSelectedPrice(PRICE_RANGES[0]);
    setSelectedYear(PRODUCTION_YEARS[0]);
    setSelectedFuel(FUEL_TYPES[0]);
    setSelectedTransmission(TRANSMISSIONS[0]);
    setSelectedZone("همه مناطق آزاد");
    setKeyword("");
    setSearchTriggered(false);
  };

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTriggered(true);
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notifyPhone.trim().length >= 10) {
      setNotifySubmitted(true);
    }
  };

  return (
    <div className="bg-[#07090C] text-[#F5F5F5] pt-28 pb-24">
      {/* Page Header */}
      <section className="relative overflow-hidden border-b border-white/[0.07] pb-12 sm:pb-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,106,0,0.14),transparent_65%)]"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#FF6A00]/45 bg-[#FF6A00]/15 px-4 py-1.5 text-xs font-bold text-[#FF8A2A]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>سامانه هوشمند جستجوی خودرو — به‌زودی (COMING SOON)</span>
              </div>

              <StaggeredText
                as="h1"
                text="جستجوی تخصصی خودروهای وارداتی مناطق آزاد"
                segmentBy="words"
                delay={70}
                duration={0.7}
                highlightWords={["جستجوی", "خودروهای", "وارداتی"]}
                className="text-3xl sm:text-5xl font-black tracking-tight text-[#F5F5F5] leading-[1.25]"
              />

              <p className="text-sm sm:text-base leading-8 text-[#9BA3AE]">
                رابط کاربری زیر، معماری کامل سامانه جستجو و فیلتر پیشرفته موجودی خودروهای
                وارداتی خودرو یاب را نمایش می‌دهد. این بخش هم‌اکنون در وضعیت{" "}
                <strong className="text-[#FF8A2A]">«به‌زودی» (پیش‌نمایش تعاملی)</strong> قرار
                دارد؛ تا زمان بارگذاری کامل موجودی آنلاین، می‌توانید مشخصات خودروی مدنظر
                خود را از طریق بخش مشاوره رایگان استعلام فرمایید.
              </p>
            </div>

            {/* Status Telemetry Pill */}
            <div className="rounded-2xl border border-[#FF6A00]/35 bg-[#0D1117] p-4 sm:p-5 shrink-0 space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF6A00] animate-ping" />
                <span className="text-xs font-extrabold text-[#F5F5F5]">
                  وضعیت سامانه: به‌زودی (نسخه پیش‌نمایش)
                </span>
              </div>
              <p className="text-[11px] text-[#9BA3AE]">
                استعلام تلفنی و مشاوره خرید هم‌اکنون به‌صورت ۲۴/۷ فعال است.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Search & Filter Cockpit Interface */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Interactive Multi-Field Filter Console */}
          <form
            onSubmit={handleSearchClick}
            className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0D1117] p-6 sm:p-8 lg:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.85)] space-y-7"
          >
            {/* Top Orange Specular Line */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-[#FF6A00] via-[#FF8A2A] to-transparent" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF6A00]/15 text-[#FF6A00] border border-[#FF6A00]/30">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#F5F5F5]">
                    کنسول فیلتر و پیکربندی خودرو
                  </h2>
                  <p className="text-xs text-[#9BA3AE]">
                    فیلترها را بر اساس برند، مدل، کلاس بدنه، قیمت، سال ساخت، سوخت و گیربکس
                    تنظیم نمایید
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-lg border border-[#FF6A00]/35 bg-[#FF6A00]/10 px-3 py-1.5 text-xs font-bold text-[#FF8A2A]">
                  به‌زودی — نمایش پیش‌فرض
                </span>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-[#171B21] px-3.5 py-2 text-xs font-semibold text-[#9BA3AE] hover:text-[#F5F5F5] hover:border-white/25"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>پاک‌سازی فیلترها</span>
                </button>
              </div>
            </div>

            {/* 8 Filter Fields Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* 1. Brand */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#F5F5F5]">
                  <CarFront className="h-3.5 w-3.5 text-[#FF6A00]" />
                  <span>برند خودروساز</span>
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value);
                    setSelectedModel("");
                  }}
                  className="w-full rounded-xl border border-white/[0.1] bg-[#171B21] px-3.5 py-3 text-xs sm:text-sm text-[#F5F5F5] focus:border-[#FF6A00] focus:outline-none"
                >
                  <option value="all">همه برندهای بین‌المللی</option>
                  {INTERNATIONAL_BRANDS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.faName} ({b.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Model */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#F5F5F5]">
                  <Layers className="h-3.5 w-3.5 text-[#FF6A00]" />
                  <span>مدل خودرو</span>
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-[#171B21] px-3.5 py-3 text-xs sm:text-sm text-[#F5F5F5] focus:border-[#FF6A00] focus:outline-none"
                >
                  <option value="">
                    {selectedBrand === "all"
                      ? "همه مدل‌ها (ابتدا برند را انتخاب کنید)"
                      : `همه مدل‌های ${activeBrandObj?.faName}`}
                  </option>
                  {availableModels.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Body Type */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#F5F5F5]">
                  <CarFront className="h-3.5 w-3.5 text-[#FF6A00]" />
                  <span>کلاس بدنه</span>
                </label>
                <select
                  value={selectedBody}
                  onChange={(e) => setSelectedBody(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-[#171B21] px-3.5 py-3 text-xs sm:text-sm text-[#F5F5F5] focus:border-[#FF6A00] focus:outline-none"
                >
                  {BODY_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Price / Budget Tier */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#F5F5F5]">
                  <Wallet className="h-3.5 w-3.5 text-[#FF6A00]" />
                  <span>محدوده قیمت و بودجه</span>
                </label>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-[#171B21] px-3.5 py-3 text-xs sm:text-sm text-[#F5F5F5] focus:border-[#FF6A00] focus:outline-none"
                >
                  {PRICE_RANGES.map((pr) => (
                    <option key={pr} value={pr}>
                      {pr}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Production Year */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#F5F5F5]">
                  <Calendar className="h-3.5 w-3.5 text-[#FF6A00]" />
                  <span>سال ساخت</span>
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-[#171B21] px-3.5 py-3 text-xs sm:text-sm text-[#F5F5F5] focus:border-[#FF6A00] focus:outline-none"
                >
                  {PRODUCTION_YEARS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. Fuel Type */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#F5F5F5]">
                  <Fuel className="h-3.5 w-3.5 text-[#FF6A00]" />
                  <span>نوع سوخت و پیشرانه</span>
                </label>
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-[#171B21] px-3.5 py-3 text-xs sm:text-sm text-[#F5F5F5] focus:border-[#FF6A00] focus:outline-none"
                >
                  {FUEL_TYPES.map((fl) => (
                    <option key={fl} value={fl}>
                      {fl}
                    </option>
                  ))}
                </select>
              </div>

              {/* 7. Transmission */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#F5F5F5]">
                  <Cog className="h-3.5 w-3.5 text-[#FF6A00]" />
                  <span>نوع گیربکس</span>
                </label>
                <select
                  value={selectedTransmission}
                  onChange={(e) => setSelectedTransmission(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-[#171B21] px-3.5 py-3 text-xs sm:text-sm text-[#F5F5F5] focus:border-[#FF6A00] focus:outline-none"
                >
                  {TRANSMISSIONS.map((tr) => (
                    <option key={tr} value={tr}>
                      {tr}
                    </option>
                  ))}
                </select>
              </div>

              {/* 8. Free Zone Location */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#F5F5F5]">
                  <MapPin className="h-3.5 w-3.5 text-[#FF6A00]" />
                  <span>منطقه آزاد مقصد</span>
                </label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-[#171B21] px-3.5 py-3 text-xs sm:text-sm text-[#F5F5F5] focus:border-[#FF6A00] focus:outline-none"
                >
                  <option value="همه مناطق آزاد">همه مناطق آزاد تجاری</option>
                  {FREE_ZONES_LIST.map((z) => (
                    <option key={z.en} value={z.name}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Keyword Input + Search Trigger Bar */}
            <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9BA3AE]" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="جستجوی آزاد بر اساس کد اتاق، آپشن خاص (مانند رادار، سقف پانوراما، کیت AMG / M)..."
                  className="w-full rounded-xl border border-white/[0.1] bg-[#171B21] pr-11 pl-4 py-3.5 text-xs sm:text-sm text-[#F5F5F5] placeholder-[#5E6672] focus:border-[#FF6A00] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-8 py-3.5 text-sm font-extrabold text-[#07090C] shadow-orange-glow transition-all hover:brightness-110 shrink-0"
              >
                <Search className="h-4 w-4" />
                <span>جستجوی خودرو (پیش‌نمایش)</span>
              </button>
            </div>
          </form>

          {/* Polished "به‌زودی (COMING SOON)" Interactive State Banner */}
          <div
            className={cn(
              "relative overflow-hidden rounded-3xl border p-6 sm:p-10 transition-all duration-500",
              searchTriggered
                ? "border-[#FF6A00] bg-gradient-to-l from-[#171B21] via-[#0D1117] to-[#171B21] shadow-[0_0_50px_rgba(255,106,0,0.3)]"
                : "border-[#FF6A00]/35 bg-[#0D1117]/95"
            )}
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#FF6A00] px-3.5 py-1 text-xs font-black text-[#07090C]">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>به‌زودی — COMING SOON</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-[#F5F5F5]">
                  {searchTriggered
                    ? "فیلترهای انتخابی شما ثبت شد — بانک اطلاعاتی آنلاین به‌زودی فعال می‌گردد"
                    : "بانک جامع جستجوی آنلاین خودروهای وارداتی به‌زودی راه‌اندازی می‌شود"}
                </h3>

                <p className="text-xs sm:text-sm leading-7 text-[#9BA3AE]">
                  موتور جستجوی لحظه‌ای موجودی شوروم‌ها و خودروهای در حال حمل خودرو یاب در
                  مرحله یکپارچه‌سازی نهایی با سامانه کارشناسی قرار دارد. هم‌اکنون می‌توانید
                  مشخصات انتخابی خود را به واحد مشاوره ارسال کنید تا لیست موجودی روز
                  به‌صورت مستقیم برای شما ارسال شود.
                </p>

                {/* Show user's active filter pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-[#9BA3AE]">فیلترهای فعلی شما:</span>
                  <span className="rounded-lg border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-2.5 py-1 text-xs text-[#FF8A2A]">
                    برند: {activeBrandObj ? activeBrandObj.faName : "همه برندها"}
                  </span>
                  {selectedModel && (
                    <span className="rounded-lg border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-2.5 py-1 text-xs text-[#FF8A2A]">
                      مدل: {selectedModel}
                    </span>
                  )}
                  <span className="rounded-lg border border-white/[0.1] bg-[#171B21] px-2.5 py-1 text-xs text-[#F5F5F5]">
                    {selectedBody}
                  </span>
                  <span className="rounded-lg border border-white/[0.1] bg-[#171B21] px-2.5 py-1 text-xs text-[#F5F5F5]">
                    {selectedFuel}
                  </span>
                  <span className="rounded-lg border border-white/[0.1] bg-[#171B21] px-2.5 py-1 text-xs text-[#F5F5F5]">
                    {selectedZone}
                  </span>
                </div>
              </div>

              {/* Instant Notification & Direct Advisory Box */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-white/[0.1] bg-[#07090C]/90 p-5 sm:p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#F5F5F5]">
                    <BellRing className="h-4 w-4 text-[#FF6A00]" />
                    <span>اطلاع‌رسانی فعال‌سازی یا دریافت موجودی روز</span>
                  </div>

                  {notifySubmitted ? (
                    <div className="rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 p-4 text-xs leading-6 text-[#F5F5F5] flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-[#FF6A00] shrink-0 mt-0.5" />
                      <div>
                        شماره همراه شما با موفقیت ثبت شد. به محض فعال‌سازی جستجوی آنلاین و
                        همچنین جهت ارسال لیست موجودی فعلی با شما تماس گرفته می‌شود.
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleNotifySubmit} className="space-y-3">
                      <p className="text-xs text-[#9BA3AE] leading-6">
                        شماره موبایل خود را وارد کنید تا لیست خودروهای موجود مطابق با فیلتر
                        بالا توسط کارشناسان برای شما ارسال گردد:
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          dir="ltr"
                          required
                          value={notifyPhone}
                          onChange={(e) => setNotifyPhone(e.target.value)}
                          placeholder="0912 000 0000"
                          className="flex-1 rounded-xl border border-white/[0.12] bg-[#171B21] px-3.5 py-2.5 text-xs font-mono text-right text-[#F5F5F5] focus:border-[#FF6A00] focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="rounded-xl bg-[#FF6A00] px-4 py-2.5 text-xs font-bold text-[#07090C] hover:bg-[#FF8A2A] shrink-0"
                        >
                          ثبت شماره
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                    <span className="text-[11px] text-[#9BA3AE]">
                      نیاز به مشاوره فوری دارید؟
                    </span>
                    <Link
                      href="/contact#consultation"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#FF8A2A] hover:text-[#FF6A00]"
                    >
                      <span>فرم مشاوره رایگان</span>
                      <ArrowUpLeft className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview of Future Catalog Cards (پیش‌نمایش ساختار کارت‌های خودرو) */}
          <div className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span className="font-mono text-xs text-[#FF8A2A] uppercase tracking-widest">
                  FUTURE INVENTORY UI PREVIEW
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#F5F5F5] mt-1">
                  پیش‌نمایش سگمنت‌های خودرویی در سامانه جستجو (به‌زودی)
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs text-[#9BA3AE]">
                <Info className="h-4 w-4 text-[#FF6A00]" />
                <span>کارت‌های زیر نمونه طراحی رابط کاربری کاتالوگ آینده هستند</span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {MOCK_SHOWCASE_VEHICLES.map((v) => (
                <div
                  key={v.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/[0.09] bg-[#0D1117] transition-all duration-300 hover:border-[#FF6A00]/45"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={v.image}
                      alt={v.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D1117] via-[#0D1117]/25 to-transparent" />
                    <span className="absolute right-4 top-4 rounded-full border border-[#FF6A00]/50 bg-[#07090C]/90 px-3.5 py-1 text-xs font-bold text-[#FF8A2A] backdrop-blur-md">
                      {v.statusTag}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <span className="font-mono text-[10px] tracking-widest text-[#FF8A2A]">
                        {v.enTitle}
                      </span>
                      <h4 className="text-xl font-extrabold text-[#F5F5F5] mt-0.5">
                        {v.title}
                      </h4>
                      <p className="text-xs text-[#9BA3AE] mt-1">{v.brand}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="rounded-xl border border-white/[0.06] bg-[#171B21]/70 p-2.5">
                        <span className="block text-[10px] text-[#9BA3AE]">کلاس بدنه</span>
                        <span className="font-bold text-[#F5F5F5]">{v.bodyType}</span>
                      </div>
                      <div className="rounded-xl border border-white/[0.06] bg-[#171B21]/70 p-2.5">
                        <span className="block text-[10px] text-[#9BA3AE]">پیشرانه</span>
                        <span className="font-bold text-[#F5F5F5]">{v.fuel}</span>
                      </div>
                      <div className="rounded-xl border border-white/[0.06] bg-[#171B21]/70 p-2.5">
                        <span className="block text-[10px] text-[#9BA3AE]">گیربکس</span>
                        <span className="font-bold text-[#F5F5F5]">{v.transmission}</span>
                      </div>
                      <div className="rounded-xl border border-white/[0.06] bg-[#171B21]/70 p-2.5">
                        <span className="block text-[10px] text-[#9BA3AE]">سهمیه</span>
                        <span className="font-bold text-[#FF8A2A]">{v.freeZone}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {v.specs.map((sp, i) => (
                        <span
                          key={i}
                          className="rounded-lg border border-white/[0.07] bg-[#07090C] px-2.5 py-1 text-[11px] text-[#9BA3AE]"
                        >
                          ✓ {sp}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                      <span className="text-xs text-[#9BA3AE]">
                        قیمت و موجودی: قابل استعلام از واحد فروش
                      </span>
                      <Link
                        href="/contact#consultation"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF6A00]/15 border border-[#FF6A00]/40 px-4 py-2 text-xs font-bold text-[#FF8A2A] hover:bg-[#FF6A00] hover:text-[#07090C] transition-colors"
                      >
                        <PhoneCall className="h-3.5 w-3.5" />
                        <span>استعلام تامین مشابه</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
