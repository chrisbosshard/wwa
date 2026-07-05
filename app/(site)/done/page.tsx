import { fetchCampaignContentByState } from "@lib/directus/queries";
import { normalizeCampaignContent } from "@lib/directus/campaign-content-defaults";
import { loadStructuredPage } from "@lib/directus/load-structured-page";
import { loadFooterSponsors } from "@lib/directus/sponsors";
import SiteFooter from "@sections/Footer/SiteFooter";
import DonePageClient from "./DonePageClient";

export const dynamic = "force-dynamic";

export default async function DonePage() {
  const [content, cmsItem, footerSponsors] = await Promise.all([
    loadStructuredPage("done"),
    fetchCampaignContentByState("done"),
    loadFooterSponsors(),
  ]);

  const campaignContent = normalizeCampaignContent("done", cmsItem);

  return (
    <>
      <DonePageClient content={content} campaignContent={campaignContent} />
      <SiteFooter topSponsors={footerSponsors.top} otherSponsors={footerSponsors.others} />
    </>
  );
}
