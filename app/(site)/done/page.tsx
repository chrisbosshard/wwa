"use client";

import React, { useState } from "react";
import Link from "next/link";
import Footer from "@sections/Footer/Footer";
import Polaroid from "@elements/Polaroid/Polaroid";
import Page from "@elements/Page/Page";
import { Progress } from "@sections/Progress/Progress";
import { Button } from "@elements/Button/Button";
import { getToday } from "@scripts/getToday";
import { useCart } from "@/components/providers/CartProvider";

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

export default function DonePage() {
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
  const allCompletedGifts = 2500;

  return (
    <>
      <Page title="Herzlichen Dank - Es wurden alle Wünsche erfüllt!" image="icon2.png">
        <h2 className="mb-6 font-normal leading-7 text-gold-300">
          Wir sind überwältigt. Gemeinsam mit Privatpersonen und{" "}
          <Link className="link underline" href="/partner">
            Partner
          </Link>{" "}
          erfüllen wir 2500 Weihnachtswünsche von Kindern aus finanziell benachteiligten Familien. Für das grosse Engagement bedanken wir uns herzlich.
        </h2>
        <h3 className="mb-6 text-base font-normal leading-relaxed text-gold-300">
          Wir verwandeln die Wünsche nun in schöne Weihnachtsgeschenke und überreichen diese am 18. Dezember 2021 den Familien. In Kürze findest du hier sowie
          auf unseren Social-Media-Kanälen Impressionen vom Einpacken sowie der Geschenkübergabe. Mit dem Newsletter informieren wir dich gerne weiter über das
          Engagement von Caritas Zürich. Möchtest du finanziell benachteiligte Kinder und Familien auch langfristig mit einer Spende oder einem freiwilligen
          Engagement unterstützen?
        </h3>
        <div className="mb-8 flex flex-wrap gap-4">
          <Button externalLink="https://www.caritas-zuerich.ch/newsletter?nlconf=1" className="mx-0">
            Newsletter anmelden
          </Button>
          <Button externalLink="https://www.caritas-zuerich.ch/aktiv-werden" color="outline" className="mx-0">
            Aktiv werden
          </Button>
          <Button externalLink="https://www.caritas-zuerich.ch/spenden/ihre-spende-hilft" color="outline" className="mx-0">
            Spenden
          </Button>
        </div>
      </Page>

      <div className="mx-auto max-w-[1200px] px-4">
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {DONE_PICTURES.map((src, index) => (
            <img key={index} src={src} alt="Impression Weihnachtswunschaktion" className="w-full rounded-[10px]" />
          ))}
        </div>

        <Progress title="Wünsche erfüllt:" value={allCompletedGifts} max={allCompletedGifts} date={today} />

        <div className="gift-container">
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

        <Footer />
      </div>
    </>
  );
}
