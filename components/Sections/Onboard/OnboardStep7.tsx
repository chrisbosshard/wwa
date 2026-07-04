// IMPORT BASICS
import React from "react";

// IMPORT COMPONENTS
import Link from "next/link";

// ****************************************
// COMPONENT: Auswaehlen
// Wünsche Auswählen
// ****************************************
const Auswaehlen = () => {
  return (
    <>
      <div className="wizard-title">
        <h2>Wunsch erfolgreich übermittelt</h2>
      </div>
      <h2>
        Dank für deine Anmeldung. Der Wunsch / Die Wünsche wurden erfolgreich übermittelt. Wir haben dir per E-Mail eine Bestätigung gesendet. Anfangs Dezember
        versenden wir per E-Mail weitere Informationen, wann und wo die Geschenke abgeholt werden können.
      </h2>
      <div className="button-container">
        <div className="link-container">
          <Link className="link" href="/">
            Zurück zur Homepage
          </Link>
        </div>
      </div>
    </>
  );
};

export default Auswaehlen;
