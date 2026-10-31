"use client";

import React, { useMemo, useRef, useState, useTransition } from "react";
import { CheckCheck, Search, Table2, X } from "lucide-react";

import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { PriceTableCarsTable } from "@/components/admin/price-table/PriceTableCarsTable";
import { setCarsPriceTableAction, toggleCarPriceTableAction } from "@/app/admin/(panel)/price-table/actions";
import type { CarRecord } from "@/lib/cars";
import { cn, toPersianDigits } from "@/lib/utils";

type Filter = "all" | "enabled" | "disabled";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "enabled", label: "مجاز در جدول" },
  { key: "disabled", label: "غیرمجاز" },
];

interface PriceTableManagerProps {
  initialCars: CarRecord[];
}

/**
 * Admin screen for `cars.price_table`: a searchable list of every catalogue
 * car with a per-row switch plus "enable/disable all visible" bulk actions.
 */
export function PriceTableManager({ initialCars }: PriceTableManagerProps) {
  const [cars, setCars] = useState<CarRecord[]>(initialCars);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isBulkPending, startBulkTransition] = useTransition();
  const [, startToggleTransition] = useTransition();
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enabledCount = useMemo(() => cars.filter((car) => car.priceTable).length, [cars]);

  const visibleCars = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return cars.filter((car) => {
      if (filter === "enabled" && !car.priceTable) return false;
      if (filter === "disabled" && car.priceTable) return false;
      if (!normalized) return true;
      return (
        car.name.toLowerCase().includes(normalized) ||
        car.brandName.toLowerCase().includes(normalized) ||
        car.model.toLowerCase().includes(normalized)
      );
    });
  }, [cars, query, filter]);

  function showToast(kind: ToastState["kind"], message: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  }

  function handleToggle(car: CarRecord) {
    if (pendingId || isBulkPending) return;
    setPendingId(car.id);
    // Optimistic flip for instant feedback; reverted if the server disagrees.
    setCars((prev) => prev.map((c) => (c.id === car.id ? { ...c, priceTable: !c.priceTable } : c)));

    startToggleTransition(async () => {
      const result = await toggleCarPriceTableAction(car.id);
      setPendingId(null);
      if (result.ok) {
        setCars((prev) => prev.map((c) => (c.id === result.record.id ? result.record : c)));
        showToast(
          "success",
          result.record.priceTable
            ? `خودرو «${result.record.name}» به جدول قیمت اضافه شد`
            : `خودرو «${result.record.name}» از جدول قیمت حذف شد`
        );
      } else {
        setCars((prev) => prev.map((c) => (c.id === car.id ? car : c)));
        showToast("error", result.message);
      }
    });
  }

  function handleBulk(enabled: boolean) {
    const targets = visibleCars.filter((car) => car.priceTable !== enabled);
    if (targets.length === 0 || isBulkPending) return;

    startBulkTransition(async () => {
      const result = await setCarsPriceTableAction(
        targets.map((car) => car.id),
        enabled
      );
      if (result.ok) {
        const byId = new Map(result.records.map((record) => [record.id, record]));
        setCars((prev) => prev.map((c) => byId.get(c.id) ?? c));
        showToast(
          "success",
          enabled
            ? `${toPersianDigits(result.records.length)} خودرو به جدول قیمت اضافه شد`
            : `${toPersianDigits(result.records.length)} خودرو از جدول قیمت حذف شد`
        );
      } else {
        showToast("error", result.message);
      }
    });
  }

  const enableAllCount = visibleCars.filter((car) => !car.priceTable).length;
  const disableAllCount = visibleCars.filter((car) => car.priceTable).length;

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
            <Table2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-6 text-[#F5F5F5]">مدیریت جدول قیمت</h1>
            <p className="mt-0.5 text-xs text-[#8B93A1]">
              {toPersianDigits(enabledCount)} از {toPersianDigits(cars.length)} خودرو برای استفاده در جدول قیمت کاربران مجاز است
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleBulk(true)}
            disabled={isBulkPending || enableAllCount === 0}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-4 text-xs font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            <CheckCheck className="h-4 w-4" />
            مجاز کردن همه موارد نمایش‌داده‌شده
            {enableAllCount > 0 && <span className="rounded-md bg-black/15 px-1.5 py-0.5 text-[10px]">{toPersianDigits(enableAllCount)}</span>}
          </button>
          <button
            type="button"
            onClick={() => handleBulk(false)}
            disabled={isBulkPending || disableAllCount === 0}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.03] px-4 text-xs font-bold text-[#D2D7DF] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X className="h-4 w-4" />
            غیرمجاز کردن همه موارد نمایش‌داده‌شده
            {disableAllCount > 0 && <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px]">{toPersianDigits(disableAllCount)}</span>}
          </button>
        </div>
      </div>

      <p className="rounded-2xl border border-[#FF6A00]/20 bg-[#FF6A00]/[0.06] px-4 py-3 text-xs leading-6 text-[#D2D7DF]">
        فقط خودروهایی که در این صفحه «مجاز» می‌کنید در جدول قیمت کاربران قابل استفاده هستند. با غیرمجاز کردن یک خودرو،
        آن خودرو از جدول قیمت همه کاربران پنهان می‌شود (اطلاعات ثبت‌شده کاربران حذف نمی‌شود و با مجاز شدن دوباره نمایش داده می‌شود).
      </p>

      {/* Search + filter */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="group relative w-full max-w-md">
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#5E6672] transition-colors group-focus-within:text-[#FF8A2A]">
            <Search className="h-[18px] w-[18px]" />
          </span>
          <input
            type="search"
            placeholder="جستجو در نام، برند، مدل یا سال..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 w-full rounded-xl border border-white/[0.12] bg-[#07090C] px-12 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15"
          />
        </div>

        <div role="tablist" aria-label="فیلتر وضعیت" className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-[#0A0D12] p-1">
          {FILTERS.map((item) => {
            const active = filter === item.key;
            const count = item.key === "all" ? cars.length : item.key === "enabled" ? enabledCount : cars.length - enabledCount;
            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(item.key)}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-colors",
                  active ? "bg-[#FF6A00]/15 text-[#FF8A2A]" : "text-[#8B93A1] hover:bg-white/[0.04] hover:text-[#F5F5F5]"
                )}
              >
                {item.label}
                <span className={cn("rounded-md px-1.5 py-0.5 text-[10px]", active ? "bg-[#FF6A00]/20" : "bg-white/[0.06]")}>
                  {toPersianDigits(count)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {visibleCars.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.1] px-6 py-14 text-center">
          <p className="text-sm font-bold text-[#F5F5F5]">خودرویی یافت نشد</p>
          <p className="mt-1 text-xs text-[#8B93A1]">
            {cars.length === 0 ? "ابتدا از بخش «خودروها» خودرو ثبت کنید." : "عبارت جستجو یا فیلتر را تغییر دهید."}
          </p>
        </div>
      ) : (
        <PriceTableCarsTable cars={visibleCars} pendingId={pendingId} disabled={isBulkPending} onToggle={handleToggle} />
      )}
    </div>
  );
}
