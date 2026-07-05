"use client";

import React, { useContext, useState, useEffect } from "react";
import { fetchWishes } from "@lib/directus/api-client";
import Link from "next/link";
import Page from "@elements/Page/Page";
import StructuredSubpage from "@elements/Page/StructuredSubpage";
import ApplicationContext from "@context/ApplicationContext/ApplicationContext.js";
import Wish from "@/components/Wish/Wish";
import type { StructuredPageContent } from "@lib/directus/schema";
import { resolveEffectivePageContent } from "@lib/directus/page-defaults";

type Props = {
  content: StructuredPageContent;
};

export default function AnmeldenPageClient({ content }: Props) {
  const { appState } = useContext(ApplicationContext);
  const [filteredWishes, setFilteredWishes] = useState([]);
  const effective = resolveEffectivePageContent(content, appState);

  useEffect(() => {
    async function loadWishes() {
      try {
        const data = await fetchWishes();
        const newWishes = data.wishes.filter((wish) => wish.image && wish.active);
        setFilteredWishes(newWishes);
      } catch (error) {
        console.error("Failed to load wishes", error);
      }
    }
    loadWishes();
  }, []);

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
          appState={appState}
          leadClassName={content.icon ? "pr-[clamp(4.5rem,10vw,7.5rem)]" : undefined}
        />
      </Page>

      {appState === "registration" && (
        <div className="bg-white pb-10 pt-2 md:pb-12">
          <div className="mx-auto max-w-[1200px] px-4">
            <div className="grid grid-cols-auto-md gap-6">
              {filteredWishes.map((wish, index) => (
                <Link key={index} href="/auswaehlen">
                  <Wish wish={wish} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
