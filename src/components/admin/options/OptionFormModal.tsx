"use client";

import React, { useId, useState, useTransition } from "react";
import { AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";

import { Modal } from "@/components/admin/ui/Modal";
import { Toggle } from "@/components/admin/ui/Toggle";
import {
  createOptionAction,
  updateOptionAction,
} from "@/app/admin/(panel)/car-form/actions";
import type { OptionRecord, OptionTypeValue } from "@/lib/options";
import { cn } from "@/lib/utils";

interface OptionFormModalProps {
  mode: "create" | "edit";
  option: OptionRecord | null;
  onClose: () => void;
  onSuccess: (record: OptionRecord) => void;
  onError: (message: string) => void;
}

interface ItemDraft {
  id?: string;
  title: string;
}

const inputClassName = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-[#07090C] px-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20"
  );

export function OptionFormModal({
  mode,
  option,
  onClose,
  onSuccess,
  onError,
}: OptionFormModalProps) {
  const isEdit = mode === "edit";
  const nameId = useId();
  const typeId = useId();
  const descriptionId = useId();

  const [name, setName] = useState(option?.name ?? "");
  const [type, setType] = useState<OptionTypeValue>(option?.type ?? "text");
  const [multiple, setMultiple] = useState(option?.multiple ?? false);
  const [isRequired, setIsRequired] = useState(option?.isRequired ?? false);
  const [description, setDescription] = useState(option?.description ?? "");

  const [items, setItems] = useState<ItemDraft[]>(() => {
    if (option && option.optionItems.length > 0) {
      return option.optionItems.map((oi) => ({ id: oi.id, title: oi.title }));
    }
    return [{ title: "" }];
  });

  // Stored ad values depend on these, so they lock once the option is in use.
  const isUsed = (option?.usageCount ?? 0) > 0;
  const multipleLocked = isUsed && (option?.multiple ?? false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAddItem() {
    setItems((prev) => [...prev, { title: "" }]);
  }

  function handleRemoveItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function handleItemChange(index: number, value: string) {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, title: value } : it))
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const validItems = items.filter((it) => it.title.trim() !== "");

    if (type === "select" && validItems.length === 0) {
      setFieldErrors({
        items: "برای ویژگی چند گزینه‌ای، حداقل یک گزینه باید تعریف شود.",
      });
      return;
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("type", type);
    formData.set("multiple", String(type === "select" && multiple));
    formData.set("isRequired", String(type !== "checkbox" && isRequired));
    formData.set("description", description);
    formData.set("items", JSON.stringify(validItems));

    startTransition(async () => {
      const result = isEdit
        ? await updateOptionAction(option!.id, formData)
        : await createOptionAction(formData);

      if (result.ok) {
        onSuccess(result.record);
      } else {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        setFormError(result.message);
        onError(result.message);
      }
    });
  }

  return (
    <Modal
      open
      onClose={isPending ? () => undefined : onClose}
      title={isEdit ? "ویرایش ویژگی" : "ایجاد ویژگی جدید"}
      description={
        isEdit
          ? `به‌روزرسانی مشخصات و گزینه‌های ویژگی «${name}»`
          : "این ویژگی در فرم ثبت آگهی همه کاربران نمایش داده می‌شود"
      }
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-12 rounded-xl border border-white/[0.12] px-5 text-sm font-bold text-[#D2D7DF] transition-colors hover:border-white/25 hover:text-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            انصراف
          </button>
          <button
            type="submit"
            form="option-form"
            disabled={isPending}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-6 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 hover:shadow-[0_0_36px_rgba(255,106,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isPending ? (
              <>
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
                {isEdit ? "در حال ذخیره…" : "در حال ایجاد…"}
              </>
            ) : isEdit ? (
              "ذخیره تغییرات"
            ) : (
              "ایجاد ویژگی"
            )}
          </button>
        </>
      }
    >
      <form
        id="option-form"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
      >
        {formError && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-semibold text-red-300"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Name */}
          <div className="space-y-2">
            <label
              htmlFor={nameId}
              className="block text-xs font-bold text-[#D2D7DF]"
            >
              عنوان ویژگی <span className="text-[#FF6A00]">*</span>
            </label>
            <input
              id={nameId}
              type="text"
              required
              disabled={isPending}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: گیربکس، کارکرد، سانروف"
              className={inputClassName(Boolean(fieldErrors.name))}
            />
            {fieldErrors.name && (
              <p className="text-xs font-semibold text-red-400">
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label
              htmlFor={typeId}
              className="block text-xs font-bold text-[#D2D7DF]"
            >
              نوع ویژگی <span className="text-[#FF6A00]">*</span>
            </label>
            <select
              id={typeId}
              disabled={isPending || isUsed}
              value={type}
              onChange={(e) => setType(e.target.value as OptionTypeValue)}
              className={inputClassName(Boolean(fieldErrors.type))}
            >
              <option value="text">نوشتاری</option>
              <option value="number">عددی</option>
              <option value="select">چند گزینه‌ای</option>
              <option value="checkbox">چک‌باکس</option>
            </select>
            {isUsed && (
              <p className="text-[11px] text-[#5E6672]">
                این ویژگی در آگهی‌ها مقدار دارد و نوع آن قابل تغییر نیست.
              </p>
            )}
            {fieldErrors.type && (
              <p className="text-xs font-semibold text-red-400">
                {fieldErrors.type}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor={descriptionId}
            className="block text-xs font-bold text-[#D2D7DF]"
          >
            توضیح کوتاه
          </label>
          <input
            id={descriptionId}
            type="text"
            disabled={isPending}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="این متن زیر فیلد در فرم ثبت آگهی نمایش داده می‌شود..."
            className={inputClassName(Boolean(fieldErrors.description))}
          />
          {fieldErrors.description && (
            <p className="text-xs font-semibold text-red-400">
              {fieldErrors.description}
            </p>
          )}
        </div>

        {type !== "checkbox" && (
          <div className="flex items-center justify-between rounded-2xl border border-white/[0.07] bg-[#07090C]/60 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-[#F5F5F5]">الزامی</p>
              <p className="mt-0.5 text-[11px] text-[#8B93A1]">
                {isRequired ? "بدون پر کردن این ویژگی، آگهی ثبت نمی‌شود" : "کاربر می‌تواند این ویژگی را خالی بگذارد"}
              </p>
            </div>
            <Toggle checked={isRequired} onCheckedChange={setIsRequired} label="الزامی بودن ویژگی" disabled={isPending} />
          </div>
        )}

        {/* Selectable items */}
        {type === "select" && (
          <div className="space-y-3 rounded-2xl border border-white/[0.08] bg-[#07090C]/60 p-4">
            <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0D1117] px-3 py-2.5">
              <div>
                <p className="text-xs font-bold text-[#F5F5F5]">نحوه انتخاب</p>
                <p className="mt-0.5 text-[11px] text-[#8B93A1]">
                  {multiple ? "کاربر می‌تواند چند گزینه را انتخاب کند" : "کاربر فقط یک گزینه را انتخاب می‌کند"}
                </p>
                {fieldErrors.multiple && (
                  <p className="mt-1 text-xs font-semibold text-red-400">{fieldErrors.multiple}</p>
                )}
              </div>
              <Toggle checked={multiple} onCheckedChange={setMultiple} label="امکان انتخاب چند گزینه" disabled={isPending || multipleLocked} />
            </div>

            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#F5F5F5]">
                گزینه‌های قابل انتخاب
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                disabled={isPending}
                className="flex items-center gap-1.5 rounded-lg border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-3 py-1.5 text-xs font-bold text-[#FF8A2A] transition-colors hover:bg-[#FF6A00]/20"
              >
                <Plus className="h-3.5 w-3.5" />
                افزودن گزینه
              </button>
            </div>

            {fieldErrors.items && (
              <p className="text-xs font-semibold text-red-400">
                {fieldErrors.items}
              </p>
            )}

            <div className="space-y-2.5 pt-1 max-h-60 overflow-y-auto admin-scrollbar pr-1">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#0D1117] p-2.5"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      disabled={isPending}
                      value={item.title}
                      onChange={(e) => handleItemChange(index, e.target.value)}
                      placeholder="عنوان گزینه (مثال: اتوماتیک ۶ سرعته)"
                      className="h-9 w-full rounded-lg border border-white/[0.08] bg-[#07090C] px-3 text-xs text-[#F5F5F5] placeholder:text-[#5E6672] focus:border-[#FF6A00] focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    disabled={isPending || items.length <= 1}
                    title="حذف گزینه"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] text-[#8B93A1] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40 disabled:hover:border-white/[0.08] disabled:hover:bg-transparent disabled:hover:text-[#8B93A1]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
