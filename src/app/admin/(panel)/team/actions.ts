"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { adminActionDenied } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";
import { teamMemberToRecord, TEAM_ORDER_BY, type TeamMemberRecord } from "@/lib/team";
import { slugify } from "@/lib/validation/brands";
import { parseTeamMemberForm } from "@/lib/validation/team";
import { isManagedUpload, removeUpload, saveUpload } from "@/lib/uploads";

const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";
const NOT_FOUND_MESSAGE = "عضو مورد نظر یافت نشد";
const PHOTO_REQUIRED = {
  ok: false as const,
  message: "عکس عضو تیم را بارگذاری کنید",
  fieldErrors: { photoFile: "عکس الزامی است" },
};

export type TeamMemberActionResult =
  | { ok: true; record: TeamMemberRecord }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export type TeamSimpleActionResult = { ok: true } | { ok: false; message: string };

export type TeamReorderResult = { ok: true; records: TeamMemberRecord[] } | { ok: false; message: string };

async function guardRequest(): Promise<{ ok: false; message: string } | null> {
  if (!isTrustedOrigin()) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const denied = await adminActionDenied("team");
  if (denied) return { ok: false, message: denied };
  return null;
}

function parseId(id: string): bigint | null {
  if (!/^\d{1,20}$/.test(id)) return null;
  return BigInt(id);
}

/** The admin list and the About tab of the contact page. */
function revalidateTeamPages() {
  revalidatePath("/admin/team");
  revalidatePath("/panel/contact");
}

/** Next free display position (end of the list). */
async function nextSortOrder(): Promise<number> {
  const last = await prisma.teamMember.aggregate({ _max: { sortOrder: true } });
  return (last._max.sortOrder ?? 0) + 1;
}

function savePhoto(file: File, name: string): Promise<string> {
  return saveUpload("team", file, slugify(name) || "member");
}

/** Create a team member. Fields: name, position, bio, photo (URL) or photoFile, sortOrder (blank = last), isActive. */
export async function createTeamMemberAction(formData: FormData): Promise<TeamMemberActionResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  const parsed = parseTeamMemberForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };
  if (!parsed.file && !parsed.data.photo) return PHOTO_REQUIRED;

  try {
    const photo = parsed.file ? await savePhoto(parsed.file, parsed.data.name) : parsed.data.photo;
    const member = await prisma.teamMember.create({
      data: {
        name: parsed.data.name,
        position: parsed.data.position,
        bio: parsed.data.bio,
        photo,
        isActive: parsed.data.isActive,
        sortOrder: parsed.data.sortOrder ?? (await nextSortOrder()),
      },
    });
    revalidateTeamPages();
    return { ok: true, record: teamMemberToRecord(member) };
  } catch (error) {
    console.error("[team:create] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/** Update a team member; a new upload replaces (and deletes) the previous managed photo file. */
export async function updateTeamMemberAction(id: string, formData: FormData): Promise<TeamMemberActionResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  const memberId = parseId(id);
  if (memberId === null) return { ok: false, message: NOT_FOUND_MESSAGE };

  const parsed = parseTeamMemberForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.message, fieldErrors: parsed.fieldErrors };
  if (!parsed.file && !parsed.data.photo) return PHOTO_REQUIRED;

  const current = await prisma.teamMember.findUnique({ where: { id: memberId }, select: { photo: true, sortOrder: true } });
  if (!current) return { ok: false, message: NOT_FOUND_MESSAGE };

  try {
    const photo = parsed.file ? await savePhoto(parsed.file, parsed.data.name) : parsed.data.photo;
    const member = await prisma.teamMember.update({
      where: { id: memberId },
      data: {
        name: parsed.data.name,
        position: parsed.data.position,
        bio: parsed.data.bio,
        photo,
        isActive: parsed.data.isActive,
        sortOrder: parsed.data.sortOrder ?? current.sortOrder,
      },
    });
    if (photo !== current.photo && isManagedUpload(current.photo)) await removeUpload(current.photo, "team");
    revalidateTeamPages();
    return { ok: true, record: teamMemberToRecord(member) };
  } catch (error) {
    console.error("[team:update] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/** Flip a member's visibility on the About page. */
export async function toggleTeamMemberActiveAction(id: string): Promise<TeamMemberActionResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  const memberId = parseId(id);
  if (memberId === null) return { ok: false, message: NOT_FOUND_MESSAGE };

  const current = await prisma.teamMember.findUnique({ where: { id: memberId }, select: { isActive: true } });
  if (!current) return { ok: false, message: NOT_FOUND_MESSAGE };

  try {
    const member = await prisma.teamMember.update({ where: { id: memberId }, data: { isActive: !current.isActive } });
    revalidateTeamPages();
    return { ok: true, record: teamMemberToRecord(member) };
  } catch (error) {
    console.error("[team:toggle] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

/** Delete a team member and their uploaded photo. */
export async function deleteTeamMemberAction(id: string): Promise<TeamSimpleActionResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  const memberId = parseId(id);
  if (memberId === null) return { ok: false, message: NOT_FOUND_MESSAGE };

  const current = await prisma.teamMember.findUnique({ where: { id: memberId }, select: { photo: true } });
  if (!current) return { ok: false, message: NOT_FOUND_MESSAGE };

  try {
    await prisma.teamMember.delete({ where: { id: memberId } });
  } catch (error) {
    console.error("[team:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  await removeUpload(current.photo, "team");
  revalidateTeamPages();
  return { ok: true };
}

/**
 * Persist a new display order: `ids` is the full list in the desired order;
 * each member gets `sort_order = position + 1`.
 */
export async function reorderTeamMembersAction(ids: string[]): Promise<TeamReorderResult> {
  const guard = await guardRequest();
  if (guard) return guard;

  if (!Array.isArray(ids) || ids.length > 1000) return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  const parsedIds = ids.map(parseId);
  if (parsedIds.some((id) => id === null) || new Set(ids).size !== ids.length) {
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }

  try {
    await prisma.$transaction(
      parsedIds.map((id, index) => prisma.teamMember.updateMany({ where: { id: id! }, data: { sortOrder: index + 1 } }))
    );
    const members = await prisma.teamMember.findMany({ orderBy: TEAM_ORDER_BY });
    revalidateTeamPages();
    return { ok: true, records: members.map(teamMemberToRecord) };
  } catch (error) {
    console.error("[team:reorder] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
