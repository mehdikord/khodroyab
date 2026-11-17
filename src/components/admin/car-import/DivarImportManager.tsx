"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CloudDownload,
  DatabaseZap,
  Loader2,
  PlusCircle,
  RotateCcw,
} from "lucide-react";

import { SearchableSelect } from "@/components/admin/ui/SearchableSelect";
import {
  importDivarBatchAction,
  scanDivarDataAction,
  type DivarScanBrand,
} from "@/app/admin/(panel)/car-import/actions";
import { cn, toPersianDigits } from "@/lib/utils";

interface CarTypeOption {
  id: string;
  name: string;
}

interface ScanReport {
  totalBrands: number;
  totalCars: number;
  newBrands: number;
  newCars: number;
  brands: DivarScanBrand[];
}

interface Totals {
  createdBrands: number;
  existingBrands: number;
  createdCars: number;
  existingCars: number;
}

interface ImportState {
  batches: DivarScanBrand[][];
  /** Index of the next batch to send. */
  next: number;
  doneBrands: number;
  doneCars: number;
  totals: Totals;
  startedAt: number;
  finishedAt?: number;
  /** "stopped": the admin closed the dialog after a failure. */
  status: "running" | "failed" | "done" | "stopped";
  error?: string;
}

/** A batch stays under this many cars (or BATCH_MAX_BRANDS brands). */
const BATCH_MAX_CARS = 150;
const BATCH_MAX_BRANDS = 10;

function buildBatches(brands: DivarScanBrand[]): DivarScanBrand[][] {
  const batches: DivarScanBrand[][] = [];
  let current: DivarScanBrand[] = [];
  let cars = 0;
  for (const brand of brands) {
    if (
      current.length > 0 &&
      (cars + brand.carCount > BATCH_MAX_CARS || current.length >= BATCH_MAX_BRANDS)
    ) {
      batches.push(current);
      current = [];
      cars = 0;
    }
    current.push(brand);
    cars += brand.carCount;
  }
  if (current.length > 0) batches.push(current);
  return batches;
}

const EMPTY_TOTALS: Totals = { createdBrands: 0, existingBrands: 0, createdCars: 0, existingCars: 0 };

function fa(n: number): string {
  return toPersianDigits(n.toLocaleString("en-US"));
}

function formatDuration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return toPersianDigits(`${minutes}:${seconds.toString().padStart(2, "0")}`);
}

function Stat({ label, value, tone = "neutral" }: { label: string; value: number; tone?: "accent" | "neutral" }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#07090C] px-4 py-3">
      <p className="text-[11px] font-semibold text-[#8B93A1]">{label}</p>
      <p
        className={cn(
          "mt-1 font-mono text-xl font-black",
          tone === "accent" ? "text-[#FF8A2A]" : "text-[#F5F5F5]"
        )}
      >
        {fa(value)}
      </p>
    </div>
  );
}

export function DivarImportManager({ carTypes }: { carTypes: CarTypeOption[] }) {
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [report, setReport] = useState<ScanReport | null>(null);
  const [carTypeId, setCarTypeId] = useState(carTypes[0]?.id ?? "");
  const [job, setJob] = useState<ImportState | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const runningRef = useRef(false);

  const isRunning = job?.status === "running";

  // Warn before the tab is closed or reloaded mid-import.
  useEffect(() => {
    if (!isRunning) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      clearInterval(timer);
    };
  }, [isRunning]);

  async function handleScan() {
    setScanning(true);
    setScanError(null);
    setReport(null);
    setJob(null);
    try {
      const result = await scanDivarDataAction();
      if (result.ok) {
        const { ok: _ok, ...rest } = result;
        setReport(rest);
      } else {
        setScanError(result.message);
      }
    } catch {
      setScanError("ارتباط با سرور برقرار نشد؛ دوباره تلاش کنید.");
    } finally {
      setScanning(false);
    }
  }

  async function run(state: ImportState) {
    if (runningRef.current) return;
    runningRef.current = true;
    let current: ImportState = { ...state, status: "running", error: undefined };
    setJob(current);

    try {
      while (current.next < current.batches.length) {
        const batch = current.batches[current.next];
        let result: Awaited<ReturnType<typeof importDivarBatchAction>>;
        try {
          result = await importDivarBatchAction(batch.map((brand) => brand.key), carTypeId);
        } catch {
          result = { ok: false, message: "ارتباط با سرور قطع شد." };
        }
        if (!result.ok) {
          current = { ...current, status: "failed", error: result.message };
          setJob(current);
          return;
        }
        current = {
          ...current,
          next: current.next + 1,
          doneBrands: current.doneBrands + batch.length,
          doneCars: current.doneCars + batch.reduce((sum, brand) => sum + brand.carCount, 0),
          totals: {
            createdBrands: current.totals.createdBrands + result.createdBrands,
            existingBrands: current.totals.existingBrands + result.existingBrands,
            createdCars: current.totals.createdCars + result.createdCars,
            existingCars: current.totals.existingCars + result.existingCars,
          },
        };
        setJob(current);
      }
      current = { ...current, status: "done", finishedAt: Date.now() };
      setJob(current);
    } finally {
      runningRef.current = false;
    }
  }

  function handleImport() {
    if (!report || !carTypeId) return;
    setNow(Date.now());
    void run({
      batches: buildBatches(report.brands),
      next: 0,
      doneBrands: 0,
      doneCars: 0,
      totals: EMPTY_TOTALS,
      startedAt: Date.now(),
      status: "running",
    });
  }

  const totalCars = report?.totalCars ?? 0;
  const totalUnits = (report?.totalBrands ?? 0) + totalCars;
  const doneUnits = (job?.doneBrands ?? 0) + (job?.doneCars ?? 0);
  const percent = job
    ? job.status === "done"
      ? 100
      : totalUnits > 0
        ? Math.min(99, Math.floor((doneUnits / totalUnits) * 100))
        : 0
    : 0;
  const elapsed = job ? (job.finishedAt ?? now) - job.startedAt : 0;
  const remaining = doneUnits > 0 ? (elapsed / doneUnits) * (totalUnits - doneUnits) : null;
  const currentBrand = job && job.status === "running" ? job.batches[job.next]?.[0]?.name : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
          <DatabaseZap className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold leading-6 text-[#F5F5F5]">ورود اطلاعات</h1>
          <p className="mt-0.5 text-xs text-[#8B93A1]">ورود اطلاعات از سایت دیوار</p>
        </div>
      </div>

      {/* Step 1: scan */}
      <section className="rounded-2xl border border-white/[0.08] bg-[#0A0D12] p-5 sm:p-6">
        <h2 className="text-base font-extrabold text-[#F5F5F5]">ورود اطلاعات از سایت دیوار</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[#8B93A1]">
          فایل اطلاعات دیوار به‌طور کامل پیمایش می‌شود و همه برندها همراه با خودروها و زیرمجموعه‌های آن‌ها
          استخراج می‌شوند. زیرمجموعه‌های هر خودرو نیز به‌عنوان خودروی همان برند در نظر گرفته می‌شوند.
        </p>
        <button
          type="button"
          onClick={handleScan}
          disabled={scanning || isRunning}
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {scanning ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <CloudDownload className="h-[18px] w-[18px]" />}
          {scanning ? "در حال دریافت اطلاعات…" : "دریافت اطلاعات"}
        </button>

        {scanError && (
          <p className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {scanError}
          </p>
        )}
      </section>

      {/* Step 2: report + import */}
      {report && (
        <section className="admin-animate-fade rounded-2xl border border-white/[0.08] bg-[#0A0D12] p-5 sm:p-6">
          <p className="text-base font-extrabold text-[#F5F5F5]">
            <span className="text-[#FF8A2A]">{fa(report.totalBrands)}</span> برند و{" "}
            <span className="text-[#FF8A2A]">{fa(report.totalCars)}</span> خودرو یافت شد
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="برند جدید" value={report.newBrands} tone="accent" />
            <Stat label="برند موجود در سیستم" value={report.totalBrands - report.newBrands} />
            <Stat label="خودروی جدید" value={report.newCars} tone="accent" />
            <Stat label="خودروی موجود در سیستم" value={report.totalCars - report.newCars} />
          </div>

          {job?.status === "done" || job?.status === "stopped" ? (
            <div
              className={cn(
                "mt-5 rounded-xl border p-4 text-sm",
                job.status === "done"
                  ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-100"
                  : "border-amber-500/30 bg-amber-950/30 text-amber-100"
              )}
            >
              <p className="flex items-center gap-2 font-bold">
                {job.status === "done" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                )}
                {job.status === "done"
                  ? `ورود اطلاعات با موفقیت به پایان رسید (${formatDuration(elapsed)})`
                  : "ورود اطلاعات نیمه‌کاره متوقف شد؛ برای تکمیل، دوباره «دریافت اطلاعات» را بزنید."}
              </p>
              <p className="mt-2 leading-7 opacity-90">
                {fa(job.totals.createdBrands)} برند و {fa(job.totals.createdCars)} خودروی جدید اضافه شد.{" "}
                {fa(job.totals.existingBrands)} برند و {fa(job.totals.existingCars)} خودرو از قبل وجود داشت و
                دوباره اضافه نشد.
              </p>
            </div>
          ) : (
            <div className="mt-5 flex flex-col gap-4 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-end">
              <div className="w-full sm:max-w-xs">
                <label className="mb-1.5 block text-xs font-bold text-[#C9CED6]">نوع پیش‌فرض خودرو</label>
                <SearchableSelect
                  value={carTypeId}
                  onChange={setCarTypeId}
                  options={carTypes.map((type) => ({ value: type.id, label: type.name }))}
                  placeholder="انتخاب نوع خودرو"
                  disabled={isRunning}
                />
                <p className="mt-1.5 text-[11px] leading-5 text-[#5E6672]">
                  دیوار نوع خودرو را ارائه نمی‌دهد؛ اگر نام خودرو شامل یکی از انواع باشد (مثل «کوپه») همان نوع، وگرنه این
                  نوع ثبت می‌شود.
                </p>
              </div>
              <button
                type="button"
                onClick={handleImport}
                disabled={!carTypeId || isRunning || report.newBrands + report.newCars === 0}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none sm:mb-[26px]"
              >
                <PlusCircle className="h-[18px] w-[18px]" />
                افزودن به سیستم
              </button>
            </div>
          )}

          {carTypes.length === 0 && (
            <p className="mt-3 text-xs text-red-300">ابتدا حداقل یک نوع خودرو در بخش «انواع خودرو» ثبت کنید.</p>
          )}
          {report.newBrands + report.newCars === 0 && !job && (
            <p className="mt-3 text-xs text-[#8B93A1]">همه برندها و خودروهای این فایل از قبل در سیستم وجود دارند.</p>
          )}
        </section>
      )}

      {/* Progress overlay: blocks the panel until the import ends or fails */}
      {job && (job.status === "running" || job.status === "failed") && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#07090C]/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="divar-import-title">
          <div className="admin-animate-in w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0A0D12] p-6 shadow-2xl">
            <h2 id="divar-import-title" className="flex items-center gap-2 text-base font-extrabold text-[#F5F5F5]">
              {job.status === "running" ? (
                <Loader2 className="h-5 w-5 animate-spin text-[#FF8A2A]" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-400" />
              )}
              {job.status === "running" ? "در حال افزودن اطلاعات به سیستم" : "ورود اطلاعات متوقف شد"}
            </h2>

            <div className="mt-5 flex items-baseline justify-between text-sm">
              <span className="text-[#8B93A1]">
                {fa(job.doneBrands)} از {fa(report?.totalBrands ?? 0)} برند · {fa(job.doneCars)} از {fa(totalCars)} خودرو
              </span>
              <span className="font-mono text-lg font-black text-[#FF8A2A]">{toPersianDigits(percent)}٪</span>
            </div>
            <div
              className="mt-2 h-3 overflow-hidden rounded-full bg-white/[0.06]"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
            >
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-500 ease-out",
                  job.status === "failed" ? "bg-red-500" : "bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A]"
                )}
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="mt-3 flex justify-between text-xs text-[#5E6672]">
              <span>زمان سپری‌شده: {formatDuration(elapsed)}</span>
              {job.status === "running" && (
                <span>زمان باقی‌مانده: {remaining === null ? "در حال محاسبه…" : `حدود ${formatDuration(remaining)}`}</span>
              )}
            </div>
            {currentBrand && <p className="mt-2 text-xs text-[#8B93A1]">در حال پردازش: {currentBrand}</p>}

            {job.status === "running" ? (
              <p className="mt-5 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-950/30 px-4 py-3 text-xs font-semibold leading-6 text-amber-100">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                لطفاً تا پایان عملیات این صفحه را نبندید و آن را به‌روزرسانی نکنید.
              </p>
            ) : (
              <>
                <p className="mt-5 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                  {job.error} موارد واردشده تا این لحظه ذخیره شده‌اند و با ادامه، از همان نقطه ادامه می‌یابد.
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => void run(job)}
                    className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-4 text-sm font-extrabold text-[#07090C] hover:brightness-110"
                  >
                    <RotateCcw className="h-4 w-4" />
                    ادامه
                  </button>
                  <button
                    type="button"
                    onClick={() => setJob({ ...job, status: "stopped", finishedAt: Date.now() })}
                    className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-white/[0.12] px-4 text-sm font-bold text-[#C9CED6] hover:bg-white/[0.04]"
                  >
                    بستن
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
