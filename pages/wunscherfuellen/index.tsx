// IMPORT BASICS
import React, { useState, useEffect, useContext } from "react";

// IMPORT COMPONENTS
import Router from "next/router";

// IMPORT CUSTOM COMPONENTS
import Footer from "@sections/Footer/Footer";
import ApplicationContext from "@context/ApplicationContext/ApplicationContext.js";
import Polaroid from "@elements/Polaroid/Polaroid";
import Page from "@elements/Page/Page";
import { Progress } from "@sections/Progress/Progress";
import { Button } from "@elements/Button/Button";

// IMPORT UTIL
import useWindowSize from "@utils/useWindowSize";
import { getToday } from "@scripts/getToday";

const Kids = ({ kids, cart, onAddToCart, onRemoveFromCart }) => {
  // STATES
  const [showNum, setShowNum] = useState(50);
  const [showCompleted, setShowCompleted] = useState(false);
  const [filteredKids, setFilteredKids] = useState(null);

  // CONTEXT
  const { appState } = useContext(ApplicationContext); // REACTIVATE FOR LIVE VERSION
  //let appState = "wish_fulfilment"; // REACTIVATE FOR LIVE VERSION

  // EFFECTS
  useEffect(() => {
    if (appState === "done") {
      Router.push("/done");
    }
  }, [appState]);

  useEffect(() => {
    if (kids && kids.length > 0) {
      const newFilteredKids = kids.filter((kid) => kid.wish && kid.wish.active);
      setFilteredKids(newFilteredKids);
    }
  }, [kids]);

  // FUNCTIONS
  const showMore = () => {
    if (kids.length > showNum + 50) {
      const newShowNum = showNum + 50;
      setShowNum(newShowNum);
    } else if (kids.length > showNum) {
      setShowNum(kids.length);
    }
  };

  const toggleWishes = () => {
    const newShowCompleted = !showCompleted;
    setShowCompleted(newShowCompleted);
    if (newShowCompleted) {
      const newFiltredKids = kids.filter((kid) => !kid.donor && kid.wish && kid.wish.active);
      setFilteredKids(newFiltredKids);
    } else {
      const newFiltredKids = kids.filter((kid) => kid.wish && kid.wish.active);
      setFilteredKids(newFiltredKids);
    }
  };

  // CALCULATIONS
  const date = getToday();

  // Show how many kids have already been granted
  let completedKids = 0;
  kids.forEach((kid) => {
    if (kid.donor && (kid.donor.paymentSuccessful || kid.donor.manualUpload)) {
      completedKids += 1;
    }
  });

  const baseCompletedKids = 0; // need to be updated
  let allCompletedKids = completedKids + baseCompletedKids;

  // RENDER
  return (
    <>
      <Page title="Erfülle einen Wunsch" image="icon2.png">
        <>
          {appState !== "closed" && (
            <>
              <h2>
                Mit deiner Hilfe setzen wir gemeinsam ein kleines Zeichen der Solidarität mit benachteiligten Familien und machen Weihnachten zu einem schönen
                Fest für alle Kinder. Mit einer Spende von CHF 50 pro Weihnachtswunsch bringen wir Kinderaugen zum Leuchten.
              </h2>
              <h3>
                Kinder haben Wünsche – kleinere und grössere. Oft gehen diese zu Weihnachten in Erfüllung. Nicht so bei Kindern aus Familien, die nur über ein
                schmales Budget verfügen. Die Weihnachtswunschaktion von Caritas Zürich leistet seit über 10 Jahren einen Beitrag, indem sie ebensolche Wünsche
                erfüllt – unterstützt durch Partner und Privatpersonen. Unterstütze uns jetzt und erfülle einem Kind einen Weihnachtswunsch. Pro Spende von 50
                Franken zu Gunsten der Weihnachtswunschaktion kann ein Wunsch erfüllt werden. Mögliche Restbeträge werden für die Erfüllung weiterer Wünsche
                verwendet und ein allfälliger Überschuss der Aktion wird dem{" "}
                <a
                  className="inline-link"
                  href="https://www.caritas-zuerich.ch/was-wir-tun/-mit-mir-freiwillige-paten-fuer-benachteiligte-kinder"
                  target="_blank"
                  rel="noreferrer"
                >
                  Patenschaftsprojekt «mit mir» von Caritas Zürich
                </a>{" "}
                zugeführt.
              </h3>
            </>
          )}
          {["pre_registration", "registration", "post_registration", "waitinglist"].includes(appState) && (
            <h3>
              <b>Sobald alle Wünsche registriert und die Wunschlisten erstellt sind, kannst du hier ab Mitte November Weihnachtswünsche erfüllen.</b>
            </h3>
          )}
          {appState === "wish_fulfilment" && (
            <>
              <h3>
                Hilf mit und erfülle einem Kind einen Weihnachtswunsch. Aus administrativ-logistischen Gründen ermöglichst du mit deiner Spende sowohl
                individuelle Weihnachtswünsche als auch Gutscheine.
              </h3>
              <Progress title="Wünsche erfüllt:" date={date} value={allCompletedKids} max={2500} />
            </>
          )}
          {appState === "closed" && (
            <>
              <h2>
                Gemeinsam mit Privatpersonen und Partner können wir <b>3500 Weihnachtswünsche</b> erfüllen. Wir sind überwältigt und bedanken uns herzlich für
                das Zeichen der Solidarität mit benachteiligten Familien. Die Weihnachtswünsche werden jetzt in Zusammenarbeit mit Partner in schöne
                Weihnachtsgeschenke verwandelt und bis am 24. Dezember den Familien übergeben. Impressionen folgen in Kürze.
              </h2>
              <h3>
                Du konntest keinen Wunsch erfüllen, möchtest dich dennoch für finanziell benachteiligte Menschen einsetzen? Dann freuen wir uns über deine
                Spende oder dein freiwilliges Engagement. Herzlichen Dank und frohe Weihnachten.
              </h3>
              <div className="mb-24 mt-6 flex justify-center gap-2">
                <Button externalLink="https://www.caritas-zuerich.ch/ihre-spende-hilft">Spenden</Button>
                <Button externalLink="https://www.caritas-zuerich.ch/aktiv-werden">Aktiv werden</Button>
              </div>
            </>
          )}
        </>
      </Page>
      {appState === "wish_fulfilment" && (
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6 flex w-full flex-row justify-end gap-3 text-gold-300">
            <input onChange={toggleWishes} type="checkbox" id="contactPermission" className="min-w-[20px]" />
            <label htmlFor="contactPermission" className="ml-2">
              Bereits erfüllte Wünsche ausblenden
            </label>
          </div>
          <div className="mb-8 grid grid-cols-auto-md gap-6">
            {filteredKids &&
              filteredKids.slice(0, showNum).map((kid, index) => {
                return <Polaroid key={index} kid={kid} kids={kids} cart={cart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} />;
              })}
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
};

export default Kids;
