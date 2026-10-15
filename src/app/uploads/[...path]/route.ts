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
 * - conditional requests via ETag / Last-Modified.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteContext {
  params: { path: string[] };
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
    "X-Content-Type-Options": "nosniff",
  });
}

export async function GET(request: NextRequest, { params }: RouteContext): Promise<Response> {
  const file = await lookup(params.path ?? []);
  if (!file) return notFound();

  const headers = buildHeaders(file);

  // Conditional request: let the browser reuse its cached copy.
  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch && ifNoneMatch === file.etag) {
    headers.delete("Content-Length");
    return new Response(null, { status: 304, headers });
  }

  const nodeStream = createReadStream(file.absolute);
  const body = Readable.toWeb(nodeStream) as unknown as ReadableStream<Uint8Array>;
  return new Response(body, { status: 200, headers });
}

export async function HEAD(_request: NextRequest, { params }: RouteContext): Promise<Response> {
  const file = await lookup(params.path ?? []);
  if (!file) return notFound();
  return new Response(null, { status: 200, headers: buildHeaders(file) });
}
