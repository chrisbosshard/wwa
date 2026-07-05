import { loadStructuredPage } from "@lib/directus/load-structured-page";
import { loadFooterSponsors } from "@lib/directus/sponsors";
import SiteFooter from "@sections/Footer/SiteFooter";
import WartelistePageClient from "./WartelistePageClient";

export const dynamic = "force-dynamic";

export default async function WartelistePage() {
  const [content, footerSponsors] = await Promise.all([loadStructuredPage("warteliste"), loadFooterSponsors()]);
  return (
    <>
      <WartelistePageClient content={content} />
      <SiteFooter topSponsors={footerSponsors.top} otherSponsors={footerSponsors.others} />
    </>
  );
}
