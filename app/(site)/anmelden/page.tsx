import { loadStructuredPage } from "@lib/directus/load-structured-page";
import { loadFooterSponsors } from "@lib/directus/sponsors";
import SiteFooter from "@sections/Footer/SiteFooter";
import AnmeldenPageClient from "./AnmeldenPageClient";

export const dynamic = "force-dynamic";

export default async function AnmeldenPage() {
  const [content, footerSponsors] = await Promise.all([loadStructuredPage("anmelden"), loadFooterSponsors()]);
  return (
    <>
      <AnmeldenPageClient content={content} />
      <SiteFooter topSponsors={footerSponsors.top} otherSponsors={footerSponsors.others} />
    </>
  );
}
