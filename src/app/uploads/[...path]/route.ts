import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import type { NextRequest } from "next/server";

import { EXTENSION_TO_MIME, resolveUploadPath } from "@/lib/uploads";

/**
 * Serves admin-uploaded files at `/uploads/<subdir>/<file>`.
 *
 * Next.js only serves `public/` files that existed at build time, so uploads
 * made after deployment would otherwise 404 in production. This handler reads
 * directly from `UPLOAD_ROOT` on every request (no manifest), with:
 * - strict path validation (no traversal, whitelisted extensions),
 * - long-lived immutable caching (file names are unique per upload),
 * - conditional requests via ETag / Last-Modified,
 * - byte ranges (`Range: bytes=…` → 206), which video players need to seek
 *   and which iOS Safari requires before it plays a video at all.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

function notFound(): Response {
  return new Response("Not Found", { status: 404, headers: { "Cache-Control": "no-store" } });
}

async function lookup(segments: string[]) {
  const absolute = resolveUploadPath(segments);
  if (!absolute) return null;

  const extension = path.extname(absolute).slice(1).toLowerCase();
  const contentType = EXTENSION_TO_MIME[extension];
  if (!contentType) return null;

  const stat = await fs.stat(absolute).catch(() => null);
  if (!stat || !stat.isFile()) return null;

  const etag = `"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`;
  return { absolute, contentType, stat, etag };
}

function buildHeaders(file: NonNullable<Awaited<ReturnType<typeof lookup>>>): Headers {
  return new Headers({
    "Content-Type": file.contentType,
    "Content-Length": String(file.stat.size),
    "Cache-Control": "public, max-age=31536000, immutable",
    "Last-Modified": file.stat.mtime.toUTCString(),
    ETag: file.etag,
    "Accept-Ranges": "bytes",
    "X-Content-Type-Options": "nosniff",
  });
}

/**
 * First byte range of a `Range: bytes=start-end` header (suffix `-n` and
 * open-ended `start-` included), clamped to the file; null when absent,
 * "invalid" when unsatisfiable. Multi-range requests are served as the first range.
 */
function parseRange(header: string | null, size: number): { start: number; end: number } | null | "invalid" {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)/.exec(header.trim());
  if (!match || (!match[1] && !match[2])) return "invalid";
  let start: number;
  let end: number;
  if (!match[1]) {
    const suffix = Number(match[2]);
    if (suffix === 0) return "invalid";
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  }
  if (start >= size || start > end) return "invalid";
  return { start, end };
}

export async function GET(request: NextRequest, props: RouteContext): Promise<Response> {
  const params = await props.params;
  const file = await lookup(params.path ?? []);
  if (!file) return notFound();

  const headers = buildHeaders(file);

  // Conditional request: let the browser reuse its cached copy.
  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch && ifNoneMatch === file.etag) {
    headers.delete("Content-Length");
    return new Response(null, { status: 304, headers });
  }

  const range = parseRange(request.headers.get("range"), file.stat.size);
  if (range === "invalid") {
    headers.set("Content-Range", `bytes */${file.stat.size}`);
    headers.delete("Content-Length");
    return new Response(null, { status: 416, headers });
  }
  if (range) {
    headers.set("Content-Range", `bytes ${range.start}-${range.end}/${file.stat.size}`);
    headers.set("Content-Length", String(range.end - range.start + 1));
    const partial = createReadStream(file.absolute, { start: range.start, end: range.end });
    return new Response(Readable.toWeb(partial) as unknown as ReadableStream<Uint8Array>, { status: 206, headers });
  }

  const nodeStream = createReadStream(file.absolute);
  const body = Readable.toWeb(nodeStream) as unknown as ReadableStream<Uint8Array>;
  return new Response(body, { status: 200, headers });
}

export async function HEAD(_request: NextRequest, props: RouteContext): Promise<Response> {
  const params = await props.params;
  const file = await lookup(params.path ?? []);
  if (!file) return notFound();
  return new Response(null, { status: 200, headers: buildHeaders(file) });
}
