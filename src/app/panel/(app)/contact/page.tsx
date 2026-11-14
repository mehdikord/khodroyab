import React from "react";
import type { Metadata } from "next";

import { getSystemSettings } from "@/lib/system-settings";
import { listActiveBranches } from "@/lib/branches";
import { ContactView } from "@/components/panel/contact/ContactView";

export const metadata: Metadata = {
  title: "تماس با ما | خودرو یاب",
};

/** "Contact us": the office details from the system settings, then the active branches. */
export default async function PanelContactPage() {
  const [settings, branches] = await Promise.all([getSystemSettings(), listActiveBranches()]);

  return (
    <ContactView
      info={{
        phone: settings.contactPhone,
        postalCode: settings.contactPostalCode,
        address: settings.contactAddress,
        telegram: settings.contactTelegram,
        whatsapp: settings.contactWhatsapp,
        instagram: settings.contactInstagram,
        location: settings.contactLocation,
      }}
      branches={branches}
    />
  );
}
