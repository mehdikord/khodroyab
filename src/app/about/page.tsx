"use client";

import React from "react";
import Link from "next/link";
import { StaggeredText } from "@/components/react-bits/StaggeredText";
import {
  TRUST_PILLARS,
  FREE_ZONES_LIST,
  QUALITY_CHECKPOINTS,
} from "@/data/khodroyab-data";
import {
  Building2,
  ShieldCheck,
  Scale,
  Headset,
  FileCheck2,
  Gauge,
  Layers,
  Sparkles,
  Compass,
  CheckCircle2,
  ArrowUpLeft,
  PhoneCall,
  Eye,
  Target,
  Award,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Scale,
  ShieldCheck,
  Headset,
  FileCheck2,
  Gauge,
  Layers,
};

export default function AboutPage() {
  return (
    <div className="bg-[#07090C] text-[#F5F5F5] pt-28 pb-20">
      {/* Page Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.07] pb-16 sm:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,106,0,0.14),transparent_60%)]"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/35 bg-[#FF6A00]/10 px-4 py-1.5 text-xs font-semibold text-[#FF8A2A]">
                <Building2 className="h-3.5 w-3.5" />
                <span>درباره خودرو یاب — KHODROYAB</span>
              </div>

              <StaggeredText
                as="h1"
                text="تخصص، شفافیت و اصالت در واردات و فروش خودروهای مناطق آزاد"
                segmentBy="words"
                delay={70}
                duration={0.7}
                highlightWords={["تخصص،", "شفافیت", "مناطق", "آزاد"]}
                className="text-3xl sm:text-5xl font-black tracking-tight text-[#F5F5F5] leading-[1.25]"
              />

              <p className="text-base sm:text-lg leading-8 sm:leading-9 text-[#9BA3AE]">
                شرکت <strong className="text-[#F5F5F5]">خودرو یاب (KHODROYAB)</strong> به
                عنوان مجموعه تخصصی فعال در حوزه فروش و واردات خودروهای خارجی در مناطق
                آزاد تجاری، با هدف جایگزینی فرآیندهای سنتی و غیرشفاف با یک ساختار
                حرفه‌ای، مستند و مشتری‌محور فعالیت می‌نماید.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-6 py-3.5 text-sm font-bold text-[#07090C] shadow-orange-glow hover:brightness-110"
                >
                  <span>مشاهده خدمات تخصصی</span>
                  <ArrowUpLeft className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-[#0D1117] px-6 py-3.5 text-sm font-semibold text-[#F5F5F5] hover:border-[#FF6A00]/50"
                >
                  <PhoneCall className="h-4 w-4 text-[#FF6A00]" />
                  <span>ارتباط با مدیریت و مشاوران</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.12] bg-[#0D1117] shadow-card-depth">
                <img
                  src="/images/showroom-freezone.jpg"
                  alt="درباره شرکت خودرو یاب در مناطق آزاد"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-6 bg-[#0D1117] border-t border-white/[0.08] space-y-2">
                  <div className="font-mono text-xs text-[#FF8A2A] tracking-widest">
                    CORPORATE IDENTITY // KHODROYAB
                  </div>
                  <p className="text-xs leading-6 text-[#9BA3AE]">
                    ترکیب دانش بازرگانی بین‌الملل، تسلط بر مقررات گمرکی مناطق آزاد و
                    استانداردهای دقیق کارشناسی فنی خودرو.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story, Mission, Vision & Editable History */}
      <section className="py-16 sm:py-24 border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/[0.08] bg-[#0D1117] p-7 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6A00]/15 text-[#FF6A00]">
                <Target className="h-6 w-6" />
              </div>
              <div className="font-mono text-xs text-[#FF8A2A]">01 // MISSION</div>
              <h2 className="text-xl font-extrabold text-[#F5F5F5]">رسالت و ماموریت ما</h2>
              <p className="text-xs sm:text-sm leading-7 text-[#9BA3AE]">
                ایجاد بستری امن، شفاف و استاندارد برای متقاضیان خرید و واردات خودروهای
                خارجی در مناطق آزاد تجاری کشور؛ به‌گونه‌ای که خریدار با آگاهی کامل از ریز
                هزینه‌ها، وضعیت فنی و اصالت مدارک، بهترین تصمیم را اتخاذ نماید.
              </p>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-[#0D1117] p-7 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6A00]/15 text-[#FF6A00]">
                <Eye className="h-6 w-6" />
              </div>
              <div className="font-mono text-xs text-[#FF8A2A]">02 // VISION</div>
              <h2 className="text-xl font-extrabold text-[#F5F5F5]">چشم‌انداز حرفه‌ای</h2>
              <p className="text-xs sm:text-sm leading-7 text-[#9BA3AE]">
                تبدیل شدن به مرجع اول و معتبرترین نام در زیست‌بوم واردات، کارشناسی و عرضه
                خودروهای استاندارد جهانی در کلیه مناطق آزاد کشور با تکیه بر فناوری‌های
                نوین اطلاع‌رسانی و تکریم واقعی مشتری.
              </p>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-[#0D1117] p-7 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6A00]/15 text-[#FF6A00]">
                <Award className="h-6 w-6" />
              </div>
              <div className="font-mono text-xs text-[#FF8A2A]">03 // CORE VALUES</div>
              <h2 className="text-xl font-extrabold text-[#F5F5F5]">ارزش‌های بنیادین</h2>
              <p className="text-xs sm:text-sm leading-7 text-[#9BA3AE]">
                صداقت در ارائه اطلاعات کارشناسی، شفافیت در ساختار قیمت، پایبندی به تعهدات
                مندرج در قرارداد، رعایت دقیق ضوابط قانونی مناطق آزاد و پاسخگویی مستمر ۲۴
                ساعته.
              </p>
            </div>
          </div>

          {/* Evolutionary Story / Editable History Timeline */}
          <div className="rounded-3xl border border-white/[0.09] bg-[#0D1117]/90 p-6 sm:p-10 lg:p-12 space-y-8">
            <div className="flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-6 md:flex-row md:items-center">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#FF8A2A]">
                  EVOLUTION & EXPERIENCE // EDITABLE NARRATIVE
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#F5F5F5] mt-1">
                  مسیر شکل‌گیری و توسعه خدمات خودرو یاب
                </h2>
              </div>
              <span className="rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-3.5 py-1.5 text-xs text-[#FF8A2A]">
                محتوای تاریخچه قابل ویرایش و بومی‌سازی
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {[
                {
                  stage: "مرحله اول",
                  title: "شکل‌گیری هسته تخصصی مشاوره و کارشناسی",
                  desc: "آغاز فعالیت با تمرکز بر شناخت دقیق بازار خودروهای وارداتی مناطق آزاد، بررسی فنی تریم‌ها و ارائه مشاوره‌های تخصصی خرید.",
                },
                {
                  stage: "مرحله دوم",
                  title: "توسعه شبکه تأمین و لجستیک بین‌المللی",
                  desc: "ایجاد ارتباط مستقیم با مبادی معتبر صادراتی جهت حذف واسطه‌های غیرضروری و تأمین خودرو با مشخصات و آپشن‌های فابریک.",
                },
                {
                  stage: "مرحله سوم",
                  title: "استقرار پروتکل‌های کارشناسی و قرارداد امن",
                  desc: "تدوین چارچوب‌های استاندارد بازرسی فنی و ظاهری چندمرحله‌ای و ساختار قراردادهای شفاف با تعهد قیمت در شرایط اعلام‌شده.",
                },
                {
                  stage: "مرحله چهارم",
                  title: "هوشمندسازی خدمات و پلتفرم دیجیتال خودرو یاب",
                  desc: "طراحی تجربه دیجیتال مدرن برای استعلام، مشاوره ۲۴ ساعته و توسعه سامانه جستجوی هوشمند خودروهای وارداتی.",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="relative rounded-2xl border border-white/[0.07] bg-[#171B21]/65 p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-[#FF6A00]/15 px-2.5 py-1 font-mono text-xs font-bold text-[#FF8A2A]">
                      {step.stage}
                    </span>
                    <span className="font-mono text-xs text-[#5E6672]">0{i + 1}</span>
                  </div>
                  <h3 className="text-base font-bold text-[#F5F5F5] leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs leading-6 text-[#9BA3AE]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Pillars of Trust */}
      <section className="py-16 sm:py-24 border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3 mb-12">
            <span className="font-mono text-xs text-[#FF8A2A] uppercase tracking-widest">
              SIX PILLARS OF EXCELLENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5F5F5]">
              تعهدات شش‌گانه خودرو یاب به خریداران
            </h2>
            <p className="text-sm sm:text-base leading-8 text-[#9BA3AE]">
              اصول حرفه‌ای که تمامی فرآیندهای فروش، واردات و پشتیبانی ما بر پایه آن‌ها
              استوار است:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TRUST_PILLARS.map((pillar) => {
              const IconComp = ICON_MAP[pillar.iconName] || ShieldCheck;
              return (
                <div
                  key={pillar.id}
                  className="rounded-3xl border border-white/[0.08] bg-[#0D1117] p-6 sm:p-7 space-y-4 hover:border-[#FF6A00]/45 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF6A00]/15 text-[#FF6A00]">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs text-[#5E6672]">{pillar.code}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-[#F5F5F5]">{pillar.title}</h3>
                  <p className="text-xs leading-6 text-[#9BA3AE]">{pillar.description}</p>
                  <ul className="space-y-1.5 border-t border-white/[0.07] pt-3">
                    {pillar.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-[#F5F5F5]/85">
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

      {/* Free Zones Coverage */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#FF6A00]/30 bg-gradient-to-l from-[#0D1117] via-[#171B21] to-[#0D1117] p-8 sm:p-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF8A2A]">
                  <Compass className="h-4 w-4" />
                  <span>پوشش جغرافیایی در مناطق آزاد</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#F5F5F5]">
                  ارائه خدمات تخصصی واردات و فروش در مناطق آزاد تجاری کشور
                </h2>
                <p className="text-sm leading-7 text-[#9BA3AE]">
                  تیم اجرایی خودرو یاب با شناخت مقررات، سهمیه‌ها و رویه‌های گمرکی هر منطقه
                  آزاد، امکان مشاوره، تأمین و تحویل خودرو را در مناطق آزاد اصلی کشور فراهم
                  کرده است.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {FREE_ZONES_LIST.map((zone) => (
                    <div
                      key={zone.en}
                      className="rounded-xl border border-white/[0.08] bg-[#07090C]/80 p-3"
                    >
                      <div className="text-xs font-bold text-[#F5F5F5]">{zone.name}</div>
                      <div className="font-mono text-[10px] text-[#FF8A2A] mt-0.5">
                        {zone.en}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-center items-start lg:items-end">
                <div className="w-full rounded-2xl border border-white/[0.1] bg-[#07090C] p-6 space-y-4">
                  <h3 className="text-lg font-extrabold text-[#F5F5F5]">
                    نیاز به راهنمایی درباره قوانین منطقه آزاد خود دارید؟
                  </h3>
                  <p className="text-xs leading-6 text-[#9BA3AE]">
                    کارشناسان ما آماده توضیح کامل شرایط پلاک‌گذاری، محدوده تردد و نحوه
                    سفارش خودرو در منطقه آزاد مورد نظر شما هستند.
                  </p>
                  <Link
                    href="/contact#consultation"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6A00] px-5 py-3.5 text-xs sm:text-sm font-bold text-[#07090C] hover:bg-[#FF8A2A]"
                  >
                    <PhoneCall className="h-4 w-4" />
                    <span>دریافت مشاوره رایگان مناطق آزاد</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
