import { redirect } from "next/navigation";

import { PANEL_HOME } from "@/lib/auth/public-panel";

/** The site's home is the customer panel's dashboard (middleware normally redirects first). */
export default function HomePage() {
  redirect(PANEL_HOME);
}
