import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

import prisma from "@/lib/prisma";
import { EXTENSION_TO_MIME } from "@/lib/uploads";
import { getCurrentAdmin } from "@/lib/auth/guards";
import { getCurrentUser } from "@/lib/auth/user-auth";
import { resolveVerificationFile } from "@/lib/verification-files";

/**
 * Streams one identity document. Only administrators and the document's owner
 * may open it; everyone else gets a 404 so document ids cannot be probed.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteContext {
  params: { id: string };
}

function notFound(): Response {
  return new Response("Not Found", { status: 404, headers: { "Cache-Control": "no-store" } });
}

export async function GET(_request: Request, { params }: RouteContext): Promise<Response> {
  if (!/^\d{1,20}$/.test(params.id)) return notFound();

  const document = await prisma.userVerificationDocument.findUnique({
    where: { id: BigInt(params.id) },
    select: { imageUrl: true, verification: { select: { userId: true } } },
  });
  if (!document) return notFound();

  let allowed = Boolean(await getCurrentAdmin());
  if (!allowed) {
    const user = await getCurrentUser();
    allowed = user !== null && user.id === document.verification.userId.toString();
  }
  if (!allowed) return notFound();

  const absolute = resolveVerificationFile(document.imageUrl);
  if (!absolute) return notFound();
  const contentType = EXTENSION_TO_MIME[path.extname(absolute).slice(1).toLowerCase()];
  const stat = await fs.stat(absolute).catch(() => null);
  if (!contentType || !stat || !stat.isFile()) return notFound();

  const body = Readable.toWeb(createReadStream(absolute)) as unknown as ReadableStream<Uint8Array>;
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(stat.size),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
