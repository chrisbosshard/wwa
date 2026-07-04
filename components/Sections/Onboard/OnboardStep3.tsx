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

import { Field } from "@elements/TextField/TextField";
import { Error } from "@elements/TextField/Error";
import { Button } from "@elements/Button/Button";

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
  const [showNum, setShowNum] = useState(50);
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
        newWishes = newWishes.filter((wish) => wish.ageRange < range);
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

  return (
    <>
      <h2 className="font-bold">Schritt 3 – Wunsch / Wünsche hinzufügen</h2>
      <h3>
        Wähle für jedes Kind den passenden Wusch aus. Eine Auswahl beliebter und spannender Geschenke haben wir dir zusammengestellt. Wenn du kein passendes
        Geschenk finden konntest, kannst du einen freien Wunsch anmelden (Maximalwert 50 Franken). Es werden nur Wünsche aus Schweizer Shops berücksichtigt.
      </h3>

      {!activeKid ? (
        <>
          <div className="mb-8 grid w-full grid-cols-auto-md gap-4">
            {kids.map((kid, index) => {
              const currentwish = kid.wish ? kid.wish.description : "Noch kein Geschenk ausgewählt";
              return (
                <div key={index}>
                  {kid.wish ? (
                    <div onClick={() => setActiveKid(index + 1)}>
                      <Wish wish={kid.wish} />
                    </div>
                  ) : (
                    <div
                      key={kid.id}
                      className="mb-1 flex w-full flex-col items-center justify-between rounded-lg border-2 border-dotted border-gold-300 pb-[43px]"
                    >
                      <button
                        className="flex aspect-square h-full w-full translate-y-4 cursor-pointer items-center justify-center rounded-lg p-4 font-bold text-gold-300"
                        onClick={() => setActiveKid(index + 1)}
                      >
                        Geschenk hinzufügen
                      </button>
                    </div>
                  )}
                  <div className="mt-4 flex w-full flex-col">
                    <p className="text-xl text-gold-300">{kid.prename + " (" + kid.age + ")"}</p>
                    <p className="mt-2 text-sm text-gold-300">Geschenk: {currentwish}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex w-full flex-col justify-center lg:flex-row">
            <Button onClick={onStepBack} type="button" className="mx-0 mt-8 lg:mx-4">
              Zurück
            </Button>
            <Button onClick={onNextStep} className="mx-0 mt-4 lg:mx-4 lg:mt-8">
              Weiter
            </Button>
          </div>
        </>
      ) : (
        <>
          {!customOpen ? (
            <div className="gift-container">
              <div className="gift-customMessage flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-caritas-gray-800" />
                <h3>
                  Passt keines der Geschenke aus der Liste? Dann melde dein eigenes Geschenk{" "}
                  <span className="gift-link" onClick={() => setCustomOpen(true)}>
                    hier
                  </span>{" "}
                  an
                </h3>
              </div>
              <h2>Wähle ein Geschenk für {kids[activeKid - 1].prename}: </h2>
              <div className="mb-4 flex w-full flex-1 flex-col gap-6 sm:flex-row sm:gap-8">
                <FilterSelect
                  label="Kategorie"
                  value={category}
                  onValueChange={setCategory}
                  options={(categories ?? []).map((cat) => ({ value: cat.id, label: cat.name }))}
                  className="w-full flex-1 sm:max-w-[17.5rem]"
                />
                <FilterSelect
                  label="Altersbeschränkung"
                  value={range}
                  onValueChange={setRange}
                  options={AGE_FILTER_OPTIONS}
                  className="w-full flex-1 sm:max-w-[17.5rem]"
                />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredWishes.map((wish, index) => (
                  <Wish key={wish.id} wish={wish} onSelect={handleSelection} />
                ))}
              </div>

              <div className="button-container">
                <div className="link-container">
                  <a className="link" onClick={() => setActiveKid(null)}>
                    Zurück
                  </a>
                </div>
                {showNum < filteredWishes.length && false ? (
                  <div className="link-container">
                    <a className="link" onClick={() => showMore()}>
                      Weitere Wünsche anzeigen
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit(checkCustomWish)} className="flex w-full flex-col gap-4">
                <h3 className="mb-4 font-bold">Eigenen Wunsch hinzufügen</h3>
                <div className="flex-1 lg:mr-4">
                  <Field label="Beschreibung" multiline={true} rows={5} {...register("description")} />
                  <Error errors={errors} type="description" />
                </div>
                <div className="flex-1 lg:mr-4">
                  <Field label="Link" {...register("link")} />
                  <Error errors={errors} type="link" />
                </div>
                <div className="flex w-full flex-col justify-center lg:flex-row">
                  <Button onClick={() => setCustomOpen(false)} type="button" className="mx-0 mt-8 lg:mx-4">
                    Zurück
                  </Button>
                  <Button type="submit" className="mx-0 mt-4 lg:mx-4 lg:mt-8">
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
