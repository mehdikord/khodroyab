import "server-only";

import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Centralised storage for files uploaded through the admin panel.
 *
 * Files are written under `UPLOAD_ROOT` and exposed at `/uploads/<subdir>/<file>`
 * by the route handler in `src/app/uploads/[...path]/route.ts`.
 *
 * Why a route handler instead of relying on `public/`?
 * Next.js only serves files that existed in `public/` at *build* time; anything
 * written there later returns 404 in production until the next build. Serving
 * uploads through a route sidesteps that, and also lets deployments point
 * `UPLOAD_DIR` at a persistent volume outside the application directory.
 */

/** Absolute directory that holds all uploads. Defaults to `<cwd>/public/uploads`. */
export const UPLOAD_ROOT = path.resolve(
  process.env.UPLOAD_DIR?.trim() || path.join(process.cwd(), "public", "uploads")
);

/** URL prefix under which uploads are served. */
export const UPLOAD_URL_PREFIX = "/uploads";

/** Sub-directories a caller may write to. Keeps paths predictable and listable. */
export type UploadSubdir = "brands" | "cars" | "users" | "sale-terms" | "sponsors";

export const MIME_TO_EXTENSION: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
};

/** Served content types, keyed by lower-case file extension (without the dot). */
export const EXTENSION_TO_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
};

/** Conservative file-name whitelist: letters, digits, dot, dash, underscore. */
const SAFE_SEGMENT = /^[A-Za-z0-9._-]+$/;

function sanitizeBaseName(baseName: string | undefined, fallback: string): string {
  const cleaned = (baseName ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return cleaned || fallback;
}

/**
 * Persist an uploaded image and return its public URL path
 * (e.g. `/uploads/cars/car-1712345678-9f3a2b1c.jpg`).
 * The caller is responsible for validating MIME type and size beforehand.
 */
export async function saveUpload(
  subdir: UploadSubdir,
  file: File,
  baseName?: string
): Promise<string> {
  const extension = MIME_TO_EXTENSION[file.type] ?? "jpg";
  const prefix = sanitizeBaseName(baseName, subdir.replace(/s$/, ""));
  const fileName = `${prefix}-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${extension}`;

  const dir = path.join(UPLOAD_ROOT, subdir);
  await fs.mkdir(dir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, fileName), bytes);

  return `${UPLOAD_URL_PREFIX}/${subdir}/${fileName}`;
}

/**
 * Resolve a public upload path (`/uploads/cars/x.jpg`) or URL segments
 * (`["cars", "x.jpg"]`) to an absolute file path inside `UPLOAD_ROOT`.
 * Returns `null` for anything that escapes the root or contains unsafe segments.
 */
export function resolveUploadPath(input: string | string[]): string | null {
  const segments = Array.isArray(input)
    ? input
    : input.replace(new RegExp(`^${UPLOAD_URL_PREFIX}/?`), "").split("/");

  if (segments.length === 0) return null;
  for (const segment of segments) {
    if (!segment || segment === "." || segment === ".." || !SAFE_SEGMENT.test(segment)) {
      return null;
    }
  }

  const absolute = path.resolve(UPLOAD_ROOT, ...segments);
  const rootWithSep = UPLOAD_ROOT.endsWith(path.sep) ? UPLOAD_ROOT : UPLOAD_ROOT + path.sep;
  return absolute.startsWith(rootWithSep) ? absolute : null;
}

/**
 * Best-effort removal of a previously uploaded file. Silently ignores paths
 * that are not managed uploads (external URLs, legacy paths) or missing files.
 * Pass `subdir` to additionally restrict deletion to one folder.
 */
export async function removeUpload(publicPath: string | null | undefined, subdir?: UploadSubdir): Promise<void> {
  if (!publicPath) return;
  const expectedPrefix = subdir ? `${UPLOAD_URL_PREFIX}/${subdir}/` : `${UPLOAD_URL_PREFIX}/`;
  if (!publicPath.startsWith(expectedPrefix)) return;

  const absolute = resolveUploadPath(publicPath);
  if (!absolute) return;
  await fs.unlink(absolute).catch(() => undefined);
}

/** True when a stored image path points at a file we manage on disk. */
export function isManagedUpload(publicPath: string | null | undefined): boolean {
  return Boolean(publicPath && publicPath.startsWith(`${UPLOAD_URL_PREFIX}/`));
}
