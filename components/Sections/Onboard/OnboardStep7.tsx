import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@elements/Button/Button";

// ****************************************
// COMPONENT: Auswaehlen
// Wünsche Auswählen
// ****************************************
const Auswaehlen = () => {
  return (
    <div className="py-2 text-center md:py-4">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F1F7E8] text-[#63852E]">
        <CheckCircleIcon className="h-9 w-9" aria-hidden />
      </div>

      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.08em] text-caritas-red">
        Herzlichen Dank
      </p>
      <h2 className="mt-2 text-2xl font-bold text-[#242424] md:text-3xl">
        Wünsche erfolgreich übermittelt
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[#575656]">
        Deine Anmeldung wurde erfolgreich gespeichert. Wir senden dir eine Bestätigung an deine E-Mail-Adresse.
      </p>

      <div className="mx-auto mt-6 max-w-2xl rounded-xl bg-[#F6F7F7] px-5 py-4 text-left text-sm leading-relaxed text-[#575656] sm:text-center">
        Anfang Dezember erhältst du per E-Mail weitere Informationen dazu, wann und wo die Geschenke abgeholt werden können.
      </div>

      <div className="mt-8 flex justify-center">
        <Button innerLink="/" className="mx-0">
          Zur Startseite
        </Button>
      </div>
    </div>
  );
};

export default Auswaehlen;
