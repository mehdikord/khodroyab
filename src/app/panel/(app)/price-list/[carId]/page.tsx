import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Crown, UsersRound } from "lucide-react";

import { requireUser } from "@/lib/auth/user-auth";
import { getPriceListCarDetail } from "@/lib/price-list";
import { PRICE_TABLE_PRICE_FIELDS } from "@/lib/price-table-shared";
import { toPersianDigits } from "@/lib/utils";
import { BrandLogo, ColorLabel, PriceTag } from "@/components/panel/price-list/price-list-ui";
import { CarOffersView } from "@/components/panel/price-list/CarOffersView";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { carId: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const detail = await getPriceListCarDetail(params.carId);
  return {
    title: detail
      ? `لیست قیمت‌های ${detail.car.name} - ${detail.car.brandName} | پنل کاربری خودرو یاب`
      : "لیست قیمت | پنل کاربری خودرو یاب",
    robots: "noindex, nofollow",
  };
}

/** Every seller's raw, clearance and instant price for one price-list car. */
export default async function PriceListCarPage({ params }: PageProps) {
  const user = await requireUser();

  const detail = await getPriceListCarDetail(params.carId);
  if (!detail) notFound();
  const { car, offers, lowest, lowestByYear, years } = detail;
  const sellerCount = offers.length;

  return (
    <div className="space-y-5">
      <Link
        href="/panel/price-list"
        className="admin-animate-in inline-flex items-center gap-1.5 text-xs font-bold text-panel-muted transition-colors hover:text-panel-text"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به لیست قیمت
      </Link>

      {/* Car hero */}
      <section className="panel-card-in relative overflow-hidden rounded-[32px] border border-panel-line/[0.1] bg-panel-surface">
        <div className="panel-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-24 end-[-60px] h-64 w-64 rounded-full bg-[#FF6A00]/20 blur-3xl" aria-hidden="true" />

        <div className="relative flex flex-col gap-6 px-5 py-6 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <BrandLogo name={car.brandName} image={car.brandImage} className="h-20 w-20 rounded-[24px] p-2.5 sm:h-24 sm:w-24" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-panel-muted">لیست قیمت‌های</p>
              <h1 className="mt-0.5 break-words text-xl font-black leading-8 text-panel-text sm:text-2xl">
                {car.name} <span className="text-panel-muted">-</span> {car.brandName}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="rounded-lg bg-panel-line/[0.06] px-2 py-1 font-semibold text-panel-text-2">مدل {toPersianDigits(car.model)}</span>
                <span className="rounded-lg bg-panel-line/[0.06] px-2 py-1 font-semibold text-panel-text-2">سال {toPersianDigits(car.year)}</span>
                {car.colorName && (
                  <span className="rounded-lg bg-panel-line/[0.06] px-2 py-1 font-semibold">
                    <ColorLabel name={car.colorName} code={car.colorCode} />
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-lg bg-[#FF6A00]/10 px-2 py-1 font-bold text-panel-accent">
                  <UsersRound className="h-3.5 w-3.5" />
                  {toPersianDigits(sellerCount)} فروشنده
                </span>
                {years.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-panel-line/[0.06] px-2 py-1 font-semibold text-panel-text-2">
                    <CalendarDays className="h-3.5 w-3.5 text-panel-accent" />
                    قیمت برای {years.map((year) => toPersianDigits(year)).join("، ")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Best prices */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:min-w-[440px]">
            {PRICE_TABLE_PRICE_FIELDS.map((field) => (
              <div key={field.key} className="rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 px-2 py-3 text-center backdrop-blur">
                <p className="flex items-center justify-center gap-1 text-[10px] font-bold text-panel-muted">
                  <Crown className="h-3 w-3 text-panel-success" />
                  کمترین {field.label.replace("قیمت ", "")}
                </p>
                <div className="mt-2 flex justify-center">
                  <PriceTag price={lowest[field.key]} best={Boolean(lowest[field.key])} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {offers.length === 0 ? (
        <div className="admin-animate-in relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-14 text-center">
          <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
              <UsersRound className="h-7 w-7" />
            </span>
            <p className="mt-5 text-base font-extrabold text-panel-text">هنوز فروشنده‌ای برای این خودرو قیمت ثبت نکرده است</p>
            <Link
              href="/panel/price-table"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-5 text-sm font-bold text-panel-accent transition-colors hover:bg-[#FF6A00]/20"
            >
              ثبت قیمت در جدول من
            </Link>
          </div>
        </div>
      ) : (
        <>
          <CarOffersView car={car} offers={offers} lowestByYear={lowestByYear} years={years} currentUserId={user.id} />
          <p className="text-[11px] leading-6 text-panel-faint">
            قیمت‌ها به دلار و توسط فروشندگان در جدول قیمتشان برای هر سال ساخت جداگانه ثبت شده‌اند؛ هر ستون یک سال است و «—» یعنی
            فروشنده برای آن سال قیمتی ثبت نکرده است. کمترین قیمت هر سال با نشان تاج سبز مشخص شده و با زدن عنوان هر سال، فروشندگان بر
            اساس قیمت همان سال مرتب می‌شوند.
          </p>
        </>
      )}
    </div>
  );
}
