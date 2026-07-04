import { fetchSponsors } from "@lib/directus/queries";
import { getAssetUrl } from "@lib/directus/client";
import { loadStructuredPage } from "@lib/directus/load-structured-page";
import StructuredSubpageShell from "@elements/Page/StructuredSubpageShell";
import { sponsorGrid } from "@/lib/ui-classes";

const fallbackSponsors = [
  { name: "Winterhilfe", link: "https://zh.winterhilfe.ch", logoUrl: "/Winterhilfe-Logo_weiss.png" },
  { name: "Canon", link: "https://ch.medical.canon/", logoUrl: "/canon.png" },
  { name: "Micro", link: "https://www.micro-scooter.com/", logoUrl: "/micro.png" },
];

export const dynamic = "force-dynamic";

export default async function PartnerPage() {
  let sponsors = fallbackSponsors;

  try {
    const cmsSponsors = await fetchSponsors();
    if (cmsSponsors?.length) {
      sponsors = cmsSponsors.map((s) => ({
        name: s.name,
        link: s.link,
        logoUrl: getAssetUrl(s.logo) || `/sponsor-${s.id}.png`,
      }));
    }
  } catch (error) {
    console.error("CMS fetch failed for sponsors", error);
  }

  return (
    <StructuredSubpageShell content={await loadStructuredPage("partner")}>
      <div className={`${sponsorGrid} mt-8`}>
        {sponsors.map((sponsor) => (
          <a key={sponsor.name} href={sponsor.link} target="_blank" rel="noreferrer" className="flex items-center justify-center p-4">
            <img src={sponsor.logoUrl.startsWith("http") ? sponsor.logoUrl : sponsor.logoUrl.replace("_weiss", "")} alt={sponsor.name} />
          </a>
        ))}
      </div>
    </StructuredSubpageShell>
  );
}
