import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { adminActionDenied } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { carVideoToRecord } from "@/lib/car-images";
import { CAR_VIDEO_MAX_BYTES, CAR_VIDEO_MAX_COUNT } from "@/lib/car-media-shared";
import { UploadInvalidTypeError, UploadTooLargeError, VIDEO_MIME_TO_EXTENSION, removeUpload, saveVideoStream } from "@/lib/uploads";

/**
 * Upload one car video: the raw file is the request body (no multipart), so
 * it streams straight to disk instead of being buffered like a Server Action
 * payload. Admins with the "cars" permission only, same-origin only.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function fail(message: string, status: number): Response {
  return Response.json({ ok: false, message }, { status });
}

export async function POST(request: NextRequest, props: RouteContext): Promise<Response> {
  const params = await props.params;
  if (!(await isTrustedOrigin())) return fail("درخواست نامعتبر است.", 403);
  const denied = await adminActionDenied("cars");
  if (denied) return fail(denied, 401);

  if (!/^\d{1,20}$/.test(params.id)) return fail("شناسه خودرو نامعتبر است", 400);
  const carId = BigInt(params.id);

  const type = (request.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (!VIDEO_MIME_TO_EXTENSION[type]) return fail("فرمت ویدیو باید MP4 یا WebM باشد.", 415);

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > CAR_VIDEO_MAX_BYTES) return fail("حجم ویدیو نباید بیشتر از ۵۰ مگابایت باشد.", 413);
  if (!request.body) return fail("فایلی ارسال نشده است.", 400);

  const car = await prisma.car.findUnique({ where: { id: carId }, select: { slug: true, _count: { select: { carVideos: true } } } });
  if (!car) return fail("خودرو پیدا نشد.", 404);
  if (car._count.carVideos >= CAR_VIDEO_MAX_COUNT) {
    return fail(`هر خودرو حداکثر ${CAR_VIDEO_MAX_COUNT.toLocaleString("fa-IR")} ویدیو می‌تواند داشته باشد.`, 409);
  }

  let saved: { url: string; size: number };
  try {
    saved = await saveVideoStream("cars", request.body, CAR_VIDEO_MAX_BYTES, `${car.slug}-video`);
  } catch (error) {
    if (error instanceof UploadTooLargeError) return fail("حجم ویدیو نباید بیشتر از ۵۰ مگابایت باشد.", 413);
    if (error instanceof UploadInvalidTypeError) return fail("فایل انتخاب‌شده ویدیوی MP4 یا WebM معتبر نیست.", 415);
    console.error("[carVideos:upload] failed", error);
    return fail("خطا در ذخیره فایل ویدیو", 500);
  }

  try {
    const record = await prisma.carVideo.create({ data: { carId, videoUrl: saved.url, sizeBytes: saved.size } });
    revalidatePath(`/admin/cars/${params.id}/images`);
    revalidatePath(`/panel/price-list/${params.id}`);
    return Response.json({ ok: true, record: carVideoToRecord(record) });
  } catch (error) {
    await removeUpload(saved.url, "cars");
    console.error("[carVideos:create] failed", error);
    return fail("خطایی رخ داد؛ لطفاً دوباره تلاش کنید.", 500);
  }
}
