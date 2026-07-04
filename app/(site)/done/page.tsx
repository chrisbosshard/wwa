import { fetchCampaignContentByState } from "@lib/directus/queries";
import { normalizeCampaignContent } from "@lib/directus/campaign-content-defaults";
import { loadStructuredPage } from "@lib/directus/load-structured-page";
import DonePageClient from "./DonePageClient";

export const dynamic = "force-dynamic";

export default async function DonePage() {
  const [content, cmsItem] = await Promise.all([
    loadStructuredPage("done"),
    fetchCampaignContentByState("done"),
  ]);

  const campaignContent = normalizeCampaignContent("done", cmsItem);

  return <DonePageClient content={content} campaignContent={campaignContent} />;
}
