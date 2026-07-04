"use client";

import React, { useState, useEffect, useContext } from "react";
import { fetchWishes } from "@lib/directus/api-client";
import Hero from "@sections/Hero/Hero";
import MainCutout from "@elements/MainCutout/MainCutout";
import MainCutoutContent from "@elements/MainCutout/MainCutoutContent";
import Footer from "@sections/Footer/Footer";
import Polaroid from "@elements/Polaroid/Polaroid";
import { Button } from "@elements/Button/Button";
import { Tree } from "@sections/Tree/Tree";
import ApplicationContext from "@context/ApplicationContext/ApplicationContext";
import Wish from "@/components/Wish/Wish";
import { calculateBalls } from "@scripts/calculateBalls";
import { getToday } from "@scripts/getToday";
import { useCart } from "@/components/providers/CartProvider";
import { FilterSelect, AGE_FILTER_OPTIONS } from "@elements/FilterSelect/FilterSelect";
import type { CampaignContent } from "@lib/directus/schema";
import { cn } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
};

type Props = {
  initialCampaignContent: Omit<CampaignContent, "id">;
};

export default function HomePageClient({ initialCampaignContent }: Props) {
  const { cart, kids, onAddToCart, onRemoveFromCart } = useCart();

  const [wishes, setWishes] = useState([]);
  const [filteredWishes, setFilteredWishes] = useState([]);
  const [balls, setBalls] = useState([]);
  const [showNumber, setShowNumber] = useState(8);
  const [category, setCategory] = useState("all");
  const [range, setRange] = useState("all");
  const [categories, setCategories] = useState<Category[] | undefined>([]);

  useEffect(() => {
    async function loadWishes() {
      try {
        const data = await fetchWishes();
        const newWishes = data.wishes.filter((wish) => wish.image && wish.active);
        const newCategories = data.categories.filter((category) => category.wishes?.length > 0);
        setWishes(newWishes);
        setFilteredWishes(newWishes);
        setCategories(newCategories);
      } catch (error) {
        console.error("Failed to load wishes", error);
      }
    }
    loadWishes();
  }, []);

  const { appState } = useContext(ApplicationContext);

  useEffect(() => {
    if (kids.length > 0) {
      setBalls(calculateBalls(kids));
    }
  }, [kids]);

  useEffect(() => {
    if (wishes) {
      let newWishes = [...wishes];
      if (category !== "" && category !== "all") {
        newWishes = newWishes.filter((wish) => wish.category && wish.category.id === category);
      }
      if (range !== "" && range !== "all") {
        newWishes = newWishes.filter((wish) => wish.ageRange < Number(range));
      }
      setFilteredWishes(newWishes);
    }
  }, [category, range, wishes]);

  const showMore = () => {
    if (filteredWishes.length > showNumber + 50) {
      setShowNumber(showNumber + 50);
    } else {
      setShowNumber(filteredWishes.length);
    }
  };

  const date = getToday();

  let completedKids = 0;
  (kids as { donor?: { paymentSuccessful?: boolean; manualUpload?: boolean } }[]).forEach((kid) => {
    if (kid.donor && (kid.donor.paymentSuccessful || kid.donor.manualUpload)) {
      completedKids += 1;
    }
  });

  const baseCompletedKids = 0;
  let allCompletedKids = completedKids + baseCompletedKids;
  const allBaseKids = 3000;
  let completedPercentage = allCompletedKids / allBaseKids;

  const isDone = false;
  if (isDone) {
    allCompletedKids = 3000;
    completedPercentage = 1;
  }

  const showLowerContent = appState === "wish_fulfilment" || appState === "pre_registration";

  return (
    <>
      <Hero showActionLinks />

      <MainCutout breadcrumbs={[{ label: "Weihnachtswunschaktion" }]}>
        <MainCutoutContent
          appState={appState}
          initialContent={initialCampaignContent}
          date={date}
          completedKids={allCompletedKids}
          registeredKids={kids.length}
        />
      </MainCutout>

      <div
        className={cn(
          showLowerContent ? "bg-caritas-gray-50 pt-10 md:pt-12" : "bg-white pt-6 md:pt-8",
        )}
      >
        <div className="mx-auto max-w-[1200px] px-4">
        {appState === "wish_fulfilment" && (
          <section>
            <div className="mb-10">
              <Tree balls={balls} />
            </div>

            <h3 className="mb-6 text-center text-xl font-bold text-caritas-gray-800">Aktuelle Wünsche</h3>
            <div className="mb-8 grid grid-cols-auto-md items-stretch gap-4">
              {(kids as unknown[]).map((kid, index) => {
                if (index < 4) {
                  return (
                    <Polaroid
                      key={index}
                      kid={kid}
                      kids={kids}
                      cart={cart}
                      onAddToCart={onAddToCart}
                      onRemoveFromCart={onRemoveFromCart}
                    />
                  );
                }
                return null;
              })}
            </div>
            <div className="mb-8 text-center">
              <Button innerLink="/wunscherfuellen" className="mx-0">
                Alle Wünsche anzeigen
              </Button>
            </div>
          </section>
        )}

        {appState === "pre_registration" && (
          <section>
            <div className="mb-10 flex flex-col items-stretch justify-center gap-6 sm:flex-row sm:items-start sm:gap-8 md:gap-10">
              <FilterSelect
                label="Kategorie"
                value={category}
                onValueChange={setCategory}
                options={(categories ?? []).map((cat) => ({ value: cat.id, label: cat.name }))}
                className="w-full sm:w-[min(100%,17.5rem)]"
              />
              <FilterSelect
                label="Altersbeschränkung"
                value={range}
                onValueChange={setRange}
                options={AGE_FILTER_OPTIONS}
                className="w-full sm:w-[min(100%,17.5rem)]"
              />
            </div>

            <div className="grid grid-cols-auto-md gap-6">
              {filteredWishes.slice(0, showNumber).map((wish, index) => (
                <Wish key={index} wish={wish} />
              ))}
            </div>

            {filteredWishes.length > showNumber && (
              <div className="mt-8 flex justify-center">
                <Button onClick={() => showMore()} className="mx-0 inline-flex rounded-full border-0 px-8">
                  Weitere Wünsche anzeigen
                </Button>
              </div>
            )}
          </section>
        )}

        <Footer />
        </div>
      </div>
    </>
  );
}
