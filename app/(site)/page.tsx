import { fetchApplication, fetchCampaignContentByState } from "@lib/directus/queries";
import { normalizeCampaignContent } from "@lib/directus/campaign-content-defaults";
import HomePageClient from "./HomePageClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const application = await fetchApplication().catch(() => ({ state: "registration" }));
  const state = application?.state || "registration";
  const cmsItem = await fetchCampaignContentByState(state);
  const initialCampaignContent = normalizeCampaignContent(state, cmsItem);

  return <HomePageClient initialCampaignContent={initialCampaignContent} />;
}
