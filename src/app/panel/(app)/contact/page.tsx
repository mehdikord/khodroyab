import React from "react";
import type { Metadata } from "next";

import { getSystemSettings } from "@/lib/system-settings";
import { listActiveBranches } from "@/lib/branches";
import { ContactView } from "@/components/panel/contact/ContactView";
import { AboutView } from "@/components/panel/about/AboutView";
import { InfoTabs } from "@/components/panel/contact/InfoTabs";

export const metadata: Metadata = {
  title: "تماس با ما و درباره خودرو یاب",
};

interface PageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

/**
 * «تماس با ما» (default tab: office details and active branches) and
 * «درباره خودرویاب» (the administrator's text) on one page, as two tabs.
 */
export default async function PanelContactPage({ searchParams }: PageProps) {
  const [settings, branches] = await Promise.all([getSystemSettings(), listActiveBranches()]);
  const tab = searchParams.tab === "about" ? "about" : "contact";

  return (
    <InfoTabs
      initialTab={tab}
      contact={
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
      }
      about={<AboutView text={settings.aboutText} />}
    />
  );
}
