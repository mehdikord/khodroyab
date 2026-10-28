import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, Building2, CalendarDays, MapPin, Megaphone, Phone, Quote, Smartphone, Sparkles, Table2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { requireUser } from "@/lib/auth/user-auth";
import { getSellerProfile, listSellerApprovedAds } from "@/lib/panel-search";
import { getUserPriceTableRows } from "@/lib/price-table";
import { cn, toPersianDigits } from "@/lib/utils";
import { SafeImage } from "@/components/panel/SafeImage";
import { AdCard } from "@/components/panel/search/AdCard";
import { PriceTableView } from "@/components/panel/price-table/PriceTableView";
import { SellerProfileTabs } from "@/components/panel/sellers/SellerProfileTabs";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const seller = await getSellerProfile(params.id);
  return {
    title: seller ? `${seller.name} | فروشندگان خودرو یاب` : "فروشنده | پنل کاربری خودرو یاب",
    robots: "noindex, nofollow",
  };
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  if (parts.length === 1) return parts[0].slice(0, 1);
  return parts[0].slice(0, 1) + parts[1].slice(0, 1);
}

interface ContactItemProps {
  icon: LucideIcon;
  label: string;
  value: string | null;
  /** Phone numbers become tap-to-call links and read left-to-right. */
  phone?: boolean;
  className?: string;
}

function ContactItem({ icon: Icon, label, value, phone, className }: ContactItemProps) {
  const content = value ? (
    <span
      dir={phone ? "ltr" : undefined}
      className={cn(
        "block text-[13px] font-extrabold text-panel-text sm:text-sm",
        phone ? "text-right font-mono tracking-wider" : "whitespace-pre-line break-words leading-6"
      )}
    >
      {toPersianDigits(value)}
    </span>
  ) : (
    <span className="block text-xs font-semibold text-panel-faint">ثبت نشده</span>
  );

  const body = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FF6A00]/25 bg-[#FF6A00]/10 text-panel-accent transition-colors group-hover/contact:bg-[#FF6A00]/20">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 flex-1 text-start">
        <span className="block text-[10px] font-bold text-panel-muted">{label}</span>
        <span className="mt-0.5 block">{content}</span>
      </span>
    </>
  );

  const boxClass = cn(
    "flex items-center gap-3 rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 px-3.5 py-3",
    className
  );

  if (phone && value) {
    return (
      <a
        href={`tel:${value.replace(/[^\d+]/g, "")}`}
        title={`تماس با ${label}`}
        className={cn(boxClass, "group/contact transition-colors hover:border-[#FF6A00]/35 hover:bg-[#FF6A00]/[0.06]")}
      >
        {body}
      </a>
    );
  }
  return <div className={cn(boxClass, value ? "items-start" : undefined)}>{body}</div>;
}

/**
 * Public seller profile as seen by other customers: avatar, name, contact
 * details (mobile, landline, address), bio, then two
 * tabs: the seller's approved ads (same cards as the search, including price
 * history) and the seller's price table (every eligible car, "---" for gaps).
 */
export default async function SellerProfilePage({ params }: PageProps) {
  await requireUser();

  const seller = await getSellerProfile(params.id);
  if (!seller) notFound();

  const [ads, priceRows] = await Promise.all([listSellerApprovedAds(params.id), getUserPriceTableRows(BigInt(seller.id))]);
  const pricedCount = priceRows.filter((row) => row.entry !== null).length;

  return (
    <div className="space-y-5">
      <Link
        href="/panel/search"
        className="admin-animate-in inline-flex items-center gap-1.5 text-xs font-bold text-panel-muted transition-colors hover:text-panel-text"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به جستجو
      </Link>

      {/* Seller hero */}
      <section className="panel-card-in relative overflow-hidden rounded-[32px] border border-panel-line/[0.1] bg-panel-surface">
        <div className="panel-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="pointer-events-none absolute -top-24 end-[-60px] h-64 w-64 rounded-full bg-[#FF6A00]/20 blur-3xl" aria-hidden="true" />

        <div className="relative flex flex-col items-center gap-5 px-5 pb-6 pt-8 text-center sm:flex-row sm:items-center sm:gap-7 sm:px-8 sm:text-start">
          <div className="panel-avatar-ring relative h-28 w-28 shrink-0 rounded-[30px] sm:h-32 sm:w-32">
            <div className="relative h-full w-full overflow-hidden rounded-[30px] border-[3px] border-panel-surface bg-panel-surface-2">
              {seller.image ? (
                <SafeImage
                  src={seller.image}
                  alt=""
                  className="h-full w-full object-cover"
                  fallback={
                    <span className="flex h-full w-full items-center justify-center bg-[#FF6A00]/[0.12] text-3xl font-black text-panel-accent">
                      {initials(seller.name)}
                    </span>
                  }
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-[#FF6A00]/[0.12] text-3xl font-black text-panel-accent">
                  {initials(seller.name)}
                </span>
              )}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-black text-panel-text sm:text-3xl">{seller.name}</h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#FF6A00]/35 bg-[#FF6A00]/10 px-2 py-0.5 text-[10px] font-bold text-panel-accent-soft">
                {seller.isCompany ? <Building2 className="h-3 w-3" /> : <BadgeCheck className="h-3 w-3" />}
                {seller.isCompany ? "مجموعه" : "فروشنده"}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-panel-muted-2 sm:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-panel-accent" />
                عضو از {seller.memberSinceLabel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Megaphone className="h-3.5 w-3.5 text-panel-accent" />
                {toPersianDigits(seller.approvedAdCount)} آگهی تایید‌شده
              </span>
            </div>

            {seller.bio ? (
              <div className="relative mt-4 rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 px-4 py-3 text-start">
                <Quote className="absolute -top-2.5 start-3 h-5 w-5 rounded-md bg-panel-surface p-0.5 text-panel-accent" />
                <p className="whitespace-pre-line text-xs leading-6 text-panel-text-2">{seller.bio}</p>
              </div>
            ) : (
              <p className="mt-4 text-xs text-panel-faint">این فروشنده هنوز بیوگرافی ثبت نکرده است.</p>
            )}

            {/* Contact details */}
            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <ContactItem icon={Smartphone} label="شماره موبایل" value={seller.phone} phone />
              <ContactItem icon={Phone} label="شماره تلفن" value={seller.tel} phone />
              <ContactItem icon={MapPin} label="آدرس" value={seller.address} className="sm:col-span-2" />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs: ads (default) / price table */}
      <SellerProfileTabs
        adsCount={ads.length}
        priceTableCount={pricedCount}
        adsPanel={
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-black text-panel-text">
                <Sparkles className="h-4 w-4 text-panel-accent" />
                آگهی‌های {seller.name}
              </h2>
              <span className="rounded-lg bg-panel-line/[0.05] px-2 py-1 text-[11px] font-bold text-panel-muted">
                {toPersianDigits(ads.length)} آگهی
              </span>
            </div>

            {ads.length === 0 ? (
              <div className="relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-14 text-center">
                <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
                <div className="relative">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
                    <Megaphone className="h-7 w-7" />
                  </span>
                  <p className="mt-5 text-base font-extrabold text-panel-text">این فروشنده در حال حاضر آگهی فعالی ندارد</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {ads.map((ad, index) => (
                  <AdCard key={ad.id} ad={ad} delay={Math.min(index, 8) * 45} hideSeller />
                ))}
              </div>
            )}
          </div>
        }
        priceTablePanel={
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-black text-panel-text">
                <Table2 className="h-4 w-4 text-panel-accent" />
                جدول قیمت {seller.name}
              </h2>
              <span className="rounded-lg bg-panel-line/[0.05] px-2 py-1 text-[11px] font-bold text-panel-muted">
                {toPersianDigits(pricedCount)} از {toPersianDigits(priceRows.length)} خودرو
              </span>
            </div>

            {priceRows.length === 0 ? (
              <div className="relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-14 text-center">
                <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
                <div className="relative">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
                    <Table2 className="h-7 w-7" />
                  </span>
                  <p className="mt-5 text-base font-extrabold text-panel-text">هنوز خودرویی برای جدول قیمت تعریف نشده است</p>
                </div>
              </div>
            ) : (
              <>
                <PriceTableView rows={priceRows} />
                <p className="text-[11px] leading-6 text-panel-faint">
                  قیمت‌ها به دلار و توسط فروشنده برای هر سال ساخت جداگانه ثبت شده‌اند. «---» یعنی فروشنده برای آن خودرو یا قیمت، مقداری ثبت
                  نکرده است.
                </p>
              </>
            )}
          </div>
        }
      />
    </div>
  );
}
