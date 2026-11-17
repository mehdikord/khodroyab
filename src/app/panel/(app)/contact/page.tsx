import React from "react";
import type { Metadata } from "next";

import { getSystemSettings } from "@/lib/system-settings";
import { listActiveBranches } from "@/lib/branches";
import { listActiveTeamMembers } from "@/lib/team";
import { ContactView } from "@/components/panel/contact/ContactView";
import { AboutView } from "@/components/panel/about/AboutView";
import { InfoTabs } from "@/components/panel/contact/InfoTabs";

export const metadata: Metadata = {
  title: "تماس با ما و درباره خودرو یاب",
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * «تماس با ما» (default tab: office details and active branches) and
 * «درباره خودرویاب» (the administrator's text and the team) on one page, as two tabs.
 */
export default async function PanelContactPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const [settings, branches, team] = await Promise.all([getSystemSettings(), listActiveBranches(), listActiveTeamMembers()]);
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
      about={<AboutView text={settings.aboutText} team={team} />}
    />
  );
}
