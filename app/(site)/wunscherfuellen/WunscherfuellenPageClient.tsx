"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Footer from "@sections/Footer/Footer";
import ApplicationContext from "@context/ApplicationContext/ApplicationContext.js";
import Polaroid from "@elements/Polaroid/Polaroid";
import Page from "@elements/Page/Page";
import StructuredSubpage from "@elements/Page/StructuredSubpage";
import { Button } from "@elements/Button/Button";
import { useCart } from "@/components/providers/CartProvider";
import type { StructuredPageContent } from "@lib/directus/schema";

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
        title={content.title}
        image={content.icon || undefined}
        breadcrumbs={[
          { label: "Weihnachtswunschaktion", href: "/" },
          { label: content.title },
        ]}
      >
        <StructuredSubpage
          content={content}
          appState={appState}
          showButtons={appState === "closed"}
          leadClassName={content.icon ? "pr-[clamp(4.5rem,10vw,7.5rem)]" : undefined}
        />
      </Page>

      {appState === "wish_fulfilment" && (
        <div className="mx-auto max-w-[1200px] px-4">
          <div className="mb-6 flex w-full flex-row justify-end gap-3 text-gold-300">
            <input onChange={toggleWishes} type="checkbox" id="contactPermission" className="min-w-[20px]" />
            <label htmlFor="contactPermission" className="ml-2">
              Bereits erfüllte Wünsche ausblenden
            </label>
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
      <Footer />
    </>
  );
}
