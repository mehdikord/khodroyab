import { redirect } from "next/navigation";

/** "About Khodroyab" now lives as a tab of the contact page. */
export default function PanelAboutPage() {
  redirect("/panel/contact?tab=about");
}
