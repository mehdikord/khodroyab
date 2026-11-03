import React from "react";
import type { Metadata } from "next";

import { requireUser } from "@/lib/auth/user-auth";
import { getUserVerification } from "@/lib/verification";
import { VerificationManager } from "@/components/panel/verification/VerificationManager";

export const metadata: Metadata = {
  title: "احراز هویت | پنل کاربری خودرو یاب",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

/** Identity verification of a collaborator: send documents, follow the review, see a rejection reason. */
export default async function PanelVerificationPage() {
  const user = await requireUser();
  const verification = user.collabrate ? await getUserVerification(BigInt(user.id)) : null;

  return <VerificationManager collabrate={user.collabrate} authenticaed={user.authenticaed} initialVerification={verification} />;
}
