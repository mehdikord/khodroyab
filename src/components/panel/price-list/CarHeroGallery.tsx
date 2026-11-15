"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Car, ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

import { SafeImage } from "@/components/panel/SafeImage";
import { cn, toPersianDigits } from "@/lib/utils";

interface CarHeroGalleryProps {
  /** The car's catalogue photos (admin uploads), first one is the cover. */
  images: string[];
  /** Accessible name of the car, e.g. "BMW X5". */
  alt: string;
  /** Shown when the car has no photo (or it fails to load), e.g. the large brand logo. */
  fallback: React.ReactNode;
  className?: string;
}

function BrokenThumb() {
  return <Car className="m-auto h-4 w-4 text-panel-faint" aria-hidden="true" />;
}

/**
 * Cover photo of a price-list car with its other photos as small thumbnails
 * on top of it. Tapping the cover or any thumbnail opens a full-screen viewer
 * (arrow keys / buttons to browse, Esc or the backdrop to close).
 */
export function CarHeroGallery({ images, alt, fallback, className }: CarHeroGalleryProps) {
  const [open, setOpen] = useState<number | null>(null);
  const cover = images[0];
  const thumbs = images.slice(1, 5);
  const hiddenCount = Math.max(0, images.length - 5);

  if (!cover) {
    return <div className={cn("relative overflow-hidden rounded-[24px] bg-panel-media", className)}>{fallback}</div>;
  }

  return (
    <>
      <div className={cn("group relative overflow-hidden rounded-[24px] bg-panel-media", className)}>
        <button
          type="button"
          onClick={() => setOpen(0)}
          aria-label={`نمایش بزرگ تصویر ${alt}`}
          className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF6A00]/60"
        >
          <SafeImage
            src={cover}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            fallback={fallback}
          />
        </button>
        {/* Legibility gradient for the thumbnails */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" aria-hidden="true" />
        <span className="pointer-events-none absolute end-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white opacity-80 backdrop-blur transition-opacity group-hover:opacity-100">
          <Expand className="h-3.5 w-3.5" aria-hidden="true" />
        </span>

        {thumbs.length > 0 && (
          <div className="absolute bottom-2.5 start-2.5 flex gap-1.5">
            {thumbs.map((url, index) => {
              const isLast = index === thumbs.length - 1 && hiddenCount > 0;
              return (
                <button
                  key={url}
                  type="button"
                  onClick={() => setOpen(index + 1)}
                  aria-label={`نمایش بزرگ تصویر ${toPersianDigits(index + 2)} از ${toPersianDigits(images.length)}`}
                  className="relative h-10 w-14 overflow-hidden rounded-lg border border-white/40 bg-panel-media shadow-lg transition-all hover:-translate-y-0.5 hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] sm:h-11 sm:w-16"
                >
                  <SafeImage src={url} alt="" loading="lazy" className="h-full w-full object-cover" fallback={<BrokenThumb />} />
                  {isLast && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-[11px] font-black text-white">
                      +{toPersianDigits(hiddenCount)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {open !== null && <Lightbox images={images} alt={alt} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}

function Lightbox({
  images,
  alt,
  index,
  onIndex,
  onClose,
}: {
  images: string[];
  alt: string;
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = images.length;
  const go = useCallback((step: number) => onIndex((index + step + count) % count), [index, count, onIndex]);

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
      if (event.key === "Escape") onClose();
      // RTL: the "next" photo is to the left.
      else if (event.key === "ArrowLeft") go(1);
      else if (event.key === "ArrowRight") go(-1);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [go, onClose]);

  const navButton = "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`تصاویر ${alt}`}
      className="admin-animate-in fixed inset-0 z-[90] flex flex-col bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))] text-white">
        <span className="text-xs font-bold text-white/80">
          {alt} · {toPersianDigits(index + 1)} از {toPersianDigits(count)}
        </span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="بستن" className={navButton}>
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center gap-2 px-2 sm:px-4" onClick={(event) => event.stopPropagation()}>
        {count > 1 && (
          <button type="button" onClick={() => go(-1)} aria-label="تصویر قبلی" className={cn(navButton, "hidden sm:flex")}>
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
        <SafeImage
          key={images[index]}
          src={images[index]}
          alt={`${alt} - تصویر ${toPersianDigits(index + 1)}`}
          className="admin-animate-in max-h-full max-w-full rounded-2xl object-contain"
          fallback={<Car className="h-16 w-16 text-white/40" />}
        />
        {count > 1 && (
          <button type="button" onClick={() => go(1)} aria-label="تصویر بعدی" className={cn(navButton, "hidden sm:flex")}>
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </div>

      {count > 1 && (
        <div
          className="panel-no-scrollbar flex justify-center gap-2 overflow-x-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3"
          onClick={(event) => event.stopPropagation()}
        >
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => onIndex(i)}
              aria-label={`تصویر ${toPersianDigits(i + 1)}`}
              aria-current={i === index}
              className={cn(
                "h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-opacity",
                i === index ? "border-[#FF6A00]" : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <SafeImage src={url} alt="" loading="lazy" className="h-full w-full object-cover" fallback={<BrokenThumb />} />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
