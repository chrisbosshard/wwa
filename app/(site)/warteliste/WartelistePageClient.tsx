"use client";

import { useState } from "react";
import OnboardStep1 from "@sections/Onboard/OnboardStep1";
import Page from "@elements/Page/Page";
import Footer from "@sections/Footer/Footer";
import StructuredSubpage from "@elements/Page/StructuredSubpage";
import type { StructuredPageContent } from "@lib/directus/schema";

type Props = {
  content: StructuredPageContent;
};

export default function WartelistePageClient({ content }: Props) {
  const [contact] = useState({ leginr: "", image: null, imageName: "" });

  const toStep2 = () => {
    window.open("https://www.kulturlegi.ch/zuerich/weihnachtswunschaktion-warteliste", "_self");
  };

  return (
    <>
      <Page
        title={content.title}
        image={content.icon || undefined}
        breadcrumbs={[
          { label: "Weihnachtswunschaktion", href: "/" },
          { label: content.title },
        ]}
      >
        <StructuredSubpage
          content={content}
          leadClassName={content.icon ? "pr-[clamp(4.5rem,10vw,7.5rem)]" : undefined}
        >
          <OnboardStep1 contact={contact} onNextStep={toStep2} waitinglist />
        </StructuredSubpage>
      </Page>
      <div className="col-span-12 mt-8 px-4 pt-4">
        <Footer />
      </div>
    </>
  );
}
