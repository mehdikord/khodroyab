"use client";

import React from "react";
import Link from "next/link";
import { StaggeredText } from "@/components/react-bits/StaggeredText";
import { ShaderCard } from "@/components/react-bits/ShaderCard";
import { ConsultationFormSection } from "@/components/sections/ConsultationFormSection";
import { SERVICES_DATA, QUALITY_CHECKPOINTS } from "@/data/khodroyab-data";
import {
  Layers,
  CheckCircle2,
  ArrowUpLeft,
  PhoneCall,
  Search,
  Gauge,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function ServicesPage() {
  return (
    <div className="bg-[#07090C] text-[#F5F5F5] pt-28">
      {/* Services Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.07] pb-16 sm:pb-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,106,0,0.14),transparent_60%)]"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/35 bg-[#FF6A00]/10 px-4 py-1.5 text-xs font-semibold text-[#FF8A2A]">
              <Layers className="h-3.5 w-3.5" />
              <span>خدمات تخصصی خودرو یاب — SERVICES</span>
            </div>

            <StaggeredText
              as="h1"
              text="خدمات یکپارچه فروش، تأمین، کارشناسی و واردات خودرو در مناطق آزاد"
              segmentBy="words"
              delay={70}
              duration={0.72}
              highlightWords={["فروش،", "تأمین،", "کارشناسی", "واردات"]}
              className="text-3xl sm:text-5xl font-black tracking-tight text-[#F5F5F5] leading-[1.25]"
            />

            <p className="text-base sm:text-lg leading-8 sm:leading-9 text-[#9BA3AE]">
              در خودرو یاب، ما صرفاً فروشنده خودرو نیستیم؛ بلکه از مرحله مشاوره و انتخاب
              فنی تا تأمین بین‌المللی، ترخیص گمرکی در مناطق آزاد، ارزیابی سلامت بدنه و
              موتور و خدمات پس از تحویل، تمامی زنجیره ارزش را با استاندارد پریمیوم پوشش
              می‌دهیم.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="#consultation"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-6 py-3.5 text-sm font-bold text-[#07090C] shadow-orange-glow hover:brightness-110"
              >
                <PhoneCall className="h-4 w-4" />
                <span>ثبت درخواست خدمات و مشاوره</span>
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-[#0D1117] px-6 py-3.5 text-sm font-semibold text-[#F5F5F5] hover:border-[#FF6A00]/50"
              >
                <Search className="h-4 w-4 text-[#FF6A00]" />
                <span>جستجوی خودرو</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Shader Card Services Grid */}
      <section className="py-16 sm:py-24 border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="font-mono text-xs text-[#FF8A2A] uppercase tracking-widest">
                REACT BITS PRO // SHADER CARD ARCHITECTURE
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#F5F5F5] mt-1">
                شش محور خدمات تخصصی خودرو یاب
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#9BA3AE] max-w-md">
              هر خدمت در قالب فرآیندی مدون، مستند و مبتنی بر قرارداد رسمی به متقاضیان
              ارائه می‌گردد.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {SERVICES_DATA.map((service) => (
              <div key={service.id} id={service.id} className="scroll-mt-28">
                <ShaderCard
                  width="100%"
                  height="100%"
                  borderRadius="28px"
                  color="#FF6A00"
                  highlightColor="#FF8A2A"
                  backgroundColor="#0D1117"
                  speed={0.36}
                  scale={3.8}
                  effectRadius={0.9}
                  effectBoost={0.44}
                  waveAmount={0.12}
                  contours={1.0}
                  intensity={0.85}
                  bloom={0.75}
                  fade={0.62}
                  opacity={0.9}
                  interactive={true}
                  tiltStrength={4.0}
                  hoverRise={1.0}
                >
                  <div className="flex h-full flex-col justify-between p-6 sm:p-9">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-[#FF6A00]/40 bg-[#FF6A00]/15 px-3.5 py-1 text-xs font-bold text-[#FF8A2A]">
                          {service.badge}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#9BA3AE]">
                          {service.code} // {service.enTitle}
                        </span>
                      </div>

                      <div className="relative h-52 w-full overflow-hidden rounded-2xl border border-white/[0.1]">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-transparent" />
                      </div>

                      <h3 className="text-2xl font-black text-[#F5F5F5]">
                        {service.title}
                      </h3>

                      <p className="text-sm leading-7 text-[#9BA3AE]">
                        {service.fullDesc}
                      </p>

                      <div className="space-y-2.5 pt-2">
                        <div className="text-xs font-bold text-[#F5F5F5]">
                          ویژگی‌ها و تعهدات اجرایی این خدمت:
                        </div>
                        <ul className="grid grid-cols-1 gap-2">
                          {service.features.map((feat, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2.5 rounded-xl border border-white/[0.06] bg-[#171B21]/60 p-3 text-xs text-[#F5F5F5]/90"
                            >
                              <CheckCircle2 className="h-4 w-4 text-[#FF6A00] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-7 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <span className="block text-[10px] text-[#9BA3AE]">
                          خروجی و مستندات تحویلی:
                        </span>
                        <span className="text-xs font-bold text-[#FF8A2A]">
                          {service.deliverable}
                        </span>
                      </div>

                      <Link
                        href="#consultation"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6A00] px-5 py-3 text-xs font-bold text-[#07090C] transition-all hover:bg-[#FF8A2A] shrink-0"
                      >
                        <span>درخواست این خدمت</span>
                        <ArrowUpLeft className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </ShaderCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Inspection Protocol Matrix */}
      <section className="py-16 sm:py-24 border-b border-white/[0.06] bg-[#0D1117]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF8A2A]">
              <Gauge className="h-4 w-4" />
              <span>استاندارد ارزیابی فنی و ظاهری</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5F5F5]">
              پروتکل ۵ مرحله‌ای تضمین کیفیت در خودرو یاب
            </h2>
            <p className="text-sm sm:text-base leading-8 text-[#9BA3AE]">
              تمامی خودروهای عرضه‌شده یا وارداتی، پیش از تحویل به مشتری از فیلترهای
              سخت‌گیرانه زیر عبور می‌کنند:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
            {QUALITY_CHECKPOINTS.map((q, idx) => (
              <div
                key={q.id}
                className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0D1117] p-5 hover:border-[#FF6A00]/45 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-[#FF6A00]/15 px-2.5 py-1 font-mono text-xs font-bold text-[#FF8A2A]">
                      0{idx + 1}
                    </span>
                    <span className="font-mono text-[10px] text-[#5E6672]">{q.code}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#F5F5F5]">{q.title}</h3>
                  <p className="text-xs leading-6 text-[#9BA3AE]">{q.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/[0.07] text-[11px] font-semibold text-[#FF8A2A]">
                  {q.metricValue}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Form Section */}
      <ConsultationFormSection />
    </div>
  );
}
