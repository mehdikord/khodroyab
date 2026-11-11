import React from "react";
import { Table2 } from "lucide-react";

import type { RecentPriceTableEntryRecord } from "@/lib/price-table";
import { PRICE_TABLE_PRICE_FIELDS } from "@/lib/price-table-shared";
import { currencyLabel } from "@/lib/currency";
import { ColorSwatch } from "@/components/admin/ui/ColorSwatch";
import { CountPill, ProfileSection, SectionEmpty } from "@/components/admin/users/ProfileSection";
import { formatPersianNumber, toPersianDigits } from "@/lib/utils";

interface UserPriceTablePreviewProps {
  userId: string;
  /** Rows the user has priced in total. */
  total: number;
  /** Most recently updated rows (max 3). */
  entries: RecentPriceTableEntryRecord[];
}

/** First price of a tier in display order (public before collaborator), with its label. */
function headlinePrice(tier: RecentPriceTableEntryRecord["tiers"][number]): { label: string; value: string; partner: boolean } | null {
  for (const field of PRICE_TABLE_PRICE_FIELDS) {
    if (tier[field.key]) return { label: field.label, value: tier[field.key]!, partner: false };
  }
  for (const field of PRICE_TABLE_PRICE_FIELDS) {
    if (tier[field.partnerKey]) return { label: `${field.label} همکار`, value: tier[field.partnerKey]!, partner: true };
  }
  return null;
}

/** Profile section: the collaborator's latest price-table rows and a link to the full editor. */
export function UserPriceTablePreview({ userId, total, entries }: UserPriceTablePreviewProps) {
  return (
    <ProfileSection
      icon={Table2}
      title="جدول لیست قیمت"
      badge={<CountPill>{toPersianDigits(total)} خودرو</CountPill>}
      description={total > 0 ? "آخرین قیمت‌های به‌روزشده" : "قیمت‌های ثبت‌شده کاربر برای خودروهای جدول"}
      action={{ href: `/admin/users/${userId}/price-table`, label: "مدیریت جدول قیمت" }}
    >
      {entries.length === 0 ? (
        <SectionEmpty title="هنوز قیمتی در جدول این کاربر ثبت نشده است" hint="از «مدیریت جدول قیمت» می‌توانید قیمت‌ها را برای کاربر ثبت کنید." />
      ) : (
        <ul className="divide-y divide-white/[0.05] overflow-hidden rounded-xl border border-white/[0.06] bg-[#07090C]/60">
          {entries.map((entry) => {
            const [first] = entry.tiers;
            const price = first ? headlinePrice(first) : null;
            const more = entry.tiers.length - 1;
            return (
              <li key={entry.car.id} className="flex items-center gap-3 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-[#F5F5F5]">
                    {entry.car.name} <span className="text-[11px] font-semibold text-[#5E6672]">{entry.car.brandName}</span>
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[11px] text-[#8B93A1]">
                    {first && (
                      <>
                        <span className="font-mono font-bold text-[#FF8A2A]">{toPersianDigits(first.year)}</span>
                        <span className="inline-flex items-center gap-1">
                          <ColorSwatch code={first.colorCode} className="h-3 w-3" />
                          {first.colorName}
                        </span>
                      </>
                    )}
                    {more > 0 && <span className="text-[#5E6672]">· {toPersianDigits(more)} ردیف دیگر</span>}
                  </p>
                </div>
                <div className="shrink-0 text-end">
                  {price ? (
                    <>
                      <p className={price.partner ? "text-[13px] font-black text-sky-300" : "text-[13px] font-black text-[#F5F5F5]"}>
                        {formatPersianNumber(price.value)}
                        <span className="ms-1 text-[10px] font-semibold opacity-70">{currencyLabel(entry.currency)}</span>
                      </p>
                      <p className="text-[10px] text-[#5E6672]">{price.label}</p>
                    </>
                  ) : (
                    <p className="text-[11px] text-[#5E6672]">بدون قیمت</p>
                  )}
                </div>
                <span className="hidden shrink-0 text-[10px] text-[#5E6672] sm:block">{entry.updatedAtLabel}</span>
              </li>
            );
          })}
        </ul>
      )}
    </ProfileSection>
  );
}
