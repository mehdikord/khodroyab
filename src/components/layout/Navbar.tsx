"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/data/khodroyab-data";
import { cn } from "@/lib/utils";
import { PhoneCall, Search, Sparkles, ShieldCheck } from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#07090C]/85 backdrop-blur-xl border-b border-white/[0.08] py-3 shadow-[0_16px_40px_rgba(0,0,0,0.75)]"
          : "bg-gradient-to-b from-[#07090C]/90 via-[#07090C]/50 to-transparent py-4 md:py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Identity Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3.5 focus:outline-none"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#FF6A00]/40 bg-[#0D1117] shadow-[0_0_24px_rgba(255,106,0,0.22)] transition-transform duration-300 group-hover:scale-105 group-hover:border-[#FF6A00]">
            {/* Custom Geometric Automotive Emblem SVG */}
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
            <span className="absolute -bottom-0.5 -left-0.5 h-2 w-2 rounded-full bg-[#FF6A00] ring-2 ring-[#07090C]" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#F5F5F5]">
                خودرو یاب
              </span>
              <span className="hidden sm:inline-block rounded-md border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-widest text-[#FF8A2A]">
                KHODROYAB
              </span>
            </div>
            <span className="text-[11px] text-[#9BA3AE] tracking-wide">
              واردات و فروش تخصصی خودرو در مناطق آزاد
            </span>
          </div>
        </Link>

        {/* Desktop Architectural Navigation */}
        <nav
          aria-label="منوی اصلی"
          className="hidden lg:flex items-center gap-1 rounded-full border border-white/[0.08] bg-[#0D1117]/80 px-2 py-1.5 backdrop-blur-md"
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[#FF6A00] text-[#07090C] font-bold shadow-[0_0_20px_rgba(255,106,0,0.45)]"
                    : "text-[#F5F5F5]/80 hover:text-[#F5F5F5] hover:bg-white/[0.05]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/search"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-[#171B21]/80 px-3.5 py-2.5 text-xs font-semibold text-[#F5F5F5] transition-all duration-200 hover:border-[#FF6A00]/50 hover:bg-[#171B21]"
          >
            <Search className="h-3.5 w-3.5 text-[#FF6A00]" />
            <span>جستجوی خودرو</span>
            <span className="rounded bg-[#FF6A00]/15 px-1.5 py-0.5 text-[10px] text-[#FF8A2A]">
              به‌زودی
            </span>
          </Link>

          <Link
            href="/contact#consultation"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-4 py-2.5 text-xs sm:text-sm font-bold text-[#07090C] shadow-[0_0_25px_rgba(255,106,0,0.35)] transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
          >
            <PhoneCall className="h-3.5 w-3.5" />
            <span>مشاوره رایگان</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
