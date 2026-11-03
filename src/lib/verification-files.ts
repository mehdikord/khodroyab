import "server-only";

import crypto from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import { MIME_TO_EXTENSION } from "@/lib/uploads";

/**
 * Private storage for identity documents.
 *
 * Unlike the other uploads these files must never be publicly reachable, so
 * they live outside `UPLOAD_ROOT` (which defaults to `public/uploads`, served
 * statically) and are streamed only by `/api/verification-documents/[id]`
 * after checking that the viewer is an administrator or the document's owner.
 */
export const VERIFICATION_ROOT = path.resolve(
  process.env.PRIVATE_UPLOAD_DIR?.trim()
    ? path.join(process.env.PRIVATE_UPLOAD_DIR.trim(), "verifications")
    : path.join(process.cwd(), "storage", "verifications")
);

const SAFE_FILE_NAME = /^[A-Za-z0-9._-]+$/;

/** Persist a document image and return its stored file name. Validate type and size first. */
export async function saveVerificationFile(file: File): Promise<string> {
  const extension = MIME_TO_EXTENSION[file.type] ?? "jpg";
  const fileName = `doc-${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${extension}`;
  await fs.mkdir(VERIFICATION_ROOT, { recursive: true });
  await fs.writeFile(path.join(VERIFICATION_ROOT, fileName), Buffer.from(await file.arrayBuffer()));
  return fileName;
}

/** Absolute path of a stored document, or null for names that are unsafe or escape the root. */
export function resolveVerificationFile(fileName: string): string | null {
  if (!SAFE_FILE_NAME.test(fileName) || fileName.startsWith(".")) return null;
  const absolute = path.resolve(VERIFICATION_ROOT, fileName);
  return path.dirname(absolute) === VERIFICATION_ROOT ? absolute : null;
}

/** Best-effort removal of stored documents. */
export async function removeVerificationFiles(fileNames: string[]): Promise<void> {
  await Promise.all(
    fileNames.map(async (fileName) => {
      const absolute = resolveVerificationFile(fileName);
      if (absolute) await fs.unlink(absolute).catch(() => undefined);
    })
  );
}
