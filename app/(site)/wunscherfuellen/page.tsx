import { loadStructuredPage } from "@lib/directus/load-structured-page";
import { loadFooterSponsors } from "@lib/directus/sponsors";
import SiteFooter from "@sections/Footer/SiteFooter";
import WunscherfuellenPageClient from "./WunscherfuellenPageClient";

export const dynamic = "force-dynamic";

export default async function WunscherfuellenPage() {
  const [content, footerSponsors] = await Promise.all([loadStructuredPage("wunscherfuellen"), loadFooterSponsors()]);
  return (
    <>
      <WunscherfuellenPageClient content={content} />
      <SiteFooter topSponsors={footerSponsors.top} otherSponsors={footerSponsors.others} />
    </>
  );
}
