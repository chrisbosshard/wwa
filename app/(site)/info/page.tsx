import React from "react";
import { fetchPageBySlug } from "@lib/directus/queries";
import Page from "@elements/Page/Page";
import Footer from "@sections/Footer/Footer";
import { Button } from "@elements/Button/Button";

const fallbackContent = {
  info: {
    title: "Weihnachtswunschaktion – Ein schönes Fest für alle Kinder.",
    body: `<p>Kinder haben Wünsche – kleinere und grössere. Die Weihnachtswunschaktion von Caritas Zürich erfüllt seit über 10 Jahren Wünsche von Kindern aus Familien mit schmalem Budget.</p>`,
  },
};

export default async function InfoPage() {
  let cmsPage = fallbackContent.info;

  try {
    const page = await fetchPageBySlug("info");
    if (page) {
      cmsPage = {
        title: page.title,
        body: page.body || "",
      };
    }
  } catch (error) {
    console.error("CMS fetch failed for info", error);
  }

  return (
    <>
      <Page title={cmsPage.title} image="icon5.png">
        <div className="cms-body" dangerouslySetInnerHTML={{ __html: cmsPage.body }} />
        <div className="mt-6 flex flex-col justify-center gap-6 lg:mb-24 lg:flex-row lg:gap-2">
          <Button innerLink="/anmelden">Wunsch anmelden</Button>
          <Button innerLink="/wunscherfuellen" color="outline">
            Wunsch erfüllen
          </Button>
        </div>
      </Page>
      <div className="col-span-12 mt-8 px-4 pt-4">
        <Footer />
      </div>
    </>
  );
}
