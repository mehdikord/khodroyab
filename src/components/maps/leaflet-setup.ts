"use client";

import type * as Leaflet from "leaflet";

/*
 * Shared map bits (admin branch picker, Contact page maps), on the Neshan web
 * SDK: Neshan's build of Leaflet 1.9.4, loaded from Neshan's CDN at runtime,
 * which adds Neshan tiles to `L.Map` via the `key` / `maptype` options.
 * Docs: https://platform.neshan.org/docs/sdk/web/leaflet/neshan-leaflet-sdk/
 *
 * The key comes from NEXT_PUBLIC_NESHAN_MAP_KEY. Without it the maps fall back
 * to plain CARTO/OpenStreetMap tiles so they still render in development.
 */

export type LeafletModule = typeof Leaflet;

const NESHAN_SDK = "https://static.neshan.org/sdk/leaflet/v1.9.4/neshan-sdk/v1.0.8";
const NESHAN_KEY = process.env.NEXT_PUBLIC_NESHAN_MAP_KEY ?? "";

/** Neshan styles: light ("dreamy") and dark ("standard-night"). */
export type MapTheme = "light" | "dark";
const NESHAN_MAPTYPE: Record<MapTheme, string> = { light: "dreamy", dark: "standard-night" };

export const hasNeshanKey = NESHAN_KEY.length > 0;

/** Extra CSS class for the map container: the dark-tile filter only applies to the fallback tiles. */
export const mapProviderClass = hasNeshanKey ? "kh-map--neshan" : "kh-map--fallback";

let leafletPromise: Promise<LeafletModule> | null = null;

function injectOnce<T extends HTMLElement>(id: string, create: () => T): T {
  const existing = document.getElementById(id) as T | null;
  if (existing) return existing;
  const el = create();
  el.id = id;
  document.head.appendChild(el);
  return el;
}

/** Load the Neshan SDK (CSS + script) once and resolve with its global `L`. */
export function loadLeaflet(): Promise<LeafletModule> {
  leafletPromise ??= new Promise<LeafletModule>((resolve, reject) => {
    const w = window as unknown as { L?: LeafletModule };
    injectOnce("neshan-sdk-css", () => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `${NESHAN_SDK}/index.css`;
      return link;
    });
    if (w.L?.Map) {
      resolve(w.L);
      return;
    }
    const script = injectOnce("neshan-sdk-js", () => {
      const s = document.createElement("script");
      s.src = `${NESHAN_SDK}/index.js`;
      s.async = true;
      return s;
    });
    script.addEventListener("load", () => (w.L?.Map ? resolve(w.L) : reject(new Error("Neshan SDK loaded without L"))));
    script.addEventListener("error", () => reject(new Error("Neshan SDK failed to load")));
  }).catch((error) => {
    leafletPromise = null; // allow a retry on the next mount
    throw error;
  });
  return leafletPromise;
}

/** Roughly the centre of Iran, for an empty map. */
export const IRAN_CENTER: [number, number] = [32.4, 53.7];
export const IRAN_ZOOM = 5;

/**
 * Create a map with Neshan tiles (or the fallback tiles when no key is set).
 * `options` are regular Leaflet map options.
 */
export function createMap(L: LeafletModule, el: HTMLElement, theme: MapTheme, options: Leaflet.MapOptions): Leaflet.Map {
  if (hasNeshanKey) {
    const neshanOptions = { ...options, key: NESHAN_KEY, maptype: NESHAN_MAPTYPE[theme] } as Leaflet.MapOptions;
    return new L.Map(el, neshanOptions);
  }
  const map = new L.Map(el, options);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    subdomains: "abcd",
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }).addTo(map);
  return map;
}

/** Switch a Neshan map between its light and dark style (no-op for the fallback tiles, which CSS recolours). */
export function setMapTheme(map: Leaflet.Map, theme: MapTheme) {
  const neshan = map as Leaflet.Map & { setMapType?: (type: string) => void };
  if (hasNeshanKey && typeof neshan.setMapType === "function") neshan.setMapType(NESHAN_MAPTYPE[theme]);
}

/** Current customer-panel theme (the admin panel is always dark). */
export function readPanelTheme(): MapTheme {
  const root = document.querySelector(".panel-root");
  if (!root) return "dark";
  return root.getAttribute("data-theme") === "light" ? "light" : "dark";
}

/** Call `onChange` whenever the panel theme toggles. Returns a cleanup function. */
export function watchPanelTheme(onChange: (theme: MapTheme) => void): () => void {
  const root = document.querySelector(".panel-root");
  if (!root) return () => undefined;
  const observer = new MutationObserver(() => onChange(readPanelTheme()));
  observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/** Orange teardrop pin; `label` (e.g. a Persian number) sits in its head. */
export function pinIcon(L: LeafletModule, { label = "", active = false }: { label?: string; active?: boolean } = {}) {
  const safe = label.replace(/[<>&"']/g, "");
  return L.divIcon({
    className: "kh-pin-wrap",
    html: `<div class="kh-pin${active ? " is-active" : ""}"><span class="kh-pin-pulse"></span><span class="kh-pin-head"><span class="kh-pin-label">${safe}</span></span><span class="kh-pin-dot"></span></div>`,
    iconSize: [40, 52],
    iconAnchor: [20, 50],
    popupAnchor: [0, -46],
  });
}
