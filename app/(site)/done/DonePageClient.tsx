"use client";

import { useState } from "react";
import Polaroid from "@elements/Polaroid/Polaroid";
import Page from "@elements/Page/Page";
import StructuredSubpage from "@elements/Page/StructuredSubpage";
import { CampaignProgress } from "@elements/Progress/CampaignProgress";
import { Button } from "@elements/Button/Button";
import { getToday } from "@scripts/getToday";
import { useCart } from "@/components/providers/CartProvider";
import { countCompletedKids } from "@lib/directus/progress";
import { giftContainer } from "@/lib/ui-classes";
import type { CampaignContent, StructuredPageContent } from "@lib/directus/schema";

const DONE_PICTURES = [
  "./picture1.png",
  "./picture2.jpg",
  "./picture3.jpg",
  "./picture4.jpeg",
  "./picture5.jpeg",
  "./picture6.jpg",
  "./picture7.jpeg",
  "./picture8.jpeg",
  "./picture9.jpeg",
];

type Props = {
  content: StructuredPageContent;
  campaignContent: Omit<CampaignContent, "id">;
};

export default function DonePageClient({ content, campaignContent }: Props) {
  const { kids, cart, onAddToCart, onRemoveFromCart } = useCart();
  const [showNum, setShowNum] = useState(50);

  const showMore = () => {
    if (kids.length > showNum + 50) {
      setShowNum(showNum + 50);
    } else if (kids.length > showNum) {
      setShowNum(kids.length);
    }
  };

  const today = getToday();
  const completedKids = countCompletedKids(kids);
  const { wishLimit, fixedWishCount } = useCart();

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
        />
      </Page>

      <div className="mx-auto max-w-[1200px] px-4">
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {DONE_PICTURES.map((src, index) => (
            <img key={index} src={src} alt="Impression Weihnachtswunschaktion" className="w-full rounded-[10px]" />
          ))}
        </div>

        <CampaignProgress
          config={campaignContent}
          wishLimit={wishLimit}
          fixedWishCount={fixedWishCount}
          date={today}
          completedKids={completedKids}
          registeredKids={kids.length}
        />

        <div className={giftContainer}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {kids.slice(0, showNum).map((kid, index) => (
              <Polaroid key={index} kid={kid} kids={kids} cart={cart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} />
            ))}
          </div>
          {showNum < kids.length && (
            <div className="mt-8 text-center">
              <Button onClick={showMore} className="mx-0">
                Weitere Wünsche anzeigen
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
