import React from "react";
import { fetchSponsors } from "@lib/directus/queries";
import { getAssetUrl } from "@lib/directus/client";
import Page from "@elements/Page/Page";
import Footer from "@sections/Footer/Footer";

const fallbackSponsors = [
  { name: "Winterhilfe", link: "https://zh.winterhilfe.ch", logoUrl: "/Winterhilfe-Logo_weiss.png" },
  { name: "Canon", link: "https://ch.medical.canon/", logoUrl: "/canon.png" },
  { name: "Micro", link: "https://www.micro-scooter.com/", logoUrl: "/micro.png" },
];

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
    <>
      <Page title="Unsere Partner" image="icon6.png">
        <h2>
          Unterstützt durch verschiedene Firmen, Stiftungen und Privatpersonen erfüllen wir mit dem gespendeten Geld Weihnachtswünsche von Kindern aus
          finanziell benachteiligten Familien. Herzlichen Dank für das Engagement!
        </h2>
        <div className="sponsor-grid mt-8">
          {sponsors.map((sponsor) => (
            <a key={sponsor.name} href={sponsor.link} target="_blank" rel="noreferrer" className="flex items-center justify-center p-4">
              <img src={sponsor.logoUrl.startsWith("http") ? sponsor.logoUrl : sponsor.logoUrl.replace("_weiss", "")} alt={sponsor.name} />
            </a>
          ))}
        </div>
      </Page>
      <div className="col-span-12 mt-8 px-4 pt-4">
        <Footer />
      </div>
    </>
  );
}
