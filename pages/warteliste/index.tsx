// IMPORT BASICS
import React, { useState } from "react";

// IMPORT COMPONENTS
import OnboardStep1 from "@sections/Onboard/OnboardStep1";
import Page from "@elements/Page/Page";
import Footer from "@sections/Footer/Footer";

const Warteliste = () => {
  const [contact] = useState({ leginr: "", image: null, imageName: "" });

  const toStep2 = () => {
    const url = "https://www.kulturlegi.ch/zuerich/weihnachtswunschaktion-warteliste";
    window.open(url, "_self");
  };

  return (
    <>
      <Page title="Warteliste" image="icon1.png">
        <>
          <h2>
            Eine Wunschanmeldung ist leider nicht mehr möglich. Bis am 31. Oktober können sich Familien in die Warteliste eintragen für einen Gutschein, ohne
            Garantie dass wir diesen erfüllen können. Pro Familie werden Maximal zwei Gutscheine verteilt.
          </h2>
          <OnboardStep1 contact={contact} onNextStep={toStep2} waitinglist />
        </>
      </Page>
      <div className="col-span-12 mt-8 p-4">
        <Footer />
      </div>
    </>
  );
};

export default Warteliste;
