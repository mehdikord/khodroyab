import React from "react";

import { cn, toPersianDigits } from "@/lib/utils";

export interface TeamSectionMember {
  id: string;
  name: string;
  photo: string;
  position: string;
  bio: string | null;
}

/** Grid shape per team size, so 1–2 people are centered instead of stranded in a 3-column grid. */
function gridClassName(count: number): string {
  if (count === 1) return "mx-auto max-w-sm grid-cols-1";
  if (count === 2) return "mx-auto max-w-3xl grid-cols-1 sm:grid-cols-2";
  if (count === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:pb-12 lg:[&>li:nth-child(even)]:mt-12";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:pb-14 lg:[&>li:nth-child(3n+2)]:mt-14";
}

/**
 * «تیم خودرویاب» on the About page: portrait cards in the administrator's order.
 * Each card is a full-bleed photo with the name and role laid over a dark fade,
 * a running number, and an orange edge + slow zoom on hover. On wide screens the
 * middle column drops down for an editorial, staggered rhythm. Pure CSS, no JS;
 * the entrance stagger stops under `prefers-reduced-motion` (`.about-rise`).
 */
export function TeamSection({ members }: { members: TeamSectionMember[] }) {
  if (members.length === 0) return null;

  return (
    <section aria-labelledby="about-team-title" className="relative mx-auto max-w-6xl px-1 pt-4 sm:px-2 sm:pt-8">
      {/* Ambient glow behind the heading */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-10 start-0 h-56 w-72 rounded-full bg-orange-flare opacity-70 blur-2xl" />

      <header className="relative mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="flex items-center gap-2.5 text-xs font-extrabold tracking-wide text-[#FF8A2A]">
            <span aria-hidden="true" className="h-1 w-8 rounded-full bg-[#FF6A00] shadow-[0_0_16px_#FF6A00]" />
            تیم خودرویاب
          </p>
          <h2 id="about-team-title" className="mt-3 text-2xl font-black leading-[1.35] tracking-tight text-panel-text sm:text-3xl lg:text-[2.1rem]">
            چهره‌هایی که خودرو یاب را می‌سازند
          </h2>
          <p className="mt-2 text-sm leading-7 text-panel-muted sm:text-[15px]">
            کسانی که هر روز برای شفاف‌تر شدن بازار خودرو کنار شما هستند.
          </p>
        </div>
        <p className="flex items-baseline gap-1.5 text-panel-muted-2" aria-label={`${toPersianDigits(members.length)} نفر`}>
          <span aria-hidden="true" className="font-mono text-4xl font-black leading-none text-panel-text sm:text-5xl">
            {toPersianDigits(String(members.length).padStart(2, "0"))}
          </span>
          <span aria-hidden="true" className="text-xs font-bold">
            نفر
          </span>
        </p>
      </header>

      <ul className={cn("relative grid gap-x-5 gap-y-10 sm:gap-x-6 lg:gap-x-7", gridClassName(members.length))}>
        {members.map((member, index) => (
          <li key={member.id} className="about-rise group" style={{ animationDelay: `${120 + Math.min(index, 8) * 90}ms` }}>
            <figure className="m-0">
              <div
                className={cn(
                  "relative aspect-[4/5] overflow-hidden rounded-[26px] border border-panel-line/[0.08] bg-panel-media",
                  "shadow-card-depth transition-[box-shadow,border-color] duration-500",
                  "group-hover:border-[#FF6A00]/50 group-hover:shadow-[0_28px_60px_-18px_rgba(255,106,0,0.45)]"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={member.photo}
                  alt={member.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:scale-[1.06]"
                />

                {/* Readability fade + warm sheen on hover */}
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#07090C] via-[#07090C]/55 to-transparent" />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_110%,rgba(255,106,0,0.38),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />

                {/* Running number */}
                <span
                  aria-hidden="true"
                  className="absolute start-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 font-mono text-[11px] font-black text-white/85 backdrop-blur-md"
                >
                  {toPersianDigits(String(index + 1).padStart(2, "0"))}
                  <span className="h-px w-5 origin-right bg-[#FF6A00] transition-transform duration-500 group-hover:scale-x-[1.8]" />
                </span>

                {/* Name + role */}
                <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#FF6A00]/35 bg-[#FF6A00]/15 px-3 py-1 text-[11px] font-extrabold text-[#FFB37A] backdrop-blur-md sm:text-xs">
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF8A2A] shadow-[0_0_8px_#FF8A2A]" />
                    <span className="truncate">{member.position}</span>
                  </span>
                  <h3 className="mt-2.5 break-words text-xl font-black leading-8 text-white sm:text-[1.35rem]">{member.name}</h3>
                </figcaption>
              </div>

              {member.bio && (
                <p className="mt-4 whitespace-pre-line break-words border-s-2 border-[#FF6A00]/40 ps-4 text-sm leading-7 text-panel-text-2 transition-colors duration-500 group-hover:border-[#FF6A00]">
                  {member.bio}
                </p>
              )}
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TeamSection;
