import { loadStructuredPage } from "@lib/directus/load-structured-page";
import { loadDisplaySponsorsByTier } from "@lib/directus/sponsors";
import StructuredSubpageShell from "@elements/Page/StructuredSubpageShell";
import PartnerSponsorGrid from "@sections/Partner/PartnerSponsorGrid";

export const dynamic = "force-dynamic";

export default async function PartnerPage() {
  const [content, sponsors] = await Promise.all([loadStructuredPage("partner"), loadDisplaySponsorsByTier()]);

  return <StructuredSubpageShell content={content} afterLead={<PartnerSponsorGrid {...sponsors} />} />;
}
