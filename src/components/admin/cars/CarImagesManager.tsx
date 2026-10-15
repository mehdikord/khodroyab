"use client";

import React, { useRef, useState, useTransition } from "react";
import { Plus, Trash2, ImagePlus, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { addCarImageAction, deleteCarImageAction } from "@/app/admin/(panel)/cars/[id]/images/actions";
import type { CarImageRecord } from "@/lib/car-images";
import { cn } from "@/lib/utils";

interface CarImagesManagerProps {
  carId: string;
  carName: string;
  initialImages: CarImageRecord[];
}

export function CarImagesManager({ carId, carName, initialImages }: CarImagesManagerProps) {
  const [images, setImages] = useState<CarImageRecord[]>(initialImages);
  const [deleteTarget, setDeleteTarget] = useState<CarImageRecord | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startUploadTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  function showToast(kind: ToastState["kind"], message: string) {
    setToast({ kind, message });
    setTimeout(() => setToast(null), 4000);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.set("imageFile", file);

    startUploadTransition(async () => {
      const result = await addCarImageAction(carId, formData);
      if (result.ok) {
        setImages((prev) => [...prev, result.record]);
        showToast("success", "تصویر با موفقیت بارگذاری شد.");
      } else {
        showToast("error", result.message);
      }
    });
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;

    startDeleteTransition(async () => {
      const result = await deleteCarImageAction(target.id, carId);
      setDeleteTarget(null);
      if (result.ok) {
        setImages((prev) => prev.filter((img) => img.id !== target.id));
        showToast("success", "تصویر با موفقیت حذف شد.");
      } else {
        showToast("error", result.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {deleteTarget && (
        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title="حذف تصویر"
          message="آیا مطمئن هستید که می‌خواهید این تصویر را حذف کنید؟"
          confirmLabel={isDeleting ? "در حال حذف..." : "حذف"}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteTarget(null)}
          pending={isDeleting}
          danger={true}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Link
            href="/admin/cars"
            className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-[#9BA3AE] transition-colors hover:bg-white/[0.06] hover:text-[#F5F5F5]"
          >
            <ArrowRight className="h-3.5 w-3.5" />
            بازگشت به لیست خودروها
          </Link>
          <h1 className="text-lg font-extrabold text-[#F5F5F5]">
            مدیریت تصاویر خودرو: {carName}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] transition-all hover:brightness-110 disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ImagePlus className="h-5 w-5" />
          )}
          افزودن تصویر جدید
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative group rounded-xl overflow-hidden border border-white/[0.1] bg-[#07090C]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.imageUrl} alt="Car" className="h-40 w-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => setDeleteTarget(img)}
                className="p-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 hover:bg-red-500/40"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
