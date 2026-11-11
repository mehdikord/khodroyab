import React from "react";
import Link from "next/link";
import { FileText, PhoneCall, Search } from "lucide-react";

import { AboutHeroScene } from "@/components/panel/about/AboutHeroScene";

/** Split the admin's text into paragraphs on blank lines; single line breaks stay inside a paragraph. */
function toParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/**
 * "About Khodroyab" page. One memorable moment: an animated night-drive hero
 * (a sports car drawing itself in, then driving past a moving city). Below it the administrator's text
 * reads as an editorial column: the first paragraph as a larger lede, the
 * rest in a narrow measure guided by an orange rule.
 */
export function AboutView({ text }: { text: string }) {
  const [lede, ...rest] = toParagraphs(text);

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Hero: animated night-drive scene */}
      <AboutHeroScene>
        <span aria-hidden="true" className="mb-5 block h-1 w-14 rounded-full bg-[#FF6A00] shadow-[0_0_24px_#FF6A00]" />
        <h1 className="text-[2rem] font-black leading-[1.25] tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.2]">درباره خودرو یاب</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
          بازار خودروهای وارداتی، شفاف و قابل مقایسه؛ از قیمت تا فروشنده.
        </p>
      </AboutHeroScene>

      {/* Body */}
      {lede ? (
        <article className="mx-auto max-w-[68ch] px-1 sm:px-2">
          <p className="whitespace-pre-line break-words text-lg font-bold leading-[2.1] text-panel-text sm:text-xl sm:leading-[2.15]">
            {lede}
          </p>

          {rest.length > 0 && (
            <div className="mt-8 space-y-6 border-s-2 border-[#FF6A00]/50 ps-5 sm:mt-10 sm:ps-7">
              {rest.map((paragraph, index) => (
                <p key={index} className="whitespace-pre-line break-words text-[15px] leading-[2.15] text-panel-text-2 sm:text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </article>
      ) : (
        <div className="mx-auto flex max-w-md flex-col items-center px-4 py-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-panel-line/[0.08] bg-panel-surface text-panel-faint">
            <FileText className="h-6 w-6" />
          </span>
          <p className="mt-4 text-sm font-extrabold text-panel-text">متن این صفحه به‌زودی منتشر می‌شود</p>
          <p className="mt-1.5 text-xs leading-6 text-panel-muted-2">تا آن زمان می‌توانید آگهی‌ها و لیست قیمت خودروها را ببینید.</p>
        </div>
      )}

      {/* Next steps */}
      <nav aria-label="ادامه مسیر" className="mx-auto flex max-w-[68ch] flex-col gap-2 px-1 sm:flex-row sm:px-2">
        <Link
          href="/panel/search"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl sm:w-auto sm:flex-1 bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] shadow-orange-subtle transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6A00]/35 active:scale-[0.99]"
        >
          <Search className="h-4 w-4" />
          جستجوی خودرو
        </Link>
        <Link
          href="/panel/contact"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl sm:w-auto sm:flex-1 border border-panel-line/[0.12] bg-panel-surface px-5 text-sm font-bold text-panel-text-2 transition-colors hover:border-[#FF6A00]/40 hover:text-panel-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/40"
        >
          <PhoneCall className="h-4 w-4" />
          تماس با ما
        </Link>
      </nav>
    </div>
  );
}

export default AboutView;
