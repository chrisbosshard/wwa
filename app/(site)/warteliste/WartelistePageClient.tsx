"use client";

import { useState } from "react";
import OnboardStep1 from "@sections/Onboard/OnboardStep1";
import Page from "@elements/Page/Page";
import StructuredSubpage from "@elements/Page/StructuredSubpage";
import type { StructuredPageContent } from "@lib/directus/schema";
import { resolveEffectivePageContent } from "@lib/directus/page-defaults";

type Props = {
  content: StructuredPageContent;
};

export default function WartelistePageClient({ content }: Props) {
  const [contact] = useState({ leginr: "", image: null, imageName: "" });
  const effective = resolveEffectivePageContent(content, "waitinglist");

  const toStep2 = () => {
    window.open("https://www.kulturlegi.ch/zuerich/weihnachtswunschaktion-warteliste", "_self");
  };

  return (
    <>
      <Page
        title={effective.title}
        image={content.icon || undefined}
        breadcrumbs={[
          { label: "Weihnachtswunschaktion", href: "/" },
          { label: effective.title },
        ]}
      >
        <StructuredSubpage
          content={content}
          appState="waitinglist"
          leadClassName={content.icon ? "pr-[clamp(4.5rem,10vw,7.5rem)]" : undefined}
        >
          <OnboardStep1 contact={contact} onNextStep={toStep2} waitinglist />
        </StructuredSubpage>
      </Page>
    </>
  );
}
