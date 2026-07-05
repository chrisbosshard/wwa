import { fetchApplication, fetchCampaignContentByState } from "@lib/directus/queries";
import { normalizeCampaignContent } from "@lib/directus/campaign-content-defaults";
import { loadFooterSponsors } from "@lib/directus/sponsors";
import SiteFooter from "@sections/Footer/SiteFooter";
import HomePageClient from "./HomePageClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [application, footerSponsors] = await Promise.all([
    fetchApplication().catch(() => ({ state: "registration" })),
    loadFooterSponsors(),
  ]);
  const state = application?.state || "registration";
  const cmsItem = await fetchCampaignContentByState(state);
  const initialCampaignContent = normalizeCampaignContent(state, cmsItem);

  return (
    <>
      <HomePageClient initialCampaignContent={initialCampaignContent} />
      <SiteFooter topSponsors={footerSponsors.top} otherSponsors={footerSponsors.others} />
    </>
  );
}
