"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Building2, Crosshair, MapPin, Navigation, PhoneCall, UserRound } from "lucide-react";

import type { BranchMapPoint } from "@/components/maps/BranchesMap";
import { CopyButton } from "@/components/panel/contact/CopyButton";
import type { PublicBranch } from "@/lib/branches";
import { phoneToTelHref } from "@/lib/system-settings-shared";
import { cn, toPersianDigits } from "@/lib/utils";

// Leaflet needs `window`; the map renders on the client only.
const BranchesMap = dynamic(() => import("@/components/maps/BranchesMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-panel-media" />,
});

const pad2 = (n: number) => toPersianDigits(String(n).padStart(2, "0"));

/** Whether the phone/tablet layout (card rail under the map) is active. */
function useIsRailLayout(): boolean {
  const [isRail, setIsRail] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsRail(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return isRail;
}

function BranchCard({
  branch,
  number,
  selected,
  onSelect,
  cardRef,
}: {
  branch: PublicBranch;
  number: number;
  selected: boolean;
  onSelect: () => void;
  cardRef: (el: HTMLElement | null) => void;
}) {
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`;

  return (
    <article
      ref={cardRef}
      data-branch-id={branch.id}
      onClick={(event) => {
        // Links and buttons inside the card do their own thing.
        if ((event.target as HTMLElement).closest("a,button")) return;
        onSelect();
      }}
      className={cn(
        "group relative w-[86%] shrink-0 cursor-pointer overflow-hidden rounded-[24px] border p-4 transition-all duration-300 sm:w-[60%] sm:p-5 lg:w-auto",
        selected
          ? "border-[#FF6A00]/60 bg-gradient-to-bl from-[#FF6A00]/[0.13] via-panel-surface to-panel-surface shadow-[0_18px_44px_-22px_rgba(255,106,0,0.7)]"
          : "border-panel-line/[0.08] bg-panel-surface hover:border-[#FF6A00]/30 hover:bg-panel-surface-2"
      )}
    >
      {/* Accent bar */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-4 start-0 w-1 rounded-e-full bg-[#FF6A00] transition-transform duration-500 ease-out",
          selected ? "scale-y-100" : "scale-y-0"
        )}
      />
      {/* Big faint number */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -bottom-4 end-3 select-none font-mono text-[72px] font-black leading-none transition-colors duration-300",
          selected ? "text-[#FF6A00]/[0.14]" : "text-panel-line/[0.04]"
        )}
      >
        {pad2(number)}
      </span>

      <div className="relative">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black transition-all duration-300",
              selected ? "bg-[#FF6A00] text-[#07090C] shadow-[0_0_24px_rgba(255,106,0,0.5)]" : "bg-[#FF6A00]/10 text-panel-accent"
            )}
          >
            {toPersianDigits(number)}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-extrabold text-panel-text">{branch.title}</h3>
            <p className="mt-1 inline-flex max-w-full items-center gap-1 rounded-full bg-panel-line/[0.05] px-2 py-0.5 text-[11px] font-bold text-panel-muted">
              <MapPin className="h-3 w-3 shrink-0 text-panel-accent" />
              <span className="truncate">
                {branch.provinceName}، {branch.cityName}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onSelect}
            aria-pressed={selected}
            aria-label={`نمایش ${branch.title} روی نقشه`}
            title="نمایش روی نقشه"
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50",
              selected ? "border-[#FF6A00]/50 text-panel-accent" : "border-panel-line/[0.1] text-panel-faint hover:text-panel-accent"
            )}
          >
            <Crosshair className="h-4 w-4" />
          </button>
        </div>

        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex items-center gap-2.5">
            <dt className="sr-only">مدیر شعبه</dt>
            <UserRound className="h-4 w-4 shrink-0 text-panel-faint" />
            <dd className="min-w-0 truncate text-panel-text-2">
              <span className="text-[11px] text-panel-muted">مدیر شعبه: </span>
              <span className="font-bold">{branch.managerName}</span>
            </dd>
          </div>
          {branch.address && (
            <div className="flex items-start gap-2.5">
              <dt className="sr-only">آدرس</dt>
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-panel-faint" />
              <dd className="line-clamp-2 text-[13px] leading-6 text-panel-muted">{toPersianDigits(branch.address)}</dd>
            </div>
          )}
        </dl>

        <div className="mt-4 flex items-center gap-2">
          <a
            href={phoneToTelHref(branch.phone)}
            className="inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-3 text-[#07090C] shadow-orange-subtle transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 active:scale-[0.98]"
          >
            <PhoneCall className="h-4 w-4 shrink-0" />
            <span dir="ltr" className="truncate text-sm font-black">
              {toPersianDigits(branch.phone)}
            </span>
          </a>
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`مسیریابی به ${branch.title}`}
            title="مسیریابی"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-panel-line/[0.1] bg-panel-surface-2 text-panel-muted transition-colors hover:border-[#FF6A00]/40 hover:text-panel-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50"
          >
            <Navigation className="h-4 w-4" />
          </a>
          <CopyButton value={branch.phone} label="کپی شماره شعبه" className="h-10 w-10" />
        </div>
      </div>
    </article>
  );
}

/**
 * Branch finder for the Contact page: province chips, a numbered-pin map and
 * the branch cards, kept in sync. Desktop: list beside a sticky map. Phones:
 * the map on top and a swipeable card rail; the centred card drives the map.
 */
export function BranchesSection({ branches }: { branches: PublicBranch[] }) {
  const [province, setProvince] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isRail = useIsRailLayout();

  const cardRefs = useRef(new Map<string, HTMLElement>());
  const railRef = useRef<HTMLDivElement>(null);
  const userSwipedRef = useRef(false);
  const ignoreObserverUntil = useRef(0);

  // Stable numbering across filters.
  const numberOf = useMemo(() => new Map(branches.map((b, i) => [b.id, i + 1])), [branches]);

  const provinces = useMemo(() => {
    const counts = new Map<number, { id: number; name: string; count: number }>();
    for (const b of branches) {
      const entry = counts.get(b.provinceId) ?? { id: b.provinceId, name: b.provinceName, count: 0 };
      entry.count += 1;
      counts.set(b.provinceId, entry);
    }
    return Array.from(counts.values());
  }, [branches]);

  const visible = useMemo(() => (province ? branches.filter((b) => b.provinceId === province) : branches), [branches, province]);

  const points: BranchMapPoint[] = useMemo(
    () =>
      visible.map((b) => ({
        id: b.id,
        label: toPersianDigits(numberOf.get(b.id) ?? 0),
        title: b.title,
        subtitle: `${b.provinceName}، ${b.cityName}`,
        lat: b.latitude,
        lng: b.longitude,
      })),
    [visible, numberOf]
  );

  const select = useCallback((id: string | null, { scroll = true }: { scroll?: boolean } = {}) => {
    setSelectedId(id);
    if (!id || !scroll) return;
    const card = cardRefs.current.get(id);
    if (!card) return;
    ignoreObserverUntil.current = Date.now() + 900;
    card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, []);

  // Phones: the card centred in the rail (after the user swipes) becomes the selection.
  useEffect(() => {
    const rail = railRef.current;
    if (!isRail || !rail) return;
    const markSwipe = () => {
      userSwipedRef.current = true;
    };
    rail.addEventListener("touchstart", markSwipe, { passive: true });
    rail.addEventListener("pointerdown", markSwipe, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!userSwipedRef.current || Date.now() < ignoreObserverUntil.current) return;
        const best = entries.filter((e) => e.isIntersecting && e.intersectionRatio > 0.75).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = best?.target.getAttribute("data-branch-id");
        if (id) setSelectedId(id);
      },
      { root: rail, threshold: [0.75, 0.95] }
    );
    cardRefs.current.forEach((card) => observer.observe(card));
    return () => {
      observer.disconnect();
      rail.removeEventListener("touchstart", markSwipe);
      rail.removeEventListener("pointerdown", markSwipe);
    };
  }, [isRail, visible]);

  if (branches.length === 0) return null;

  return (
    <section
      aria-labelledby="branches-heading"
      className="panel-card-in relative overflow-hidden rounded-[28px] border border-panel-line/[0.08] bg-panel-surface sm:rounded-[32px]"
    >
      <div className="panel-ambient pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      {/* Header */}
      <div className="relative flex flex-col gap-4 px-5 pb-4 pt-6 sm:flex-row sm:items-end sm:justify-between sm:px-7">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[11px] font-bold text-panel-accent">
            <Building2 className="h-3.5 w-3.5" />
            شبکه شعبه‌های خودرو یاب
          </p>
          <h2 id="branches-heading" className="mt-1.5 text-xl font-black text-panel-text sm:text-2xl">
            نزدیک‌ترین شعبه را پیدا کنید
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 px-3 py-2 text-center backdrop-blur">
            <span className="block text-lg font-black leading-6 text-panel-text">{toPersianDigits(branches.length)}</span>
            <span className="block text-[10px] font-bold text-panel-muted">شعبه</span>
          </span>
          <span className="rounded-2xl border border-panel-line/[0.08] bg-panel-bg/60 px-3 py-2 text-center backdrop-blur">
            <span className="block text-lg font-black leading-6 text-panel-text">{toPersianDigits(provinces.length)}</span>
            <span className="block text-[10px] font-bold text-panel-muted">استان</span>
          </span>
        </div>
      </div>

      {/* Province chips */}
      {provinces.length > 1 && (
        <div className="panel-no-scrollbar relative flex gap-2 overflow-x-auto px-5 pb-4 sm:px-7" role="group" aria-label="فیلتر استان">
          {[{ id: null as number | null, name: "همه", count: branches.length }, ...provinces].map((p) => {
            const active = province === p.id;
            return (
              <button
                key={p.id ?? "all"}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setProvince(p.id);
                  setSelectedId(null);
                  userSwipedRef.current = false;
                  railRef.current?.scrollTo({ left: 0, behavior: "smooth" });
                }}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50",
                  active
                    ? "border-[#FF6A00] bg-[#FF6A00] text-[#07090C] shadow-[0_0_20px_rgba(255,106,0,0.35)]"
                    : "border-panel-line/[0.1] bg-panel-bg/50 text-panel-muted hover:border-[#FF6A00]/40 hover:text-panel-text"
                )}
              >
                {p.name}
                <span className={cn("rounded-full px-1.5 text-[10px]", active ? "bg-[#07090C]/15" : "bg-panel-line/[0.06]")}>
                  {toPersianDigits(p.count)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Map + cards */}
      <div className="relative grid gap-0 border-t border-panel-line/[0.06] lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
        <div className="order-first h-[300px] overflow-hidden sm:h-[360px] lg:order-last lg:h-[600px]">
          <BranchesMap points={points} selectedId={selectedId} onSelect={(id) => select(id)} className="h-full w-full" />
        </div>

        <div
          ref={railRef}
          className={cn(
            "branch-rail panel-scrollbar flex gap-3 overflow-x-auto px-4 py-4",
            "lg:h-[600px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:border-e lg:border-panel-line/[0.06] lg:p-4"
          )}
        >
          {visible.map((branch) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              number={numberOf.get(branch.id) ?? 0}
              selected={branch.id === selectedId}
              onSelect={() => select(branch.id === selectedId ? null : branch.id)}
              cardRef={(el) => {
                if (el) cardRefs.current.set(branch.id, el);
                else cardRefs.current.delete(branch.id);
              }}
            />
          ))}
        </div>
      </div>

      {isRail && visible.length > 1 && (
        <p className="relative px-5 pb-4 text-center text-[11px] text-panel-faint">برای دیدن شعبه‌های دیگر، کارت‌ها را بکشید</p>
      )}
    </section>
  );
}

export default BranchesSection;
