"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  Layers,
  Building2,
  Award,
  PhoneCall,
} from "lucide-react";

const DOCK_ITEMS = [
  { label: "خانه", href: "/", icon: Home },
  { label: "جستجو", href: "/search", icon: Search },
  { label: "خدمات", href: "/services", icon: Layers },
  { label: "درباره ما", href: "/about", icon: Building2 },
  { label: "مجوزها", href: "/licenses", icon: Award },
  { label: "تماس", href: "/contact", icon: PhoneCall },
];

export const MobileBottomDock: React.FC = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/panel")) return null;

  return (
    <nav
      aria-label="ناوبری موبایل"
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden px-2 pb-2 pt-1 pointer-events-none"
    >
      <div className="pointer-events-auto mx-auto flex max-w-md items-center justify-between rounded-2xl border border-white/[0.12] bg-[#0D1117]/95 px-1.5 py-1.5 shadow-[0_-10px_35px_rgba(0,0,0,0.85)] backdrop-blur-xl">
        {DOCK_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 transition-all duration-200 min-h-[52px]",
                isActive
                  ? "bg-[#FF6A00]/15 text-[#FF6A00]"
                  : "text-[#9BA3AE] hover:text-[#F5F5F5]"
              )}
            >
              {isActive && (
                <span className="absolute top-0.5 h-1 w-5 rounded-full bg-[#FF6A00] shadow-[0_0_10px_#FF6A00]" />
              )}
              <Icon
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isActive && "scale-110 text-[#FF6A00]"
                )}
              />
              <span
                className={cn(
                  "text-[10px] leading-none tracking-tight",
                  isActive ? "font-bold text-[#F5F5F5]" : "font-medium"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomDock;
