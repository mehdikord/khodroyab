import React from "react";
import Link from "next/link";
import { ArrowDownWideNarrow, ArrowLeft, BadgeCheck, Search, SlidersHorizontal } from "lucide-react";

import { cn, toPersianDigits } from "@/lib/utils";

interface SearchAdsCardProps {
  /** Number of public (approved, active) sale ads. */
  saleCount: number;
  className?: string;
}

const CHIPS = [
  { icon: SlidersHorizontal, label: "فیلتر پیشرفته" },
  { icon: ArrowDownWideNarrow, label: "مرتب‌سازی" },
  { icon: BadgeCheck, label: "تایید‌شده توسط مدیریت" },
] as const;

/**
 * Dashboard hero card leading to the sale-ad search. It always uses the dark
 * look of the photo (in both panel themes): the car sits on the left, the copy
 * and a mock search bar on the right, with a light sweep on hover and a
 * light streak running along the bottom edge.
 */
export function SearchAdsCard({ saleCount, className }: SearchAdsCardProps) {
  return (
    <Link
      href="/panel/search"
      aria-label="جستجو و مشاهده آگهی‌های فروش خودرو"
      className={cn(
        "kh-search-card panel-card-in group relative isolate block overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#07090C] text-[#F5F5F5] sm:rounded-[32px]",
        "shadow-[0_30px_70px_-25px_rgba(0,0,0,0.85),0_0_50px_-20px_rgba(255,106,0,0.35)] transition-[border-color,box-shadow,transform] duration-500",
        "hover:border-[#FF6A00]/45 hover:shadow-[0_34px_80px_-25px_rgba(0,0,0,0.9),0_0_70px_-18px_rgba(255,106,0,0.55)] motion-safe:hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-panel-bg",
        className
      )}
    >
      {/* Photo: top strip on phones, left two thirds from `sm` up */}
      <div aria-hidden="true" className="relative h-48 overflow-hidden sm:absolute sm:inset-y-0 sm:left-0 sm:h-auto sm:w-[68%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-car.jpg"
          alt=""
          className="h-full w-full object-cover object-[center_80%] transition-transform duration-[1200ms] ease-out motion-safe:group-hover:scale-[1.06]"
        />
        {/* Fade into the copy: downwards on phones, towards the right from `sm` up */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090C] via-[#07090C]/30 to-transparent sm:bg-gradient-to-l sm:via-[#07090C]/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07090C]/60 via-transparent to-transparent" />
        <div className="absolute -bottom-10 left-[18%] h-32 w-[60%] rounded-full bg-[#FF6A00]/25 blur-3xl transition-opacity duration-700 group-hover:opacity-100 sm:opacity-70" />
      </div>

      {/* Texture and glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 end-[-80px] h-72 w-72 rounded-full bg-[#FF6A00]/[0.13] blur-3xl" />
        <div className="kh-search-grid absolute inset-0 opacity-60" />
        <div className="kh-search-sheen absolute inset-0" />
      </div>

      {/* Copy */}
      <div className="relative z-10 -mt-16 flex flex-col gap-4 p-5 pt-0 sm:mt-0 sm:min-h-[320px] sm:w-[62%] sm:justify-center sm:p-8 lg:w-[56%] lg:p-10">
        <span
          aria-hidden="true"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FF6A00]/35 bg-[#07090C]/70 px-3 py-1.5 text-[11px] font-extrabold text-[#FFB070] backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#FF6A00] opacity-70 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF6A00]" />
          </span>
          {saleCount > 0 ? (
            <>
              <span className="font-mono text-[13px] tabular-nums text-[#F5F5F5]">{toPersianDigits(saleCount)}</span>
              آگهی فعال فروش
            </>
          ) : (
            "آگهی‌های تایید‌شده"
          )}
        </span>

        <div aria-hidden="true">
          <h2 className="text-[26px] font-black leading-[1.35] tracking-tight sm:text-[32px] lg:text-[36px]">
            جستجو و مشاهده
            <br />
            <span className="bg-gradient-to-l from-[#FF6A00] via-[#FF8A2A] to-[#FFC48A] bg-clip-text text-transparent">آگهی‌های خودرو</span>
          </h2>
          <p className="mt-2 max-w-md text-xs leading-6 text-[#AEB5BF] sm:text-sm sm:leading-7">
            برند، نوع، رنگ و سال ساخت را انتخاب کنید و از بین آگهی‌های تایید‌شده، خودروی دلخواهتان را پیدا کنید.
          </p>
        </div>

        {/* Mock search bar */}
        <div
          aria-hidden="true"
          className="flex items-center gap-3 rounded-2xl border border-white/[0.12] bg-white/[0.06] p-1.5 ps-4 backdrop-blur-md transition-colors duration-300 group-hover:border-[#FF6A00]/40 group-hover:bg-white/[0.08] sm:max-w-md"
        >
          <Search className="h-[18px] w-[18px] shrink-0 text-[#FF8A2A]" />
          <span className="flex min-w-0 flex-1 items-center gap-0.5 truncate text-[13px] text-[#8E97A3]">
            <span className="kh-search-caret inline-block h-4 w-px shrink-0 bg-[#FF8A2A]" />
            <span className="truncate">برند، مدل یا کد آگهی…</span>
          </span>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6A00] to-[#FF8A2A] text-[#07090C] shadow-[0_0_24px_rgba(255,106,0,0.55)] transition-shadow duration-300 group-hover:shadow-[0_0_34px_rgba(255,106,0,0.8)]">
            <ArrowLeft className="h-5 w-5 transition-transform duration-300 motion-safe:group-hover:-translate-x-1" strokeWidth={2.5} />
          </span>
        </div>

        <ul aria-hidden="true" className="flex flex-wrap gap-1.5">
          {CHIPS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-[#07090C]/60 px-2.5 py-1 text-[10.5px] font-bold text-[#C9CFD6] backdrop-blur"
            >
              <Icon className="h-3.5 w-3.5 text-[#FF8A2A]" />
              {label}
            </li>
          ))}
        </ul>
      </div>

      {/* Light streak along the bottom edge */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden">
        <div className="kh-search-streak absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-transparent via-[#FF8A2A] to-transparent" />
      </div>
    </Link>
  );
}

export default SearchAdsCard;
