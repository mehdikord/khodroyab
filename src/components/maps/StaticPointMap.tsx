"use client";

import React, { useEffect, useRef, useState } from "react";

import { createMap, loadLeaflet, mapProviderClass, readPanelTheme, setMapTheme, watchPanelTheme } from "@/components/maps/leaflet-setup";
import { cn } from "@/lib/utils";

/**
 * A still (non-interactive) Neshan map centred on one point, for the head
 * office card. The pin is drawn by the parent on top, at the exact centre.
 */
export function StaticPointMap({ lat, lng, zoom = 16, className }: { lat: number; lng: number; zoom?: number; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let cleanup: () => void = () => undefined;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current) return;
        const map = createMap(L, containerRef.current, readPanelTheme(), {
          center: [lat, lng],
          zoom,
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          touchZoom: false,
          boxZoom: false,
          keyboard: false,
        });
        const stopWatchingTheme = watchPanelTheme((theme) => setMapTheme(map, theme));
        const resizeObserver = new ResizeObserver(() => {
          map.invalidateSize();
          map.setView([lat, lng], zoom, { animate: false });
        });
        resizeObserver.observe(containerRef.current);
        map.whenReady(() => !cancelled && setReady(true));
        cleanup = () => {
          stopWatchingTheme();
          resizeObserver.disconnect();
          map.remove();
        };
      })
      .catch(() => undefined); // the card still shows the pin and the "open in" links

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [lat, lng, zoom]);

  return (
    <div
      ref={containerRef}
      dir="ltr"
      aria-hidden="true"
      className={cn("kh-map pointer-events-none transition-opacity duration-700", mapProviderClass, ready ? "opacity-100" : "opacity-0", className)}
    />
  );
}

export default StaticPointMap;
