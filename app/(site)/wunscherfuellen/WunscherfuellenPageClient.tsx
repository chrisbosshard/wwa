"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import ApplicationContext from "@context/ApplicationContext/ApplicationContext.js";
import Polaroid from "@elements/Polaroid/Polaroid";
import Page from "@elements/Page/Page";
import StructuredSubpage from "@elements/Page/StructuredSubpage";
import { Button } from "@elements/Button/Button";
import { CheckboxField } from "@elements/Checkbox/CheckboxField";
import { useCart } from "@/components/providers/CartProvider";
import type { StructuredPageContent } from "@lib/directus/schema";
import { resolveEffectivePageContent } from "@lib/directus/page-defaults";

type Props = {
  content: StructuredPageContent;
};

export default function WunscherfuellenPageClient({ content }: Props) {
  const { kids, cart, onAddToCart, onRemoveFromCart } = useCart();
  const [showNum, setShowNum] = useState(50);
  const [showCompleted, setShowCompleted] = useState(false);
  const [filteredKids, setFilteredKids] = useState(null);
  const { appState } = useContext(ApplicationContext);
  const router = useRouter();
  const effective = resolveEffectivePageContent(content, appState);

  useEffect(() => {
    if (appState === "done") {
      router.push("/done");
    }
  }, [appState, router]);

  useEffect(() => {
    if (kids && kids.length > 0) {
      setFilteredKids(kids.filter((kid) => kid.wish && kid.wish.active));
    }
  }, [kids]);

  const showMore = () => {
    if (kids.length > showNum + 50) {
      setShowNum(showNum + 50);
    } else if (kids.length > showNum) {
      setShowNum(kids.length);
    }
  };

  const toggleWishes = () => {
    const newShowCompleted = !showCompleted;
    setShowCompleted(newShowCompleted);
    if (newShowCompleted) {
      setFilteredKids(kids.filter((kid) => !kid.donor && kid.wish && kid.wish.active));
    } else {
      setFilteredKids(kids.filter((kid) => kid.wish && kid.wish.active));
    }
  };

  return (
    <>
      <Page
        title={effective.title}
        breadcrumbs={[
          { label: "Weihnachtswunschaktion", href: "/" },
          { label: effective.title },
        ]}
      >
        <StructuredSubpage content={content} appState={appState} showButtons={appState === "closed"} />
      </Page>

      {appState === "wish_fulfilment" && (
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="mb-5 mt-8 flex w-full justify-end md:mt-10">
            <CheckboxField
              id="hideCompletedWishes"
              checked={showCompleted}
              onChange={toggleWishes}
              label="Bereits erfüllte Wünsche ausblenden"
              className="items-center text-[#242424]"
            />
          </div>
          <div className="mb-8 grid grid-cols-auto-md gap-6">
            {filteredKids &&
              filteredKids.slice(0, showNum).map((kid, index) => (
                <Polaroid key={index} kid={kid} kids={kids} cart={cart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} />
              ))}
          </div>
          {showNum < kids.length && (
            <Button onClick={showMore} className="mx-auto">
              Weitere Wünsche anzeigen
            </Button>
          )}
        </div>
      )}
    </>
  );
}
