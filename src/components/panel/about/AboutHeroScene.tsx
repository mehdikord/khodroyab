import React from "react";

/*
 * Night-drive scene for the About page hero, pure SVG + CSS (no JS):
 * a sports car's outline draws itself in, then it keeps driving: wheels spin,
 * the body rides the suspension, the headlight beam breathes, while the road
 * lanes, speed streaks and the city skyline slide past (parallax).
 * The car faces left, i.e. forward in a right-to-left reading direction.
 * All loops stop under `prefers-reduced-motion` (see globals.css, `.about-*`).
 */

/* ───────────── Skyline: deterministic buildings (same markup on server and client) ───────────── */

interface Building {
  x: number;
  w: number;
  h: number;
  windows: { x: number; y: number }[];
}

function buildSkyline(): Building[] {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const buildings: Building[] = [];
  let x = 0;
  while (x < 1000) {
    const w = 26 + Math.round(rand() * 46);
    const h = 34 + Math.round(rand() * 86);
    const windows: { x: number; y: number }[] = [];
    for (let wy = 140 - h + 10; wy < 132; wy += 12) {
      for (let wx = x + 6; wx < x + w - 8; wx += 10) {
        if (rand() < 0.16) windows.push({ x: wx, y: wy });
      }
    }
    buildings.push({ x, w, h, windows });
    x += w + 2 + Math.round(rand() * 6);
  }
  return buildings;
}

const SKYLINE = buildSkyline();

function Skyline() {
  return (
    <svg viewBox="0 0 1000 140" preserveAspectRatio="none" className="h-full w-1/2 shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id="about-building" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#222A38" />
          <stop offset="1" stopColor="#0E121A" />
        </linearGradient>
      </defs>
      {SKYLINE.map((b) => (
        <g key={b.x}>
          <rect x={b.x} y={140 - b.h} width={b.w} height={b.h} fill="url(#about-building)" />
          <rect x={b.x} y={140 - b.h} width={b.w} height="1.5" fill="#FF8A2A" opacity="0.18" />
          {b.windows.map((w) => (
            <rect key={`${w.x}-${w.y}`} x={w.x} y={w.y} width="3.5" height="4.5" fill="#FFB36B" opacity="0.55" />
          ))}
        </g>
      ))}
    </svg>
  );
}

/* ───────────── Car ───────────── */

const BODY_PATH =
  "M 28 150 C 24 138 32 127 58 122 L 200 104 C 232 96 258 76 296 64 C 336 54 404 53 446 62 C 488 72 522 90 552 104 C 570 112 580 124 577 141 L 574 152 L 489 152 A 39 39 0 0 0 411 152 L 169 152 A 39 39 0 0 0 91 152 Z";

const SPOKES = [0, 72, 144, 216, 288];

function Wheel({ cx, delay }: { cx: number; delay: string }) {
  return (
    <g className="about-wheel-in" style={{ animationDelay: delay }}>
      <circle cx={cx} cy="152" r="29" fill="#07090C" stroke="#2A303B" strokeWidth="2" />
      <g className="about-spin" style={{ transformOrigin: `${cx}px 152px` }}>
        <circle cx={cx} cy="152" r="19" fill="none" stroke="#7A8494" strokeWidth="2" />
        {SPOKES.map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={angle}
              x1={cx}
              y1="152"
              x2={cx + Math.cos(rad) * 18}
              y2={152 + Math.sin(rad) * 18}
              stroke="#AEB6C2"
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
        <circle cx={cx} cy="152" r="5" fill="#FF6A00" />
      </g>
    </g>
  );
}

function Car() {
  return (
    <svg viewBox="-260 40 860 146" className="block h-auto w-full overflow-visible" role="img" aria-label="خودروی اسپرت در حال حرکت در جاده شب">
      <defs>
        <linearGradient id="about-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A414D" />
          <stop offset="0.55" stopColor="#1A1F27" />
          <stop offset="1" stopColor="#0B0E13" />
        </linearGradient>
        <linearGradient id="about-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5C6B80" stopOpacity="0.55" />
          <stop offset="1" stopColor="#0B0E13" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="about-beam" gradientUnits="userSpaceOnUse" x1="40" y1="0" x2="-255" y2="0">
          <stop offset="0" stopColor="#FFE2C2" stopOpacity="0.6" />
          <stop offset="1" stopColor="#FFE2C2" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="about-shadow">
          <stop offset="0" stopColor="#000" stopOpacity="0.75" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Road shadow under the car */}
      <ellipse cx="300" cy="182" rx="300" ry="9" fill="url(#about-shadow)" />

      {/* Headlight beam on the road ahead */}
      <polygon className="about-beam" points="40,127 -255,104 -255,182 40,139" fill="url(#about-beam)" />

      {/* Body rides the suspension; wheels stay on the road */}
      <g className="about-bob">
        <path d={BODY_PATH} fill="url(#about-body)" className="about-fill" />
        {/* Glasshouse with B-pillar */}
        <path
          d="M 236 100 C 264 84 286 72 316 67 L 440 67 C 470 74 498 88 520 100 Z"
          fill="url(#about-glass)"
          className="about-fill"
        />
        <path d="M 382 67 L 374 100" stroke="#0B0E13" strokeWidth="5" className="about-fill" />
        {/* Shoulder line, door seams, mirror */}
        <path d="M 60 128 C 200 118 420 116 568 118" fill="none" stroke="#FFFFFF" strokeOpacity="0.14" strokeWidth="1.5" className="about-fill" />
        <path d="M 300 104 L 296 150 M 410 102 L 414 150" fill="none" stroke="#000" strokeOpacity="0.45" strokeWidth="1.5" className="about-fill" />
        <path d="M 268 94 l 16 -6 l 3 9 z" fill="#1A1F27" stroke="#3A414D" className="about-fill" />
        {/* Roof highlight */}
        <path d="M 300 64 C 340 55 402 55 444 63" fill="none" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" className="about-fill" />
        {/* Lights */}
        <path d="M 36 132 C 50 126 70 123 86 122 L 82 130 C 66 132 50 134 38 136 Z" fill="#FFE9D2" className="about-headlight" />
        <path d="M 556 112 L 577 120 L 576 131 L 558 124 Z" fill="#FF2D2D" className="about-taillight" />
        {/* Orange outline that draws itself in */}
        <path
          d={BODY_PATH}
          pathLength={1}
          fill="none"
          stroke="#FF6A00"
          strokeWidth="2.2"
          strokeLinejoin="round"
          className="about-draw"
        />
      </g>

      <Wheel cx={130} delay="1.1s" />
      <Wheel cx={450} delay="1.25s" />
    </svg>
  );
}

/* ───────────── Scene ───────────── */

const STREAKS = [
  { top: "18%", width: "7rem", duration: "1.6s", delay: "0s" },
  { top: "32%", width: "11rem", duration: "1.1s", delay: "0.5s" },
  { top: "46%", width: "5rem", duration: "1.9s", delay: "1.1s" },
  { top: "58%", width: "9rem", duration: "1.3s", delay: "0.2s" },
  { top: "68%", width: "6rem", duration: "1.5s", delay: "0.9s" },
];

/** Height of the road band; the car's wheels rest on its top edge. */
const ROAD = "3.5rem";

export function AboutHeroScene({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden rounded-[28px] border border-panel-line/[0.1] bg-[#05070A] sm:rounded-[36px]">
      {/* Sky + horizon glow */}
      <div aria-hidden="true" className="absolute inset-0 -z-30 bg-[radial-gradient(90%_70%_at_30%_100%,rgba(255,106,0,0.28),transparent_60%),linear-gradient(to_bottom,#070A10,#05070A)]" />

      {/* City skyline (slow parallax) */}
      <div aria-hidden="true" className="absolute inset-x-0 -z-20 h-28 overflow-hidden opacity-75 sm:h-40" style={{ bottom: ROAD }}>
        {/* Pinned to the left edge: in an RTL parent a 200%-wide block would otherwise hang off to the left */}
        <div dir="ltr" className="about-scroll-slow absolute left-0 top-0 flex h-full w-[200%]">
          <Skyline />
          <Skyline />
        </div>
      </div>

      {/* Speed streaks */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {STREAKS.map((streak) => (
          <span
            key={streak.top}
            className="about-streak absolute left-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
            style={{ top: streak.top, width: streak.width, animationDuration: streak.duration, animationDelay: streak.delay }}
          />
        ))}
      </div>

      {/* Road */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 border-t border-white/[0.14] bg-gradient-to-b from-[#10141B] to-[#05070A]"
        style={{ height: ROAD }}
      >
        <div className="absolute inset-x-0 top-0 h-6 bg-[radial-gradient(45%_100%_at_35%_0%,rgba(255,106,0,0.22),transparent)]" />
        <div className="about-lanes absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2" />
      </div>

      {/* Content: text (start side) + car on the road (end side) */}
      <div className="relative grid min-h-[380px] grid-rows-[auto_1fr] md:min-h-[400px] md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:grid-rows-1">
        <div className="about-rise self-center px-6 pt-8 sm:px-10 md:pb-[3.5rem] md:pt-0">{children}</div>
        <div className="flex items-end px-3 sm:px-6" style={{ paddingBottom: `calc(${ROAD} - 3px)` }}>
          <div className="w-full max-w-[820px]">
            <Car />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutHeroScene;
