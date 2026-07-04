// IMPORT BASICS
import React from "react";

// IMPORT CUSTOM COMPONENTS
import Page from "@elements/Page/Page";
import Footer from "@sections/Footer/Footer";

const Help = () => {
  return (
    <>
      <Page title="Hilfe bei der Anmeldung" image="icon1.png">
        <h2 className="text-left">Du brauchst Hilfe bei der Anmeldung mit deiner KulturLegi? Vielleicht können dir folgende Informationen weiterhelfen. </h2>
        <div className="text-gold-300">
          <p className="mb-4 flex gap-4">
            <div className="flex h-12 w-12 min-w-[3rem] items-center justify-center rounded-full border-2 border-gold-300">
              <p className="text-xl font-bold">a</p>
            </div>
            <p>
              Ist deine KulturLegi abgelaufen? Dann verlängere diese mit aktuellen Unterlagen per{" "}
              <a
                className="text-gold-300 underline "
                href="https://www.kulturlegi.ch/zuerich/kulturlegi-beantragen/online-antrag"
                target="_blank"
                rel="noopener noreferrer"
              >
                Online-Antrag
              </a>{" "}
              oder persönlich im{" "}
              <a className="text-gold-300 underline " href="https://www.kulturlegi.ch/zuerich/ueber-uns/kontakt" target="_blank" rel="noopener noreferrer">
                KulturLegi-Büro
              </a>
              .
            </p>
            .
          </p>
          <p className="mb-4 flex gap-4">
            <div className="flex h-12 w-12 min-w-[3rem] items-center justify-center rounded-full border-2 border-gold-300">
              <p className="text-xl font-bold">b</p>
            </div>
            <p>Du wohnst nicht im Kanton Zürich oder Kanton Schaffhausen, dann kannst du leider nicht an der Aktion teilnehmen.</p>
          </p>
          <p className="mb-4 flex gap-4">
            <div className="flex h-12 w-12 min-w-[3rem] items-center justify-center rounded-full border-2 border-gold-300">
              <p className="text-xl font-bold">c</p>
            </div>
            <p>
              Du besitzt keine KulturLegi? Die Berechtigungskriterien und weitere Informationen zur KulturLegi findest du unter{" "}
              <a className=" underline " href="https://www.kulturlegi.ch/zuerich" target="_blank" rel="noopener noreferrer">
                www.kulturlegi.ch/zuerich
              </a>
            </p>
          </p>
          <p className="mt-8">
            Brauchst du Hilfe? Telefonisch sind wir unter 044 366 68 48 erreichbar oder sind persönlich im KulturLegi-Büro, im Digi-Treff oder in den Lernstuben
            vom Kanton Zürich für dich da.
          </p>
        </div>
      </Page>
      <div className="col-span-12 mt-8 p-4">
        {" "}
        <Footer />
      </div>
    </>
  );
};

export default Help;
