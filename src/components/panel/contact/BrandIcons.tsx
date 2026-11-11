import React from "react";

/* Simple brand glyphs in lucide's stroke style (lucide ships no Telegram / WhatsApp icons). */

type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function TelegramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21.2 4.3 2.9 11.4c-.8.3-.8 1.4 0 1.7l4.5 1.5 1.7 5.3c.2.7 1.1.9 1.6.4l2.5-2.4 4.7 3.5c.6.4 1.4.1 1.6-.6l3.1-13.4c.2-.8-.6-1.5-1.4-1.1Z" />
      <path d="m7.4 14.6 10.1-6.9-7.6 8.3" />
    </svg>
  );
}

export function WhatsappIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3.3 20.7 4.6 16A8.6 8.6 0 1 1 8 19.4Z" />
      <path d="M9.2 8.4c.2-.4.6-.5.9-.4l.8 1.8c.1.3 0 .5-.2.7l-.5.6c.6 1.3 1.5 2.2 2.8 2.8l.6-.5c.2-.2.4-.3.7-.2l1.8.8c.1.3 0 .7-.4.9-1.6 1-4.1 0-5.6-1.5-1.5-1.5-2.4-3.9-.9-5Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5.2" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" />
    </svg>
  );
}
