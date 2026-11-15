import "server-only";

import sanitizeHtml from "sanitize-html";

/** Longest stored rich-text description (HTML characters). */
export const RICH_TEXT_MAX_LENGTH = 200_000;

const TEXT_ALIGN = [/^(right|left|center|justify)$/];
const COLOR = [/^#[0-9a-f]{3,8}$/i, /^rgba?\(\s*[\d.\s,%]+\)$/i];
const CSS_SIZE = [/^\d{1,4}(\.\d+)?px$/];

/**
 * Whitelist sanitiser for the admin's rich-text editor output (TipTap HTML):
 * headings, emphasis, lists, quotes, links, tables, alignment and text /
 * highlight colours. Everything else (scripts, event handlers, iframes,
 * arbitrary styles, `javascript:` URLs) is dropped.
 */
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "del", "mark", "span",
      "ul", "ol", "li", "blockquote", "hr", "a", "code", "pre",
      "table", "colgroup", "col", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      th: ["colspan", "rowspan", "colwidth", "style"],
      td: ["colspan", "rowspan", "colwidth", "style"],
      col: ["style"],
      table: ["style"],
      mark: ["data-color", "style"],
      span: ["style"],
      p: ["style"],
      h2: ["style"],
      h3: ["style"],
      h4: ["style"],
      ol: ["start"],
    },
    allowedStyles: {
      "*": { "text-align": TEXT_ALIGN },
      span: { color: COLOR, "background-color": COLOR },
      mark: { "background-color": COLOR, color: COLOR },
      col: { width: CSS_SIZE, "min-width": CSS_SIZE },
      table: { width: CSS_SIZE, "min-width": CSS_SIZE },
      td: { "text-align": TEXT_ALIGN, "background-color": COLOR },
      th: { "text-align": TEXT_ALIGN, "background-color": COLOR },
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesAppliedToAttributes: ["href"],
    transformTags: {
      // Links always open safely in a new tab.
      a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer nofollow" }),
    },
  });
}

/** True when the HTML has no visible text and no table/rule (e.g. "<p></p>"). */
export function isRichTextEmpty(html: string | null | undefined): boolean {
  if (!html) return true;
  if (/<(table|hr)\b/i.test(html)) return false;
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;|\s/g, "").length === 0;
}

/** Sanitised description for storage, or null when it is empty. */
export function normalizeRichText(html: string | null | undefined): string | null {
  if (!html) return null;
  const clean = sanitizeRichText(html).trim();
  return isRichTextEmpty(clean) ? null : clean;
}

/**
 * Stored description → HTML ready to render: sanitised again (defence in
 * depth) and every table wrapped in a horizontally scrollable frame.
 */
export function renderRichText(html: string | null | undefined): string | null {
  const clean = normalizeRichText(html);
  if (!clean) return null;
  return clean.replace(/<table\b/g, '<div class="rich-table"><table').replace(/<\/table>/g, "</table></div>");
}
