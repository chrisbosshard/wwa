"use client";

import { useState, useEffect, useContext, useMemo } from "react";
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
import { isGrantedWish } from "@lib/directus/progress";

type Props = {
  content: StructuredPageContent;
};

export default function WunscherfuellenPageClient({ content }: Props) {
  const { kids, cart, onAddToCart, onRemoveFromCart } = useCart();
  const [showNum, setShowNum] = useState(50);
  const [hideCompleted, setHideCompleted] = useState(false);
  const { appState } = useContext(ApplicationContext);
  const router = useRouter();
  const effective = resolveEffectivePageContent(content, appState);
  const filteredKids = useMemo(
    () =>
      kids.filter(
        (kid) =>
          kid.wish?.active &&
          (!hideCompleted || !(kid.completed || isGrantedWish(kid))),
      ),
    [hideCompleted, kids],
  );

  useEffect(() => {
    if (appState === "done") {
      router.push("/done");
    }
  }, [appState, router]);

  const showMore = () => {
    if (filteredKids.length > showNum + 50) {
      setShowNum(showNum + 50);
    } else if (filteredKids.length > showNum) {
      setShowNum(filteredKids.length);
    }
  };

  const toggleWishes = () => {
    setHideCompleted((current) => !current);
    setShowNum(50);
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
              checked={hideCompleted}
              onChange={toggleWishes}
              label="Bereits erfüllte Wünsche ausblenden"
              className="items-center text-[#242424]"
            />
          </div>
          <div className="mb-8 grid grid-cols-auto-md gap-6">
            {filteredKids.slice(0, showNum).map((kid) => (
              <Polaroid key={kid.id} kid={kid} kids={kids} cart={cart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} />
            ))}
          </div>
          {showNum < filteredKids.length && (
            <Button onClick={showMore} className="mx-auto">
              Weitere Wünsche anzeigen
            </Button>
          )}
        </div>
      )}
    </>
  );
}
