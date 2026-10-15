"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { carOptionToRecord, type CarOptionRecord } from "@/lib/car-options";
import { getCurrentAdmin } from "@/lib/auth/guards";
import { isTrustedOrigin } from "@/lib/auth/request-guard";

const UNAUTHENTICATED_MESSAGE =
  "نشست شما منقضی شده است؛ لطفاً دوباره وارد شوید.";

const GENERIC_FAILURE_MESSAGE = "خطایی رخ داد؛ لطفاً دوباره تلاش کنید.";

export type CarOptionActionResult =
  | { ok: true; record: CarOptionRecord }
  | { ok: false; message: string };

export type CarOptionSimpleActionResult =
  | { ok: true }
  | { ok: false; message: string };

async function guardRequest(): Promise<
  { ok: false; message: string } | null
> {
  if (!isTrustedOrigin()) {
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
  if (!(await getCurrentAdmin())) {
    return { ok: false, message: UNAUTHENTICATED_MESSAGE };
  }
  return null;
}

export async function getCarOptionsAction(carId: string): Promise<CarOptionRecord[]> {
  const admin = await getCurrentAdmin();
  if (!admin) return [];

  try {
    const carOptions = await prisma.carOption.findMany({
      where: { carId: BigInt(carId) },
      include: {
        option: {
          include: {
            optionItems: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return carOptions.map(carOptionToRecord);
  } catch (error) {
    console.error("[carOptions:get] failed", error);
    return [];
  }
}

export async function addCarOptionAction(
  carId: string,
  optionId: string,
  val: string
): Promise<CarOptionActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  try {
    const created = await prisma.carOption.create({
      data: {
        carId: BigInt(carId),
        optionId: BigInt(optionId),
        val,
      },
      include: {
        option: {
          include: {
            optionItems: true,
          },
        },
      },
    });

    revalidatePath(`/admin/cars/${carId}/options`);
    return { ok: true, record: carOptionToRecord(created) };
  } catch (error) {
    console.error("[carOptions:create] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}

export async function deleteCarOptionAction(
  id: string,
  carId: string
): Promise<CarOptionSimpleActionResult> {
  const guardResult = await guardRequest();
  if (guardResult) return guardResult;

  try {
    await prisma.carOption.delete({ where: { id: BigInt(id) } });
    revalidatePath(`/admin/cars/${carId}/options`);
    return { ok: true };
  } catch (error) {
    console.error("[carOptions:delete] failed", error);
    return { ok: false, message: GENERIC_FAILURE_MESSAGE };
  }
}
