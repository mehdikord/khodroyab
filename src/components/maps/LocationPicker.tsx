"use client";

import React, { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { Crosshair, Loader2, MousePointerClick, X } from "lucide-react";

import { createMap, IRAN_CENTER, IRAN_ZOOM, loadLeaflet, mapProviderClass, pinIcon, type LeafletModule } from "@/components/maps/leaflet-setup";
import { formatGeoPoint, parseGeoPoint, type GeoPoint } from "@/lib/system-settings-shared";
import { cn } from "@/lib/utils";

interface LocationPickerProps {
  value: GeoPoint | null;
  onChange: (value: GeoPoint | null) => void;
  /**
   * A place to look up (e.g. "city, province") when no point is set yet:
   * the map flies there so the admin starts near the right spot.
   */
  focusQuery?: string;
  disabled?: boolean;
  hasError?: boolean;
}

const PICK_ZOOM = 16;

/**
 * Pick a point on a map: click/tap to drop the pin, drag it to fine-tune, use
 * the device location, or paste coordinates / a Google Maps link.
 */
export function LocationPicker({ value, onChange, focusQuery, disabled, hasError }: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const markerRef = useRef<Leaflet.Marker | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const valueRef = useRef(value);
  valueRef.current = value;

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coordsText, setCoordsText] = useState(value ? formatGeoPoint(value).replace(",", ", ") : "");
  const [coordsError, setCoordsError] = useState(false);

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;

    loadLeaflet().catch(() => {
      if (!cancelled) setFailed(true);
      return null;
    }).then((L) => {
      if (!L) return;
      if (cancelled || !containerRef.current) return;
      leafletRef.current = L;
      const start = valueRef.current;
      const map = createMap(L, containerRef.current, "dark", {
        center: start ? [start.lat, start.lng] : IRAN_CENTER,
        zoom: start ? PICK_ZOOM : IRAN_ZOOM,
        zoomControl: true,
        attributionControl: true,
      });
      map.on("click", (event: Leaflet.LeafletMouseEvent) => {
        onChangeRef.current({ lat: event.latlng.lat, lng: event.latlng.lng });
      });
      mapRef.current = map;

      // The modal animates in; keep tiles aligned with the final size.
      resizeObserver = new ResizeObserver(() => map.invalidateSize());
      resizeObserver.observe(containerRef.current);
      setReady(true);
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Keep the marker (and the coordinates field) in sync with `value`.
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map) return;

    if (!value) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }

    const latLng: [number, number] = [value.lat, value.lng];
    if (!markerRef.current) {
      const marker = L.marker(latLng, { icon: pinIcon(L, { active: true }), draggable: true, autoPan: true, keyboard: false });
      marker.on("dragend", () => {
        const { lat, lng } = marker.getLatLng();
        onChangeRef.current({ lat, lng });
      });
      marker.addTo(map);
      markerRef.current = marker;
    } else {
      markerRef.current.setLatLng(latLng);
    }
    if (!map.getBounds().pad(-0.15).contains(latLng)) {
      map.flyTo(latLng, Math.max(map.getZoom(), PICK_ZOOM - 2), { duration: 0.8 });
    }
    setCoordsText(formatGeoPoint(value).replace(",", ", "));
    setCoordsError(false);
  }, [value, ready]);

  useEffect(() => {
    if (markerRef.current?.dragging) {
      if (disabled) markerRef.current.dragging.disable();
      else markerRef.current.dragging.enable();
    }
  }, [disabled, value]);

  // Fly to the chosen city while no point has been picked yet.
  useEffect(() => {
    const query = focusQuery?.trim();
    if (!ready || !query || valueRef.current) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=ir&accept-language=fa&q=${encodeURIComponent(query)}`;
        const response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
        if (!response.ok) return;
        const [hit] = (await response.json()) as { lat: string; lon: string }[];
        if (hit && !valueRef.current) mapRef.current?.flyTo([Number(hit.lat), Number(hit.lon)], 12, { duration: 1.1 });
      } catch {
        // Lookup is a convenience only; the admin can still pan to the spot.
      }
    }, 400);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [focusQuery, ready]);

  function locateMe() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        const point = { lat: position.coords.latitude, lng: position.coords.longitude };
        onChange(point);
        mapRef.current?.flyTo([point.lat, point.lng], PICK_ZOOM, { duration: 1 });
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function applyCoordsText(text: string) {
    if (!text.trim()) {
      setCoordsError(false);
      return;
    }
    const point = parseGeoPoint(text);
    setCoordsError(!point);
    if (point) {
      onChange(point);
      mapRef.current?.flyTo([point.lat, point.lng], PICK_ZOOM, { duration: 0.9 });
    }
  }

  return (
    <div className="space-y-2.5">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border transition-colors",
          hasError ? "border-red-500/50" : "border-white/[0.12]",
          disabled && "pointer-events-none opacity-70"
        )}
      >
        <div ref={containerRef} dir="ltr" className={cn("kh-map h-[280px] w-full sm:h-[320px]", mapProviderClass)} />

        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0b0e13] px-6 text-center">
            {failed ? (
              <p className="text-xs leading-6 text-[#8B93A1]">نقشه بارگذاری نشد. اتصال اینترنت را بررسی کنید؛ مختصات را می‌توانید در کادر زیر وارد کنید.</p>
            ) : (
              <Loader2 className="h-6 w-6 animate-spin text-[#FF8A2A]" />
            )}
          </div>
        )}

        {/* Hint */}
        {ready && !value && (
          <div className="pointer-events-none absolute inset-x-0 top-3 z-[500] flex justify-center px-3">
            <span className="admin-animate-in inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#07090C]/85 px-3 py-1.5 text-[11px] font-bold text-[#F5F5F5] shadow-lg backdrop-blur">
              <MousePointerClick className="h-3.5 w-3.5 text-[#FF8A2A]" />
              روی محل شعبه در نقشه کلیک کنید
            </span>
          </div>
        )}

        {/* Map tools */}
        <div className="absolute bottom-3 right-3 z-[500] flex flex-col gap-2">
          <button
            type="button"
            onClick={locateMe}
            disabled={disabled || locating}
            title="موقعیت فعلی من"
            aria-label="استفاده از موقعیت فعلی من"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0D1117]/90 text-[#F5F5F5] shadow-lg backdrop-blur transition-colors hover:bg-[#FF6A00] hover:text-[#07090C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/60 disabled:opacity-60"
          >
            {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setCoordsText("");
              }}
              disabled={disabled}
              title="حذف موقعیت"
              aria-label="حذف موقعیت انتخاب‌شده"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0D1117]/90 text-[#F5F5F5] shadow-lg backdrop-blur transition-colors hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          dir="ltr"
          value={coordsText}
          onChange={(e) => {
            setCoordsText(e.target.value);
            setCoordsError(false);
          }}
          onBlur={(e) => applyCoordsText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              applyCoordsText(e.currentTarget.value);
            }
          }}
          placeholder="35.6997, 51.3380"
          aria-label="مختصات شعبه (عرض، طول جغرافیایی)"
          disabled={disabled}
          className={cn(
            "h-10 min-w-0 flex-1 rounded-xl border bg-[#07090C] px-3 text-left font-mono text-xs text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
            coordsError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20"
          )}
        />
      </div>
      <p className={cn("text-[11px] leading-5", coordsError ? "text-red-400" : "text-[#5E6672]")}>
        {coordsError
          ? "مختصات معتبر نیست؛ مثلاً: 35.6997, 51.3380"
          : "پین را می‌توانید بکشید و جابه‌جا کنید. مختصات یا لینک گوگل مپ را هم می‌توانید در کادر بالا وارد کنید."}
      </p>
    </div>
  );
}

export default LocationPicker;
