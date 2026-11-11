"use client";

import React, { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import { Loader2, Maximize2 } from "lucide-react";

import {
  createMap,
  IRAN_CENTER,
  IRAN_ZOOM,
  loadLeaflet,
  mapProviderClass,
  pinIcon,
  readPanelTheme,
  setMapTheme,
  watchPanelTheme,
  type LeafletModule,
} from "@/components/maps/leaflet-setup";
import { cn } from "@/lib/utils";

export interface BranchMapPoint {
  id: string;
  /** Text inside the pin (the branch's number). */
  label: string;
  title: string;
  subtitle: string;
  lat: number;
  lng: number;
}

interface BranchesMapProps {
  points: BranchMapPoint[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  className?: string;
}

const FOCUS_ZOOM = 15;

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/**
 * Every branch as a numbered pin. Selecting a branch (pin or card) flies the
 * map to it and lifts its pin; clearing the selection frames all branches again.
 */
export function BranchesMap({ points, selectedId, onSelect, className }: BranchesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const markersRef = useRef(new Map<string, Leaflet.Marker>());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;
    const markers = markersRef.current;

    let stopWatchingTheme: () => void = () => undefined;

    loadLeaflet().catch(() => {
      if (!cancelled) setFailed(true);
      return null;
    }).then((L) => {
      if (!L || cancelled || !containerRef.current) return;
      leafletRef.current = L;
      const map = createMap(L, containerRef.current, readPanelTheme(), {
        center: IRAN_CENTER,
        zoom: IRAN_ZOOM,
        // Page scroll must not get trapped by the map on touch devices / trackpads.
        scrollWheelZoom: false,
        zoomControl: true,
      });
      stopWatchingTheme = watchPanelTheme((theme) => setMapTheme(map, theme));
      map.on("focus", () => map.scrollWheelZoom.enable());
      map.on("blur", () => map.scrollWheelZoom.disable());
      mapRef.current = map;
      resizeObserver = new ResizeObserver(() => map.invalidateSize());
      resizeObserver.observe(containerRef.current);
      setReady(true);
    });

    return () => {
      cancelled = true;
      stopWatchingTheme();
      resizeObserver?.disconnect();
      markers.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // (Re)build the pins whenever the visible set changes, then frame them.
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    points.forEach((point, index) => {
      const marker = L.marker([point.lat, point.lng], {
        icon: pinIcon(L, { label: point.label }),
        title: point.title,
        riseOnHover: true,
        keyboard: true,
      });
      marker.bindPopup(
        `<strong style="font-weight:800">${escapeHtml(point.title)}</strong><br/><span style="opacity:.7">${escapeHtml(point.subtitle)}</span>`,
        { closeButton: false, autoPan: true, offset: [0, -4] }
      );
      marker.on("click", () => onSelectRef.current(point.id));
      // Stagger the drop-in a little.
      marker.on("add", () => {
        const el = marker.getElement()?.querySelector<HTMLElement>(".kh-pin");
        if (el) el.style.animationDelay = `${Math.min(index, 12) * 60}ms`;
      });
      marker.addTo(map);
      markersRef.current.set(point.id, marker);
    });
    // Framing happens in the selection effect below (it also runs on `points` changes).
  }, [points, ready]);

  // Highlight + fly to the selected branch, or frame them all.
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!ready || !L || !map) return;

    points.forEach((point) => {
      const marker = markersRef.current.get(point.id);
      if (!marker) return;
      const active = point.id === selectedId;
      // Toggle the class instead of `setIcon`, which would rebuild the pin and replay its drop-in.
      marker.getElement()?.querySelector(".kh-pin")?.classList.toggle("is-active", active);
      marker.setZIndexOffset(active ? 1000 : 0);
    });

    const selected = points.find((p) => p.id === selectedId);
    if (selected) {
      map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), FOCUS_ZOOM), { duration: 1.1 });
      const marker = markersRef.current.get(selected.id);
      map.once("moveend", () => marker?.openPopup());
    } else {
      map.closePopup();
      if (points.length > 0) {
        map.flyToBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number])), { padding: [56, 56], maxZoom: 13, duration: 0.9 });
      }
    }
  }, [selectedId, points, ready]);

  return (
    <div className={className}>
      <div className="relative h-full w-full">
        <div ref={containerRef} dir="ltr" className={cn("kh-map h-full w-full", mapProviderClass)} aria-label="نقشه شعبه‌ها" />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-panel-media px-6 text-center">
            {failed ? (
              <p className="text-xs leading-6 text-panel-muted">نقشه بارگذاری نشد؛ اتصال اینترنت را بررسی کنید.</p>
            ) : (
              <Loader2 className="h-6 w-6 animate-spin text-panel-accent" />
            )}
          </div>
        )}
        {ready && selectedId && points.length > 1 && (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="absolute bottom-3 left-1/2 z-[500] inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-panel-line/[0.12] bg-panel-surface/90 px-4 py-2 text-xs font-bold text-panel-text shadow-lg backdrop-blur transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/60"
          >
            <Maximize2 className="h-3.5 w-3.5 text-panel-accent" />
            نمایش همه شعبه‌ها
          </button>
        )}
      </div>
    </div>
  );
}

export default BranchesMap;
