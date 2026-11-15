/** Car catalogue media limits and types (client-safe). */

/** Largest car video accepted, in bytes (50 MB). */
export const CAR_VIDEO_MAX_BYTES = 50 * 1024 * 1024;
/** Most videos one car may have. */
export const CAR_VIDEO_MAX_COUNT = 6;
/** `accept` of the video file input. */
export const CAR_VIDEO_ACCEPT = "video/mp4,video/webm";

/** One slide of a car's photo/video gallery. */
export type CarMediaItem = { type: "image"; url: string } | { type: "video"; url: string };

/** "۱۲٫۴ مگابایت" */
export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1).replace(/\.0$/, "")} مگابایت`;
  return `${Math.max(1, Math.round(bytes / 1024))} کیلوبایت`;
}
