"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CenterFlow, CenterFlowNodeItem } from "@/components/react-bits/CenterFlow";
import { INTERNATIONAL_BRANDS } from "@/data/khodroyab-data";
import {
  Sparkles,
  CheckCircle2,
  ArrowUpLeft,
  Compass,
  CarFront,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const VehicleVarietyCenterFlow: React.FC = () => {
  const [selectedBrandId, setSelectedBrandId] = useState<string>(
    INTERNATIONAL_BRANDS[0].id
  );

  const selectedBrand =
    INTERNATIONAL_BRANDS.find((b) => b.id === selectedBrandId) ||
    INTERNATIONAL_BRANDS[0];

  const nodeItems: CenterFlowNodeItem[] = INTERNATIONAL_BRANDS.map((brand) => ({
    id: brand.id,
    label: `${brand.faName} (${brand.name})`,
    content: (
      <div className="flex flex-col items-center justify-center p-1.5 text-center">
        <span className="font-mono text-[10px] sm:text-xs font-extrabold tracking-wider text-[#FF8A2A] group-hover:text-[#FF6A00]">
          {brand.monogram}
        </span>
        <span className="mt-0.5 text-[10px] sm:text-xs font-bold text-[#F5F5F5] line-clamp-1">
          {brand.faName}
        </span>
        <span className="hidden sm:inline-block font-mono text-[8px] tracking-widest text-[#9BA3AE] uppercase">
          {brand.name.split("-")[0]}
        </span>
      </div>
    ),
  }));

  return (
    <section
      id="vehicle-variety"
      className="relative overflow-hidden py-20 sm:py-28 border-t border-white/[0.06] bg-[#07090C]"
    >
      {/* Subtle Top & Bottom Radial Spotlights */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,106,0,0.12),transparent_65%)]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/35 bg-[#FF6A00]/10 px-4 py-1.5 text-xs font-semibold text-[#FF8A2A]">
            <Layers className="h-3.5 w-3.5" />
            <span>تنوع خودرو + انتخاب گسترده + برندهای معتبر</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#F5F5F5] leading-[1.25]">
            شبکه تأمین برندهای{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#FF6A00] via-[#FF8A2A] to-[#F5F5F5]">
              تراز اول جهانی
            </span>{" "}
            در خودرو یاب
          </h2>

          <p className="text-sm sm:text-base leading-8 text-[#9BA3AE]">
            خودرو یاب به عنوان هاب تخصصی واردات و فروش خودرو در مناطق آزاد، دسترسی مستقیم
            به طیف گسترده‌ای از خودروسازان معتبر آلمانی، ژاپنی، کره‌ای و اروپایی را در
            سگمنت‌های متنوع فراهم ساخته است. روی هر برند کلیک کنید تا جزئیات مدل‌های
            محبوب را مشاهده نمایید.
          </p>

          {/* 3 Key Variety Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <span className="rounded-xl border border-white/[0.08] bg-[#0D1117] px-3.5 py-1.5 text-xs font-semibold text-[#F5F5F5]">
              <span className="text-[#FF6A00] ml-1.5">●</span>
              تنوع خودرو در تمام سگمنت‌ها
            </span>
            <span className="rounded-xl border border-white/[0.08] bg-[#0D1117] px-3.5 py-1.5 text-xs font-semibold text-[#F5F5F5]">
              <span className="text-[#FF6A00] ml-1.5">●</span>
              انتخاب گسترده تریم و آپشن
            </span>
            <span className="rounded-xl border border-white/[0.08] bg-[#0D1117] px-3.5 py-1.5 text-xs font-semibold text-[#F5F5F5]">
              <span className="text-[#FF6A00] ml-1.5">●</span>
              برندهای معتبر بین‌المللی
            </span>
          </div>
        </div>

        {/* Signature React Bits Pro — Center Flow Interactive Diagram */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          {/* CenterFlow Hub (8 Columns on Desktop) */}
          <div className="lg:col-span-8 rounded-3xl border border-white/[0.08] bg-[#0D1117]/75 p-2 sm:p-4 backdrop-blur-md shadow-[0_25px_65px_rgba(0,0,0,0.85)]">
            <CenterFlow
              nodeItems={nodeItems}
              centerSize={148}
              nodeSize={86}
              pulseDuration={3.6}
              lineWidth={1.6}
              pulseWidth={2.5}
              lineColor="rgba(255, 255, 255, 0.09)"
              pulseColor="#FF6A00"
              glowColor="#FF6A00"
              borderRadius={30}
              nodeDistance={0.78}
              activeNodeId={selectedBrandId}
              onSelectNode={(id) => setSelectedBrandId(id)}
              centerContent={
                <div className="flex flex-col items-center justify-center text-center px-3">
                  <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6A00]/15 border border-[#FF6A00]/40 text-[#FF6A00]">
                    <CarFront className="h-4 w-4" />
                  </div>
                  <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-[0.22em] text-[#FF8A2A]">
                    KHODROYAB
                  </span>
                  <span className="text-sm sm:text-base font-black text-[#F5F5F5] mt-0.5">
                    خودرو یاب
                  </span>
                  <span className="mt-1 rounded-full bg-[#FF6A00]/20 px-2 py-0.5 text-[8px] font-semibold text-[#F5F5F5]">
                    هاب واردات
                  </span>
                </div>
              }
            />
          </div>

          {/* Interactive Selected Brand Telemetry Panel (4 Columns on Desktop) */}
          <div className="lg:col-span-4 flex flex-col justify-between rounded-3xl border border-[#FF6A00]/30 bg-gradient-to-b from-[#171B21] to-[#0D1117] p-6 sm:p-8 shadow-orange-subtle">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#FF8A2A]">
                    {selectedBrand.name}
                  </span>
                  <h3 className="text-2xl font-black text-[#F5F5F5] mt-1">
                    {selectedBrand.faName}
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FF6A00]/40 bg-[#07090C] font-mono text-sm font-black text-[#FF6A00]">
                  {selectedBrand.monogram}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#9BA3AE]">
                <Compass className="h-4 w-4 text-[#FF6A00]" />
                <span>خاستگاه برند:</span>
                <span className="font-bold text-[#F5F5F5]">{selectedBrand.origin}</span>
                <span className="text-white/20">|</span>
                <span className="text-[#FF8A2A]">{selectedBrand.category}</span>
              </div>

              <p className="text-sm leading-7 text-[#9BA3AE]">
                {selectedBrand.description}
              </p>

              <div className="space-y-2.5 pt-1">
                <div className="text-xs font-bold text-[#F5F5F5] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#FF6A00]" />
                  <span>مدل‌های شاخص قابل تأمین و واردات:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedBrand.popularModels.map((model) => (
                    <span
                      key={model}
                      dir="ltr"
                      className="rounded-lg border border-white/[0.1] bg-[#07090C]/90 px-3 py-1.5 font-mono text-xs font-semibold text-[#F5F5F5]"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-[#07090C]/60 p-4 space-y-2 text-xs text-[#9BA3AE]">
                <div className="flex items-center gap-2 text-[#F5F5F5] font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-[#FF6A00]" />
                  <span>امکان سفارش در تریم‌های مختلف</span>
                </div>
                <p className="leading-6">
                  موجودی خودروهای آماده تحویل و شرایط ثبت سفارش وارداتی برند{" "}
                  {selectedBrand.faName} از طریق واحد مشاوره قابل استعلام است.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row gap-3">
              <Link
                href={`/search?brand=${selectedBrand.id}`}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF6A00] px-4 py-3 text-xs font-bold text-[#07090C] transition-all hover:bg-[#FF8A2A]"
              >
                <span>مشاهده در جستجوی خودرو</span>
                <ArrowUpLeft className="h-4 w-4" />
              </Link>
              <Link
                href="#consultation"
                className="inline-flex items-center justify-center rounded-xl border border-white/[0.12] bg-[#07090C] px-4 py-3 text-xs font-semibold text-[#F5F5F5] hover:border-[#FF6A00]/50"
              >
                استعلام مشاوره
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Mobile/Desktop Brand Selector Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {INTERNATIONAL_BRANDS.map((brand) => {
            const active = brand.id === selectedBrandId;
            return (
              <button
                key={brand.id}
                type="button"
                onClick={() => setSelectedBrandId(brand.id)}
                className={cn(
                  "rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all",
                  active
                    ? "border-[#FF6A00] bg-[#FF6A00]/15 text-[#F5F5F5] shadow-[0_0_15px_rgba(255,106,0,0.3)]"
                    : "border-white/[0.07] bg-[#0D1117] text-[#9BA3AE] hover:border-white/20 hover:text-[#F5F5F5]"
                )}
              >
                {brand.faName}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default VehicleVarietyCenterFlow;
