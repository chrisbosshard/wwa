// IMPORT BASICS
import React, { useState, useEffect, useContext } from "react";

// IMPORT COMPONENTS
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Link from "next/link";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { fetchWishes } from "@lib/directus/api-client";

// IMPORT CUSTOM COMPONENT
import Hero from "@sections/Hero/Hero";
import Footer from "@sections/Footer/Footer";
import Polaroid from "@elements/Polaroid/Polaroid";
import { Button } from "@elements/Button/Button";
import { ImageLink } from "@elements/ImageLink/ImageLink";
import { Tree } from "@sections/Tree/Tree";
import { Progress } from "@sections/Progress/Progress";
import ApplicationContext from "@context/ApplicationContext/ApplicationContext";
import Wish from "components/Wish/Wish";

// IMPORT UTIL
import { calculateBalls } from "@scripts/calculateBalls";
import { getToday } from "@scripts/getToday";
import shuffleArray from "@scripts/shuffleArray";

type Category = {
  id: string;
  name: string;
};

// *****************************************************
// HOME
// *****************************************************
const Home = (props) => {
  // PROPS
  const { onAddToCart, onRemoveFromCart, cart, kids } = props;

  // STATES
  const [wishes, setWishes] = useState([]);
  const [filteredWishes, setFilteredWishes] = useState([]);
  const [balls, setBalls] = useState([]);
  const [showNumber, setShowNumber] = useState(8);
  const [category, setCategory] = useState("");
  const [range, setRange] = useState("");
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

  // CONTEXT
  const { appState } = useContext(ApplicationContext); // REACTIVATE FOR LIVE VERSION
  // const appState = "wish_fulfilment"; // REACTIVATE FOR LIVE VERSION

  // USEEFFECT
  // *****************************************************
  // Update Balls
  // *****************************************************
  useEffect(() => {
    if (kids.length > 0) {
      const newBalls = calculateBalls(kids);
      setBalls(newBalls);
    }
  }, [kids]);

  // *****************************************************
  // FIlter Category
  // ******************************************
  useEffect(() => {
    if (wishes) {
      let newWishes = [...wishes];
      if (category !== "") {
        newWishes = newWishes.filter((wish) => wish.category && wish.category.id === category);
      }
      if (range !== "") {
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
    if (filteredWishes.length > showNumber + 50) {
      const newShowNum = showNumber + 50;
      setShowNumber(newShowNum);
    } else {
      setShowNumber(filteredWishes.length);
    }
  };

  // CALCULATIONS
  const date = getToday();

  // Show how many gifts have already been granted
  let completedKids = 0;
  kids.forEach((kid) => {
    if (kid.donor && (kid.donor.paymentSuccessful || kid.donor.manualUpload)) {
      completedKids += 1;
    }
  });

  const baseCompletedKids = 0; // need to be updated
  let allCompletedKids = completedKids + baseCompletedKids;
  let allBaseKids = 3000;
  let completedPercentage = allCompletedKids / allBaseKids;

  // IF ACTIVITY IS DONE
  const isDone = false;
  if (isDone) {
    allCompletedKids = 3000;
    completedPercentage = 1;
  }

  // *****************************************************

  // RENDER
  return (
    <div style={{ overflow: "hidden" }}>
      <Hero />
      <div className="m-auto max-w-6xl p-4">
        <div className="grid grid-cols-auto-md items-start gap-6">
          <ImageLink
            link="/anmelden"
            image1="icon1.png"
            image2="icon1_hover.png"
            title="Wunsch anmelden"
            text="Melde hier den Wunsch für dein Kind an. Mitmachen kannst du, wenn du eine KulturLegi hast."
          />
          <ImageLink
            link="/wunscherfuellen"
            image1="icon2.png"
            image2="icon2_hover.png"
            title="Erfülle einen Wunsch"
            text="Mit deiner Hilfe erfüllen wir Weihnachtswünsche von Kindern aus Familien mit schmalem Budget."
          />
          <ImageLink
            link="/team"
            image1="icon3.png"
            image2="icon3_hover.png"
            title="Erfüllt als Team Wünsche"
            text="Ihr möchtet euch gemeinsam engagieren? Dann meldet euch bei uns!"
          />
          <ImageLink
            link="/help"
            image1="icon4.png"
            image2="icon4_hover.png"
            title="Kinder unterstützen"
            text="Du möchtest Kinder aus benachteiligten Familien auch über Weihnachten hinaus unterstützen? Wir haben da einige konkrete Angebote."
          />
        </div>
        {appState === "wish_fulfilment" && (
          <>
            <Tree balls={balls} />
            <p className="m-auto mb-20 mt-16 max-w-4xl text-center text-xl font-light text-gold-300">
              Gemeinsam erfüllen wir Weihnachtswünsche und <b>schmücken den Weihnachtsbaum mit jedem erfüllten Wunsch</b>. Hilf mit und erfülle einem Kind einen
              Weihnachtswunsch.
            </p>
            <Progress title="Wünsche erfüllt:" date={date} value={allCompletedKids} max={2500} />
            <div className="my-20 grid grid-cols-auto-md items-start gap-4">
              {kids.map((kid, index) => {
                if (index < 4) {
                  return <Polaroid key={index} kid={kid} kids={kids} cart={cart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} />;
                }
              })}
            </div>
            <div className="mb-12 flex justify-center gap-2">
              <Button innerLink="/wunscherfuellen">Alle Wünsche</Button>
            </div>
          </>
        )}
        {appState === "pre_registration" && (
          <div>
            <p className="mb-20 mt-32 text-center text-3xl font-bold text-gold-300">Wunschanmeldung startet am 01. Oktober 2025</p>
            <div className="mx-4 mb-4 flex flex-1 flex-col gap-4 lg:flex-row">
              <FormControl variant="outlined" sx={{ minWidth: 120 }} className="flex-1">
                <InputLabel id="demo-simple-select-filled-label">Kategorie</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={category}
                  label="Kategorie"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem key="na" value="">
                    <em>Filter entfernen</em>
                  </MenuItem>
                  {categories.map((category, index) => {
                    return (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl variant="outlined" sx={{ minWidth: 120 }} className="flex-1">
                <InputLabel id="demo-simple-select-filled-label">Altersbeschränkung</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  value={range}
                  label="Altersbeschränkung"
                  onChange={(e) => setRange(e.target.value)}
                >
                  <MenuItem key="na" value="">
                    <em>Filter entfernen</em>
                  </MenuItem>
                  {[...Array(14)].map((i, index) => {
                    const year = index + 1;
                    const label = index === 0 ? "Bis 1 Jahr" : "Bis " + year + " Jahre";
                    return (
                      <MenuItem key={index} value={year}>
                        {label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className="mx-auto mt-8 max-w-[1200px] p-4 lg:mt-4">
              <div className="mb-8 grid grid-cols-auto-md gap-6">
                {filteredWishes.slice(0, showNumber).map((wish, index) => {
                  return <Wish key={index} wish={wish} />;
                })}
              </div>
            </div>
            {filteredWishes.length > showNumber && (
              <div className="link-container">
                <a className="link" onClick={() => showMore()}>
                  Weitere Wünsche anzeigen
                </a>
              </div>
            )}
          </div>
        )}
        {appState === "registration" && (
          <>
            <div className="mb-12 mt-32 flex justify-center gap-2">
              <Button innerLink="/anmelden">Einen Wunsch anmelden</Button>
            </div>
            <Progress title="Wünsche angemeldet:" date={date} value={kids.length} max={3000} />
          </>
        )}
        {appState === "waitinglist" && (
          <>
            <div className="mt-32">
              <p className="mb-10 mt-20 text-center text-3xl font-bold text-gold-300">Die Wunschanmeldung ist abgeschlossen</p>
              <p className="text-md mb-10 text-center text-gold-300">
                Eine Wunschanmeldung ist leider nicht mehr möglich. Familien können sich jedoch bis zum 31. Oktober 2025 in die Warteliste eintragen, allerdings
                ohne Garantie, dass wir jede Familie berücksichtigen können. Bei ausreichenden finanziellen Mitteln erhalten Familien vor Weihnachten einen
                Gutschein im Wert von maximal 100 Franken.
              </p>
              <div className="mb-12 flex justify-center gap-2">
                <Button innerLink="/warteliste">Warteliste</Button>
              </div>
            </div>
          </>
        )}
        {["post_registration"].includes(appState) && (
          <div className="mt-32">
            <p className="mb-10 mt-20 text-center text-3xl font-bold text-gold-300">Die Wunschanmeldung ist abgeschlossen</p>
            <p className="text-md mb-10 text-center text-gold-300">
              Sobald alle Wünsche registriert und die Wunschlisten erstellt sind, kannst du hier ab Mitte November Weihnachtswünsche erfüllen.
            </p>
          </div>
        )}
        {appState === "closed" && (
          <>
            {/* <Tree balls={balls} /> */}
            <p className="m-auto mb-20 mt-16 max-w-4xl text-center text-xl font-light text-gold-300">
              Gemeinsam mit Privatpersonen und Partner können wir <span className="font-bold">3500 Weihnachtswünsche</span> erfüllen. Wir sind überwältigt und
              bedanken uns herzlich für das Zeichen der Solidarität mit benachteiligten Familien. Die Weihnachtswünsche werden jetzt in Zusammenarbeit mit
              Partner in schöne Weihnachtsgeschenke verwandelt und bis am 24. Dezember den Familien übergeben.
            </p>
            <Progress title="Wünsche erfüllt:" date={date} value={3000} max={3000} />
            <p className="m-auto mb-20 mt-16 max-w-2xl text-center text-xl font-light text-gold-300">
              Du konntest keinen Wunsch erfüllen, möchtest dich dennoch für finanziell benachteiligte Menschen einsetzen? Dann freuen wir uns über deine Spende
              oder ein freiwilliges Engagement.
            </p>
            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row sm:gap-2">
              <Button externalLink="https://www.caritas-zuerich.ch/ihre-spende-hilft">Spenden</Button>
              <Button externalLink="https://www.caritas-zuerich.ch/aktiv-werden">Aktiv werden</Button>
              <Button innerLink="/wunscherfuellen">Alle Wünsche</Button>
            </div>
          </>
        )}
        <br />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
