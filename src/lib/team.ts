import "server-only";

import type { TeamMember } from "@prisma/client";

import prisma from "@/lib/prisma";

/** Serializable team member (BigInt/Date normalized to strings) for client components. */
export interface TeamMemberRecord {
  id: string;
  name: string;
  photo: string;
  position: string;
  bio: string | null;
  isActive: boolean;
  /** Display priority: lower numbers are shown first. */
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** What the public "About us" team section needs. */
export interface PublicTeamMember {
  id: string;
  name: string;
  photo: string;
  position: string;
  bio: string | null;
}

export function teamMemberToRecord(member: TeamMember): TeamMemberRecord {
  return {
    id: member.id.toString(),
    name: member.name,
    photo: member.photo,
    position: member.position,
    bio: member.bio,
    isActive: member.isActive,
    sortOrder: member.sortOrder,
    createdAt: member.createdAt.toISOString(),
    updatedAt: member.updatedAt.toISOString(),
  };
}

/** Display order: by priority, then oldest first. */
export const TEAM_ORDER_BY = [{ sortOrder: "asc" as const }, { id: "asc" as const }];

export async function listTeamMembers(): Promise<TeamMemberRecord[]> {
  const members = await prisma.teamMember.findMany({ orderBy: TEAM_ORDER_BY });
  return members.map(teamMemberToRecord);
}

/** Active members in display order, for the About page. Never throws. */
export async function listActiveTeamMembers(): Promise<PublicTeamMember[]> {
  try {
    const members = await prisma.teamMember.findMany({
      where: { isActive: true },
      select: { id: true, name: true, photo: true, position: true, bio: true },
      orderBy: TEAM_ORDER_BY,
    });
    return members.map((member) => ({ ...member, id: member.id.toString() }));
  } catch (error) {
    console.error("[team:list-active] failed", error);
    return [];
  }
}
