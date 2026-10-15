import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  Gauge,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { AdminLogo } from "@/components/admin/AdminLogo";
import { LoginForm } from "@/components/admin/LoginForm";
import { getCurrentAdmin } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "ورود به پنل مدیریت | خودرو یاب",
  description: "دسترسی به پنل مدیریت یکپارچه خودرو یاب — محدود به مدیران مجاز",
  robots: "noindex, nofollow",
};

const LOGIN_HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "دسترسی امن و کنترل‌شده",
    description: "احراز هویت مبتنی بر MySQL و نشست رمزنگاری‌شده با کوکی امن",
  },
  {
    icon: Gauge,
    title: "مدیریت یکپارچه سامانه",
    description: "نقطه ورود واحد برای مدیریت برندها، خودروها، آپشن‌ها و شرایط فروش",
  },
  {
    icon: TrendingUp,
    title: "زیرساخت آماده توسعه",
    description: "پایه‌ای استاندارد برای افزودن ماژول‌های مدیریتی در مراحل بعدی",
  },
];

export default async function AdminLoginPage() {
  // Server-side verification: a *valid* session skips the login screen. An
  // invalid/stale cookie simply falls through to the form below (the cookie is
  // never trusted without verification, so this cannot loop).
  const admin = await getCurrentAdmin();
  if (admin) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Ambient layers */}
      <div
        className="admin-ambient pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div
        className="admin-grid-bg pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Brand & value proposition (visual side) */}
        <section className="admin-animate-in order-2 hidden lg:order-1 lg:block">
          <AdminLogo />

          <h1 className="mt-10 text-4xl font-black leading-[1.2] tracking-tight text-[#F5F5F5]">
            پنل مدیریت
            <span className="bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] bg-clip-text text-transparent">
              {" "}
              خودرو یاب
            </span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-8 text-[#9BA3AE]">
            مرکز فرمان یکپارچه برای مدیریت محتوای خودرویی، برندها، مدل‌ها و شرایط
            فروش در مناطق آزاد. دسترسی این بخش تنها برای مدیران مجاز و احراز هویت
            شده امکان‌پذیر است.
          </p>

          <ul className="mt-10 space-y-4">
            {LOGIN_HIGHLIGHTS.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-[#0D1117]/70 p-4 backdrop-blur-sm transition-colors hover:border-[#FF6A00]/30"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FF6A00]/35 bg-[#FF6A00]/10 text-[#FF8A2A]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-[#F5F5F5]">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-xs leading-6 text-[#9BA3AE]">
                      {item.description}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#0D1117]/80 px-3.5 py-1.5 text-[11px] text-[#5E6672]">
            <Sparkles className="h-3.5 w-3.5 text-[#FF8A2A]" />
            <span className="font-mono tracking-wider">
              KHODROYAB // ADMIN CONTROL CENTER
            </span>
          </div>
        </section>

        {/* Auth card (form side) */}
        <section className="order-1 lg:order-2">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 flex justify-center lg:hidden">
              <AdminLogo />
            </div>

            <div className="admin-animate-in rounded-3xl border border-white/[0.1] bg-[#0D1117]/95 p-6 shadow-[0_40px_80px_rgba(0,0,0,0.9),0_0_60px_rgba(255,106,0,0.07)] backdrop-blur-2xl sm:p-8">
              <div className="mb-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/35 bg-[#FF6A00]/10 px-3 py-1 text-[11px] font-semibold text-[#FF8A2A]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>ورود مدیران مجاز</span>
                </span>
                <h2 className="mt-4 text-2xl font-black tracking-tight text-[#F5F5F5]">
                  خوش آمدید
                </h2>
                <p className="mt-2 text-sm leading-7 text-[#9BA3AE]">
                  برای ادامه، شماره موبایل و رمز عبور مدیریتی خود را وارد کنید.
                </p>
              </div>

              <LoginForm />
            </div>

            <p className="mt-6 text-center text-xs text-[#5E6672]">
              © {new Date().getFullYear()} خودرو یاب — KHODROYAB. کلیه حقوق محفوظ
              است.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
