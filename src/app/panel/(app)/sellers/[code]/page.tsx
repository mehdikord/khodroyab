import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, CarFront } from "lucide-react";

import { getCurrentUser } from "@/lib/auth/user-auth";
import { getPublicSellerByCode } from "@/lib/sellers";
import { listSellerAds } from "@/lib/panel-search";
import { getConversionRates } from "@/lib/market-rates";
import { toPersianDigits } from "@/lib/utils";
import { AdCard } from "@/components/panel/search/AdCard";
import { SearchPagination } from "@/components/panel/search/SearchPagination";
import { SellerHeader } from "@/components/panel/sellers/SellerHeader";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { code: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const seller = /^\d{8}$/.test(params.code) ? await getPublicSellerByCode(params.code) : null;
  return { title: seller ? `${seller.name} | فروشندگان خودرو یاب` : "فروشنده | خودرو یاب" };
}

/** A seller's public profile (open to guests): name, code and their approved sale ads. */
export default async function SellerProfilePage({ params, searchParams }: PageProps) {
  if (!/^\d{8}$/.test(params.code)) notFound();
  const seller = await getPublicSellerByCode(params.code);
  if (!seller) notFound();
  // Codes rotate: an old link moves to the seller's current code.
  if (seller.code !== params.code) redirect(`/panel/sellers/${seller.code}`);

  const user = await getCurrentUser();
  const pageRaw = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const requestedPage = Math.max(1, Number.parseInt(pageRaw ?? "", 10) || 1);
  const [result, rates] = await Promise.all([
    listSellerAds(seller.userId, requestedPage, user?.isPartner ?? false),
    getConversionRates(),
  ]);
  const rialPerUsd = rates?.usd?.priceRial ?? null;
  const pathname = `/panel/sellers/${seller.code}`;

  return (
    <div className="space-y-5">
      <Link
        href="/panel/sellers"
        className="admin-animate-in inline-flex items-center gap-1.5 text-xs font-bold text-panel-muted transition-colors hover:text-panel-text"
      >
        <ArrowRight className="h-4 w-4" />
        همه فروشندگان
      </Link>

      <SellerHeader name={seller.name} code={seller.code} adCount={seller.adCount} priceListCount={seller.priceListCount} active="ads" />

      {/* Ads */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-black text-panel-text">آگهی‌های فروشنده</h2>
        {result.total > 0 && (
          <span className="rounded-lg bg-panel-line/[0.06] px-2 py-0.5 text-[11px] font-bold text-panel-muted">{toPersianDigits(result.total)} آگهی</span>
        )}
      </div>

      {result.ads.length === 0 ? (
        <div className="admin-animate-in relative overflow-hidden rounded-3xl border border-dashed border-panel-line/[0.12] bg-panel-surface/60 px-6 py-14 text-center">
          <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
              <CarFront className="h-7 w-7" />
            </span>
            <p className="mt-5 text-base font-extrabold text-panel-text">این فروشنده در حال حاضر آگهی فعالی ندارد</p>
            <Link
              href="/panel/search"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-5 text-sm font-bold text-panel-accent transition-colors hover:bg-[#FF6A00]/20"
            >
              دیدن همه آگهی‌ها
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {result.ads.map((ad, index) => (
              <AdCard key={ad.id} ad={ad} delay={Math.min(index, 8) * 45} rialPerUsd={rialPerUsd} />
            ))}
          </div>
          <SearchPagination page={result.page} pageCount={result.pageCount} baseQuery="" pathname={pathname} />
        </>
      )}
    </div>
  );
}
