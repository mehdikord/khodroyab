"use client";

import React, { useId, useState, useTransition } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";

import { Modal } from "@/components/admin/ui/Modal";
import { PERMISSION_ICONS } from "@/components/admin/roles/PermissionChips";
import { createRoleAction, updateRoleAction } from "@/app/admin/(panel)/roles/actions";
import type { AdminRoleRecord } from "@/lib/admins";
import { ADMIN_PERMISSIONS, ADMIN_PERMISSION_META, type AdminPermission } from "@/lib/auth/permissions";
import { cn, toPersianDigits } from "@/lib/utils";

interface RoleFormModalProps {
  role: AdminRoleRecord | null;
  onClose: () => void;
  onSuccess: (record: AdminRoleRecord) => void;
}

const inputClassName = (hasError: boolean) =>
  cn(
    "h-12 w-full rounded-xl border bg-[#07090C] px-4 text-sm text-[#F5F5F5] outline-none transition-all placeholder:text-[#5E6672] disabled:cursor-not-allowed disabled:opacity-60",
    "focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/15",
    hasError ? "border-red-500/50" : "border-white/[0.12] hover:border-white/20"
  );

/** Create/Edit a role: name, description and the sections it grants. */
export function RoleFormModal({ role, onClose, onSuccess }: RoleFormModalProps) {
  const isEdit = role !== null;
  const nameId = useId();
  const descriptionId = useId();

  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [permissions, setPermissions] = useState<AdminPermission[]>(role?.permissions ?? []);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const allSelected = permissions.length === ADMIN_PERMISSIONS.length;

  function clearError(key: string) {
    setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));
  }

  function togglePermission(permission: AdminPermission) {
    clearError("permissions");
    setPermissions((prev) =>
      prev.includes(permission) ? prev.filter((p) => p !== permission) : ADMIN_PERMISSIONS.filter((p) => p === permission || prev.includes(p))
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError(null);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("description", description);
    for (const permission of permissions) formData.append("permissions", permission);

    startTransition(async () => {
      const result = isEdit ? await updateRoleAction(role.id, formData) : await createRoleAction(formData);
      if (result.ok) {
        onSuccess(result.record);
      } else {
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        setFormError(result.message);
      }
    });
  }

  return (
    <Modal
      open
      onClose={isPending ? () => undefined : onClose}
      title={isEdit ? "ویرایش نقش" : "تعریف نقش جدید"}
      description={
        isEdit
          ? role.adminCount > 0
            ? `تغییرات بلافاصله روی ${toPersianDigits(role.adminCount)} مدیر دارای این نقش اعمال می‌شود`
            : `به‌روزرسانی نقش «${role.name}»`
          : "نقش، مجموعه‌ای از بخش‌های پنل است که مدیران دارای آن نقش می‌توانند مدیریت کنند"
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
            form="role-form"
            disabled={isPending}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-6 text-sm font-extrabold text-[#07090C] shadow-[0_0_28px_rgba(255,106,0,0.35)] transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/50 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {isPending ? (
              <>
                <Loader2 className="h-[18px] w-[18px] animate-spin" />
                در حال ذخیره…
              </>
            ) : isEdit ? (
              "ذخیره تغییرات"
            ) : (
              "ایجاد نقش"
            )}
          </button>
        </>
      }
    >
      <form id="role-form" onSubmit={handleSubmit} noValidate aria-busy={isPending} className="space-y-5">
        {formError && (
          <div role="alert" className="admin-animate-in flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm text-red-200">
            <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-red-400" />
            <span className="leading-6">{formError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor={nameId} className="block text-sm font-semibold text-[#F5F5F5]">
              نام نقش <span className="text-[#FF6A00]">*</span>
            </label>
            <input
              id={nameId}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError("name");
              }}
              data-autofocus
              maxLength={100}
              placeholder="مثلاً: کارشناس آگهی‌ها"
              autoComplete="off"
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.name)}
              className={inputClassName(Boolean(fieldErrors.name))}
            />
            {fieldErrors.name && <p className="text-xs text-red-400">{fieldErrors.name}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor={descriptionId} className="block text-sm font-semibold text-[#F5F5F5]">
              توضیحات
            </label>
            <input
              id={descriptionId}
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                clearError("description");
              }}
              maxLength={255}
              placeholder="اختیاری — وظیفه این نقش"
              autoComplete="off"
              disabled={isPending}
              aria-invalid={Boolean(fieldErrors.description)}
              className={inputClassName(Boolean(fieldErrors.description))}
            />
            {fieldErrors.description && <p className="text-xs text-red-400">{fieldErrors.description}</p>}
          </div>
        </div>

        <fieldset className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <legend className="text-sm font-semibold text-[#F5F5F5]">
              بخش‌های قابل دسترسی <span className="text-[#FF6A00]">*</span>
            </legend>
            <button
              type="button"
              onClick={() => {
                clearError("permissions");
                setPermissions(allSelected ? [] : [...ADMIN_PERMISSIONS]);
              }}
              disabled={isPending}
              className="rounded-lg px-2 py-1 text-[11px] font-bold text-[#FF8A2A] transition-colors hover:bg-[#FF6A00]/10 disabled:opacity-50"
            >
              {allSelected ? "حذف همه" : "انتخاب همه"}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {ADMIN_PERMISSIONS.map((permission) => {
              const checked = permissions.includes(permission);
              const meta = ADMIN_PERMISSION_META[permission];
              const Icon = PERMISSION_ICONS[permission];
              return (
                <label
                  key={permission}
                  className={cn(
                    "group relative flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition-colors",
                    checked
                      ? "border-[#FF6A00]/45 bg-[#FF6A00]/[0.08]"
                      : "border-white/[0.08] bg-[#0A0D12] hover:border-white/[0.18]",
                    isPending && "cursor-not-allowed opacity-60"
                  )}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => togglePermission(permission)}
                    disabled={isPending}
                  />
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
                      checked ? "border-[#FF6A00]/40 bg-[#FF6A00]/15 text-[#FF8A2A]" : "border-white/[0.08] bg-white/[0.03] text-[#5E6672]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-[#F5F5F5]">{meta.label}</span>
                    <span className="mt-1 block text-[11px] leading-5 text-[#8B93A1]">{meta.description}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors group-has-[:focus-visible]:ring-2 group-has-[:focus-visible]:ring-[#FF6A00]/50",
                      checked ? "border-[#FF6A00] bg-[#FF6A00] text-[#07090C]" : "border-white/[0.2] bg-transparent"
                    )}
                  >
                    {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                </label>
              );
            })}
          </div>
          {fieldErrors.permissions ? (
            <p className="text-xs text-red-400">{fieldErrors.permissions}</p>
          ) : (
            <p className="text-[11px] leading-5 text-[#5E6672]">
              هر بخش به معنای مدیریت کامل آن است. مدیریت مدیران، نقش‌ها و اشتراک‌ها فقط برای مدیر کل امکان‌پذیر است.
            </p>
          )}
        </fieldset>
      </form>
    </Modal>
  );
}
