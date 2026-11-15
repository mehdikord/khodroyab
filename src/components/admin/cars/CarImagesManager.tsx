"use client";

import React, { useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, Clapperboard, Film, ImageIcon, ImagePlus, Loader2, Trash2, Upload, X } from "lucide-react";

import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { Toast, type ToastState } from "@/components/admin/ui/Toast";
import { addCarImageAction, deleteCarImageAction, deleteCarVideoAction } from "@/app/admin/(panel)/cars/[id]/images/actions";
import type { CarImageRecord, CarVideoRecord } from "@/lib/car-images";
import { CAR_VIDEO_ACCEPT, CAR_VIDEO_MAX_BYTES, CAR_VIDEO_MAX_COUNT, formatFileSize } from "@/lib/car-media-shared";
import { cn, toPersianDigits } from "@/lib/utils";

interface CarImagesManagerProps {
  carId: string;
  carName: string;
  initialImages: CarImageRecord[];
  initialVideos: CarVideoRecord[];
}

type DeleteTarget = { kind: "image"; record: CarImageRecord } | { kind: "video"; record: CarVideoRecord };

type UploadState = { name: string; size: number; loaded: number; xhr: XMLHttpRequest };

type UploadResult = { ok: true; record: CarVideoRecord } | { ok: false; message: string };

/**
 * Raw-body upload to `/api/admin/cars/:id/videos` with progress (fetch cannot
 * report upload progress). Resolves with the server's JSON result.
 */
function uploadVideo(carId: string, file: File, onProgress: (loaded: number) => void, onStart: (xhr: XMLHttpRequest) => void): Promise<UploadResult> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/admin/cars/${carId}/videos`);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (event) => onProgress(event.loaded);
    xhr.onload = () => {
      try {
        resolve(JSON.parse(xhr.responseText) as UploadResult);
      } catch {
        resolve({ ok: false, message: xhr.status === 413 ? "حجم ویدیو بیش از حد مجاز است." : "خطایی رخ داد؛ لطفاً دوباره تلاش کنید." });
      }
    };
    xhr.onerror = () => resolve({ ok: false, message: "ارتباط با سرور برقرار نشد؛ اتصال اینترنت را بررسی کنید." });
    xhr.onabort = () => resolve({ ok: false, message: "بارگذاری ویدیو لغو شد." });
    onStart(xhr);
    xhr.send(file);
  });
}

function SectionHeader({
  icon: Icon,
  title,
  hint,
  action,
}: {
  icon: typeof ImageIcon;
  title: string;
  hint: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-white/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/10 text-[#FF8A2A]">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-sm font-extrabold text-[#F5F5F5]">{title}</h2>
          <p className="mt-0.5 text-[11px] text-[#8B93A1]">{hint}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

const addButtonClass =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] px-5 text-sm font-extrabold text-[#07090C] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50";

function EmptyState({ icon: Icon, text }: { icon: typeof ImageIcon; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/[0.1] py-10 text-center text-xs text-[#8B93A1]">
      <Icon className="h-7 w-7 text-[#5E6672]" />
      {text}
    </div>
  );
}

/** Photos and videos of one car (shown together on the car's price-list page). */
export function CarImagesManager({ carId, carName, initialImages, initialVideos }: CarImagesManagerProps) {
  const [images, setImages] = useState<CarImageRecord[]>(initialImages);
  const [videos, setVideos] = useState<CarVideoRecord[]>(initialVideos);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [upload, setUpload] = useState<UploadState | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startUploadTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const videoLimitReached = videos.length >= CAR_VIDEO_MAX_COUNT;

  function showToast(kind: ToastState["kind"], message: string) {
    setToast({ kind, message });
    setTimeout(() => setToast(null), 4000);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
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

  async function handleVideoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!CAR_VIDEO_ACCEPT.split(",").includes(file.type)) {
      showToast("error", "فرمت ویدیو باید MP4 یا WebM باشد.");
      return;
    }
    if (file.size > CAR_VIDEO_MAX_BYTES) {
      showToast("error", `حجم ویدیو (${formatFileSize(file.size)}) بیشتر از ۵۰ مگابایت است.`);
      return;
    }

    const result = await uploadVideo(
      carId,
      file,
      (loaded) => setUpload((current) => (current ? { ...current, loaded } : current)),
      (xhr) => setUpload({ name: file.name, size: file.size, loaded: 0, xhr })
    );
    setUpload(null);
    if (result.ok) {
      setVideos((prev) => [...prev, result.record]);
      showToast("success", "ویدیو با موفقیت بارگذاری شد.");
    } else {
      showToast("error", result.message);
    }
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;

    startDeleteTransition(async () => {
      const result =
        target.kind === "image" ? await deleteCarImageAction(target.record.id, carId) : await deleteCarVideoAction(target.record.id, carId);
      setDeleteTarget(null);
      if (!result.ok) {
        showToast("error", result.message);
        return;
      }
      if (target.kind === "image") setImages((prev) => prev.filter((img) => img.id !== target.record.id));
      else setVideos((prev) => prev.filter((video) => video.id !== target.record.id));
      showToast("success", target.kind === "image" ? "تصویر با موفقیت حذف شد." : "ویدیو با موفقیت حذف شد.");
    });
  }

  const percent = upload ? Math.min(100, Math.round((upload.loaded / Math.max(1, upload.size)) * 100)) : 0;

  return (
    <div className="space-y-6">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {deleteTarget && (
        <ConfirmDialog
          open
          title={deleteTarget.kind === "image" ? "حذف تصویر" : "حذف ویدیو"}
          message={`آیا مطمئن هستید که می‌خواهید این ${deleteTarget.kind === "image" ? "تصویر" : "ویدیو"} را حذف کنید؟`}
          confirmLabel={isDeleting ? "در حال حذف..." : "حذف"}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteTarget(null)}
          pending={isDeleting}
          danger
        />
      )}

      <div className="flex flex-col gap-2">
        <Link
          href="/admin/cars"
          className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-[#9BA3AE] transition-colors hover:bg-white/[0.06] hover:text-[#F5F5F5]"
        >
          <ArrowRight className="h-3.5 w-3.5" />
          بازگشت به لیست خودروها
        </Link>
        <h1 className="text-lg font-extrabold text-[#F5F5F5]">تصاویر و ویدیوهای خودرو: {carName}</h1>
        <p className="text-xs leading-6 text-[#8B93A1]">
          تصاویر و ویدیوها به‌صورت اسلاید در بالای صفحه لیست قیمت این خودرو نمایش داده می‌شوند؛ اولین تصویر، تصویر اصلی (کاور) خودرو است.
        </p>
      </div>

      {/* Photos */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1117]">
        <SectionHeader
          icon={ImageIcon}
          title={`تصاویر (${toPersianDigits(images.length)})`}
          hint="PNG، JPG، WebP یا AVIF · حداکثر ۲ مگابایت"
          action={
            <>
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className={addButtonClass}>
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
                افزودن تصویر
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                onChange={handleFileChange}
                className="hidden"
              />
            </>
          }
        />
        <div className="p-4 sm:p-5">
          {images.length === 0 ? (
            <EmptyState icon={ImageIcon} text="هنوز تصویری برای این خودرو بارگذاری نشده است." />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {images.map((img, index) => (
                <div key={img.id} className="group relative overflow-hidden rounded-xl border border-white/[0.1] bg-[#07090C]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.imageUrl} alt="" className="h-40 w-full object-cover" />
                  {index === 0 && (
                    <span className="absolute start-2 top-2 rounded-lg bg-[#FF6A00] px-2 py-0.5 text-[10px] font-extrabold text-[#07090C]">کاور</span>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                    <button
                      type="button"
                      aria-label="حذف تصویر"
                      onClick={() => setDeleteTarget({ kind: "image", record: img })}
                      className="rounded-lg border border-red-500/20 bg-red-500/20 p-2 text-red-400 hover:bg-red-500/40"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Videos */}
      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1117]">
        <SectionHeader
          icon={Clapperboard}
          title={`ویدیوها (${toPersianDigits(videos.length)} از ${toPersianDigits(CAR_VIDEO_MAX_COUNT)})`}
          hint="MP4 یا WebM · حداکثر ۵۰ مگابایت · برای پخش روی همه گوشی‌ها MP4 (H.264) پیشنهاد می‌شود"
          action={
            <>
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={Boolean(upload) || videoLimitReached}
                title={videoLimitReached ? "به حداکثر تعداد ویدیو رسیده‌اید" : undefined}
                className={addButtonClass}
              >
                {upload ? <Loader2 className="h-5 w-5 animate-spin" /> : <Film className="h-5 w-5" />}
                افزودن ویدیو
              </button>
              <input ref={videoInputRef} type="file" accept={CAR_VIDEO_ACCEPT} onChange={handleVideoChange} className="hidden" />
            </>
          }
        />
        <div className="space-y-4 p-4 sm:p-5">
          {upload && (
            <div className="rounded-xl border border-[#FF6A00]/30 bg-[#FF6A00]/[0.06] p-3.5" aria-live="polite">
              <div className="flex items-center gap-3">
                <Upload className="h-4 w-4 shrink-0 text-[#FF8A2A]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-[#F5F5F5]" dir="auto">
                    {upload.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-[#8B93A1]">
                    {toPersianDigits(percent)}٪ · {formatFileSize(upload.loaded)} از {formatFileSize(upload.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => upload.xhr.abort()}
                  aria-label="لغو بارگذاری"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.1] text-[#9BA3AE] hover:text-[#F5F5F5]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-[#FF6A00] to-[#FF8A2A] transition-[width] duration-200"
                  style={{ width: `${percent}%` }}
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          )}

          {videos.length === 0 && !upload ? (
            <EmptyState icon={Clapperboard} text="هنوز ویدیویی برای این خودرو بارگذاری نشده است." />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <div key={video.id} className="overflow-hidden rounded-xl border border-white/[0.1] bg-[#07090C]">
                  <video src={`${video.videoUrl}#t=0.1`} controls preload="metadata" playsInline className={cn("aspect-video w-full bg-black object-contain")} />
                  <div className="flex items-center justify-between gap-2 px-3 py-2">
                    <span className="font-mono text-[11px] text-[#8B93A1]">{video.sizeBytes ? formatFileSize(video.sizeBytes) : "ویدیو"}</span>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ kind: "video", record: video })}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[11px] font-bold text-red-400 hover:bg-red-500/25"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
