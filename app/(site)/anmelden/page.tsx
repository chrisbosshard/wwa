"use client";

import React, { useContext, useState, useEffect } from "react";
import { fetchWishes } from "@lib/directus/api-client";
import Link from "next/link";
import Page from "@elements/Page/Page";
import Footer from "@sections/Footer/Footer";
import ApplicationContext from "@context/ApplicationContext/ApplicationContext.js";
import { Button } from "@elements/Button/Button";
import Wish from "@/components/Wish/Wish";

export default function AnmeldenPage() {
  const { appState } = useContext(ApplicationContext);

  const [wishes, setWishes] = useState([]);
  const [filteredWishes, setFilteredWishes] = useState([]);

  useEffect(() => {
    async function loadWishes() {
      try {
        const data = await fetchWishes();
        const newWishes = data.wishes.filter((wish) => wish.image && wish.active);
        setWishes(newWishes);
        setFilteredWishes(newWishes);
      } catch (error) {
        console.error("Failed to load wishes", error);
      }
    }
    loadWishes();
  }, []);

  return (
    <>
      <Page
        title="Wunsch anmelden"
        image="icon1.png"
        breadcrumbs={[
          { label: "Weihnachtswunschaktion", href: "/" },
          { label: "Wunsch anmelden" },
        ]}
      >
        <div className="subpage-content">
          <p className="subpage-lead">
            Caritas Zürich erfüllt mit Unterstützung weiterer Partner und Privatpersonen Weihnachtswünsche von Kindern aus finanziell benachteiligten
            Familien. Die Wünsche mit einem Maximalwert von 50 Franken können aus der Wunschübersicht ausgesucht oder individuell angegeben werden.
          </p>

          <div className="subpage-grid">
            <div>
              <div className="subpage-section">
                <span className="subpage-section-title">Teilnahmebedingungen</span>
                Das Angebot gilt für Kinder bis 14 Jahre, die im Kanton Zürich oder Kanton Schaffhausen wohnen und eine gültige{" "}
                <a className="inline-link" href="https://www.kulturlegi.ch/zuerich/kulturlegi-beantragen/wer-ist-berechtigt">
                  KulturLegi
                </a>{" "}
                haben. Jedes Kind darf maximal einen Wunsch auswählen. Der Wunsch darf höchstens 50 Franken kosten. Rabatt-Aktionen sind nicht erlaubt.
              </div>
              <div className="subpage-section">
                <span className="subpage-section-title">Was</span>
                Wähle wenn möglich ein Geschenk aus der Wunschübersicht aus. Hast du kein passendes Geschenk gefunden, dann kannst du einen individuellen
                Wunsch anmelden. Es sind ausschliesslich Schweizer Shops zugelassen (z.B. Galaxus, Brack etc.)
              </div>
            </div>
            <div>
              <div className="subpage-section">
                <span className="subpage-section-title">Geschenkübergabe</span>
                Die Geschenkübergabe findet Mitte Dezember statt. Wenn wir die Wünsche erfüllen können, versenden wir anfangs Dezember per E-Mail oder per Post
                eine Anmeldebestätigung mit der Abholnummer und der Info, wo die Geschenke abgeholt werden können.
              </div>
              <div className="subpage-section">
                <span className="subpage-section-title">Hilfe bei der Wunschanmeldung</span>
                Familien bekommen Hilfe beim Ausfüllen der Wunschanmeldung: Persönlich im{" "}
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
              </div>
            </div>
          </div>

          {appState === "pre_registration" && <p className="subpage-status">Wunschanmeldung startet am 01. Oktober 2025</p>}

          {appState === "registration" && (
            <div className="subpage-actions">
              <Button innerLink="/auswaehlen" className="mx-0 rounded-full border-0">
                Wunsch anmelden
              </Button>
            </div>
          )}

          {appState === "waitinglist" && (
            <>
              <p className="subpage-status">Die Wunschanmeldung ist abgeschlossen</p>
              <p className="subpage-status-text">
                Eine Wunschanmeldung ist leider nicht mehr möglich. Familien können sich jedoch bis zum 31. Oktober 2025 in die Warteliste eintragen, allerdings
                ohne Garantie, dass wir jede Familie berücksichtigen können. Bei ausreichenden finanziellen Mitteln erhalten Familien vor Weihnachten einen
                Gutschein im Wert von maximal 100 Franken.
              </p>
              <div className="subpage-actions">
                <Button innerLink="/warteliste" className="mx-0 rounded-full border-0">
                  Warteliste
                </Button>
              </div>
            </>
          )}

          {appState === "wish_fulfilment" && <p className="subpage-status">Die Wunschanmeldung ist abgeschlossen</p>}

          <p className="subpage-footnote">
            *Es steht eine begrenzte Anzahl Geschenke zur Verfügung. Das Angebot gilt solange verfügbar. Wir bemühen uns, Wünsche wenn möglich genauso zu
            erfüllen, wie angegeben. Sofern der gewünschte Artikel nicht verfügbar oder der Preis zu hoch ist, werden wir ein vergleichbares Geschenk
            vorbereiten. Ihre Angaben werden vertraulich behandelt. Für das Erfüllen der Wünsche erhalten unsere Partner folgende Informationen von uns: Wunsch,
            Vorname und Alter des Kindes.
          </p>
        </div>
      </Page>

      {appState === "registration" && (
        <div className="bg-white pb-10 pt-2 md:pb-12">
          <div className="mx-auto max-w-[1200px] px-4">
            <div className="grid grid-cols-auto-md gap-6">
              {filteredWishes.map((wish, index) => (
                <Link key={index} href="/auswaehlen">
                  <Wish wish={wish} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white">
        <div className="mx-auto max-w-[1200px] px-4">
          <Footer />
        </div>
      </div>
    </>
  );
}
