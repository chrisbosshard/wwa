// IMPORT BASICS
import React, { useState, useEffect } from "react";

// IMPORT COMPONENTS
import { AlertCircle } from "lucide-react";
import { fetchWishes, createWish } from "@lib/directus/api-client";
import Wish from "../../../components/Wish/Wish";
import { FilterSelect, AGE_FILTER_OPTIONS } from "@elements/FilterSelect/FilterSelect";
import emailjs from "@emailjs/browser";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { step3Schema } from "@validations/register";

import { FormField } from "@elements/TextField/FormField";
import { Button } from "@elements/Button/Button";
import { giftCustomMessage, giftLink, giftPickerSection, underlineTextLink } from "@/lib/ui-classes";
import { onboardStepDescription, onboardStepNav, onboardStepTitle } from "@sections/Onboard/OnboardStepPanel";

const addGiftButtonClass =
  "inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-caritas-red bg-white px-3 text-sm font-semibold text-caritas-red transition-colors hover:bg-caritas-red hover:text-white";

type Category = {
  id: string;
  name: string;
};

type FormData = z.infer<typeof step3Schema>;

// ****************************************
// COMPONENT: Auswaehlen
// Wünsche Auswählen
// ****************************************
const OnboardStep3 = (props) => {
  // PROPS
  const { kids, family, onNextStep, onStepBack, onKidChange } = props;

  // STATES
  const [showNum, setShowNum] = useState(8);
  const [wishes, setWishes] = useState([]);
  const [filteredWishes, setFilteredWishes] = useState([]);
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState<Category[] | undefined>();
  const [range, setRange] = useState("all");
  const [activeKid, setActiveKid] = useState<number>();
  const [customOpen, setCustomOpen] = useState(false);

  // QUERY
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

  // FORM
  const {register, reset, handleSubmit, formState: { errors },} = useForm<FormData>({resolver: zodResolver(step3Schema)}); // prettier-ignore

  // EFFECT
  // ******************************************
  // Get Data
  // ******************************************
  // ******************************************
  // FIlter Category
  // ******************************************
  useEffect(() => {
    if (wishes) {
      let newWishes = [...wishes];
      if (category !== "all") {
        newWishes = newWishes.filter((wish) => wish.category && wish.category.id === category);
      }
      if (range !== "all") {
        newWishes = newWishes.filter((wish) => wish.ageRange < Number(range));
      }
      setFilteredWishes(newWishes);
    }
  }, [category, range, wishes]);

  // FUNCTIONS
  // ******************************************
  // Show more items
  // ******************************************
  const showMore = () => {
    if (filteredWishes.length > showNum + 50) {
      const newShowNum = showNum + 50;
      setShowNum(newShowNum);
    } else {
      setShowNum(filteredWishes.length);
    }
  };

  // ******************************************
  // Select Wish
  // ******************************************
  const handleSelection = (id) => {
    if (wishes) {
      const newKids = [...kids];
      const wish = wishes.find((wish) => wish.id === id);
      newKids[activeKid - 1].wish = wish;
      onKidChange(newKids);
      setActiveKid(null);
    }
  };

  // ******************************************
  // Select Wish
  // ******************************************
  const handleCustomSelection = (wish) => {
    const newKids = [...kids];
    newKids[activeKid - 1].wish = wish;
    onKidChange(newKids);
    setActiveKid(null);
    setCustomOpen(false);
  };

  const checkCustomWish = async (data: FormData) => {
    const result = await createWish({
      description: data.description,
      link: data.link,
      active: false,
      year: "2026",
      individual: true,
      toCheck: true,
    }).catch((error) => {
      console.log(error);
      return null;
    });
    if (!result) return;
    const wish = {
      id: result.createWish.id,
      description: data.description,
      image: {
        url: "/eigenerwunsch.png",
      },
    };
    reset();
    handleCustomSelection(wish);
  };

  const allKidsHaveWishes = kids.length > 0 && kids.every((kid) => kid.wish);

  return (
    <>
      <h2 className={onboardStepTitle}>Schritt 3 – Wunsch / Wünsche hinzufügen</h2>
      <p className={onboardStepDescription}>
        Wähle für jedes Kind den passenden Wunsch aus. Eine Auswahl beliebter und spannender Geschenke haben wir dir zusammengestellt. Wenn du kein passendes
        Geschenk finden konntest, kannst du einen freien Wunsch anmelden (Maximalwert 50 Franken). Es werden nur Wünsche aus Schweizer Shops berücksichtigt.
      </p>

      {!activeKid ? (
        <>
          <div className="mb-8 w-full overflow-hidden rounded-xl border border-[#e8e8e8]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#e8e8e8] bg-[#fafafa]">
                <tr>
                  <th scope="col" className="px-4 py-3 text-sm font-semibold text-[#333333] sm:px-5">
                    Vorname
                  </th>
                  <th scope="col" className="px-4 py-3 text-sm font-semibold text-[#333333] sm:px-5">
                    Alter
                  </th>
                  <th scope="col" className="px-4 py-3 text-sm font-semibold text-[#333333] sm:px-5">
                    Geschenk
                  </th>
                  <th scope="col" className="px-4 py-3 text-right sm:px-5">
                    <span className="sr-only">Aktion</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e8e8] bg-white">
                {kids.map((kid, index) => (
                  <tr key={`${kid.prename}-${kid.age}-${index}`}>
                    <td className="px-4 py-3 text-base font-medium text-[#333333] sm:px-5 sm:py-4">{kid.prename}</td>
                    <td className="px-4 py-3 text-base text-[#444444] sm:px-5 sm:py-4">{kid.age}</td>
                    <td className="px-4 py-3 text-base sm:px-5 sm:py-4">
                      {kid.wish ? (
                        <span className="text-[#333333]">{kid.wish.description}</span>
                      ) : (
                        <span className="text-[#999999]">Noch kein Geschenk ausgewählt</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right sm:px-5 sm:py-4">
                      <button type="button" className={addGiftButtonClass} onClick={() => setActiveKid(index + 1)}>
                        {kid.wish ? "Ändern" : "Hinzufügen"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={onboardStepNav}>
            <Button onClick={onStepBack} type="button" className="mx-0">
              Zurück
            </Button>
            <Button onClick={onNextStep} type="button" disabled={!allKidsHaveWishes} className="mx-0">
              Weiter
            </Button>
          </div>
        </>
      ) : (
        <>
          {!customOpen ? (
            <>
              <div className={`${giftCustomMessage} flex items-start gap-3`}>
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#666666]" />
                <p className="text-base leading-relaxed text-[#444444]">
                  Passt keines der Geschenke aus der Liste? Dann melde dein eigenes Geschenk{" "}
                  <button type="button" className={giftLink} onClick={() => setCustomOpen(true)}>
                    hier
                  </button>{" "}
                  an.
                </p>
              </div>
              <div className={giftPickerSection}>
                <h3 className="mb-6 text-xl font-bold text-[#242424] md:text-2xl">
                  Wähle ein Geschenk für {kids[activeKid - 1].prename}
                </h3>
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
                  {filteredWishes.slice(0, showNum).map((wish) => (
                    <Wish key={wish.id} wish={wish} onSelect={handleSelection} />
                  ))}
                </div>
                {filteredWishes.length > showNum && (
                  <div className="mt-8 flex justify-center">
                    <button type="button" className={underlineTextLink} onClick={showMore}>
                      Weitere Wünsche anzeigen
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-8 flex justify-center">
                <Button onClick={() => setActiveKid(null)} type="button" className="mx-0 inline-flex rounded-full border-0 px-8">
                  Zurück zur Übersicht
                </Button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit(checkCustomWish)} className="flex w-full flex-col gap-4">
                <h3 className="text-xl font-bold text-[#242424]">Eigenen Wunsch hinzufügen</h3>
                <FormField label="Beschreibung" name="description" errors={errors} multiline rows={5} {...register("description")} />
                <FormField label="Link" name="link" errors={errors} {...register("link")} />
                <div className={onboardStepNav}>
                  <Button onClick={() => setCustomOpen(false)} type="button" className="mx-0">
                    Zurück
                  </Button>
                  <Button type="submit" className="mx-0">
                    Eigenen Wunsch hinzufügen
                  </Button>
                </div>
              </form>
            </>
          )}
        </>
      )}
    </>
  );
};

export default OnboardStep3;
