"use client";

import React, { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TableKit } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { Placeholder } from "@tiptap/extensions";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  Columns3,
  Eraser,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Minus,
  Palette,
  Quote,
  Redo2,
  Rows3,
  Strikethrough,
  Table2,
  Trash2,
  Underline,
  Undo2,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  /** Initial HTML (read once on mount). */
  value: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  /** Labelled-by id for accessibility. */
  labelledBy?: string;
}

const TEXT_COLORS = [
  { label: "نارنجی", value: "#FF6A00" },
  { label: "قرمز", value: "#EF4444" },
  { label: "سبز", value: "#10B981" },
  { label: "آبی", value: "#3B82F6" },
  { label: "کهربایی", value: "#F59E0B" },
  { label: "بنفش", value: "#A855F7" },
  { label: "خاکستری", value: "#9CA3AF" },
];

const HIGHLIGHTS = [
  { label: "نارنجی", value: "rgba(255,106,0,0.25)" },
  { label: "زرد", value: "rgba(250,204,21,0.3)" },
  { label: "سبز", value: "rgba(16,185,129,0.25)" },
  { label: "آبی", value: "rgba(59,130,246,0.25)" },
  { label: "قرمز", value: "rgba(239,68,68,0.25)" },
];

function ToolButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
  danger = false,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      // Keep the editor's selection while clicking the toolbar.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn(
        "flex h-8 min-w-8 shrink-0 items-center justify-center gap-1 rounded-lg px-1.5 text-[11px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-30",
        active
          ? "bg-[#FF6A00]/20 text-[#FF8A2A]"
          : danger
            ? "text-red-400 hover:bg-red-500/15"
            : "text-[#9BA3AE] hover:bg-white/[0.07] hover:text-[#F5F5F5]"
      )}
    >
      {children}
    </button>
  );
}

const Divider = () => <span className="mx-0.5 h-5 w-px shrink-0 bg-white/[0.1]" aria-hidden="true" />;

/** Small popover with colour swatches under a toolbar button. */
function ColorMenu({
  label,
  icon: Icon,
  colors,
  current,
  onPick,
  onClear,
  disabled,
}: {
  label: string;
  icon: typeof Palette;
  colors: { label: string; value: string }[];
  current: string | null;
  onPick: (value: string) => void;
  onClear: () => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <ToolButton label={label} active={Boolean(current) || open} disabled={disabled} onClick={() => setOpen((value) => !value)}>
        <Icon className="h-4 w-4" />
        <span className="h-1.5 w-3 rounded-full" style={{ background: current ?? "transparent" }} aria-hidden="true" />
      </ToolButton>
      {open && (
        <div className="absolute start-0 top-9 z-30 flex w-max items-center gap-1.5 rounded-xl border border-white/[0.12] bg-[#12161D] p-2 shadow-2xl">
          {colors.map((color) => (
            <button
              key={color.value}
              type="button"
              title={color.label}
              aria-label={color.label}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onPick(color.value);
                setOpen(false);
              }}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 transition-transform hover:scale-110"
              style={{ background: color.value }}
            >
              {current === color.value && <Check className="h-3.5 w-3.5 text-white drop-shadow" />}
            </button>
          ))}
          <button
            type="button"
            title="بدون رنگ"
            aria-label="بدون رنگ"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onClear();
              setOpen(false);
            }}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 text-[#9BA3AE] hover:text-[#F5F5F5]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function Toolbar({ editor, disabled }: { editor: Editor; disabled?: boolean }) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
      table: e.isActive("table"),
      alignRight: e.isActive({ textAlign: "right" }),
      alignCenter: e.isActive({ textAlign: "center" }),
      alignLeft: e.isActive({ textAlign: "left" }),
      alignJustify: e.isActive({ textAlign: "justify" }),
      color: (e.getAttributes("textStyle").color as string | undefined) ?? null,
      highlight: (e.getAttributes("highlight").color as string | undefined) ?? null,
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const chain = () => editor.chain().focus();

  function openLink() {
    setLinkUrl((editor.getAttributes("link").href as string | undefined) ?? "https://");
    setLinkOpen(true);
  }

  function applyLink() {
    const url = linkUrl.trim();
    if (!url || url === "https://") chain().extendMarkRange("link").unsetLink().run();
    else chain().extendMarkRange("link").setLink({ href: /^(https?:|mailto:|tel:)/i.test(url) ? url : `https://${url}` }).run();
    setLinkOpen(false);
  }

  return (
    <div className="border-b border-white/[0.08] bg-[#0A0D12]">
      <div role="toolbar" aria-label="ابزارهای ویرایش متن" className="flex flex-wrap items-center gap-0.5 p-1.5">
        <ToolButton label="واگرد" disabled={disabled || !state.canUndo} onClick={() => chain().undo().run()}>
          <Undo2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="ازنو" disabled={disabled || !state.canRedo} onClick={() => chain().redo().run()}>
          <Redo2 className="h-4 w-4" />
        </ToolButton>
        <Divider />
        <ToolButton label="عنوان" active={state.h2} disabled={disabled} onClick={() => chain().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="زیرعنوان" active={state.h3} disabled={disabled} onClick={() => chain().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="h-4 w-4" />
        </ToolButton>
        <Divider />
        <ToolButton label="ضخیم" active={state.bold} disabled={disabled} onClick={() => chain().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="کج" active={state.italic} disabled={disabled} onClick={() => chain().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="زیرخط" active={state.underline} disabled={disabled} onClick={() => chain().toggleUnderline().run()}>
          <Underline className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="خط‌خورده" active={state.strike} disabled={disabled} onClick={() => chain().toggleStrike().run()}>
          <Strikethrough className="h-4 w-4" />
        </ToolButton>
        <ColorMenu
          label="رنگ متن"
          icon={Palette}
          colors={TEXT_COLORS}
          current={state.color}
          disabled={disabled}
          onPick={(value) => chain().setColor(value).run()}
          onClear={() => chain().unsetColor().run()}
        />
        <ColorMenu
          label="رنگ پس‌زمینه متن"
          icon={Highlighter}
          colors={HIGHLIGHTS}
          current={state.highlight}
          disabled={disabled}
          onPick={(value) => chain().setHighlight({ color: value }).run()}
          onClear={() => chain().unsetHighlight().run()}
        />
        <Divider />
        <ToolButton label="راست‌چین" active={state.alignRight} disabled={disabled} onClick={() => chain().setTextAlign("right").run()}>
          <AlignRight className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="وسط‌چین" active={state.alignCenter} disabled={disabled} onClick={() => chain().setTextAlign("center").run()}>
          <AlignCenter className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="چپ‌چین" active={state.alignLeft} disabled={disabled} onClick={() => chain().setTextAlign("left").run()}>
          <AlignLeft className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="تراز دوطرفه" active={state.alignJustify} disabled={disabled} onClick={() => chain().setTextAlign("justify").run()}>
          <AlignJustify className="h-4 w-4" />
        </ToolButton>
        <Divider />
        <ToolButton label="فهرست نقطه‌ای" active={state.bullet} disabled={disabled} onClick={() => chain().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="فهرست شماره‌دار" active={state.ordered} disabled={disabled} onClick={() => chain().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="نقل‌قول" active={state.quote} disabled={disabled} onClick={() => chain().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="خط جداکننده" disabled={disabled} onClick={() => chain().setHorizontalRule().run()}>
          <Minus className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="پیوند" active={state.link || linkOpen} disabled={disabled} onClick={openLink}>
          <Link2 className="h-4 w-4" />
        </ToolButton>
        {state.link && (
          <ToolButton label="حذف پیوند" disabled={disabled} onClick={() => chain().extendMarkRange("link").unsetLink().run()}>
            <Link2Off className="h-4 w-4" />
          </ToolButton>
        )}
        <Divider />
        <ToolButton
          label="درج جدول"
          active={state.table}
          disabled={disabled || state.table}
          onClick={() => chain().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >
          <Table2 className="h-4 w-4" />
          <span className="hidden sm:inline">جدول</span>
        </ToolButton>
        <ToolButton label="پاک کردن قالب‌بندی" disabled={disabled} onClick={() => chain().unsetAllMarks().clearNodes().run()}>
          <Eraser className="h-4 w-4" />
        </ToolButton>
      </div>

      {/* Table tools: only while the cursor is inside a table */}
      {state.table && (
        <div className="flex flex-wrap items-center gap-0.5 border-t border-white/[0.06] bg-[#FF6A00]/[0.04] p-1.5 text-[11px]">
          <span className="px-1.5 font-bold text-[#FF8A2A]">جدول:</span>
          <ToolButton label="افزودن سطر پایین" disabled={disabled} onClick={() => chain().addRowAfter().run()}>
            <Rows3 className="h-4 w-4" />+ سطر
          </ToolButton>
          <ToolButton label="حذف سطر" disabled={disabled} onClick={() => chain().deleteRow().run()}>
            <Rows3 className="h-4 w-4" />− سطر
          </ToolButton>
          <ToolButton label="افزودن ستون بعد" disabled={disabled} onClick={() => chain().addColumnAfter().run()}>
            <Columns3 className="h-4 w-4" />+ ستون
          </ToolButton>
          <ToolButton label="حذف ستون" disabled={disabled} onClick={() => chain().deleteColumn().run()}>
            <Columns3 className="h-4 w-4" />− ستون
          </ToolButton>
          <ToolButton label="سطر عنوان" disabled={disabled} onClick={() => chain().toggleHeaderRow().run()}>
            سطر عنوان
          </ToolButton>
          <ToolButton label="ادغام / جدا کردن خانه‌ها" disabled={disabled} onClick={() => chain().mergeOrSplit().run()}>
            ادغام خانه‌ها
          </ToolButton>
          <ToolButton label="حذف جدول" danger disabled={disabled} onClick={() => chain().deleteTable().run()}>
            <Trash2 className="h-4 w-4" />
            حذف جدول
          </ToolButton>
        </div>
      )}

      {linkOpen && (
        <div className="flex items-center gap-2 border-t border-white/[0.06] p-2">
          <input
            autoFocus
            dir="ltr"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyLink();
              } else if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                setLinkOpen(false);
              }
            }}
            placeholder="https://example.com"
            className="h-9 min-w-0 flex-1 rounded-lg border border-white/[0.12] bg-[#07090C] px-3 font-mono text-xs text-[#F5F5F5] outline-none focus:border-[#FF6A00]"
          />
          <button type="button" onClick={applyLink} className="h-9 rounded-lg bg-[#FF6A00] px-3 text-xs font-extrabold text-[#07090C]">
            ثبت
          </button>
          <button type="button" onClick={() => setLinkOpen(false)} className="h-9 rounded-lg border border-white/[0.12] px-3 text-xs font-bold text-[#9BA3AE]">
            انصراف
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Rich-text editor (TipTap) for admin-authored content: headings, emphasis,
 * colours, alignment, lists, quotes, links and tables. Emits HTML; the server
 * sanitises it before storage (`sanitizeRichText`).
 */
export function RichTextEditor({ value, onChange, disabled, placeholder = "متن را اینجا بنویسید…", className, labelledBy }: RichTextEditorProps) {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        link: { openOnClick: false, autolink: true, protocols: ["mailto", "tel"] },
      }),
      TableKit.configure({ table: { resizable: false } }),
      TextAlign.configure({ types: ["heading", "paragraph"], defaultAlignment: null }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    editable: !disabled,
    editorProps: {
      attributes: {
        dir: "auto",
        class: "rich-content rich-editor min-h-[220px] px-4 py-3 outline-none",
        ...(labelledBy ? { "aria-labelledby": labelledBy } : {}),
        "aria-multiline": "true",
        role: "textbox",
      },
    },
    onUpdate: ({ editor: e }) => onChangeRef.current(e.isEmpty ? "" : e.getHTML()),
  });

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/[0.12] bg-[#07090C] transition-all focus-within:border-[#FF6A00] focus-within:ring-4 focus-within:ring-[#FF6A00]/15",
        disabled && "opacity-60",
        className
      )}
    >
      {editor ? (
        <>
          <Toolbar editor={editor} disabled={disabled} />
          <div className="admin-scrollbar max-h-[50vh] overflow-y-auto">
            <EditorContent editor={editor} />
          </div>
        </>
      ) : (
        <div className="flex h-[264px] items-center justify-center text-xs text-[#5E6672]">در حال آماده‌سازی ویرایشگر…</div>
      )}
    </div>
  );
}
