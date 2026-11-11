import React from "react";
import { ArrowUpLeft, Clock, MapPin, Navigation, Phone, PhoneCall } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { StaticPointMap } from "@/components/maps/StaticPointMap";
import { BranchesSection } from "@/components/panel/contact/BranchesSection";
import { CopyButton } from "@/components/panel/contact/CopyButton";
import type { PublicBranch } from "@/lib/branches";
import { InstagramIcon, TelegramIcon, WhatsappIcon } from "@/components/panel/contact/BrandIcons";
import { formatPostalCode, parseGeoPoint, phoneToTelHref, type GeoPoint } from "@/lib/system-settings-shared";
import { cn, toPersianDigits } from "@/lib/utils";

export interface ContactInfo {
  phone: string;
  postalCode: string;
  address: string;
  telegram: string;
  whatsapp: string;
  instagram: string;
  /** "lat,lng" or empty. */
  location: string;
}

/* ───────────── Social channels ───────────── */

type SocialKind = "telegram" | "whatsapp" | "instagram";

interface SocialChannel {
  kind: SocialKind;
  href: string;
  label: string;
  /** Handle or number shown under the label; null when the link has none (e.g. an invite link). */
  handle: string | null;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
  /** Brand fill of the icon chip. */
  chip: string;
  /** Brand glow on hover. */
  glow: string;
}

function handleOf(kind: SocialKind, href: string): string | null {
  try {
    const url = new URL(href);
    const segments = url.pathname.split("/").filter(Boolean);
    if (kind === "whatsapp") {
      return url.hostname === "wa.me" && /^\d+$/.test(segments[0] ?? "") ? `+${segments[0]}` : null;
    }
    const [first] = segments;
    return segments.length === 1 && first && !first.startsWith("+") ? `@${first}` : null;
  } catch {
    return null;
  }
}

function buildChannels(info: ContactInfo): SocialChannel[] {
  const all: Omit<SocialChannel, "handle">[] = [
    {
      kind: "telegram",
      href: info.telegram,
      label: "تلگرام",
      icon: TelegramIcon,
      chip: "bg-[#229ED9]",
      glow: "hover:shadow-[0_18px_40px_-18px_rgba(34,158,217,0.75)] hover:border-[#229ED9]/50",
    },
    {
      kind: "whatsapp",
      href: info.whatsapp,
      label: "واتس‌اپ",
      icon: WhatsappIcon,
      chip: "bg-[#25D366]",
      glow: "hover:shadow-[0_18px_40px_-18px_rgba(37,211,102,0.75)] hover:border-[#25D366]/50",
    },
    {
      kind: "instagram",
      href: info.instagram,
      label: "اینستاگرام",
      icon: InstagramIcon,
      chip: "bg-[radial-gradient(circle_at_30%_110%,#FDCB52_0%,#F56040_35%,#DD2A7B_60%,#8134AF_90%)]",
      glow: "hover:shadow-[0_18px_40px_-18px_rgba(221,42,123,0.75)] hover:border-[#DD2A7B]/50",
    },
  ];
  return all.filter((c) => c.href).map((c) => ({ ...c, handle: handleOf(c.kind, c.href) }));
}

/* ───────────── Hero: signal scene ───────────── */

interface OrbitBadge {
  key: string;
  icon: LucideIcon | SocialChannel["icon"];
  chip: string;
}

/** Radar sweep, sonar rings and the contact channels orbiting a ringing handset. Decorative. */
function SignalScene({ badges }: { badges: OrbitBadge[] }) {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-[210px] [--r:92px] sm:w-[250px] sm:[--r:110px] md:w-[300px] md:[--r:134px]"
    >
      {/* Static guide rings */}
      <div className="absolute inset-0 rounded-full border border-white/[0.07]" />
      <div className="contact-orbit-dash absolute inset-[14%] rounded-full border border-dashed border-[#FF6A00]/25" />
      <div className="absolute inset-[30%] rounded-full border border-white/[0.08]" />

      {/* Radar sweep */}
      <div className="contact-sweep absolute inset-0 rounded-full" />

      {/* Sonar pulses */}
      {["0s", "1.2s", "2.4s"].map((delay) => (
        <span
          key={delay}
          className="contact-sonar absolute inset-[18%] rounded-full border-2 border-[#FF6A00]/60"
          style={{ animationDelay: delay }}
        />
      ))}

      {/* Core */}
      <div className="contact-pop absolute inset-[34%] flex items-center justify-center rounded-full bg-gradient-to-br from-[#FF8A2A] to-[#FF5A00] text-[#07090C] shadow-[0_0_60px_rgba(255,106,0,0.55),inset_0_1px_0_rgba(255,255,255,0.45)]">
        <Phone className="contact-ring h-[42%] w-[42%]" strokeWidth={2.2} />
      </div>

      {/* Orbiting channels */}
      <div className="contact-orbit absolute inset-0">
        {badges.map((badge, index) => {
          const angle = (360 / badges.length) * index - 90;
          const Icon = badge.icon;
          return (
            <div
              key={badge.key}
              className="absolute left-1/2 top-1/2 -ml-5 -mt-5 h-10 w-10 sm:-ml-[22px] sm:-mt-[22px] sm:h-11 sm:w-11"
              style={{ transform: `rotate(${angle}deg) translateX(var(--r)) rotate(${-angle}deg)` }}
            >
              <div className="contact-orbit-upright h-full w-full">
                <span
                  className={cn(
                    "contact-pop flex h-full w-full items-center justify-center rounded-2xl text-white shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)] ring-1 ring-white/20",
                    badge.chip
                  )}
                  style={{ animationDelay: `${0.5 + index * 0.12}s` }}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────── Map ───────────── */

/** Minimal location card: a still Neshan map, a custom pin at the exact centre and two "open in" links. */
function MapCard({ point, address, style }: { point: GeoPoint; address: string; style?: React.CSSProperties }) {
  const coords = `${point.lat},${point.lng}`;
  const googleHref = `https://www.google.com/maps/dir/?api=1&destination=${coords}`;
  const neshanHref = `https://neshan.org/maps/@${coords},16z,0p`;

  return (
    <section
      aria-label="موقعیت دفتر روی نقشه"
      className="panel-card-in group relative overflow-hidden rounded-[26px] border border-panel-line/[0.08] bg-panel-surface"
      style={style}
    >
      <div className="relative h-[220px] overflow-hidden bg-panel-media sm:h-[260px] lg:h-full lg:min-h-[260px]">
        {/* Still map (no panning), so the pin drawn below stays exactly on the office */}
        <StaticPointMap
          lat={point.lat}
          lng={point.lng}
          className="absolute inset-[-40px] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {/* Edge fade into the card + soft brand tint */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_50%,transparent_40%,rgb(var(--p-surface))_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[#FF6A00]/[0.05] mix-blend-multiply" />

        {/* Pin */}
        <div className="pointer-events-none absolute left-1/2 top-1/2">
          <span className="contact-pin-pulse absolute -left-5 -top-5 h-10 w-10 rounded-full bg-[#FF6A00]/45" />
          <span className="absolute -left-[5px] -top-[5px] h-2.5 w-2.5 rounded-full bg-[#FF6A00] ring-4 ring-[#FF6A00]/25" />
          {/* Drop animation on the wrapper; the teardrop inside keeps its own rotation */}
          <span className="contact-pin-drop absolute -left-[18px] -top-[50px] block h-9 w-9">
            <span className="flex h-9 w-9 rotate-45 items-center justify-center rounded-full rounded-br-none bg-gradient-to-br from-[#FF8A2A] to-[#FF5A00] text-[#07090C] shadow-[0_10px_24px_-6px_rgba(255,106,0,0.7)]">
              <MapPin className="h-4 w-4 -rotate-45" strokeWidth={2.4} />
            </span>
          </span>
        </div>

        {/* Open-in links */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2">
          <a
            href={googleHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-panel-text px-3 text-xs font-extrabold text-panel-bg shadow-lg transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/60 active:scale-[0.98]"
          >
            <Navigation className="h-3.5 w-3.5" />
            مسیریابی
          </a>
          <a
            href={neshanHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-panel-line/[0.12] bg-panel-surface/90 px-4 text-xs font-bold text-panel-text-2 shadow-lg backdrop-blur transition-transform hover:-translate-y-0.5 hover:text-panel-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/60 active:scale-[0.98]"
          >
            نشان
            <ArrowUpLeft className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
      {address && <span className="sr-only">{address}</span>}
    </section>
  );
}

/* ───────────── View ───────────── */

/**
 * "Contact us": every detail comes from the system settings. A dark signal-scene
 * hero carries the call-to-action (the phone number); below it the address +
 * postal code, the social channels and a minimal map, then the branch finder.
 * Blocks with no data are hidden.
 */
export function ContactView({ info, branches = [] }: { info: ContactInfo; branches?: PublicBranch[] }) {
  const channels = buildChannels(info);
  const point = info.location ? parseGeoPoint(info.location) : null;
  const hasPlace = Boolean(info.address || info.postalCode);
  const hasAnything = Boolean(info.phone || hasPlace || channels.length || point);

  const badges: OrbitBadge[] = [
    ...channels.map((c) => ({ key: c.kind, icon: c.icon, chip: c.chip })),
    ...(hasPlace || point ? [{ key: "place", icon: MapPin, chip: "bg-[#1B212B]" }] : []),
  ];
  if (badges.length < 2) badges.push({ key: "hours", icon: Clock, chip: "bg-[#1B212B]" });

  let delay = 0.15;
  const nextDelay = () => ({ animationDelay: `${(delay += 0.08).toFixed(2)}s` });

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden rounded-[28px] border border-panel-line/[0.1] bg-[#05070A] sm:rounded-[36px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[radial-gradient(60%_80%_at_20%_50%,rgba(255,106,0,0.22),transparent_65%),radial-gradient(50%_60%_at_100%_0%,rgba(255,138,42,0.10),transparent_60%),linear-gradient(to_bottom,#080B11,#05070A)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-70 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(80%_80%_at_50%_50%,#000,transparent)]"
        />

        <div className="grid items-center gap-2 px-5 pb-7 pt-6 sm:px-8 sm:pb-9 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-6 md:px-10 md:py-10">
          {/* Scene first on phones so the hero reads as a picture, then the call-to-action */}
          <div className="order-first md:order-last">
            <SignalScene badges={badges} />
          </div>

          <div className="text-center md:text-start">
            <div className="contact-rise inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-bold text-white/70 backdrop-blur">
              <span className="contact-live h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              آماده پاسخگویی به شما
            </div>

            <h1
              className="contact-rise mt-3 text-[2rem] font-black leading-[1.25] tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.2]"
              style={{ animationDelay: "0.08s" }}
            >
              تماس با <span className="text-[#FF7A1A]">خودرو یاب</span>
            </h1>
            <p
              className="contact-rise mx-auto mt-3 max-w-md text-sm leading-7 text-white/65 sm:text-base sm:leading-8 md:mx-0"
              style={{ animationDelay: "0.16s" }}
            >
              {hasAnything
                ? "سؤال، پیشنهاد یا نیاز به مشاوره دارید؟ از هر راهی که راحت‌ترید با ما در ارتباط باشید."
                : "اطلاعات تماس به‌زودی در این صفحه قرار می‌گیرد."}
            </p>

            {info.phone && (
              <div
                className="contact-rise mt-6 flex items-stretch justify-center gap-2 md:justify-start"
                style={{ animationDelay: "0.26s" }}
              >
                <a
                  href={phoneToTelHref(info.phone)}
                  className="group/call relative inline-flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] py-2.5 pe-5 ps-2.5 text-[#07090C] shadow-[0_0_36px_rgba(255,106,0,0.4)] transition-all hover:shadow-[0_0_48px_rgba(255,106,0,0.6)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6A00]/40 active:scale-[0.98]"
                >
                  {/* Shine sweep on hover */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/30 opacity-0 transition-all duration-700 group-hover/call:left-[120%] group-hover/call:opacity-100"
                  />
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#07090C]/15">
                    <PhoneCall className="contact-ring h-5 w-5" strokeWidth={2.3} />
                  </span>
                  <span className="min-w-0 text-start">
                    <span className="block text-[11px] font-bold opacity-75">تماس مستقیم</span>
                    <span dir="ltr" className="block truncate text-lg font-black tracking-wide sm:text-xl">
                      {toPersianDigits(info.phone)}
                    </span>
                  </span>
                </a>
                <CopyButton
                  value={info.phone}
                  label="کپی شماره تماس"
                  className="h-auto w-12 rounded-2xl border-white/10 bg-white/[0.05] text-white/70 hover:text-white"
                />
              </div>
            )}

            {channels.length > 0 && (
              <div
                className="contact-rise mt-5 flex items-center justify-center gap-2 md:justify-start"
                style={{ animationDelay: "0.34s" }}
              >
                {channels.map((c) => (
                  <a
                    key={c.kind}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={c.label}
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-2xl text-white ring-1 ring-white/15 transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 active:scale-95",
                      c.chip
                    )}
                  >
                    <c.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Details ── */}
      {(hasPlace || point) && (
        <div className={cn("grid gap-4 sm:gap-5", hasPlace && point && "lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]")}>
          {hasPlace && (
            <section
              aria-label="آدرس دفتر"
              className="panel-card-in relative overflow-hidden rounded-[26px] border border-panel-line/[0.08] bg-panel-surface p-5 sm:p-6"
              style={nextDelay()}
            >
              <div aria-hidden="true" className="pointer-events-none absolute -end-16 -top-16 h-40 w-40 rounded-full bg-[#FF6A00]/10 blur-3xl" />
              <div className="relative flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FF6A00]/10 text-panel-accent ring-1 ring-[#FF6A00]/20">
                  <MapPin className="h-5 w-5" />
                </span>
                <h2 className="text-base font-extrabold text-panel-text">آدرس دفتر</h2>
              </div>

              {info.address && (
                <div className="relative mt-4 flex items-start gap-2">
                  <p className="min-w-0 flex-1 whitespace-pre-line break-words text-sm leading-8 text-panel-text-2 sm:text-[15px]">
                    {toPersianDigits(info.address)}
                  </p>
                  <CopyButton value={info.address} label="کپی آدرس" />
                </div>
              )}

              {info.postalCode && (
                <div className="relative mt-4 flex items-center justify-between gap-3 rounded-2xl border border-dashed border-panel-line/[0.12] bg-panel-surface-2/70 px-4 py-3">
                  <div className="min-w-0">
                    <span className="block text-[11px] font-bold text-panel-muted">کد پستی</span>
                    <span dir="ltr" className="mt-0.5 block font-mono text-base font-black tracking-[0.18em] text-panel-text">
                      {toPersianDigits(formatPostalCode(info.postalCode))}
                    </span>
                  </div>
                  <CopyButton value={info.postalCode} label="کپی کد پستی" />
                </div>
              )}
            </section>
          )}

          {point && <MapCard point={point} address={info.address} style={nextDelay()} />}
        </div>
      )}

      {channels.length > 0 && (
        <section aria-label="شبکه‌های اجتماعی" className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {channels.map((c) => (
            <a
              key={c.kind}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              style={nextDelay()}
              className={cn(
                "panel-card-in group flex items-center gap-3 rounded-[22px] border border-panel-line/[0.08] bg-panel-surface p-3.5 transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 sm:p-4",
                c.glow
              )}
            >
              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105",
                  c.chip
                )}
              >
                <c.icon className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-extrabold text-panel-text">{c.label}</span>
                <span dir="ltr" className="mt-0.5 block truncate text-end font-mono text-xs text-panel-muted">
                  {c.handle ?? (c.kind === "whatsapp" ? "Chat" : "Join")}
                </span>
              </span>
              <ArrowUpLeft className="h-4 w-4 shrink-0 text-panel-faint transition-all duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-panel-accent" />
            </a>
          ))}
        </section>
      )}

      {/* ── Branches ── */}
      <BranchesSection branches={branches} />
    </div>
  );
}

export default ContactView;
