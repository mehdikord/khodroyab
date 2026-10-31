"use client";

import React, { useState } from "react";
import { Car } from "lucide-react";

import { SafeImage } from "@/components/panel/SafeImage";
import { cn } from "@/lib/utils";

function NoImage() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="admin-grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative flex flex-col items-center gap-2 text-panel-faint">
        <Car className="h-12 w-12" strokeWidth={1.5} />
        <span className="text-xs font-semibold">بدون تصویر</span>
      </div>
    </div>
  );
}

/** Large photo with a thumbnail strip; the primary photo comes first. */
export function AdGallery({ urls, alt }: { urls: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = urls[activeIndex];

  return (
    <div className="space-y-2">
      <div className="aspect-[16/10] overflow-hidden rounded-3xl bg-panel-media">
        {active ? <SafeImage key={active} src={active} alt={alt} className="h-full w-full object-cover" fallback={<NoImage />} /> : <NoImage />}
      </div>
      {urls.length > 1 && (
        <div className="panel-no-scrollbar flex gap-2 overflow-x-auto">
          {urls.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`نمایش تصویر ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 bg-panel-media transition-opacity",
                index === activeIndex ? "border-[#FF6A00]" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <SafeImage src={url} alt="" loading="lazy" className="h-full w-full object-cover" fallback={<Car className="m-auto h-5 w-5 text-panel-faint" />} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
