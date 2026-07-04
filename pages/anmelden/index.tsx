// IMPORT BASICS
import React, { useContext, useState, useEffect } from "react";
import { fetchWishes } from "@lib/directus/api-client";

// IMPORT COMPONENTS
import Link from "next/link";

// IMPORT CUSTOM COMPONENTS
import Page from "@elements/Page/Page";
import Footer from "@sections/Footer/Footer";
import ApplicationContext from "@context/ApplicationContext/ApplicationContext.js";
import { Button } from "@elements/Button/Button";
import Wish from "../../components/Wish/Wish.js";

type Category = {
  id: string;
  name: string;
};

// *****************************************************
// ANMELDEN
// *****************************************************
const Register = () => {
  // CONTEXT
  const { appState } = useContext(ApplicationContext);
  // let appState = "registration";

  // STATES
  const [wishes, setWishes] = useState([]);
  const [filteredWishes, setFilteredWishes] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[] | undefined>();

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

  return (
    <>
      <Page title="Wunsch anmelden" image="icon1.png">
        <>
          <h2>
            Caritas Zürich erfüllt mit Unterstützung weiterer Partner und Privatpersonen Weihnachtswünsche von Kindern aus finanziell benachteiligten Familien.
            Die Wünsche mit einem Maximalwert von 50 Franken können aus der Wunschübersicht ausgesucht oder individuell angegeben werden.
          </h2>
          <div className="grid grid-cols-2 lg:gap-6">
            <div className="col-span-2 sm:col-span-1">
              <h3>
                <b>Teilnahmebedingungen</b>
                <br /> Das Angebot gilt für Kinder bis 14 Jahre, die im Kanton Zürich oder Kanton Schaffhausen wohnen und eine gültige{" "}
                <a className="inline-link" href="https://www.kulturlegi.ch/zuerich/kulturlegi-beantragen/wer-ist-berechtigt">
                  KulturLegi
                </a>{" "}
                haben. Jedes Kind darf maximal einen Wunsch auswählen. Der Wunsch darf höchstens 50 Franken kosten. Rabatt-Aktionen sind nicht erlaubt.
              </h3>
              <h3>
                <b>Was</b>
                <br />
                Wähle wenn möglich ein Geschenk aus der Wunschübersicht aus. Hast du kein passendes Geschenk gefunden, dann kannst du einen individuellen Wunsch
                anmelden. Es sind ausschliesslich Schweizer Shops zugelassen (z.B. Galaxus, Brack etc.)
              </h3>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3>
                <b>Geschenkübergabe</b>
                <br /> Die Geschenkübergabe findet Mitte Dezember statt. Wenn wir die Wünsche erfüllen können, versenden wir anfangs Dezember per E-Mail oder
                per Post eine Anmeldebestätigung mit der Abholnummer und der Info, wo die Geschenke abgeholt werden können.
              </h3>
              <h3>
                <b>Hilfe bei der Wunschanmeldung</b>
                <br /> Familien bekommen Hilfe beim Ausfüllen der Wunschanmeldung: Persönlich im{" "}
                <a className="inline-link" href="https://www.kulturlegi.ch/zuerich/ueber-uns/kontakt" target="_blank" rel="noopener noreferrer">
                  KulturLegi Büro
                </a>
                , im{" "}
                <a className="inline-link" href="https://caritas-regio.ch/ueber-caritas/zuerich/digi-treff" target="_blank" rel="noopener noreferrer">
                  Digi-Treff
                </a>{" "}
                und in den{" "}
                <a className="inline-link" href="https://lernstuben.ch/lernstuben-ueberblick-page" target="_blank" rel="noopener noreferrer">
                  Lernstuben vom Kanton Zürich
                </a>
                . Telefonisch unter 044 366 68 48.
              </h3>
            </div>
          </div>
          {appState === "pre_registration" && <p className="my-8 text-3xl font-bold text-gold-300">Wunschanmeldung startet am 01. Oktober 2025</p>}
          {appState === "registration" && (
            <Button className="mb-12 mt-8" innerLink="/auswaehlen">
              Wunsch anmelden
            </Button>
          )}
          {appState === "waitinglist" && (
            <div className="">
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
          )}
          {appState === "wish_fulfilment" && (
            <div className="">
              <p className="mb-10 mt-20 text-center text-3xl font-bold text-gold-300">Die Wunschanmeldung ist abgeschlossen</p>
            </div>
          )}
          <h4>
            *Es steht eine begrenzte Anzahl Geschenke zur Verfügung. Das Angebot gilt solange verfügbar. Wir bemühen uns, Wünsche wenn möglich genauso zu
            erfüllen, wie angegeben. Sofern der gewünschte Artikel nicht verfügbar oder der Preis zu hoch ist, werden wir ein vergleichbares Geschenk
            vorbereiten. Ihre Angaben werden vertraulich behandelt. Für das Erfüllen der Wünsche erhalten unsere Partner folgende Informationen von uns: Wunsch,
            Vorname und Alter des Kindes.
          </h4>
        </>
      </Page>
      {appState === "registration" && (
        <div className="mx-auto mt-8 max-w-[1200px] p-4 lg:mt-20">
          <div className="mb-8 grid grid-cols-auto-md gap-6">
            {filteredWishes.map((wish, index) => {
              return (
                <Link key={index} href="/auswaehlen">
                  <Wish key={index} wish={wish} />
                </Link>
              );
            })}
          </div>
        </div>
      )}
      <div className="col-span-12 mt-8 p-4">
        <Footer />
      </div>
    </>
  );
};

export default Register;
