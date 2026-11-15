"use server";

import { revalidatePath } from "next/cache";

import { authorizeAdminAction } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { isPurchaseRequestStatus, savePurchaseRequestNote, setPurchaseRequestStatus } from "@/lib/purchase-requests";
import { adminNoteSchema } from "@/lib/validation/purchase-requests";

const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

export type PurchaseRequestActionResult = { ok: true } | { ok: false; message: string };

function revalidateRequests(id: string) {
  revalidatePath("/admin", "layout"); // sidebar badges
  revalidatePath("/admin/purchase-requests/public");
  revalidatePath("/admin/purchase-requests/members");
  revalidatePath(`/admin/purchase-requests/public/${id}`);
  revalidatePath(`/admin/purchase-requests/members/${id}`);
  revalidatePath("/panel/requests");
}

/** Change a request's status (root only); the change is logged with the admin's name. */
export async function setPurchaseRequestStatusAction(id: string, status: string): Promise<PurchaseRequestActionResult> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const auth = await authorizeAdminAction("root");
  if (!auth.ok) return auth;
  if (!isPurchaseRequestStatus(status)) return { ok: false, message: "وضعیت نامعتبر است" };

  try {
    const result = await setPurchaseRequestStatus(id, status, { id: auth.admin.id, name: auth.admin.name });
    if (!result.ok) return result;
    revalidateRequests(id);
    return { ok: true };
  } catch (error) {
    console.error("[purchase-requests:status] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/** Save the internal note of a request (root only). */
export async function savePurchaseRequestNoteAction(id: string, note: string): Promise<PurchaseRequestActionResult> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const auth = await authorizeAdminAction("root");
  if (!auth.ok) return auth;
  const parsed = adminNoteSchema.safeParse(note);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "یادداشت معتبر نیست" };

  try {
    const result = await savePurchaseRequestNote(id, parsed.data);
    if (!result.ok) return result;
    revalidateRequests(id);
    return { ok: true };
  } catch (error) {
    console.error("[purchase-requests:note] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
