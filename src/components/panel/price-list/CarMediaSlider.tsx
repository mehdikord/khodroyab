"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Camera, Car, ChevronLeft, ChevronRight, Clapperboard, Expand, Play, X } from "lucide-react";

import { SafeImage } from "@/components/panel/SafeImage";
import type { CarMediaItem } from "@/lib/car-media-shared";
import { cn, toPersianDigits } from "@/lib/utils";

interface CarMediaSliderProps {
  /** Photos and videos of the car, in slide order. */
  media: CarMediaItem[];
  /** Accessible name of the car, e.g. "BMW X5". */
  alt: string;
  /** Shown when the car has no media at all. */
  fallback: React.ReactNode;
  className?: string;
}

/** Scroll offset of slide `index` in a full-width snap track (RTL tracks scroll negative). */
function slideOffset(track: HTMLElement, index: number): number {
  const rtl = getComputedStyle(track).direction === "rtl";
  return (rtl ? -1 : 1) * index * track.clientWidth;
}

/**
 * Swipeable gallery of a car's photos and videos: one full-bleed slide at a
 * time (scroll-snap, so touch swiping feels native), dots and a counter,
 * arrows on hover for pointers. Photos open a full-screen viewer; videos play
 * inline with the native controls and pause when swiped away.
 */
export function CarMediaSlider({ media, alt, fallback, className }: CarMediaSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef(new Map<number, HTMLVideoElement>());
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState<number | null>(null);
  const [viewer, setViewer] = useState<number | null>(null);
  const count = media.length;
  const photoCount = media.filter((item) => item.type === "image").length;
  const videoCount = count - photoCount;

  // Track the slide in view.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || count < 2) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { root: track, threshold: 0.6 }
    );
    track.querySelectorAll("[data-index]").forEach((slide) => observer.observe(slide));
    return () => observer.disconnect();
  }, [count]);

  // A video swiped out of view stops playing.
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (index !== active && !video.paused) video.pause();
    });
    if (playing !== null && playing !== active) setPlaying(null);
  }, [active, playing]);

  const goTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;
      const target = (index + count) % count;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({ left: slideOffset(track, target), behavior: reduce ? "auto" : "smooth" });
    },
    [count]
  );

  function playVideo(index: number) {
    const video = videoRefs.current.get(index);
    if (!video) return;
    video.muted = false;
    setPlaying(index);
    void video.play().catch(() => setPlaying(null));
  }

  if (count === 0) {
    return <div className={cn("relative overflow-hidden rounded-[24px] bg-panel-media", className)}>{fallback}</div>;
  }

  const current = media[active];

  return (
    <>
      <div
        className={cn("group/slider relative isolate overflow-hidden rounded-[24px] bg-panel-media", className)}
        role="region"
        aria-roledescription="carousel"
        aria-label={`تصاویر و ویدیوهای ${alt}`}
      >
        <div
          ref={trackRef}
          className="panel-no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {media.map((item, index) => (
            <div
              key={`${item.type}:${item.url}`}
              data-index={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`${toPersianDigits(index + 1)} از ${toPersianDigits(count)}`}
              className="relative h-full w-full shrink-0 snap-center snap-always overflow-hidden"
            >
              {item.type === "image" ? (
                <button
                  type="button"
                  onClick={() => setViewer(index)}
                  aria-label={`نمایش بزرگ تصویر ${toPersianDigits(index + 1)} ${alt}`}
                  className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF6A00]/60"
                >
                  <SafeImage
                    src={item.url}
                    alt={index === 0 ? alt : ""}
                    loading={index === 0 ? "eager" : "lazy"}
                    className={cn(
                      "h-full w-full object-cover transition-transform duration-[1400ms] ease-out motion-reduce:transition-none",
                      active === index ? "scale-100" : "scale-[1.08]"
                    )}
                    fallback={<Car className="m-auto h-10 w-10 text-panel-faint" aria-hidden="true" />}
                  />
                </button>
              ) : (
                <>
                  <video
                    ref={(element) => {
                      if (element) videoRefs.current.set(index, element);
                      else videoRefs.current.delete(index);
                    }}
                    src={`${item.url}#t=0.1`}
                    preload="metadata"
                    playsInline
                    muted
                    controls={playing === index}
                    onPause={() => setPlaying((value) => (value === index ? null : value))}
                    onEnded={() => setPlaying(null)}
                    className="h-full w-full bg-black object-cover"
                    aria-label={`ویدیوی ${alt}`}
                  />
                  {playing !== index && (
                    <button
                      type="button"
                      onClick={() => playVideo(index)}
                      aria-label={`پخش ویدیوی ${alt}`}
                      className="group/play absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/50 via-black/10 to-black/20 focus-visible:outline-none"
                    >
                      <span className="relative flex h-16 w-16 items-center justify-center">
                        <span className="absolute inset-0 rounded-full bg-[#FF6A00]/40 motion-safe:animate-ping" aria-hidden="true" />
                        <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/15 text-white shadow-[0_0_40px_rgba(255,106,0,0.55)] backdrop-blur-md transition-transform group-hover/play:scale-110 group-focus-visible/play:ring-2 group-focus-visible/play:ring-[#FF6A00]">
                          <Play className="h-7 w-7 translate-x-[-1px] fill-current" />
                        </span>
                      </span>
                      <span className="absolute bottom-10 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                        <Clapperboard className="h-3.5 w-3.5" />
                        ویدیوی خودرو
                      </span>
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Overlays (hidden while a video plays so its controls stay usable) */}
        <div className={cn("pointer-events-none absolute inset-0 transition-opacity duration-300", playing !== null && "opacity-0")}>
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/45 to-transparent" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" aria-hidden="true" />

          <div className="absolute end-2.5 top-2.5 flex items-center gap-1.5">
            {count > 1 && (
              <span className="inline-flex h-7 items-center gap-2 rounded-full bg-black/45 px-2.5 text-[10px] font-bold text-white backdrop-blur">
                {photoCount > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Camera className="h-3 w-3" />
                    {toPersianDigits(photoCount)}
                  </span>
                )}
                {videoCount > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Clapperboard className="h-3 w-3" />
                    {toPersianDigits(videoCount)}
                  </span>
                )}
              </span>
            )}
            {current?.type === "image" && (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white opacity-80 backdrop-blur">
                <Expand className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            )}
          </div>

          {count > 1 && (
            <div className={cn("absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5", playing === null && "pointer-events-auto")}>
              {media.map((item, index) => (
                <button
                  key={`${item.type}:${item.url}`}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`${item.type === "video" ? "ویدیو" : "تصویر"} ${toPersianDigits(index + 1)}`}
                  aria-current={active === index}
                  className="flex h-4 items-center"
                >
                  <span
                    className={cn(
                      "block h-1.5 rounded-full transition-all duration-300",
                      active === index ? "w-6 bg-[#FF6A00] shadow-[0_0_10px_rgba(255,106,0,0.8)]" : "w-1.5 bg-white/60 hover:bg-white",
                      item.type === "video" && active !== index && "ring-1 ring-[#FF6A00]"
                    )}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {count > 1 && playing === null && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="اسلاید قبلی"
              className="absolute start-2.5 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur transition-opacity hover:bg-black/65 focus-visible:opacity-100 group-hover/slider:opacity-100 [@media(hover:hover)]:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="اسلاید بعدی"
              className="absolute end-2.5 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur transition-opacity hover:bg-black/65 focus-visible:opacity-100 group-hover/slider:opacity-100 [@media(hover:hover)]:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {viewer !== null && (
        <MediaViewer
          media={media}
          alt={alt}
          index={viewer}
          onIndex={setViewer}
          onClose={(last) => {
            setViewer(null);
            goTo(last);
          }}
        />
      )}
    </>
  );
}

/** Full-screen viewer: photos and videos, arrows / keys / swipe to browse, Esc or backdrop to close. */
function MediaViewer({
  media,
  alt,
  index,
  onIndex,
  onClose,
}: {
  media: CarMediaItem[];
  alt: string;
  index: number;
  onIndex: (index: number) => void;
  onClose: (lastIndex: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const count = media.length;
  const item = media[index];
  const go = useCallback((step: number) => onIndex((index + step + count) % count), [index, count, onIndex]);
  const close = useCallback(() => onClose(index), [onClose, index]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      // RTL: the next slide is to the left.
      else if (event.key === "ArrowLeft") go(1);
      else if (event.key === "ArrowRight") go(-1);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [go, close]);

  const navButton =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`تصاویر و ویدیوهای ${alt}`}
      className="admin-animate-in fixed inset-0 z-[90] flex flex-col bg-black/90 backdrop-blur-sm"
      onClick={close}
    >
      <div className="flex items-center justify-between px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))] text-white">
        <span className="text-xs font-bold text-white/80">
          {alt} · {toPersianDigits(index + 1)} از {toPersianDigits(count)}
        </span>
        <button ref={closeRef} type="button" onClick={close} aria-label="بستن" className={navButton}>
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center gap-2 px-2 sm:px-4"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={(event) => {
          touchX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const start = touchX.current;
          const end = event.changedTouches[0]?.clientX;
          touchX.current = null;
          if (start === null || end === undefined || Math.abs(end - start) < 50 || count < 2) return;
          // RTL: dragging to the right brings in the next slide (from the left).
          go(end > start ? 1 : -1);
        }}
      >
        {count > 1 && (
          <button type="button" onClick={() => go(-1)} aria-label="قبلی" className={cn(navButton, "hidden sm:flex")}>
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
        {item.type === "image" ? (
          <SafeImage
            key={item.url}
            src={item.url}
            alt={`${alt} - تصویر ${toPersianDigits(index + 1)}`}
            className="admin-animate-in max-h-full max-w-full rounded-2xl object-contain"
            fallback={<Car className="h-16 w-16 text-white/40" />}
          />
        ) : (
          <video
            key={item.url}
            src={item.url}
            controls
            autoPlay
            playsInline
            className="admin-animate-in max-h-full max-w-full rounded-2xl bg-black"
            aria-label={`ویدیوی ${alt}`}
          />
        )}
        {count > 1 && (
          <button type="button" onClick={() => go(1)} aria-label="بعدی" className={cn(navButton, "hidden sm:flex")}>
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </div>

      {count > 1 && (
        <div
          className="panel-no-scrollbar flex justify-center gap-2 overflow-x-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3"
          onClick={(event) => event.stopPropagation()}
        >
          {media.map((entry, i) => (
            <button
              key={`${entry.type}:${entry.url}`}
              type="button"
              onClick={() => onIndex(i)}
              aria-label={`${entry.type === "video" ? "ویدیو" : "تصویر"} ${toPersianDigits(i + 1)}`}
              aria-current={i === index}
              className={cn(
                "relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white/5 transition-opacity",
                i === index ? "border-[#FF6A00]" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              {entry.type === "image" ? (
                <SafeImage src={entry.url} alt="" loading="lazy" className="h-full w-full object-cover" fallback={<Car className="m-auto h-4 w-4 text-white/40" />} />
              ) : (
                <>
                  <video src={`${entry.url}#t=0.1`} preload="metadata" muted playsInline className="h-full w-full object-cover" aria-hidden="true" tabIndex={-1} />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/35 text-white">
                    <Play className="h-4 w-4 fill-current" />
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
